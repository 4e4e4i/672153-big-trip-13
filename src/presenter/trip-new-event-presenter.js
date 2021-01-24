import EditEventView from "../view/edit-event-view";
import {nanoid} from "nanoid";
import {UserAction, UpdateType, RenderPosition} from "../helpers/constants";
import {remove, render} from "../helpers/utils/dom-helpers";

export default class TripNewEventPresenter {
  constructor(tripEventListContainer, changeData) {
    this._tripEventListContainer = tripEventListContainer;
    this._changeData = changeData;

    this._editEventComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destinations, availableOffers) {
    if (this._editEventComponent !== null) {
      return;
    }

    this._editEventComponent = new EditEventView(undefined, destinations, availableOffers, `CREATE`);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventListContainer, this._editEventComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }

    remove(this._editEventComponent);
    this._editEventComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
