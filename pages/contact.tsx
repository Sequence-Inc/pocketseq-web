import {
    Button,
    Container,
    FormLabel,
    Select,
    TextArea,
    TextField,
} from "@element";
import React from "react";
import { getSession } from "next-auth/react";
import { Header, Footer } from "@layout";

const Contact = ({ userSession }) => {
    return (
        <div className="bg-gray-50">
            <Header userSession={userSession} />
            <main>
                <Container className="py-20 align-middle space-y-4 ">
                    <p className="text-lg font-black">Contact Us</p>
                    <form className=" px-4 bg-gray-100 rounded-md">
                        <div className="px-0 py-3 space-y-6 sm:py-6">
                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="Select"
                                />

                                <Select options={[]} value={null} />
                            </div>
                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="Email"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="Name is required"
                                    autoFocus
                                    onChange={() => {}}
                                />
                            </div>

                            <div className=" sm:w-full space-y-2">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="Input Text"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="Input Text is required"
                                    autoFocus
                                    onChange={() => {}}
                                />
                                <p className="text-xs text-gray-400">
                                    Lorem Ipsum is simply dummy text
                                </p>
                            </div>

                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="Input Text"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="Input Text is required"
                                    autoFocus
                                    onChange={() => {}}
                                />
                            </div>

                            <div className=" sm:w-full space-y-2">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="Textarea"
                                    required
                                />

                                <TextArea
                                    label={""}
                                    rows={6}
                                    errorMessage="Input Text is required"
                                    autoFocus
                                    onChange={() => {}}
                                />

                                <p className="text-xs text-gray-400">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled
                                    it to make a type specimen book. It has
                                    survived not only five centuries
                                </p>
                            </div>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
        },
    };
};
