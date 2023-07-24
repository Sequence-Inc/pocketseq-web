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
                errorMessage="会社名は必須です。"
                label="会社名"
                id="company.name"
                placeholder="例）株式会社ポケットシーク"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("company.nameKana", { required: true })}
                error={errors?.company?.nameKana ? true : false}
                errorMessage="会社名のフリガナは必須です。"
                label="会社名（かな）"
                id="company.nameKana"
                placeholder="例）カ）ポケットシーク"
                disabled={loading}
            />
            <TextField
                {...register("company.email", { required: true })}
                error={errors?.company?.email ? true : false}
                errorMessage="メールアドレスは必須です。"
                label="メールアドレス"
                id="company.email"
                placeholder="例）info@pocketseq.com"
                disabled={loading}
            />
            <TextField
                {...register("company.registrationNumber", { required: true })}
                error={errors?.company?.registrationNumber ? true : false}
                errorMessage="法人番号は必須です。"
                label="法人番号"
                id="company.registrationNumber"
                placeholder="例）1234567890123"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.password", { required: true })}
                error={errors?.company?.password ? true : false}
                errorMessage="パスワードが必要。"
                label="パスワード"
                id="comany.password"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.confirmPassword", {
                    validate: (val) => val === password.current && true,
                })}
                error={errors?.company?.confirmPassword ? true : false}
                errorMessage={errors?.company?.confirmPassword?.message}
                label="パスワード確認"
                id="company.confirmPassword"
                disabled={loading}
            />
        </div>
    );
};

export default CorporateForm;
