const { minWidth, fontFamily } = require("tailwindcss/defaulttheme");

module.exports = {
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/elements/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                primary: "#33E68C",
                primaryHover: "#2EC77A",
            },
            fontFamily: {
                sans: ["Inter var", ...fontFamily.sans],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/line-clamp"),
        require("@tailwindcss/aspect-ratio"),
    ],
};
