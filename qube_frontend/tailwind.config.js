module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      'primary_black': '#091026',
      'primary_darkblue': '#030B2B',
      'primary_blue': '#052DA6',
      'secondary_orange': '#F24E29',
      'secondary_pink': '#F2075D',
      'secondary_yellow': '#FDB805',
      'white': "#ffffff",
      'black': "#000000",
      'form_background': '#111F4C',
      'form_text_color': '#466DB9',
      'form_sent_background': '#18244D',
      'submit_button_start': "#022CBE",
      'submit_button_end': "#025BF9",
      'error_red': "#F2085D",
      'input_border': '#4C74C1',
      'green': '#00B849',
      'red': '#F2085D',
      'orange': '#F24E29',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
