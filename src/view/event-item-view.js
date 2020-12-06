import Abstract from "./abstract";

const createTripEventItemTemplate = () => `<li class="trip-events__item"></li>`;

export default class EventItemView extends Abstract {
  getTemplate() {
    return createTripEventItemTemplate();
  }
}
