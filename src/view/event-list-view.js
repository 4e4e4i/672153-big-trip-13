import Abstract from "./abstract";

const createEventListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class EventList extends Abstract {
  getTemplate() {
    return createEventListTemplate();
  }
}
