import InfoView from "./view/info-view";
import TabsView from "./view/tabs-view";
import FiltersView from "./view/filters-view";
import SortView from "./view/sort-view";
import EventView from "./view/event-view";
import EditEventView from "./view/edit-event-view";
import EventItemView from "./view/event-item-view";
import EventListView from "./view/event-list-view";
import TripMessageView from "./view/trip-message-view";

import {generateTripEvent} from "./mock/trip-event";
import {CITIES, FilterType, RenderPosition} from "./helpers/constants";
import {getSortedByElementKey} from "./helpers/utils/get-sorted-by-element-key";
import {render, createHiddenTitle} from "./helpers/utils/dom-helpers";

const renderEvent = (eventList, event) => {
  const tripEventItemElement = (slot) => new EventItemView(slot);
  const eventView = tripEventItemElement(new EventView(event).getElement());
  const eventEditView = tripEventItemElement(new EditEventView(event, CITIES).getElement());

  const switchEventToForm = () => {
    eventView.getElement().replaceWith(eventEditView.getElement());
  };

  const switchFormToEvent = () => {
    eventEditView.getElement().replaceWith(eventView.getElement());
  };

  const onEscKeyDown = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape` || evt.key === `Esc`) {
      switchFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventView.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    switchEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditView.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, switchFormToEvent);
  eventEditView.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    switchFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventList, eventView.getElement(), RenderPosition.BEFOREEND);
};

const FILTERS = Object.values(FilterType);

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

  activeFilter: `everything`,

  eventPoints: [],

  tripInfo: {},

  sortItems: [
    {
      name: `day`,
      isDisabled: false,
    },
    {
      name: `event`,
      isDisabled: true,
    },
    {
      name: `time`,
      isDisabled: false,
    },
    {
      name: `price`,
      isDisabled: false,
    },
    {
      name: `offers`,
      isDisabled: true
    }
  ]
};

const generatedEventPoints = Array.from({length: EVENT_COUNT}).map(generateTripEvent);
state.eventPoints = generatedEventPoints;

const getTotalPrice = (events) => events.reduce((acc, {totalPrice}) => acc + totalPrice, 0);
const getVisitedCities = (events) => events.map(({destination: {name}}) => name);

const calculateTripInfo = (eventPoints) => {
  const sortedEventsByStartTime = getSortedByElementKey(eventPoints, `startTime`);
  return {
    cities: getVisitedCities(eventPoints),
    startTime: sortedEventsByStartTime[0].startTime,
    endTime: sortedEventsByStartTime[sortedEventsByStartTime.length - 1].endTime,
    totalPrice: getTotalPrice(eventPoints)
  };
};

if (state.eventPoints.length) {
  state.tripInfo = calculateTripInfo(state.eventPoints);
}

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

if (Object.values(state.tripInfo).some(Boolean)) {
  render(tripMainElement, new InfoView(state.tripInfo).getElement(), RenderPosition.AFTERBEGIN);
}

const tripTabsElement = new TabsView(state.tabs).getElement();
const tripFiltersElement = new FiltersView(FILTERS, state.activeFilter).getElement();
render(tripControlsElement, tripTabsElement, RenderPosition.AFTERBEGIN);
createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFOREBEGIN);
render(tripControlsElement, tripFiltersElement, RenderPosition.BEFOREEND);
createHiddenTitle({text: `Filter events`, level: 2}, tripFiltersElement, RenderPosition.BEFOREBEGIN);

createHiddenTitle({text: `Trip events`, level: 2}, tripEventsElement, RenderPosition.AFTERBEGIN);
if (state.eventPoints.length) {
  const eventListComponent = new EventListView();
  render(tripEventsElement, new SortView(state.sortItems, state.activeSort).getElement(), RenderPosition.BEFOREEND);
  render(tripEventsElement, eventListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENT_COUNT; i++) {
    renderEvent(eventListComponent.getElement(), state.eventPoints[i]);
  }
} else {
  const emptyMessage = `Click New Event to create your first point`;
  render(tripEventsElement, new TripMessageView(emptyMessage).getElement(), RenderPosition.BEFOREEND);
}


