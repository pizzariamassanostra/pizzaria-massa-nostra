export const censorUsername = (username: string): string => {
  const usernameArray = username.trim().split(" ");
  let censoredArray: string[] = [];

  usernameArray?.forEach((word, index) => {
    if ([usernameArray.length - 1, 0].includes(index)) {
      censoredArray.push(word);
    } else {
      censoredArray.push(
        word
          .split("")
          .map(() => {
            return "*";
          })
          .join(""),
      );
    }
  });
  return censoredArray.join(" ");
};
