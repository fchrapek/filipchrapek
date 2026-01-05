export default {
  plugins: {
    "postcss-custom-media": {},
    "postcss-nesting": {},
    "postcss-functions": {
      functions: {
        rem: (px) => `${px / 16}rem`,
      },
    },
  },
};
