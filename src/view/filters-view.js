import {FilterType} from "../helpers/constants";
import {createElement} from "../helpers/utils/dom-helpers";

const createTripFiltersTemplate = (filterList, activeFilter = ``) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList.map((filter) => `
        <div class="trip-filters__filter">
          <input id="filter-${filter}" ${filter === activeFilter ? `checked` : ``} class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
          <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
        </div>
      `).join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView {
  constructor(filterList, activeFilter) {
    this._activeFilter = activeFilter;
    this._filterList = filterList;
    this._element = null;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filterList, this._activeFilter);
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
