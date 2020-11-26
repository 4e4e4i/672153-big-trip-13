import {FILTERS_TYPES} from "../helpers/constants";
const filterList = Object.values(FILTERS_TYPES);

export const createTripFiltersTemplate = (activeFilter = ``) => {
  return `
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filterList.map((filter) => `
        <div class="trip-filters__filter">
          <input id="filter-${filter}" ${filter === activeFilter ? `checked` : ``} class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
          <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
        </div>
      `).join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};
