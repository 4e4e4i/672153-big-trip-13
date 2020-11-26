import dayjs from "dayjs";

const createInfoTitle = (cities) => {
  if (cities.length > 3) {
    return `
      ${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}
    `;
  }
  return `${cities.map((city, index) => index === 0 ? `${city}` : ` &mdash; ${city}`)}`;
};

export const createTripInfoTemplate = (info = {}) => {
  const {cities = [], startTime = null, endTime = null, totalPrice = null} = info;
  const startTrip = dayjs(startTime);
  const endTrip = dayjs(endTime);
  const isSameMonthEnd = () => startTrip.get(`month`) === endTrip.get(`month`);
  const getEndTripText = () => isSameMonthEnd() ? endTrip.format(`D`) : endTrip.format(`MMM D`);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createInfoTitle(cities)}</h1>

        <p class="trip-info__dates">${startTrip.format(`MMM D`)}&nbsp;&mdash;&nbsp;${getEndTripText()}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
};
