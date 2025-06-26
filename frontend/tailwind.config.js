// tailwind.config.js
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'], // <-- waa muhiim!
            },
            colors: {
                primary: {
                    DEFAULT: "#4ED7F1",
                    100: "#E0FAFD",
                    200: "#B9F1FA",
                    300: "#92E8F8",
                    400: "#6BDEF5",
                    500: "#4ED7F1", // your original
                    600: "#36C3DC",
                    700: "#1F9FB5",
                    800: "#157B8F", // your new bg-primary-800
                    900: "#0A586A",
                },
            },
        },
    },
    plugins: [],
}
