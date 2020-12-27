import Abstract from "./abstract";
import {SORT_TYPE} from "../helpers/constants";
const disabledSortTypes = [`event`, `time`, `offers`];

export const createTripSortTemplate = (activeSort = `day`) => {
  const sortTypeNames = Object.values(SORT_TYPE);
  const isDisabledSortType = (type) => disabledSortTypes.includes(type);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypeNames.map((sortName) => `
        <div class="trip-sort__item  trip-sort__item--${sortName}">
          <input
            id="sort-day"
            class="trip-sort__input visually-hidden"
            ${sortName === activeSort ? `checked` : ``}
            ${isDisabledSortType(sortName) ? `disabled` : ``}
            type="radio"
            name="trip-sort"
            data-sort-type="${sortName}"
            value="sort-${sortName}"
          >
          <label class="trip-sort__btn" for="sort-${sortName}">${sortName}</label>
        </div>
      `).join(``)}
    </form>`
  );
};

export default class SortView extends Abstract {
  constructor(activeSort) {
    super();

    this._activeSort = activeSort;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._activeSort);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const tripSortItem = evt.target.closest(`.trip-sort__item`);
    if (!tripSortItem) {
      return;
    }
    const tripSortInput = tripSortItem.querySelector(`input`);
    if (!tripSortInput) {
      return;
    }
    const {dataset: {sortType}, attributes: {disabled}} = tripSortInput;
    if (disabled) {
      return;
    }
    this._callback.sortTypeChange(sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
