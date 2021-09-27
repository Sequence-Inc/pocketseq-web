import Head from "next/head";
import Link from "next/link";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { useMutation, useQuery } from "@apollo/client";
import { Container, TextField, PhotoUploadField, Button } from "@element";

import {
    ADD_SPACE_TYPE,
    SPACETYPE_BY_ID,
} from "src/apollo/queries/admin.queries";
import { NetworkHelper } from "@comp";
import { classNames } from "src/utils";
import { useState } from "react";
import { GET_ALL_SPACE_TYPES } from "src/apollo/queries/space.queries";
import axios from "axios";

function SpaceTypeAdd() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const [addSpaceType, { error }] = useMutation(ADD_SPACE_TYPE);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // check and prepare data
        if (
            title.trim() === "" ||
            description.trim() === "" ||
            photo === null
        ) {
            alert("Error: All fields are necessary.");
            setLoading(false);
            return;
        }

        // first add space type
        const { data, errors } = await addSpaceType({
            variables: {
                input: {
                    title: title.trim(),
                    description: description.trim(),
                    coverPhotoMime: photo.type,
                },
            },
            refetchQueries: [{ query: GET_ALL_SPACE_TYPES }],
        });

        if (errors) {
            console.log("Errors", errors);
            // alert(errors.message);
            setLoading(false);
            return;
        }
        if (data) {
            console.log("finished request");
            const { url, mime } = data.addSpaceType.upload;
            const options = {
                headers: {
                    "Content-Type": mime,
                },
            };
            console.log("uploading photo");
            await axios.put(url, photo, options);
            console.log("upload photo complete");
            setLoading(false);
            alert("Space Type successfully added.");
        }
    };

    return (
        <HostLayout>
            <Head>
                <title>Add Space Type - Timebook</title>
            </Head>
            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            Add Space Type
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <div className="w-full sm:px-0">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                        <div className="px-4 py-5 space-y-4">
                            <div>
                                <TextField
                                    value={title}
                                    label="Title"
                                    // error={}
                                    errorMessage="Title is required"
                                    disabled={loading}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                    }}
                                    singleRow
                                />
                            </div>
                            <div>
                                <TextField
                                    value={description}
                                    label="Description"
                                    // error={}
                                    errorMessage="Description is required"
                                    disabled={loading}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                    singleRow
                                />
                            </div>
                            <div>
                                <PhotoUploadField
                                    label="Photo"
                                    // error={}
                                    errorMessage="Via is required"
                                    disabled={loading}
                                    onChange={(photo) => setPhoto(photo)}
                                    singleRow
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="primary"
                                    className="w-auto"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                >
                                    Add Space Type
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
}

export default withAuth(SpaceTypeAdd);
