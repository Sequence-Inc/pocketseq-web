// const withPWA = require("next-pwa");
// const runtimeCaching = require("next-pwa/cache");
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
    reactStrictMode: true,
    images: {
        domains: [
            "cdnspacemarket.com",
            "timebook-api-dev-media.s3.ap-northeast-1.amazonaws.com",
            "timebook-api-prod-media.s3.ap-northeast-1.amazonaws.com",
        ],
    },
    // pwa: {
    //     dest: "public",
    //     runtimeCaching,
    //     disable: true,
    // },
    webpack: (config) => {
        config.experiments = { topLevelAwait: true };
        return config;
    },
});
