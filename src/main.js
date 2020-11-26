import {createTripInfoTemplate} from "./view/trip-info";
import {createTripTabsTemplate} from "./view/trip-tabs";
import {createTripFiltersTemplate} from "./view/trip-filters";
import {createTripSortTemplate} from "./view/trip-sort";
import {createTripEventTemplate} from "./view/trip-event";
import {createTripEditEventTemplate} from "./view/trip-edit-event";
import {createTripEventItemTemplate} from "./view/trip-event-item";

import {generateTripEvent} from "./mock/trip-event";
import {CITIES} from "./helpers/constants";

const EVENT_COUNT = 15;

const state = {
  tabs: [
    {
      name: `Table`,
      url: `#`,
      isActive: true
    },
    {
      name: `Stats`,
      url: `#`,
      isActive: false
    }
  ],

  activeSort: `day`,

  activeFilter: ``,

  eventPoints: [],

  tripInfo: {}
};

const generatedEventPoints = new Array(EVENT_COUNT).fill().map(generateTripEvent);
state.eventPoints = generatedEventPoints;


const getSortedEventsByDay = (events) => [...events].sort(({startTime}) => startTime);
const getTotalPrice = (events) => events.reduce((acc, {totalPrice}) => acc + totalPrice, 0);
const getVisitedCities = (events) => events.map(({destination: {name}}) => name);

const calculateTripInfo = (eventPoints) => {
  const sortedEventsByDay = getSortedEventsByDay(eventPoints);

  return {
    cities: getVisitedCities(eventPoints),
    startTime: sortedEventsByDay[0].startTime,
    endTime: sortedEventsByDay[sortedEventsByDay.length - 1].endTime,
    totalPrice: getTotalPrice(eventPoints)
  };
};

state.tripInfo = calculateTripInfo(state.eventPoints);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(state.tripInfo), `afterbegin`);
render(tripControlsElement, createTripTabsTemplate(state.tabs), `afterbegin`);
render(tripControlsElement, createTripFiltersTemplate(state.activeFilter), `beforeend`);
render(tripEventsElement, createTripSortTemplate(state.activeSort), `beforeend`);

const tripListEvent = tripEventsElement.querySelector(`.trip-events__list`);

render(tripListEvent, createTripEventItemTemplate(createTripEditEventTemplate(state.eventPoints[0], CITIES)), `afterbegin`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripListEvent, createTripEventItemTemplate(createTripEventTemplate(state.eventPoints[i])), `beforeend`);
}

render(tripListEvent, createTripEventItemTemplate(createTripEditEventTemplate({}, CITIES, `CREATE`)), `beforeend`);


