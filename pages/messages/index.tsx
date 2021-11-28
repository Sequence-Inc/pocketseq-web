import Head from 'next/head';
import React from 'react'
import HostLayout from 'src/layouts/HostLayout';
import { Container } from "@element";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_NEW_CHAT, MY_CHAT, SEND_MESSAGE } from 'src/apollo/queries/chat.queries';
import router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import clsx from 'clsx';

const Messages = ({ name, recipientIds, userId }) => {
    const [newChat, setNewChat] = useState<{ name: string; recipientIds: string | string[] } | undefined>();
    const [activeChat, setActiveChat] = useState<any>();
    const [message, setMessage] = useState<string | undefined>();
    const activeUser = activeChat?.members?.filter(res => res.accountId !== userId)[0];

    const { data, refetch } = useQuery(MY_CHAT, { fetchPolicy: "network-only" });
    const [mutate] = useMutation(CREATE_NEW_CHAT);
    const [sendMessageMutate] = useMutation(SEND_MESSAGE);

    useEffect(() => {
        if (data && recipientIds) {
            const activeChat = data?.myChats.find(res => res.type === "SINGLE" && res.members.some(mem => mem.accountId === recipientIds));
            if (activeChat) {
                setActiveChat(activeChat);
            } else {
                setNewChat({ name: name as string, recipientIds: recipientIds });
                setActiveChat({ name: name as string, recipientIds: recipientIds });
            }
        }
        const activeMember = data?.myChats[0]
        if (activeMember && !recipientIds) {
            const activeHost = activeMember.members[0];
            setActiveChat(activeMember);
            router.push(`/messages?name=${activeHost?.firstName}%20${activeHost?.lastName}&recipientIds=${activeHost?.accountId}`)
        }
    }, [data]);

    const changeActiveChat = (chat: any) => {
        setActiveChat(chat);
        const activeMember = chat.members?.filter(res => res.accountId !== userId)[0];
        router.push(`/messages?name=${chat?.id ? activeMember?.firstName + " " + activeMember?.lastName : chat?.name}&recipientIds=${chat?.id ? activeMember?.accountId : chat?.recipientIds}`)
    }

    const sendMessage = async () => {
        try {
            if (activeChat?.id) {
                const chatData = await sendMessageMutate({ variables: { input: { message, chatId: activeChat?.id } } });
                if (chatData.data) {
                    setNewChat(undefined);
                    setMessage(undefined);
                    refetch();
                }
            } else {
                const chatData = await mutate({ variables: { input: { message, recipientIds: activeChat?.recipientIds } } });
                if (chatData.data) {
                    setNewChat(undefined);
                    setMessage(undefined);
                    refetch();
                }
            }
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <HostLayout>
            <Head>
                <title>Profile - Timebook</title>
            </Head>
            {/* <Container className=""> */}
            <main className="flex-1 min-w-0 overflow-hidden border-t border-gray-200 lg:flex">
                {/* Primary column */}
                <section
                    aria-labelledby="primary-heading"
                    className="flex flex-col flex-1 h-[calc(100vh-68px)] min-w-0 overflow-y-auto lg:order-last overflow-hidden"
                >
                    <div className="flex flex-col justify-between h-[calc(100vh-64px)] flex-1 pb-2">
                        <div className="flex justify-between px-4 py-3 bg-white border-b-2 border-gray-200 sm:items-center">
                            <div className="flex items-center space-x-4">
                                {activeUser?.profilePhoto?.thumbnail?.url ?
                                    <img src={activeUser?.profilePhoto?.thumbnail?.url} alt="" className="w-10 h-10 rounded-full sm:w-16 sm:h-16" />
                                    : <div className="w-10 h-10 bg-gray-200 rounded-full sm:w-16 sm:h-16" />}
                                <div className="flex flex-col leading-tight">
                                    <div className="flex items-center mt-1 text-2xl">
                                        <span className="mr-3 text-gray-700">
                                            {activeUser ? activeUser?.firstName + " " + activeUser?.lastName : activeChat?.name}
                                            {console.log(activeUser, activeChat, activeUser ? activeUser?.firstName + " " + activeUser?.lastName : activeChat?.name)}
                                        </span>
                                        {/* <span className="text-green-500">
                                            <svg width="10" height="10">
                                                <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                                            </svg>
                                        </span> */}
                                    </div>
                                    {/* <span className="text-lg text-gray-600">Junior Developer</span> */}
                                </div>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </button>
                                <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </button>
                                <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                </button>
                            </div> */}
                        </div>
                        <div id="messages" className="flex flex-col p-3 space-y-4 overflow-y-auto scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2">
                            {activeChat?.messages?.map(res => {
                                return res.sender.id === recipientIds ?
                                    <div className="chat-message">
                                        <div className="flex items-end">
                                            <div className="flex flex-col items-start order-2 max-w-xs mx-2 space-y-2 text-xs">
                                                <div>
                                                    <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg rounded-bl-none">
                                                        {res.message}
                                                    </span>
                                                </div>
                                            </div>
                                            {res.profilePhoto?.thumbnail?.url ?
                                                <img src={res.profilePhoto?.thumbnail?.url} alt="My profile" className="order-2 w-6 h-6 rounded-full" />
                                                : <div className="order-2 w-6 h-6 bg-gray-200 rounded-full" />}
                                        </div>
                                    </div> :
                                    <div className="chat-message">
                                        <div className="flex items-end justify-end">
                                            <div className="flex flex-col items-end order-1 max-w-xs mx-2 space-y-2 text-xs">
                                                <div>
                                                    <span className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg rounded-br-none ">
                                                        {res.message}
                                                    </span>
                                                </div>
                                            </div>
                                            {res.profilePhoto?.thumbnail?.url ?
                                                <img src={res.profilePhoto?.thumbnail?.url} alt="My profile" className="order-2 w-6 h-6 rounded-full" />
                                                : <div className="order-2 w-6 h-6 bg-gray-200 rounded-full" />}
                                        </div>
                                    </div>
                            })}
                        </div>
                        <div className="px-4 pt-4 mb-2 border-t-2 border-gray-200 sm:mb-0">
                            <div className="relative flex">
                                {/* <span className="absolute inset-y-0 flex items-center">
                                    <button type="button" className="inline-flex items-center justify-center w-12 h-12 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                        </svg>
                                    </button>
                                </span> */}
                                <input
                                    type="text"
                                    placeholder="Write Something"
                                    autoFocus
                                    className="w-full px-6 py-3 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-full focus:outline-none focus:placeholder-gray-400"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 items-center hidden sm:flex">
                                    {/* <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                    </button>
                                    <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </button>
                                    <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </button> */}
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center w-10 h-10 mr-2 text-white transition duration-500 ease-in-out rounded-full bg-primary hover:opacity-50 focus:outline-none"
                                        onClick={sendMessage}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 transform rotate-90">
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
                    <div className="relative flex flex-col h-full overflow-y-auto border-gray-200 w-96">
                        {/* Your content */}
                        <ul role="list" className="divide-y divide-gray-200">
                            {newChat &&
                                <li
                                    key={newChat.name}
                                    className="flex items-center p-4 cursor-pointer"
                                    onClick={() => changeActiveChat(newChat)}
                                >
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{newChat.name}</p>
                                    </div>
                                </li>
                            }
                            {data?.myChats?.map((person) => {
                                // const filteredPerson = person.members[1];
                                const filteredPerson = person.members?.filter(res => res.accountId !== userId)[0];
                                const isActive = person.id === activeChat?.id;
                                console.log("FFFFF", filteredPerson, person.members, userId)
                                return (
                                    <li
                                        key={person.id}
                                        className={clsx("flex items-center p-4", isActive ? "bg-gray-50" : "cursor-pointer")}
                                        onClick={() => changeActiveChat(person)}
                                    >
                                        {filteredPerson?.profilePhoto?.thumbnail?.url ?
                                            <img className="w-10 h-10 rounded-full" src={filteredPerson.profilePhoto?.thumbnail?.url} alt="" />
                                            : <div className="w-10 h-10 bg-gray-200 rounded-full" />}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{filteredPerson?.firstName} {filteredPerson?.lastName}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </aside>
            </main>

            {/* </Container> */}
        </HostLayout>
    )
}

export default Messages;

export async function getServerSideProps(context) {
    const userId = context.req.cookies?.session_profile ? JSON.parse(context.req.cookies?.session_profile)?.id : null;
    const name = Object.keys(context.query).length ? context.query?.name : null;
    const recipientIds = Object.keys(context.query).length ? context.query?.recipientIds : null;
    return { props: { name, recipientIds, userId } };
}
