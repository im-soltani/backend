const capitalizeFirstLetter = (s: string) =>
  s ? s.substr(0, 1).toUpperCase() + s.substr(1) : s;

export { capitalizeFirstLetter };
