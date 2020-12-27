import SortView from "../view/sort-view";
import EventListView from "../view/event-list-view";
import TripMessageView from "../view/trip-message-view";
import {RenderPosition, SORT_TYPE} from "../helpers/constants";
import {createHiddenTitle, render} from "../helpers/utils/dom-helpers";
import {updateItem} from "../helpers/utils/update-item";
import {sortByField} from "../helpers/utils/sort-by-field";
import TripEventPresenter from "./trip-event-presenter";

export default class TripBoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._eventListComponent = new EventListView().getElement();
    this._sortComponent = new SortView(this._activeSort);
    this._tripMessageView = new TripMessageView();
    this._tripEventPresenter = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._activeSort = SORT_TYPE.DAY;
  }

  init(tripEvents) {
    this._tripEvents = [...tripEvents];
    this._sourceTripEvents = [...tripEvents];
    this._sortTripEvents(this._activeSort);
    this._renderTripBoard();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripEvent(event) {
    const tripEventPresenter = new TripEventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    tripEventPresenter.init(event);
    this._tripEventPresenter[event.id] = tripEventPresenter;
  }

  _renderTripList() {
    render(this._boardContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    this._tripEvents.forEach((tripEvent) => this._renderTripEvent(tripEvent));
  }

  _renderEmptyTripList() {
    const emptyMessage = `Click New Event to create your first point`;
    render(this._boardContainer, this._tripMessageView.init(emptyMessage), RenderPosition.BEFOREEND);
  }

  _handleEventChange(updateEvent) {
    this._tripEvents = updateItem(this._tripEvents, updateEvent);
    this._tripEventPresenter[updateEvent.id].init(updateEvent);
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

    this._sortTripEvents(sortType);
    this._clearTripEventList();
    this._renderTripList();
  }

  _sortTripEvents(sortType) {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this._tripEvents.sort(sortByField(`startTime`));
        break;
      case SORT_TYPE.PRICE:
        this._tripEvents.sort(sortByField(`totalPrice`));
        break;
      default:
        this._tripEvents = [...this._sourceTripEvents];
    }

    this._activeSort = sortType;
  }

  _clearTripEventList() {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripEventPresenter = {};
  }

  _renderTripBoard() {
    createHiddenTitle({text: `Trip events`, level: 2}, this._boardContainer, RenderPosition.AFTERBEGIN);
    if (this._tripEvents.length) {
      this._renderSort();
      this._renderTripList();
    } else {
      this._renderEmptyTripList();
    }
  }
}
