import Observer from "../helpers/utils/observer";

import {FilterType} from "../helpers/constants";

export default class FilterModel extends Observer {
  constructor(props) {
    super(props);
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
