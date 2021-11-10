import { PasswordInput, TextField } from "@element";
import React from "react";

const CorporateForm = ({ register, errors, loading }) => {
    return (
        <div className="space-y-3">
            <TextField
                {...register("company.name", { required: true })}
                error={errors?.company?.name ? true : false}
                errorMessage={errors?.company?.name?.message}
                label="会社名"
                id="company.name"
                placeholder="例）株式会社タイムブック"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("company.nameKana", { required: true })}
                error={errors?.company?.nameKana ? true : false}
                errorMessage={errors?.company?.nameKana?.message}
                label="会社名（かな）"
                id="company.nameKana"
                placeholder="例）カ）タイムブック"
                disabled={loading}
            />
            <TextField
                {...register("company.email", { required: true })}
                error={errors?.company?.email ? true : false}
                errorMessage={errors?.company?.email?.message}
                label="メールアドレス"
                id="company.email"
                placeholder="例）info@timebook.co.jp"
                disabled={loading}
            />
            <TextField
                {...register("company.registrationNumber", { required: true })}
                error={errors?.company?.registrationNumber ? true : false}
                errorMessage={errors?.company?.registrationNumber?.message}
                label="法人番号"
                id="company.registrationNumber"
                placeholder="例）1234567890123"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.password", { required: true })}
                error={errors?.company?.password ? true : false}
                errorMessage={errors?.company?.password?.message}
                label="パスワード"
                id="comany.password"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.confirmPassword", { required: true })}
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
