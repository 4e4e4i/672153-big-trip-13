import {createElement} from "../helpers/utils/dom-helpers";

const createEventListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class EventList {
  getTemplate() {
    return createEventListTemplate();
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
