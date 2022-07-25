export const getRandomInt = (min:number, max: number):number => {
  /* generates random number between range (inclusive) */
  
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
