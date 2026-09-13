export function getSum(arrayOfNumbers) {
  let sum = arrayOfNumbers.reduce((total, num) => total + num, 0);
  return sum;
}
