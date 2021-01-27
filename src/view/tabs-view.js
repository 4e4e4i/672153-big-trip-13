import Abstract from "./abstract";

import {MenuItem} from "../helpers/constants";

export const createTripTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
          <a
            class="trip-tabs__btn trip-tabs__btn--active"
            href="#"
            data-tab="${MenuItem.TABLE}"
          >
            Table
          </a>

          <a
            class="trip-tabs__btn"
            href="#"
            data-tab="${MenuItem.STATISTICS}"
          >
            Stats
          </a>
    </nav>
  `);
};

export default class TabsView extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuTab) {
    const activeItemElement = this.getElement().querySelector(`.trip-tabs__btn--active`);
    const clickedItemElement = this.getElement().querySelector(`[data-tab="${menuTab}"]`);

    activeItemElement.classList.remove(`trip-tabs__btn--active`);
    clickedItemElement.classList.add(`trip-tabs__btn--active`);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }
    this._callback.menuClick(evt.target.dataset.tab);
  }
}
