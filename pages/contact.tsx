import { Container, FormLabel, Select, TextArea, TextField } from "@element";
import React from "react";

const Contact = () => {
    return (
        <Container className="bg-gray-100 my-4">
            <form>
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
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries
                        </p>
                    </div>
                </div>
            </form>
        </Container>
    );
};

export default Contact;
