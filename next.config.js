const nextTranslate = require("next-translate");

module.exports = nextTranslate({
    reactStrictMode: true,
    images: {
        domains: [
            "cdnspacemarket.com",
            "timebook-api-dev-media.s3.ap-northeast-1.amazonaws.com",
            "timebook-api-prod-media.s3.ap-northeast-1.amazonaws.com",
            "timebook-public-media.s3.ap-northeast-1.amazonaws.com",
            "s3.ap-northeast-1.amazonaws.com",
        ],
    },
    webpack: (config) => {
        config.experiments = { topLevelAwait: true, layers: true };
        return config;
    },
    experiments: true,
});
