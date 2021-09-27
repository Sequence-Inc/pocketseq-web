// module.exports = {
//     images: {
//         domains: ["cdnspacemarket.com"],
//     },
// };

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
    reactStrictMode: true,
    images: {
        domains: [
            "cdnspacemarket.com",
            "timebook-api-dev-media.s3.ap-northeast-1.amazonaws.com",
        ],
    },
    pwa: {
        dest: "public",
        runtimeCaching,
        disable: true,
    },
    webpack: (config) => {
        config.experiments = { topLevelAwait: true };
        return config;
    },
});
