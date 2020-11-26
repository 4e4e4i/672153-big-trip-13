export const createTripTabsTemplate = (tabs) => {
  const componentModifiers = {
    isActive: (isActive) => isActive ? `trip-tabs__btn--active` : ``
  };

  return `
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabs.map(({name, isActive, url}) => `
        <a class="trip-tabs__btn  ${componentModifiers.isActive(isActive)}" href=${url}">${name}</a>
      `).join(``)}
    </nav>
  `;
};
