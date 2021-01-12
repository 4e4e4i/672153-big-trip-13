import SortView from "../view/sort-view";
import EventListView from "../view/event-list-view";
import TripMessageView from "../view/trip-message-view";
import {RenderPosition, SortType, UpdateType, UserAction} from "../helpers/constants";
import {createHiddenTitle, remove, render} from "../helpers/utils/dom-helpers";
import {sortByField} from "../helpers/utils/sort-by-field";
import TripEventPresenter from "./trip-event-presenter";

export default class TripBoardPresenter {
  constructor(boardContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._boardContainer = boardContainer;
    this._eventListComponent = new EventListView().getElement();
    this._sortComponent = null;
    this._tripMessageView = new TripMessageView();
    this._tripEventPresenter = {};
    this._activeSort = SortType.DAY;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripBoard();
  }

  _getPoints() {
    switch (this._activeSort) {
      case SortType.DAY:
        return this._pointsModel.getPoints().slice().sort(sortByField(`startTime`));
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortByField(`totalPrice`));
    }

    return this._pointsModel.getPoints();
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
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
        this._tripEventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _handleModeChange() {
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
    tripEventPresenter.init(event);
    this._tripEventPresenter[event.id] = tripEventPresenter;
  }

  _renderTripList(points) {
    render(this._boardContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    points.forEach((tripEvent) => this._renderTripEvent(tripEvent));
  }

  _renderEmptyTripList() {
    const emptyMessage = `Click New Event to create your first point`;
    render(this._boardContainer, this._tripMessageView.init(emptyMessage), RenderPosition.BEFOREEND);
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripEventPresenter = {};

    remove(this._sortComponent);
    remove(this._tripMessageView);

    if (resetSortType) {
      this._activeSort = SortType.DAY;
    }
  }

  _renderTripBoard() {
    createHiddenTitle({text: `Trip events`, level: 2}, this._boardContainer, RenderPosition.AFTERBEGIN);
    const points = this._getPoints().slice();
    if (points.length) {
      this._renderSort();
      this._renderTripList(points);
    } else {
      this._renderEmptyTripList();
    }
  }
}
