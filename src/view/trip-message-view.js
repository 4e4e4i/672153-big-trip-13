import {createElement} from "../helpers/utils/dom-helpers";

const createTripMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class TripMessageView {
  constructor(message) {
    this._message = message;
    this._element = null;
  }

  getTemplate() {
    return createTripMessageTemplate(this._message);
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
