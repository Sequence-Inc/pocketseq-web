import { PasswordInput, TextField } from "@element";
import React, { useRef } from "react";

const CorporateForm = ({ register, errors, watch, loading }) => {
    const password = useRef({});
    password.current = watch().company?.password;

    return (
        <div className="space-y-3">
            <TextField
                {...register("company.name", { required: true })}
                error={errors?.company?.name ? true : false}
                errorMessage="Company name is required"
                label="会社名"
                id="company.name"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("company.nameKana", { required: true })}
                error={errors?.company?.nameKana ? true : false}
                errorMessage="Company name kana is required"
                label="会社名（かな）"
                id="company.nameKana"
                disabled={loading}
            />
            <TextField
                {...register("company.email", { required: true })}
                error={errors?.company?.email ? true : false}
                errorMessage="Company email is required"
                label="メールアドレス"
                id="company.email"
                disabled={loading}
            />
            <TextField
                {...register("company.registrationNumber", { required: true })}
                error={errors?.company?.registrationNumber ? true : false}
                errorMessage="Registration number is required"
                label="法人番号"
                id="company.registrationNumber"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.password", { required: true })}
                error={errors?.company?.password ? true : false}
                errorMessage="Password is required"
                label="パスワード"
                id="comany.password"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.confirmPassword", { validate: (val) => val === password.current && true })}
                error={errors?.company?.confirmPassword ? true : false}
                errorMessage="The passwords do not match"
                label="パスワード認証"
                id="company.confirmPassword"
                disabled={loading}
            />
        </div>
    );
};

export default CorporateForm;
