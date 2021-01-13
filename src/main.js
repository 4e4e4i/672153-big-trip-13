import InfoView from "./view/info-view";
import TabsView from "./view/tabs-view";
import TripBoardPresenter from "./presenter/trip-board-presenter";
import TripFilterPresenter from "./presenter/trip-filter-presenter";
import PointsModel from "./model/points-model";
import FilterModel from "./model/filter-model";

import {generateTripEvent} from "./mock/trip-event";
import {RenderPosition} from "./helpers/constants";
import {getSortedByElementKey} from "./helpers/utils/get-sorted-by-element-key";
import {render, createHiddenTitle} from "./helpers/utils/dom-helpers";

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

  eventPoints: [],

  tripInfo: {},
};

const generatedEventPoints = Array.from({length: EVENT_COUNT}).map(generateTripEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(generatedEventPoints);

const filterModel = new FilterModel();

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

if (generatedEventPoints.length) {
  state.tripInfo = calculateTripInfo(generatedEventPoints);
}

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsElement, pointsModel, filterModel);
const tripFilterPresenter = new TripFilterPresenter(tripControlsElement, filterModel, pointsModel);

if (Object.values(state.tripInfo).some(Boolean)) {
  render(tripMainElement, new InfoView(state.tripInfo), RenderPosition.AFTERBEGIN);
}

const tripTabsElement = new TabsView(state.tabs);
render(tripControlsElement, tripTabsElement, RenderPosition.AFTERBEGIN);
createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFOREBEGIN);

tripFilterPresenter.init();
tripBoardPresenter.init();


