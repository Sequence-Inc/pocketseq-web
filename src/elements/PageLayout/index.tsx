import Head from "next/head";
import React, { FunctionComponent } from "react";
import Container from "../Container";
import clsx from "clsx";

interface IPageLayoutProps {
    pageTitle?: string;
    bannerTitle?: string;
    BannerIcon?: any;
    children?: React.ReactNode;
    BannerActionButton?: FunctionComponent;
    childrenWrapperClassName?: string;
}

const PageLayout = (props: IPageLayoutProps) => {
    const {
        pageTitle,
        bannerTitle,
        BannerIcon,
        BannerActionButton,
        children,
        childrenWrapperClassName,
    } = props;
    return (
        <>
            {pageTitle && (
                <Head>
                    <title>{pageTitle}</title>
                </Head>
            )}

            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        {BannerIcon && (
                                            <BannerIcon
                                                className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            {bannerTitle || pageTitle}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            {BannerActionButton && <BannerActionButton />}
                        </div>
                    </div>
                </Container>
            </div>
            <Container
                className={clsx(
                    "py-4 sm:py-6 lg:py-8 text-gray-700",
                    childrenWrapperClassName || ""
                )}
            >
                {children}
            </Container>
        </>
    );
};

export default PageLayout;
