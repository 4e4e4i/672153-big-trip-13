import dayjs from "dayjs";
import {EventType, ADDITIONAL_OFFERS} from "../helpers/constants";
import Smart from "./smart";
import {getDestination} from "../mock/trip-event";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const EVENTS = Object.values(EventType);

const CALENDAR_DEFAULT_CONFIG = {
  dateFormat: `d/m/y H:i`,
  enableTime: true,
};

const createEventsLabelsListTemplate = (type, id) => {
  if (!EVENTS.length) {
    return ``;
  }

  const eventsItems = EVENTS.map((eventType) => {
    const eventTypeLowerCase = eventType.toLowerCase();
    const isChecked = type.toLowerCase() === eventTypeLowerCase ? `checked` : ``;
    return `
      <div class="event__type-item">
        <input id="event-type-${eventTypeLowerCase}-${id}" ${isChecked} class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeLowerCase}">
        <label class="event__type-label  event__type-label--${eventTypeLowerCase}" for="event-type-${eventTypeLowerCase}-${id}">${eventType}</label>
      </div>
    `;
  }).join(``);

  return `
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventsItems}
      </fieldset>
    </div>
  `;
};

const createOffersFormTemplate = (availableOffers, id) => {
  if (!availableOffers.length) {
    return ``;
  }

  const offersSelectorsFragments = availableOffers.map((offer) => {
    const {type: offerType, name: offerName, price: offerPrice, isChecked: isOfferChecked} = offer;
    const isChecked = isOfferChecked ? `checked` : ``;

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerType}-${id}" type="checkbox" name="event-offer-${offerType}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offerType}-${id}">
          <span class="event__offer-title">${offerName}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerPrice}</span>
        </label>
      </div>
    `;
  }).join(``);

  return `
      <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
             ${offersSelectorsFragments}
          </div>
        </section>
    `;
};

const createPhotosTapeTemplate = (photos = []) => {
  if (!photos.length) {
    return ``;
  }

  return `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos.map((photoUrl) => `<img class="event__photo" src="${photoUrl}" alt="Event photo">`).join(``)}
        </div>
      </div>
    `;
};

const createdEventDestinationTemplate = (destination) => {
  const {name, photos = [], description} = destination;
  if (!name) {
    return ``;
  }
  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${photos.length ? createPhotosTapeTemplate(photos) : ``}
      </section>
    `;
};

const createCitiesInputTemplate = (selectedCity, cities, id) => {
  return `
    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${selectedCity}" list="destination-list-${id}">
    <datalist id="destination-list-${id}">
      ${cities.map((city) => `
        <option value="${city}"></option>
      `).join(``)}
    </datalist>
  `;
};

export const createTripEditEventTemplate = (tripEvent, cities, mode) => {
  const {
    type = `TAXI`,
    destination: eventDestination = {
      name: ``,
      description: ``,
      photos: []
    },
    startTime = new Date(),
    endTime = new Date(),
    price = 0,
    offers = [],
    id
  } = tripEvent;

  const isEditForm = () => mode === `EDIT`;
  const startTimeFormatted = dayjs(startTime).format(`DD/MM/YY HH:mm`);
  const endTimeFormatted = dayjs(endTime).format(`DD/MM/YY HH:mm`);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${EventType[type].toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${createEventsLabelsListTemplate(type, id)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${EventType[type]}
          </label>
          ${createCitiesInputTemplate(eventDestination.name, cities, id)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startTimeFormatted}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endTimeFormatted}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEditForm() ? `Delete` : `Cancel`}</button>

        ${isEditForm() ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        ` : ``}
      </header>
      <section class="event__details">
        ${createOffersFormTemplate(offers, id)}
        ${createdEventDestinationTemplate(eventDestination)}
      </section>
    </form>`
  );
};

export default class EditEventView extends Smart {
  constructor(tripEvent = {}, cities = [], mode = `EDIT`) {
    super();
    this._data = tripEvent;
    this._cities = cities;
    this._mode = mode;
    this._datepickers = {};

    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._cityToggleHandler = this._cityToggleHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeFormClickHandler = this._closeFormClickHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  removeElement() {
    super.removeElement();

    if (Object.keys(this._datepickers).length) {
      this._destroyDatepicker(`start-time`);
      this._destroyDatepicker(`end-time`);
    }
  }

  getTemplate() {
    return createTripEditEventTemplate(this._data, this._cities, this._mode);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setCloseFormClickHandler(this._callback.closeFormClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset(data) {
    this.updateData(
        data
    );
  }

  _setDatepickers() {
    this._setDatepickerStartTime(`start-time`);
    this._setDatepickerEndTime(`end-time`);
  }

  _setDatepickerStartTime(periodTime) {
    this._destroyDatepicker(periodTime);

    this._datepickers[periodTime] = flatpickr(
        this.getElement().querySelector(`.event__input--time[name='event-${periodTime}']`),
        Object.assign(
            {},
            CALENDAR_DEFAULT_CONFIG,
            {
              defaultDate: this._data[periodTime],
              onChange: this._startTimeChangeHandler
            }
        )
    );
  }

  _setDatepickerEndTime(periodTime) {
    this._destroyDatepicker(periodTime);

    this._datepickers[periodTime] = flatpickr(
        this.getElement().querySelector(`.event__input--time[name='event-${periodTime}']`),
        Object.assign(
            {},
            CALENDAR_DEFAULT_CONFIG,
            {
              minDate: this._data[`startTime`],
              defaultDate: this._data[periodTime],
              onChange: this._endTimeChangeHandler
            }
        )
    );
  }

  _destroyDatepicker(periodTime) {
    if (this._datepickers && this._datepickers[periodTime]) {
      this._datepickers[periodTime].destroy();
      this._datepickers[periodTime] = null;
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((radio) => {
        radio.addEventListener(`change`, this._eventTypeToggleHandler);
      });

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._cityToggleHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _closeFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormClick();
  }

  _eventTypeToggleHandler(evt) {
    evt.preventDefault();
    const type = evt.target.value.toUpperCase().split(`-`).join(`_`);
    if (!EventType[type]) {
      return;
    }
    this.updateData({
      type,
      offers: ADDITIONAL_OFFERS[type] ? ADDITIONAL_OFFERS[type] : []
    });
  }

  _cityToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: getDestination(evt.target.value)
    });

  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      startTime: dayjs(userDate)
    });
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      endTime: dayjs(userDate)
    });
  }

  setCloseFormClickHandler(callback) {
    this._callback.closeFormClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`button[type=reset]`).addEventListener(`click`, this._formDeleteClickHandler);
  }
}
