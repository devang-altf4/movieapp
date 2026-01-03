/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f84464',
                'primary-hover': '#d63350',
                'bg-main': '#0f172a',
                'bg-card': '#1e293b',
            }
        },
    },
    plugins: [],
}
