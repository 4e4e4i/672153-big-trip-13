import SortView from "../view/sort-view";
import EventListView from "../view/event-list-view";
import TripMessageView from "../view/trip-message-view";
import {RenderPosition} from "../helpers/constants";
import {createHiddenTitle, render} from "../helpers/utils/dom-helpers";
import {updateItem} from "../helpers/utils/update-item";
import TripEventPresenter from "./trip-event-presenter";

export default class TripBoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._sortItems = [];
    this._eventListComponent = new EventListView().getElement();
    this._tripMessageView = new TripMessageView();
    this._tripEventPresenter = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this.activeSort = `day`;
  }

  init(tripEvents, sortItems) {
    this._tripEvents = [...tripEvents];
    this._sortItems = sortItems;
    this._renderTripBoard();
  }

  _renderSort() {
    render(this._boardContainer, new SortView(this._sortItems, this.activeSort), RenderPosition.BEFOREEND);
  }

  _renderTripEvent(event) {
    const tripEventPresenter = new TripEventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    tripEventPresenter.init(event);
    this._tripEventPresenter[event.id] = tripEventPresenter;
  }

  _renderTripList() {
    render(this._boardContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    [...this._tripEvents].forEach((tripEvent) => this._renderTripEvent(tripEvent));
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
