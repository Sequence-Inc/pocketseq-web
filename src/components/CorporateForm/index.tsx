import { PasswordInput, TextField } from '@element'
import React from 'react'

const CorporateForm = ({ register, errors, loading }) => {
    return (
        <div>
            <TextField
                {...register("company.name", { required: true })}
                error={errors?.company?.name ? true : false}
                errorMessage={errors?.company?.name?.message}
                label="Comapny Name"
                id="company.name"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("company.nameKana", { required: true })}
                error={errors?.company?.nameKana ? true : false}
                errorMessage={errors?.company?.nameKana?.message}
                label="Company Name Kana"
                id="company.nameKana"
                disabled={loading}
            />
            <TextField
                {...register("company.email", { required: true })}
                error={errors?.company?.email ? true : false}
                errorMessage={errors?.company?.email?.message}
                label="Email Address"
                id="company.email"
                disabled={loading}
            />
            <TextField
                {...register("company.registrationNumber", { required: true })}
                error={errors?.company?.registrationNumber ? true : false}
                errorMessage={errors?.company?.registrationNumber?.message}
                label="Registration Number"
                id="company.registrationNumber"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.password", { required: true })}
                error={errors?.company?.password ? true : false}
                errorMessage={errors?.company?.password?.message}
                label="Password"
                id="comany.password"
                disabled={loading}
            />
            <PasswordInput
                {...register("company.confirmPassword", { required: true })}
                error={errors?.company?.confirmPassword ? true : false}
                errorMessage={errors?.company?.confirmPassword?.message}
                label="Confirm Password"
                id="company.confirmPassword"
                disabled={loading}
            />
        </div>
    )
}

export default CorporateForm;
