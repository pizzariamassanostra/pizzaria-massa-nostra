export const firstLastName = (username: string): string => {
  const usernameArray = username.trim().split(" ");

  const firstName = usernameArray[0];
  const lastName = usernameArray[usernameArray.length - 1];

  return `${firstName} ${lastName}`;
};
