import dayjs from "dayjs";
import Abstract from "./abstract";

import {EventType, TimeInMs} from "../helpers/constants";

const createTripEventOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (`
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.map(({price, title}) => `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `).join(``)}
    </ul>
  `);
};

export const createTripEventTemplate = (event) => {
  const {type, destination, startTime, endTime, dueTime, price, isFavorite, offers = []} = event;

  const eventType = EventType[type];
  const checkedOffers = offers;
  const startDate = dayjs(startTime);
  const endDate = dayjs(endTime);
  const startTimeFormatted = startDate.format(`HH:mm`);
  const startDateAttribute = startDate.format(`YYYY-MM-DD`);
  const startDayFormatted = `${startDate.format(`MMM`).toUpperCase()} ${startDate.format(`D`)}`;
  const endDateAttribute = endDate.format(`YYYY-MM-DD`);
  const endTimeFormatted = endDate.format(`HH:mm`);
  const startTimeAttribute = `${startDateAttribute}T${startTimeFormatted}`;
  const endTimeAttribute = `${endDateAttribute}T${endTimeFormatted}`;
  const differenceInHours = endDate.diff(startDate, `hour`);
  const getDurationOfEvent = (ms) => {
    const duration = new Date(ms);
    const days = Math.trunc(duration / TimeInMs.DAY);
    const hours = Math.trunc((duration % TimeInMs.DAY) / TimeInMs.HOUR);
    const minutes = Math.round((duration % TimeInMs.HOUR) / TimeInMs.MINUTE);
    return {
      days,
      hours,
      minutes
    };
  };
  const durationOfEvent = getDurationOfEvent(dueTime);

  const getDurationText = (differenceHour, duration) => {
    const {days, hours, minutes} = duration;

    if (days > 0) {
      return `${days}D ${hours}H ${minutes}M`;
    } else if (hours > 0) {
      return `${hours}H ${minutes}M`;
    } else {
      return `${minutes}M`;
    }
  };
  const favoriteClassName = isFavorite
    ? `event__favorite-btn event__favorite-btn--active`
    : `event__favorite-btn`;

  return (
    `<div class="event">
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
    </div>`
  );
};

export default class EventView extends Abstract {
  constructor(event) {
    super();
    this._event = event;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._switchFavoriteClickHandler = this._switchFavoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _switchFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.switchFavoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setSwitchFavoriteClickHandler(callback) {
    this._callback.switchFavoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._switchFavoriteClickHandler);
  }
}
