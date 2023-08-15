import React, { useState } from "react";

import { Button, TextField } from "@element";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_ACCOUNT } from "src/apollo/queries/user.queries";
import { LoadingSpinner } from "../LoadingSpinner";
import { signOut } from "next-auth/react";
import AlertModal from "../AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const deactivationReason = [
    {
        label: "借りたいスペースが見つからない",
        value: "借りたいスペースが見つからない",
    },
    {
        label: "アプリ(サイト)が使いづらい",
        value: "アプリ(サイト)が使いづらい",
    },
    {
        label: "利用する予定が無くなった",
        value: "利用する予定が無くなった",
    },
    {
        label: "その他",
        value: "その他",
    },
];

export const DeactivateAccount = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedReason, setSelectedReason] = useState<string[]>([]);
    const [otherReason, setOtherReason] = useState("");
    const [password, setPassword] = useState<string>("");

    const [deactivate, { loading, reset }] = useMutation(DEACTIVATE_ACCOUNT, {
        onError: (error) => {
            setModalData({
                intent: "ERROR",
                title: "エラー",
                text: error.graphQLErrors[0].message,
            });
            openModal();
        },
        onCompleted: (data) => {
            setModalData({
                intent: "SUCCESS",
                title: "アカウント退会しました",
                text: data.deactivateAccount.message,
                onConfirm: () => {
                    signOut();
                },
            });
            openModal();
        },
    });

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const handleAccountDeactivation = () => {
        if (password.length < 6) {
            setModalData({
                intent: "ERROR",
                title: "エラー",
                text: "パスワードは 6 文字以上にする必要があります",
            });
            openModal();
            return;
        }

        if (selectedReason.length === 0) {
            setModalData({
                intent: "ERROR",
                title: "エラー",
                text: "アカウント削除したい理由を選択してください",
            });
            openModal();
            return;
        }

        if (selectedReason.includes("その他") && otherReason.trim() === "") {
            setModalData({
                intent: "ERROR",
                title: "エラー",
                text: "アカウント削除したいその他理由を入力して下さい",
            });
            openModal();
            return;
        }

        setModalData({
            intent: "LOADING",
            title: "",
            text: "",
        });
        openModal();

        const reason = selectedReason.includes("その他")
            ? `${selectedReason
                  .filter((value) => value !== "その他")
                  .join("、")}、${otherReason}`
            : `${selectedReason.join("、")}`;

        deactivate({
            variables: {
                input: {
                    password,
                    reason,
                },
            },
        });
    };

    return (
        <div className="space-y-4 max-w-md mx-auto">
            {open && (
                <div className="space-y-4">
                    <div className="text-gray-800">
                        アカウント削除したい理由をお聞かせください（複数選択可能）
                    </div>
                    <div className="space-y-2">
                        {deactivationReason.map(({ value, label }, index) => (
                            <div>
                                <label className="flex cursor-pointer text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="deactivationReason"
                                        value={value}
                                        checked={
                                            selectedReason.includes(value)
                                                ? true
                                                : false
                                        }
                                        onClick={() => {
                                            if (
                                                selectedReason.includes(value)
                                            ) {
                                                setSelectedReason(
                                                    selectedReason.filter(
                                                        (reason) =>
                                                            value !== reason
                                                    )
                                                );
                                            } else {
                                                setSelectedReason([
                                                    ...selectedReason,
                                                    value,
                                                ]);
                                            }
                                        }}
                                        className="mr-2"
                                        disabled={loading}
                                    />
                                    <span>{label}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    {selectedReason.includes("その他") && (
                        <div>
                            <textarea
                                value={otherReason}
                                onChange={(event) => {
                                    const text = event.target.value;
                                    text.length <= 100 && setOtherReason(text);
                                }}
                                className="text-gray-600 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                                disabled={loading}
                            />
                        </div>
                    )}
                    <div className="text-gray-800">
                        アカウントを削除します。
                    </div>
                    <div className="text-gray-500">
                        登録中のご住所やクレジットカード情報、予約履歴など、アカウントに紐づく情報がすべて削除されます。
                    </div>
                    <div>
                        <TextField
                            label="パスワード"
                            type="password"
                            value={password}
                            onChange={(event) => {
                                const text = event.target.value;
                                setPassword(text);
                            }}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        onClick={handleAccountDeactivation}
                        disabled={loading}
                        variant="danger"
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
                variant={open ? "secondary" : "danger"}
                type="button"
            >
                {open ? "キャンセル" : "アカウントを削除"}
            </Button>
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
