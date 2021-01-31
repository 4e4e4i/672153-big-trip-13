import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import Smart from "./smart";

import {EventType, FormMode, BLANK_POINT} from "../helpers/constants";

const EVENTS = Object.values(EventType);
const CALENDAR_DEFAULT_CONFIG = {
  dateFormat: `d/m/y H:i`,
  enableTime: true,
};

const createEventsLabelsListTemplate = (type, id, isDisabled) => {
  if (!EVENTS.length) {
    return ``;
  }

  const eventsItems = EVENTS.map((eventType) => {
    const eventTypeLowerCase = eventType.toLowerCase();
    const isChecked = type.toLowerCase() === eventTypeLowerCase ? `checked` : ``;
    return `
      <div class="event__type-item">
        <input
          id="event-type-${eventTypeLowerCase}-${id}"
          ${isChecked}
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${eventTypeLowerCase}"
          ${isDisabled ? `disabled` : ``}
        >
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

const createOffersFormTemplate = (offers, availableOffers = [], isDisabled) => {
  if (!availableOffers.length) {
    return ``;
  }

  const offersSelectorsFragments = availableOffers.map((availableOffer) => {
    const {title: offerName, price: offerPrice, offerId} = availableOffer;
    const isChecked = offers.some((offer) => offer.title === availableOffer.title) ? `checked` : ``;

    return `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${offerId}"
          type="checkbox"
          name="event-offer-${offerId}"
          data-offer="${offerId}"
          ${isChecked}
          ${isDisabled ? `disabled` : ``}
        >
        <label class="event__offer-label" for="event-offer-${offerId}">
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
          ${photos.map(({description, src}) => `<img class="event__photo" src="${src}" alt="${description}">`).join(``)}
        </div>
      </div>
    `;
};

const createdEventDestinationTemplate = (destination = {}) => {
  const {name, pictures = [], description} = destination;
  if (!name) {
    return ``;
  }
  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${pictures.length ? createPhotosTapeTemplate(pictures) : ``}
      </section>
    `;
};

const createCitiesInputTemplate = (selectedCity, destinations, id, isDisabled) => {
  return `
    <input
      class="event__input  event__input--destination"
      id="event-destination-${id}"
      type="text" name="event-destination"
      value="${selectedCity}"
      list="destination-list-${id}"
      ${isDisabled ? `disabled` : ``}
    >
    <datalist id="destination-list-${id}">
      ${destinations.map(({name}) => `
        <option value="${name}"></option>
      `).join(``)}
    </datalist>
  `;
};

export const createTripEditEventTemplate = (tripEvent, destinations, availableOffers, mode) => {
  const {
    type = `TAXI`,
    destination = {
      name: ``,
      description: ``,
      photos: []
    },
    startTime = new Date(),
    endTime = new Date(),
    price = 0,
    offers = [],
    id,
    isDisabled,
    isSaving,
    isDeleting
  } = tripEvent;

  const isEditForm = () => mode === FormMode.EDIT;
  const startTimeFormatted = dayjs(startTime).format(`DD/MM/YY HH:mm`);
  const endTimeFormatted = dayjs(endTime).format(`DD/MM/YY HH:mm`);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${EventType[type].toLowerCase()}.png"
              alt="Event type icon"
            >
          </label>
          <input
            class="event__type-toggle  visually-hidden"
            id="event-type-toggle-${id}"
            type="checkbox"
            ${isDisabled ? `disabled` : ``}
          >

          ${createEventsLabelsListTemplate(type, id, isDisabled)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${EventType[type]}
          </label>
          ${createCitiesInputTemplate(destination.name, Object.values(destinations), id, isDisabled)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            value="${startTimeFormatted}"
            ${isDisabled ? `disabled` : ``}
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            value="${endTimeFormatted}"
            ${isDisabled ? `disabled` : ``}
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-${id}"
            type="text"
            name="event-price"
            value="${price}"
            ${isDisabled ? `disabled` : ``}
          >
        </div>

        <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          ${isDisabled ? `disabled` : ``}
        >
          ${isSaving ? `Saving...` : `Save`}
        </button>
        <button
           class="event__reset-btn"
           type="reset"
           ${isDisabled ? `disabled` : ``}
        >
          ${isEditForm() ? `${isDeleting ? `Deleting..` : `Delete`}` : `Cancel`}
        </button>

        ${isEditForm() ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        ` : ``}
      </header>
      <section class="event__details">
        ${createOffersFormTemplate(offers, availableOffers[type], isDisabled)}
        ${createdEventDestinationTemplate(destination)}
      </section>
    </form>`
  );
};

export default class EditEventView extends Smart {
  constructor(tripEvent = BLANK_POINT, destinations = {}, availableOffers = {}, mode = FormMode.EDIT) {
    super();
    this._data = EditEventView.parsePointToData(tripEvent);
    this._destinations = destinations;
    this._availableOffers = availableOffers;
    this._mode = mode;
    this._datepickers = {};
    this._priceInputEl = null;

    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._offersChangeStatusHandler = this._offersChangeStatusHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
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
    return createTripEditEventTemplate(this._data, this._destinations, this._availableOffers, this._mode);
  }

  restoreHandlers() {
    if (this._mode === FormMode.EDIT) {
      this.setCloseFormClickHandler(this._callback.closeFormClick);
    }
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset(data) {
    this.updateData(
        EditEventView.parsePointToData(data)
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

    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((checkbox) => {
        checkbox.addEventListener(`change`, this._offersChangeStatusHandler);
      });

    this._priceInputEl = this.getElement().querySelector(`.event__input--price`);
    this._priceInputEl.addEventListener(`change`, this._priceChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEventView.parseDataToPoint(this._data));
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
      offers: []
    });
  }

  _offersChangeStatusHandler({target}) {
    const changedOffer = target.dataset.offer;
    const availableOffersOfEvent = this._availableOffers[this._data.type];
    const eventOffers = target.checked
      ? [...this._data.offers, availableOffersOfEvent.find(({offerId}) => offerId === changedOffer)]
      : this._data.offers.filter(({offerId}) => offerId !== changedOffer);
    this.updateData({
      offers: eventOffers
    });
  }

  _priceChangeHandler(evt) {
    this._priceInputEl.value = evt.target.value.replace(/[^\d]/g, ``);

    this.updateData({
      price: Number(evt.target.value) || 0
    });
  }

  _cityToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: this._destinations[evt.target.value]
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`button[type=reset]`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditEventView.parseDataToPoint(this._data));
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
