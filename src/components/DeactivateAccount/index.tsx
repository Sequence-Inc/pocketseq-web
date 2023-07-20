import React, { useState } from "react";

import { Button, TextField } from "@element";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_ACCOUNT } from "src/apollo/queries/user.queries";
import { LoadingSpinner } from "../LoadingSpinner";
import { signOut } from "next-auth/react";

export const DeactivateAccount = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [result, setResult] = useState<string>("");

    const [deactivate, { loading, reset }] = useMutation(DEACTIVATE_ACCOUNT, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message);
        },
        onCompleted: (data) => {
            setResult(data.deactivateAccount.message);
            signOut();
        },
    });

    const handleAccountDeactivation = () => {
        if (password.length < 6) {
            return;
        }
        deactivate({
            variables: { input: { password } },
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="space-y-4 max-w-md mx-auto">
                <div className="py-3 px-4 rounded-lg bg-red-50 text-red-600">
                    {error}
                </div>
                <Button
                    onClick={() => {
                        setError("");
                        reset();
                    }}
                >
                    Okay
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-md mx-auto">
            {open && (
                <div className="space-y-4 border-t-2 border-gray-100 mt-4 pt-4">
                    <div>
                        <TextField
                            label="パスワード"
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        onClick={handleAccountDeactivation}
                        disabled={loading}
                        variant="primary"
                        type="button"
                    >
                        アカウントを削除
                    </Button>
                </div>
            )}
            <Button
                onClick={() => {
                    setOpen((open) => !open);
                }}
                variant={open ? "secondary" : "primary"}
                type="button"
            >
                {open ? "キャンセル" : "アカウントを削除"}
            </Button>
        </div>
    );
};
