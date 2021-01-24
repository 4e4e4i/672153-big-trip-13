import InfoView from "./view/info-view";
import TabsView from "./view/tabs-view";
import TripBoardPresenter from "./presenter/trip-board-presenter";
import TripFilterPresenter from "./presenter/trip-filter-presenter";
import PointsModel from "./model/points-model";
import FilterModel from "./model/filter-model";

import {RenderPosition, UpdateType} from "./helpers/constants";
import {getSortedByElementKey} from "./helpers/utils/get-sorted-by-element-key";
import {render, createHiddenTitle} from "./helpers/utils/dom-helpers";
import Api from "./api";

const AUTHORIZATION = `Basic asldfkjlk3213dsaiii33ud`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

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
  ]
};

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

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

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsElement, pointsModel, filterModel, api);
const tripFilterPresenter = new TripFilterPresenter(tripControlsElement, filterModel, pointsModel);
const tripTabsElement = new TabsView(state.tabs);

const createTripInfo = (points) => {
  render(tripMainElement, new InfoView(calculateTripInfo(points)), RenderPosition.AFTERBEGIN);
};

const createTripMenu = () => {
  render(tripControlsElement, tripTabsElement, RenderPosition.AFTERBEGIN);
  createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFOREBEGIN);
};

tripFilterPresenter.init();
tripBoardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripBoardPresenter.createTask();
});

api.getData()
  .then((serverData) => {
    pointsModel.setOffers(serverData.offers);
    pointsModel.setDestinations(serverData.destinations);
    pointsModel.setPoints(UpdateType.INIT, serverData.points);
    if (serverData.points.length) {
      createTripInfo(serverData.points);
    }
    createTripMenu();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    createTripMenu();
  });


