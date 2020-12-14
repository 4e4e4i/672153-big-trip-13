import Abstract from "./abstract";

const createTripMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class TripMessageView extends Abstract {
  constructor() {
    super();
    this._message = ``;
  }

  init(message) {
    this._message = message;
  }

  getTemplate() {
    return createTripMessageTemplate(this._message);
  }
}
