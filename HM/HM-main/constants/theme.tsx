const colors = {
    accent: "#D87D4A",
    primary: "#5D9C59",
    secondary: "#BFA980",
    tertiary: "#F3E6C9",
    black: "#2F2F2F",
    white: "#FAFAFA",
    gray: "#A5A5A5",
    gray2: "#C0BFC0",
    gray3: '#808080',
    gray4: "#696969",
    red:"#e52931"
  };
  
  const sizes = {
    // global sizes
    base: 16,
    font: 14,
    radius: 6,
    padding: 25,
  
    // font sizes
    h1: 26,
    h2: 20,
    h3: 18,
    title: 18,
    header: 16,
    body: 14,
    caption: 12,
    border:8,
  };
  
  const fonts = {
    h1: {
      fontSize: sizes.h1
    },
    h2: {
      fontSize: sizes.h2
    },
    h3: {
      fontSize: sizes.h3
    },
    header: {
      fontSize: sizes.header
    },
    title: {
      fontSize: sizes.title
    },
    body: {
      fontSize: sizes.body
    },
    caption: {
      fontSize: sizes.caption
    },
    small: { fontSize: 10 },
  };
  
  export { colors, sizes, fonts };