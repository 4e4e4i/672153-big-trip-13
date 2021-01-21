import EventItemView from "../view/event-item-view";
import EventView from "../view/event-view";
import EditEventView from "../view/edit-event-view";

import {CITIES, RenderPosition, UserAction, UpdateType} from "../helpers/constants";
import {render, replace, remove} from "../helpers/utils/dom-helpers";
import {isDateEqual} from "../helpers/utils/is-dates-equal";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
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

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(tripEvent);
    this._editEventComponent = new EditEventView(tripEvent, CITIES);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setSwitchFavoriteClickHandler(this._handleSwitchFavoriteClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editEventComponent.setCloseFormClickHandler(this._handleCloseForm);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventItemComponent.getElement(), this._eventComponent, RenderPosition.BEFOREEND);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventListContainer, this._eventItemComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
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
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._resetEditComponentData();
      this._switchFormToEvent();
    }
  }

  _handleEditClick() {
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
    const isMinorUpdate = !isDateEqual(this._tripEvent.startTime, update.startTime);

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );
    this._switchFormToEvent();
  }

  _handleCloseForm() {
    this._resetEditComponentData();
    this._switchFormToEvent();
  }

  _handleDeleteClick(point) {
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
