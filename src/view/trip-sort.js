const sortList = [
  {
    name: `day`,
    isDisabled: false,
  },
  {
    name: `event`,
    isDisabled: true,
  },
  {
    name: `time`,
    isDisabled: false,
  },
  {
    name: `price`,
    isDisabled: false,
  },
  {
    name: `offers`,
    isDisabled: true
  }
];

export const createTripSortTemplate = (activeSort = `day`) => {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortList.map(({name, isDisabled}) => `
        <div class="trip-sort__item  trip-sort__item--${name}">
          <input id="sort-day" class="trip-sort__input visually-hidden" ${name === activeSort ? `checked` : ``} ${isDisabled ? `disabled` : ``} type="radio" name="trip-sort" value="sort-${name}">
          <label class="trip-sort__btn" for="sort-${name}">${name}</label>
        </div>
      `).join(``)}
    </form>

    <ul class="trip-events__list"></ul>
  `;
};
