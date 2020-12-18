import InfoView from "./view/info-view";
import TabsView from "./view/tabs-view";
import FiltersView from "./view/filters-view";
import TripBoardPresenter from "./presenter/trip-board-presenter";

import {generateTripEvent} from "./mock/trip-event";
import {FilterType, RenderPosition} from "./helpers/constants";
import {getSortedByElementKey} from "./helpers/utils/get-sorted-by-element-key";
import {render, createHiddenTitle} from "./helpers/utils/dom-helpers";

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

const tripBoardPresenter = new TripBoardPresenter(tripEventsElement);

if (Object.values(state.tripInfo).some(Boolean)) {
  render(tripMainElement, new InfoView(state.tripInfo), RenderPosition.AFTERBEGIN);
}

const tripTabsElement = new TabsView(state.tabs);
const tripFiltersElement = new FiltersView(FILTERS, state.activeFilter);
render(tripControlsElement, tripTabsElement, RenderPosition.AFTERBEGIN);
createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFOREBEGIN);
render(tripControlsElement, tripFiltersElement, RenderPosition.BEFOREEND);
createHiddenTitle({text: `Filter events`, level: 2}, tripFiltersElement, RenderPosition.BEFOREBEGIN);

tripBoardPresenter.init(state.eventPoints, state.sortItems);


