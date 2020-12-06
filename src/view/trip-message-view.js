import Abstract from "./abstract";

const createTripMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class TripMessageView extends Abstract {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createTripMessageTemplate(this._message);
  }
}
