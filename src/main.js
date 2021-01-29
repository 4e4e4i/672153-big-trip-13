import TabsView from "./view/tabs-view";
import TripStatisticsView from "./view/trip-statistics-view";
import TripBoardPresenter from "./presenter/trip-board-presenter";
import TripFilterPresenter from "./presenter/trip-filter-presenter";
import PointsModel from "./model/points-model";
import FilterModel from "./model/filter-model";
import Api from "./api";

import {MenuItem, RenderPosition, UpdateType, FilterType} from "./helpers/constants";
import {render, createHiddenTitle, remove} from "./helpers/utils/dom-helpers";

const AUTHORIZATION = `Basic asldfkjlk3213dsaiii33ud`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.page-main`);
const siteMainContainer = siteMainElement.querySelector(`.page-body__container`);
const siteHeaderElement = document.querySelector(`.page-header`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainContainer.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsElement, pointsModel, filterModel, api);
const tripFilterPresenter = new TripFilterPresenter(tripControlsElement, filterModel, pointsModel);
const tripTabsElement = new TabsView();
let statisticsComponent = null;

const createTripMenu = () => {
  render(tripControlsElement, tripTabsElement, RenderPosition.AFTER_BEGIN);
  createHiddenTitle({text: `Switch trip view`, level: 2}, tripTabsElement, RenderPosition.BEFORE_BEGIN);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripTabsElement.setMenuItem(MenuItem.TABLE);
      tripBoardPresenter.init();
      break;
    case MenuItem.STATISTICS:
      tripTabsElement.setMenuItem(MenuItem.STATISTICS);
      tripBoardPresenter.destroy();
      statisticsComponent = new TripStatisticsView(pointsModel);
      render(siteMainContainer, statisticsComponent, RenderPosition.BEFORE_END);
      break;
  }
};

tripTabsElement.setMenuClickHandler(handleSiteMenuClick);

tripFilterPresenter.init();
tripBoardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  tripBoardPresenter.destroy();
  tripTabsElement.setMenuItem(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripBoardPresenter.init();
  tripBoardPresenter.createTask();
});

api.getData()
  .then(({points, offers, destinations}) => {
    pointsModel.setOffers(offers);
    pointsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
    createTripMenu();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    createTripMenu();
  });


