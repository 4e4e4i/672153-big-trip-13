import {createElement} from "../helpers/utils/dom-helpers";

const createTripEventItemTemplate = (slot) => `<li class="trip-events__item">${slot}</li>`;

export default class EventItemView {
  constructor(slot) {
    this._slot = slot;
    this._element = null;
  }

  getTemplate() {
    return createTripEventItemTemplate(this._slot);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
