import EditEventView from "../view/edit-event-view";

import {UserAction, UpdateType, RenderPosition, FormMode, BLANK_POINT} from "../helpers/constants";
import {remove, render} from "../helpers/utils/dom-helpers";
import {isEsc} from "../helpers/utils/helpers";

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

    this._editEventComponent = new EditEventView(BLANK_POINT, destinations, availableOffers, FormMode.CREATE);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventListContainer, this._editEventComponent, RenderPosition.AFTER_BEGIN);

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

  setSaving() {
    this._editEventComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._editEventComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
