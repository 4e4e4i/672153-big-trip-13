import Abstract from "./abstract";

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

export default class TabsView extends Abstract {
  constructor(tabs) {
    super();
    this._tabs = tabs;
  }

  getTemplate() {
    return createTripTabsTemplate(this._tabs);
  }
}
