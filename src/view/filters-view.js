import Abstract from "./abstract";

const createTripFiltersTemplate = (filterList, activeFilter = ``) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList.map(({type, name}) => `
        <div class="trip-filters__filter">
          <input
            id="filter-${type}"
            ${type === activeFilter ? `checked` : ``}
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
          >
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
        </div>
      `).join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView extends Abstract {
  constructor(filterList, activeFilter) {
    super();
    this._activeFilter = activeFilter;
    this._filterList = filterList;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filterList, this._activeFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
