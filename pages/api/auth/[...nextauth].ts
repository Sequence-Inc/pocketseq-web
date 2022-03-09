import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosRequestConfig } from "axios";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    lable: "Email",
                    type: "email",
                    placeholder: "mail@site.com",
                },
                password: { lable: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const { username: email, password } = credentials;

                    const request = JSON.stringify({
                        query: `mutation login ($input: LoginInput!) {
                                    login (input: $input) {
                                        accessToken
                                        refreshToken
                                    }
                                }`,
                        variables: {
                            input: {
                                email,
                                password,
                            },
                        },
                    });

                    // login config
                    const config: AxiosRequestConfig = {
                        method: "post",
                        url: process.env.NEXT_PUBLIC_API_URL,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: request,
                    };

                    const { data } = await axios(config);
                    const user = data.data.login;
                    return {
                        ...user.profile,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                    };
                } catch (e) {
                    console.log(e);
                    return null;
                }
            },
        }),
    ],
    secret: "8eb0d5eb8a45e4a4ac60b284d317383e91c9d372e3b67b154155c0a1b183c5deb2e5d6dceb6366704828c494951925d5",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        secret: "8eb0d5eb8a45e4a4ac60b284d317383e91c9d372e3b67b154155c0a1b183c5deb2e5d6dceb6366704828c494951925d5",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    user: user.profile,
                };
            } else {
                return token;
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;

            const request = JSON.stringify({
                query: `query myProfile {
                                myProfile {
                                    __typename
                                    ... on UserProfile {
                                        id
                                        roles
                                        email
                                        firstName
                                        lastName
                                        firstNameKana
                                        lastNameKana
                                        phoneNumber
                                        address {
                                            id
                                            addressLine1
                                            addressLine2
                                            city
                                            longitude
                                            latitude
                                            postalCode
                                            prefecture {
                                                id
                                                name
                                                nameKana
                                                nameRomaji
                                                available
                                            }
                                        }
                                        profilePhoto {
                                            id
                                            mime
                                            type
                                            thumbnail {
                                                width
                                                height
                                                url
                                            }
                                            small {
                                                width
                                                height
                                                url
                                            }
                                            medium {
                                                width
                                                height
                                                url
                                            }
                                            large {
                                                width
                                                height
                                                url
                                            }
                                        }
                                    }
                                    ... on CompanyProfile {
                                        id
                                        roles
                                        email
                                        name
                                        nameKana
                                        phoneNumber
                                        registrationNumber
                                    }
                                }
                        }`,
            });

            const config: AxiosRequestConfig = {
                method: "post",
                url: process.env.NEXT_PUBLIC_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.accessToken}`,
                },
                data: request,
            };
            const { data } = await axios(config);
            const userDetail = data.data.myProfile;
            if (userDetail.__typename === "UserProfile") {
                userDetail.name = `${userDetail.lastName} ${userDetail.firstName}`;
                userDetail.nameKana = `${userDetail.lastNameKana} ${userDetail.firstNameKana}`;
            }
            session.user = { ...userDetail };
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
});
