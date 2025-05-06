import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // ✅ React ke sare components me Tailwind enable
    ],
    theme: {
      extend: {},
    },
    plugins: [daisyui],
    daisyui:{
      themes:[
        "light",
        "dark",
        "synthwave",
        "cyberpunk"
      ]
    }
  }
  