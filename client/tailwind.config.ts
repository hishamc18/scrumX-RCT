import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        extralight: "200",
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      colors: {
        textColor: "#323333",
        placeholder: "rgba(50, 51, 51, 0.5)",
        pureWhite: "#FFFEFE", //icon, //white text, //sidebar, //modal, //navbar 
        offWhite: "#FAFBFB", //div background
        primaryDark: "#323333", //welcome card
      },
    },
  },
  plugins: [],
} satisfies Config;
