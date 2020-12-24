export const sortTripEventsByDay = (tripEventA, tripEventB) => {
  const dueTime = ({startTime, endTime}) => endTime - startTime;
  return dueTime(tripEventA) - dueTime(tripEventB);
};

export const sortTripEventsByPrice = ({totalPrice: totalPriceA}, {totalPrice: totalPriceB}) => {
  return totalPriceA - totalPriceB;
};
