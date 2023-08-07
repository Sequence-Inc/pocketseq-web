import { useMutation } from "@apollo/client";
import { Button, TextField } from "@element";
import { useCallback, useState } from "react";
import { UPDATE_PASSWORD } from "src/apollo/queries/user.queries";
import AlertModal from "../AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

type Errors = {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean | string;
};

export const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [updatePassword] = useMutation(UPDATE_PASSWORD);

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const handleSubmit = useCallback(async () => {
        let hasError = false;
        // check all fields
        if (currentPassword === "") {
            setErrors((errors) => ({ ...errors, currentPassword: true }));
            hasError = true;
        } else {
            setErrors((errors) => ({ ...errors, currentPassword: false }));
            hasError = false;
        }

        if (newPassword === "") {
            setErrors((errors) => ({ ...errors, newPassword: true }));
            hasError = true;
        } else {
            setErrors((errors) => ({ ...errors, newPassword: false }));
            hasError = false;
        }
        if (confirmPassword === "") {
            setErrors((errors) => ({ ...errors, confirmPassword: true }));
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            setErrors((errors) => ({
                ...errors,
                confirmPassword: "パスワードが一致しません。",
            }));
            hasError = true;
        } else {
            setErrors((errors) => ({ ...errors, confirmPassword: false }));
            hasError = false;
        }
        if (hasError) {
            return;
        }

        // all good
        try {
            setLoading(true);
            setModalData({ ...modalData, intent: "LOADING" });
            openModal();
            const result = await updatePassword({
                variables: {
                    input: {
                        currentPassword,
                        newPassword,
                    },
                },
            });
            if (result.data?.changePassword?.message) {
                setModalData({
                    intent: "SUCCESS",
                    title: "パスワードが変更されました",
                    text: result.data?.changePassword?.message,
                    onConfirm: () => {
                        window.location.reload();
                    },
                });
                openModal();
            }
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
        } finally {
            setLoading(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <div className="w-full overflow-hidden bg-white rounded-lg shadow py-2 sm:py-3">
            <h3 className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 px-4 sm:px-6 pb-4">
                <div className="font-bold">パスワード修正</div>
                <Button
                    variant="primary"
                    className="inline-block w-auto px-4"
                    onClick={handleSubmit}
                >
                    保存
                </Button>
            </h3>
            <div className="space-y-3 px-4 sm:px-6 py-6">
                <div className="">
                    <TextField
                        label="現在のパスワード"
                        error={errors.currentPassword}
                        errorMessage="現在のパスワードが必要です。"
                        singleRow
                        onChange={(event) => {
                            setCurrentPassword(event.target.value);
                        }}
                        value={currentPassword}
                        type="password"
                    />
                </div>
                <div className="">
                    <TextField
                        label="新しいパスワード"
                        error={errors.newPassword}
                        errorMessage="新しいパスワードが必要です。"
                        singleRow
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                        }}
                        value={newPassword}
                        type="password"
                    />
                </div>
                <div className="">
                    <TextField
                        label="パスワード認証"
                        error={
                            typeof errors.confirmPassword === "boolean"
                                ? errors.confirmPassword
                                : true
                        }
                        errorMessage={
                            typeof errors.confirmPassword === "boolean"
                                ? "パスワード認証が必要です。"
                                : errors.confirmPassword
                        }
                        singleRow
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                        value={confirmPassword}
                        type="password"
                    />
                </div>
            </div>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};
