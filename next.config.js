// module.exports = {
//     images: {
//         domains: ["cdnspacemarket.com"],
//     },
// };

const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
    reactStrictMode: true,
    images: {
        domains: ["cdnspacemarket.com"],
    },
    pwa: {
        dest: 'public',
        runtimeCaching,
    }
})

