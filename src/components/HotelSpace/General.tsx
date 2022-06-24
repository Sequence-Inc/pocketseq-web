import React from "react";
import {
    Button,
    GoogleMap,
    Select,
    TextArea,
    TextField,
    TimePickerField,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { useForm } from "react-hook-form";

const format = "HH:mm a";

const General = () => {
    const { t } = useTranslation("adminhost");
    const { handleSubmit, reset, watch, control, register } = useForm();
    return (
        <>
            <form>
                <div className="px-0 py-3 space-y-4 sm:py-6">
                    <div className="max-w-screen-sm">
                        <TextField
                            label={t("name")}
                            errorMessage="Name is required"
                            autoFocus
                            onChange={() => {}}
                        />
                    </div>
                    <div className="max-w-screen-sm">
                        <TextArea
                            label="Description"
                            errorMessage="Description is required"
                            autoFocus
                            rows={3}
                            onChange={() => {}}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TimePickerField
                            label="Check in time"
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TimePickerField
                            label="Check out time"
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default General;
