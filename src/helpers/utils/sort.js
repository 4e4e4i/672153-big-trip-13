export const sortTripEventsByDay = (tripEventA, tripEventB) => {
  return tripEventA.startTime - tripEventB.startTime;
};

export const sortTripEventsByPrice = ({totalPrice: totalPriceA}, {totalPrice: totalPriceB}) => {
  return totalPriceA - totalPriceB;
};
