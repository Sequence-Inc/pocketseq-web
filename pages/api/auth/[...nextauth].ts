import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
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
        profile {
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
                        url: "https://dev-api.timebook.co.jp/dev/graphql",
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
            console.log({ token, user, account });
            if (user && account) {
                console.log("HAS USER");
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    user: user.profile,
                };
            } else {
                console.log("NO HAS USER");
                return token;
            }
        },
        async session({ session, token }) {
            console.log("SESSION CALLBACK", { session, token });
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.user = { ...session.user, ...(token.user as any) };
            return session;
        },
    },
});
