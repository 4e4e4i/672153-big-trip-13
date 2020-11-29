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

const filterList = Object.values(FilterType);

const sortList = [
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
];

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

if (Object.values(state.tripInfo).some(Boolean) || state.eventPoints.length) {
  render(tripMainElement, new InfoView(state.tripInfo).getElement(), RenderPosition.AFTERBEGIN);
}

const tripTabsElement = new TabsView(state.tabs).getElement();
const tripFiltersElement = new FiltersView(filterList, state.activeFilter).getElement();
render(tripControlsElement, tripTabsElement, RenderPosition.AFTERBEGIN);
createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFOREBEGIN);
render(tripControlsElement, tripFiltersElement, RenderPosition.BEFOREEND);
createHiddenTitle({text: `Filter events`, level: 2}, tripFiltersElement, RenderPosition.BEFOREBEGIN);

createHiddenTitle({text: `Trip events`, level: 2}, tripEventsElement, RenderPosition.AFTERBEGIN);
if (state.eventPoints.length) {
  render(tripEventsElement, new SortView(sortList, state.activeSort).getElement(), RenderPosition.BEFOREEND);
  render(tripEventsElement, new EventListView().getElement(), RenderPosition.BEFOREEND);
  const tripEventListView = tripEventsElement.querySelector(`.trip-events__list`);
  const tripEventItemElement = (slot) => new EventItemView(slot).getElement();

  render(tripEventListView, tripEventItemElement(new EditEventView(state.eventPoints[0], CITIES).getElement()), RenderPosition.AFTERBEGIN);

  for (let i = 0; i < EVENT_COUNT; i++) {
    render(tripEventListView, tripEventItemElement(new EventView(state.eventPoints[i]).getElement()), RenderPosition.BEFOREEND);
  }

  render(tripEventListView, tripEventItemElement(new EditEventView({}, CITIES, `CREATE`).getElement()), RenderPosition.BEFOREEND);
} else {
  const emptyMessage = `Click New Event to create your first point`;
  render(tripEventsElement, new TripMessageView(emptyMessage).getElement(), RenderPosition.BEFOREEND);
}


