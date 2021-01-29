import dayjs from "dayjs";

export const isDateEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, `D`);
};

export const numberPad = (number, width) => (number.toString().length < width) ? `0${number}` : number;

export const isPointFromThePast = (point) => point.startTime < new Date().getTime();

export const isPointFromTheFuture = (point) => point.startTime > new Date().getTime();

export const sortByField = (fieldName) => (a, b) => a[fieldName] > b[fieldName] ? 1 : -1;

export const isEsc = (evt) => evt.key === `Escape` || evt.key === `Esc`;
