import SortView from "../view/sort-view";
import EventListView from "../view/event-list-view";
import TripMessageView from "../view/trip-message-view";
import {FilterType, RenderPosition, SortType, UpdateType, UserAction} from "../helpers/constants";
import {createHiddenTitle, remove, render} from "../helpers/utils/dom-helpers";
import {sortByField} from "../helpers/utils/sort-by-field";
import TripEventPresenter from "./trip-event-presenter";
import TripNewEventPresenter from "./trip-new-event-presenter";
import {FILTER} from "../helpers/utils/filter";

export default class TripBoardPresenter {
  constructor(boardContainer, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._eventListComponent = new EventListView().getElement();
    this._loadingMessageComponent = null;
    this._sortComponent = null;
    this._tripMessageView = null;
    this._tripEventPresenter = {};
    this._activeSort = SortType.DAY;
    this._isLoading = true;
    this._destinations = null;
    this._availableOffers = null;
    this._api = api;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._tripNewEventPresenter = new TripNewEventPresenter(this._eventListComponent, this._handleViewAction);
  }

  init() {
    createHiddenTitle({text: `Trip events`, level: 2}, this._boardContainer, RenderPosition.AFTERBEGIN);
    this._renderTripBoard();
  }

  createTask() {
    this._activeSort = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._tripNewEventPresenter.init(this._destinations, this._availableOffers);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = FILTER[filterType](points);

    if (filteredPoints.length) {
      switch (this._activeSort) {
        case SortType.DAY:
          return filteredPoints.sort(sortByField(`startTime`));
        case SortType.PRICE:
          return filteredPoints.sort(sortByField(`totalPrice`));
      }
    }

    return filteredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripEventPresenter[data.id].init(data, this._destinations, this._availableOffers);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderTripBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingMessageComponent);
        this._renderTripBoard();
        break;
    }
  }

  _handleModeChange() {
    this._tripNewEventPresenter.destroy();
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._activeSort === sortType) {
      return;
    }

    this._activeSort = sortType;
    this._clearBoard();
    this._renderTripBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._activeSort);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTripEvent(event) {
    const tripEventPresenter = new TripEventPresenter(this._eventListComponent, this._handleViewAction, this._handleModeChange);
    tripEventPresenter.init(event, this._destinations, this._availableOffers);
    this._tripEventPresenter[event.id] = tripEventPresenter;
  }

  _renderTripList(points) {
    render(this._boardContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    points.forEach((tripEvent) => this._renderTripEvent(tripEvent));
  }

  _renderLoading() {
    const loadingMessage = `Loading...`;
    this._initMessageBoard(`_loadingMessageComponent`, loadingMessage);
    render(this._boardContainer, this._loadingMessageComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderEmptyTripList() {
    const emptyMessage = `Click New Event to create your first point`;
    this._initMessageBoard(`_tripMessageView`, emptyMessage);
    render(this._boardContainer, this._tripMessageView.getElement(), RenderPosition.BEFOREEND);
  }

  _initMessageBoard(componentView, message) {
    if (this[componentView] === null) {
      this[componentView] = new TripMessageView();
      this[componentView].init(message);
    }
  }

  _clearBoard({resetSortType = false} = {}) {
    this._tripNewEventPresenter.destroy();
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripEventPresenter = {};

    remove(this._sortComponent);
    remove(this._tripMessageView);
    remove(this._loadingMessageComponent);

    if (resetSortType) {
      this._activeSort = SortType.DAY;
    }
  }

  _renderTripBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._destinations = this._pointsModel.getDestinations();
    this._availableOffers = this._pointsModel.getOffers();
    const points = this._getPoints();
    if (points.length) {
      this._renderSort();
      this._renderTripList(points);
    } else {
      this._renderEmptyTripList();
    }
  }
}
