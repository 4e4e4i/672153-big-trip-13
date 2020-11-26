import dayjs from "dayjs";
import {numberPad} from "../utils/number-pad";
import {EVENT_TYPES} from "../helpers/constants";

const createTripEventOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }
  let fragment = ``;

  for (const offer of offers) {
    const {price, name} = offer;
    fragment += `
      <li class="event__offer">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>
    `;
  }

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${fragment}
    </ul>
  `;
};

export const createTripEventTemplate = (event) => {
  const {type, destination, startTime, endTime, price, isFavorite, offers} = event;

  const eventType = EVENT_TYPES[type];
  const checkedOffers = offers.filter((offer) => offer.isChecked);
  const startDate = dayjs(startTime);
  const endDate = dayjs(endTime);
  const startTimeFormatted = startDate.format(`HH:mm`);
  const startDateAttribute = startDate.format(`YYYY-MM-DD`);
  const startDayFormatted = `${startDate.format(`MMM`).toUpperCase()} ${startDate.format(`D`)}`;
  const endDateAttribute = endDate.format(`YYYY-MM-DD`);
  const endTimeFormatted = endDate.format(`HH:mm`);
  const startTimeAttribute = `${startDateAttribute}T${startTimeFormatted}`;
  const endTimeAttribute = `${endDateAttribute}T${endTimeFormatted}`;
  const differenceInMs = endTime - startTime;
  const differenceInHours = endDate.diff(startDate, `hour`);
  const getDurationOfEvent = (ms) => {
    const duration = new Date(ms);
    const days = numberPad(duration.getDate() - 1, 2);
    const hours = numberPad(duration.getHours(), 2);
    const minutes = numberPad(duration.getMinutes(), 2);
    return {
      days,
      hours,
      minutes
    };
  };
  const durationOfEvent = getDurationOfEvent(differenceInMs);
  const getDurationText = (differenceHour, duration) => {
    const {days, hours, minutes} = duration;

    if (differenceHour > 24) {
      return `${days}D ${hours}H ${minutes}M`;
    }
    if (differenceHour <= 24 && hours >= 1) {
      return `${hours}H ${minutes}M`;
    }
    return `${minutes}M`;
  };
  const favoriteClassName = isFavorite
    ? `event__favorite-btn event__favorite-btn--active`
    : `event__favorite-btn`;

  return `
    <div class="event">
      <time class="event__date" datetime="${startDateAttribute}">${startDayFormatted}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTimeAttribute}">${startTimeFormatted}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTimeAttribute}">${endTimeFormatted}</time>
        </p>
        <p class="event__duration">${getDurationText(differenceInHours, durationOfEvent)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${createTripEventOffersTemplate(checkedOffers)}
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  `;
};
