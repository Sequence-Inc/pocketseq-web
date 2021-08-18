import { PasswordInput, TextField } from '@element'
import React from 'react'

const IndividualForm = ({ register, errors, loading }) => {
    return (
        <div>
            <TextField
                {...register("user.firstName", { required: true })}
                error={errors?.user?.firstName ? true : false}
                errorMessage={errors?.user?.firstName?.message}
                label="First Name"
                id="firstName"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("user.lastName", { required: true })}
                error={errors?.user?.lastName ? true : false}
                errorMessage={errors?.user?.lastName?.message}
                label="Last Name"
                id="lastName"
                autoFocus={true}
                disabled={loading}
            />
            <TextField
                {...register("user.firstNameKana", { required: true })}
                error={errors?.user?.firstNameKana ? true : false}
                errorMessage={errors?.user?.firstNameKana?.message}
                label="First Name Kana"
                id="firstNameKana"
                disabled={loading}
            />
            <TextField
                {...register("user.lastNameKana", { required: true })}
                error={errors?.user?.lastNameKana ? true : false}
                errorMessage={errors?.user?.lastNameKana?.message}
                label="Last Name Kana"
                id="lastNameKana"
                disabled={loading}
            />
            <TextField
                {...register("user.email", { required: true })}
                error={errors?.user?.email ? true : false}
                errorMessage={errors?.user?.email?.message}
                label="Email Address"
                id="email"
                disabled={loading}
            />
            <PasswordInput
                {...register("user.password", { required: true })}
                error={errors?.user?.password ? true : false}
                errorMessage={errors?.user?.password?.message}
                label="Password"
                id="password"
                disabled={loading}
            />
            <PasswordInput
                {...register("user.confirmPassword", { required: true })}
                error={errors?.user?.confirmPassword ? true : false}
                errorMessage={errors?.user?.confirmPassword?.message}
                label="Confirm Password"
                id="confirmPassword"
                disabled={loading}
            />
        </div>
    )
}

export default IndividualForm;
