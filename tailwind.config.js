/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: [
                    // 'Poppins',
                ],
            },
        },
    },
    darkMode: "class",
    plugins: [nextui()]
};
