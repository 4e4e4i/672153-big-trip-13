import dayjs from "dayjs";
import {EVENT_TYPES} from "../helpers/constants";
const eventsList = Object.values(EVENT_TYPES);

const createEventsLabelsListTemplate = (type, id) => {
  if (!eventsList.length) {
    return ``;
  }

  const eventsItems = eventsList.map((eventType) => {
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

export const createTripEditEventTemplate = (event = {}, cities = [], mode = `EDIT`) => {
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
  } = event;

  const isEditForm = () => mode === `EDIT`;
  const startTimeFormatted = dayjs(startTime).format(`DD/MM/YY HH:mm`);
  const endTimeFormatted = dayjs(endTime).format(`DD/MM/YY HH:mm`);

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${EVENT_TYPES[type].toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${createEventsLabelsListTemplate(type, id)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${EVENT_TYPES[type]}
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
        <button class="event__reset-btn" type="reset">${isEditForm() ? `Cancel` : `Delete`}</button>

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
    </form>
  `;
};
