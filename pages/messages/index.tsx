import Head from "next/head";
import React from "react";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";
import { useMutation, useQuery } from "@apollo/client";
import {
    CREATE_NEW_CHAT,
    MY_CHAT,
    SEND_MESSAGE,
} from "src/apollo/queries/chat.queries";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import clsx from "clsx";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";
import { LoadingSpinner } from "@comp";
import moment from "moment";

const availableStyles = {
    self: [
        "flex items-end justify-end mt-4",
        "flex flex-col items-end order-1 max-w-xs mx-2 space-y-2 text-xs",
        "inline-block px-4 py-2 text-base text-white bg-blue-600 rounded-lg rounded-br-none",
        "text-gray-400",
    ],
    naself: [
        "flex items-end mt-4",
        "flex flex-col items-start order-2 max-w-xs mx-2 space-y-2 text-xs",
        "inline-block px-4 py-2 text-base text-gray-600 bg-gray-100 rounded-lg rounded-bl-none",
        "text-gray-400",
    ],
};

const urlCheck = new RegExp(
    "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_])?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
);

const Messages = ({ userSession, name, recipientIds, userId }) => {
    const [newChat, setNewChat] = useState<
        { name: string; recipientIds: string | string[] } | undefined
    >();
    const [activeChat, setActiveChat] = useState<any>();
    const [message, setMessage] = useState<string>("");

    const { data, loading, error, refetch } = useQuery(MY_CHAT, {
        fetchPolicy: "network-only",
    });
    const [mutate] = useMutation(CREATE_NEW_CHAT);
    const [sendMessageMutate] = useMutation(SEND_MESSAGE);

    useEffect(() => {
        if (data && recipientIds) {
            const activeChat = data?.myChats.find(
                (res) =>
                    res.type === "SINGLE" &&
                    res.members.some((mem) => mem.accountId === recipientIds)
            );
            if (activeChat) {
                setActiveChat(activeChat);
            } else {
                setNewChat({
                    name: name as string,
                    recipientIds: recipientIds,
                });
                setActiveChat({
                    name: name as string,
                    recipientIds: recipientIds,
                });
            }
        }
        const activeChat = data?.myChats[0];

        if (activeChat && !recipientIds) {
            const activeHost = activeChat.members[0];
            setActiveChat(activeChat);
            router.push(
                `/messages?name=${activeHost?.firstName}%20${activeHost?.lastName}&recipientIds=${activeHost?.accountId}`
            );
        }
    }, [data]);

    const changeActiveChat = (chat: any) => {
        setActiveChat(chat);
        const activeMember = chat.members?.filter(
            (res) => res.accountId !== userId
        )[0];
        router.push(
            `/messages?name=${
                chat?.id
                    ? activeMember?.firstName + " " + activeMember?.lastName
                    : chat?.name
            }&recipientIds=${
                chat?.id ? activeMember?.accountId : chat?.recipientIds
            }`
        );
    };

    const sendMessage = async () => {
        try {
            if (activeChat?.id) {
                const chatData = await sendMessageMutate({
                    variables: { input: { message, chatId: activeChat?.id } },
                });
                if (chatData.data) {
                    setNewChat(undefined);
                    setMessage("");
                    refetch();
                }
            } else {
                const chatData = await mutate({
                    variables: {
                        input: {
                            message,
                            recipientIds: activeChat?.recipientIds,
                        },
                    },
                });
                if (chatData.data) {
                    setNewChat(undefined);
                    setMessage("");
                    refetch();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const activeRecipient = activeChat?.members?.filter(
        (res) => res.id !== userId
    )[0];

    const activeRecipientProfilePhotoURL =
        activeRecipient?.profilePhoto?.thumbnail?.url ||
        `https://avatars.dicebear.com/api/identicon/${activeRecipient?.id}.svg`;

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>メッセージ - {config.appName}</title>
            </Head>
            {/* <Container className=""> */}
            <main className="flex-1 min-w-0 overflow-hidden border-t border-gray-200 lg:flex">
                {/* Primary column */}
                <section
                    aria-labelledby="primary-heading"
                    className="flex flex-col flex-1 h-[calc(100vh-68px)] min-w-0 overflow-y-auto lg:order-last overflow-hidden"
                >
                    <div className="flex flex-col justify-between h-[calc(100vh-64px)] flex-1 pb-2">
                        <div className="flex justify-between px-4 py-3 bg-white border-b border-gray-200 sm:items-center">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={activeRecipientProfilePhotoURL}
                                    alt=""
                                    className="w-10 h-10 rounded-full sm:w-12 sm:h-12"
                                />
                                <div className="flex flex-col leading-tight">
                                    <div className="flex items-center mt-1 text-xl">
                                        <span className="mr-3 text-gray-700">
                                            {activeRecipient
                                                ? activeRecipient?.lastName +
                                                  " " +
                                                  activeRecipient?.firstName
                                                : activeChat?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            id="messages"
                            className="flex flex-col-reverse p-4 h-full overflow-y-auto scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
                        >
                            {activeChat?.messages?.map((message) => {
                                const self = message.sender.id === userId;

                                const style = self
                                    ? availableStyles.self
                                    : availableStyles.naself;

                                let htmlMessage = message.message;

                                if (urlCheck.test(htmlMessage)) {
                                    htmlMessage = htmlMessage.replaceAll(
                                        urlCheck.exec(htmlMessage)[0],
                                        `<a class="underline" target="_blank" href="${
                                            urlCheck.exec(htmlMessage)[0]
                                        }">${urlCheck.exec(htmlMessage)[0]}</a>`
                                    );
                                }

                                return (
                                    <div
                                        className="chat-message"
                                        key={message.id}
                                    >
                                        <div className={style[0]}>
                                            <div className={style[1]}>
                                                <div>
                                                    <span
                                                        className={style[2]}
                                                        dangerouslySetInnerHTML={{
                                                            __html: htmlMessage,
                                                        }}
                                                    ></span>
                                                </div>
                                                <div className={style[3]}>
                                                    {moment(
                                                        message.updatedAt
                                                    ).fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* New Message Input Box */}
                        <div className="px-4 pt-4 mb-2 border-t border-gray-200 sm:mb-0">
                            <div className="relative flex">
                                <input
                                    type="text"
                                    placeholder="何か書く"
                                    autoFocus
                                    className="w-full px-6 py-3 text-gray-600 placeholder-gray-600 border border-gray-200 bg-white rounded-full focus:outline-none focus:placeholder-gray-400"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 items-center hidden sm:flex">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center w-10 h-10 mr-2 text-white transition duration-500 ease-in-out rounded-full bg-primary hover:opacity-50 focus:outline-none"
                                        onClick={sendMessage}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-6 h-6 transform rotate-90"
                                        >
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary column (hidden on smaller screens) */}
                <aside className="hidden bg-white lg:block lg:flex-shrink-0 lg:order-first">
                    <div className="relative flex flex-col h-full overflow-y-auto border-r border-gray-200 w-96">
                        {/* Your content */}
                        <ul role="list" className="divide-y divide-gray-200">
                            {newChat && (
                                <li
                                    key={newChat.name}
                                    className="flex items-center p-4 cursor-pointer"
                                    onClick={() => changeActiveChat(newChat)}
                                >
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {newChat.name}
                                        </p>
                                    </div>
                                </li>
                            )}
                            {data?.myChats?.map((chat) => {
                                const sender = chat.members.filter(
                                    (res) => res.id !== userId
                                )[0];

                                const isActive = chat.id === activeChat?.id;

                                return (
                                    <li
                                        key={chat.id}
                                        className={clsx(
                                            "flex items-center p-4",
                                            isActive
                                                ? "bg-gray-50"
                                                : "cursor-pointer"
                                        )}
                                        onClick={() => changeActiveChat(chat)}
                                    >
                                        {sender?.profilePhoto?.thumbnail
                                            ?.url ? (
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={
                                                    sender.profilePhoto
                                                        ?.thumbnail?.url
                                                }
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        )}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {sender?.lastName}{" "}
                                                {sender?.firstName}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>
            </main>

            {/* </Container> */}
        </HostLayout>
    );
};

export default Messages;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/api/auth/signin",
        roles: ["user", "host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        const name = Object.keys(context.query).length
            ? context.query?.name
            : null;
        const recipientIds = Object.keys(context.query).length
            ? context.query?.recipientIds
            : null;

        return {
            props: {
                userSession,
                userId: userSession.user.id,
                name,
                recipientIds,
            },
        };
    }
};
