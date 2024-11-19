/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx,ts,tsx,js}"],
  theme: {
    extend: {
      animation: {
        spin: "spin 1.5s linear infinite",
        zoom: "zoom 1.8s ease-in-out infinite",
      },
      keyframes: {
        zoom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [
     
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "#EF4444", // Set the scrollbar color and track color
        },
        ".scrollbar-custom": {
          "&::-webkit-scrollbar": {
            width: "5px", // Set width of the scrollbar
            right: "5px", // Move the scrollbar 5px to the right
          },
          "&::-webkit-scrollbar-track": {
            background: "#8492a7", // Set the background color for the scrollbar track
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#EF4444", // Set the background color for the scrollbar handle
            borderRadius: "30px", // Round the corners of the scrollbar handle
            border: "none", // Remove the border
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
}