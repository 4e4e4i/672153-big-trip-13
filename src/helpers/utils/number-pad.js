export const numberPad = (number, width) => (number.toString().length < width) ? `0${number}` : number;
