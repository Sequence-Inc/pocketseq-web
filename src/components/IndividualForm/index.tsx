import { PasswordInput, TextField } from "@element";
import React, { useRef } from "react";

const IndividualForm = ({ register, watch, errors, loading }) => {
    const password = useRef({});
    password.current = watch().user?.password;

    return (
        <div className="space-y-3">
            <TextField
                {...register("user.lastName", { required: true })}
                error={errors?.user?.lastName ? true : false}
                errorMessage={errors?.user?.lastName?.message}
                label="性"
                placeholder="例）山田"
                id="lastName"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("user.firstName", { required: true })}
                error={errors?.user?.firstName ? true : false}
                errorMessage={errors?.user?.firstName?.message}
                label="名"
                id="firstName"
                placeholder="例）太郎"
                disabled={loading}
            />
            <TextField
                {...register("user.lastNameKana", { required: true })}
                error={errors?.user?.lastNameKana ? true : false}
                errorMessage={errors?.user?.lastNameKana?.message}
                label="性（かな）"
                placeholder="例）ヤマダ"
                id="lastNameKana"
                disabled={loading}
            />
            <TextField
                {...register("user.firstNameKana", { required: true })}
                error={errors?.user?.firstNameKana ? true : false}
                errorMessage={errors?.user?.firstNameKana?.message}
                label="名（かな）"
                placeholder="例）タロウ"
                id="firstNameKana"
                disabled={loading}
            />
            <TextField
                {...register("user.email", { required: true })}
                error={errors?.user?.email ? true : false}
                errorMessage={errors?.user?.email?.message}
                label="メールアドレス"
                id="email"
                placeholder="例）taro@mail.com"
                disabled={loading}
            />
            <PasswordInput
                {...register("user.password", { required: true })}
                error={errors?.user?.password ? true : false}
                errorMessage={errors?.user?.password?.message}
                label="パスワード"
                id="password"
                disabled={loading}
            />
            <PasswordInput
                {...register("user.confirmPassword", {
                    validate: (val) => val === password.current && true,
                })}
                error={errors?.user?.confirmPassword ? true : false}
                errorMessage={errors?.user?.confirmPassword?.message}
                label="パスワード確認"
                id="confirmPassword"
                disabled={loading}
            />
        </div>
    );
};

export default IndividualForm;
