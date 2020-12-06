import Abstract from "./abstract";

export const createTripSortTemplate = (sortItems, activeSort = `day`) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.map(({name, isDisabled}) => `
        <div class="trip-sort__item  trip-sort__item--${name}">
          <input
            id="sort-day"
            class="trip-sort__input visually-hidden"
            ${name === activeSort ? `checked` : ``} ${isDisabled ? `disabled` : ``}
            type="radio"
            name="trip-sort"
            value="sort-${name}"
          >
          <label class="trip-sort__btn" for="sort-${name}">${name}</label>
        </div>
      `).join(``)}
    </form>`
  );
};

export default class SortView extends Abstract {
  constructor(sortItems, activeSort) {
    super();
    this._sortItems = sortItems;
    this._activeSort = activeSort;
  }

  getTemplate() {
    return createTripSortTemplate(this._sortItems, this._activeSort);
  }
}
