import dayjs from "dayjs";

export const isDateEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, `D`);
};
