import EventItemView from "../view/event-item-view";
import EventView from "../view/event-view";
import EditEventView from "../view/edit-event-view";

import {RenderPosition, UserAction, UpdateType} from "../helpers/constants";
import {render, replace, remove} from "../helpers/utils/dom-helpers";
import {isDateEqual, isEsc, isOnline} from "../helpers/utils/helpers";
import {toast} from "../helpers/utils/toast/toast";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class TripEventPresenter {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;
    this._eventItemComponent = new EventItemView();

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleSwitchFavoriteClick = this._handleSwitchFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseForm = this._handleCloseForm.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(tripEvent, destinations, availableOffers) {
    this._tripEvent = tripEvent;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(tripEvent);
    this._editEventComponent = new EditEventView(tripEvent, destinations, availableOffers);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setSwitchFavoriteClickHandler(this._handleSwitchFavoriteClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editEventComponent.setCloseFormClickHandler(this._handleCloseForm);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventItemComponent.getElement(), this._eventComponent, RenderPosition.BEFORE_END);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventListContainer, this._eventItemComponent.getElement(), RenderPosition.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEditEventComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchFormToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
    remove(this._eventItemComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editEventComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editEventComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._editEventComponent.shake(resetFormState);
        break;
    }
  }

  _switchEventToForm() {
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchFormToEvent() {
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._resetEditComponentData();
      this._switchFormToEvent();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(`You can't edit task offline`);
      return;
    }

    this._switchEventToForm();
    this._resetEditComponentData();
  }

  _handleSwitchFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._tripEvent,
            {
              isFavorite: !this._tripEvent.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast(`You can't save task offline`);
      return;
    }

    const isMinorUpdate = !isDateEqual(this._tripEvent.startTime, update.startTime);

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );
  }

  _handleCloseForm() {
    this._resetEditComponentData();
    this._switchFormToEvent();
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast(`You can't delete task offline`);
      return;
    }

    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _resetEditComponentData() {
    this._editEventComponent.reset(this._tripEvent);
  }
}
