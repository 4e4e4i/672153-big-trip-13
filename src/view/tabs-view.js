import {createElement} from "../helpers/utils/dom-helpers";

export const createTripTabsTemplate = (tabs) => {
  const componentModifiers = {
    isActive: (isActive) => isActive ? `trip-tabs__btn--active` : ``
  };

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabs.map(({name, isActive, url}) => `
        <a class="trip-tabs__btn  ${componentModifiers.isActive(isActive)}" href=${url}">${name}</a>
      `).join(``)}
    </nav>
  `);
};

export default class TabsView {
  constructor(tabs) {
    this._tabs = tabs;
    this._element = null;
  }

  getTemplate() {
    return createTripTabsTemplate(this._tabs);
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
