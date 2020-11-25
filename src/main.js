import {createTripInfoTemplate} from "./view/trip-info";
import {createTripTabsTemplate} from "./view/trip-tabs";
import {createTripFiltersTemplate} from "./view/trip-filters";
import {createTripSortTemplate} from "./view/trip-sort";
import {createTripEventTemplate} from "./view/trip-event";
import {createTripEditEventTemplate} from "./view/trip-edit-event";
import {createTripCreateEventTemplate} from "./view/trip-create-event";
import {createTripEventItemTemplate} from "./view/trip-event-item";

import {generateTripEvent} from "./mock/trip-event";

const EVENT_COUNT = 3;

const eventPoints = new Array(EVENT_COUNT).fill().map(generateTripEvent);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);
render(tripControlsElement, createTripTabsTemplate(), `afterbegin`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);
render(tripEventsElement, createTripSortTemplate(), `beforeend`);

const tripListEvent = tripEventsElement.querySelector(`.trip-events__list`);

render(tripListEvent, createTripEventItemTemplate(createTripEditEventTemplate()), `afterbegin`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripListEvent, createTripEventItemTemplate(createTripEventTemplate(eventPoints[i])), `beforeend`);
}

render(tripListEvent, createTripEventItemTemplate(createTripCreateEventTemplate()), `beforeend`);

console.log(generateTripEvent());
