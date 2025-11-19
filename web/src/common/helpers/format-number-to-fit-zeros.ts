export const formatNumberToFitZeros = (
  numbers: string[],
  desiredLenght: number,
) => {
  const formattedNumbers = numbers.map((number) => {
    return number.padStart(desiredLenght, "0");
  });
  return formattedNumbers;
};
