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
        primaryDark: "#323333", //welcome card  EEE9D2
        lightBlue: '#0094FF',
        lightDark: "#EBEAEB",
        lightWhite:"F0EFEF",
        priorityRed:"#FF6F61",
        lightGreen:"#00BFA6",
        priorityLow:"#EEE9D2",
        priorityMedium:"#E4EBF3"
      },
      screens: {
        'xl-custom': '1035px',
        'xll-custom': '1500px'
      }
    },
  },
  plugins: [],
} satisfies Config;