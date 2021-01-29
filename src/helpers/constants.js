import {isPointFromTheFuture, isPointFromThePast} from "./utils/helpers";

export const TRANSPORT_TYPES = [`TAXI`, `BUS`, `TRAIN`, `SHIP`, `TRANSPORT`, `DRIVE`, `FLIGHT`];

export const ChartConfiguration = {
  BAR_HEIGHT: 55,
  BACKGROUND_COLOR: `#ffffff`,
  FONT_COLOR: `#000000`,
  CHART_TYPE: `horizontalBar`,
  CHART_PADDING_LEFT: 100,
  FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  SCALE_Y_AXES_TICKS_PADDING: 5,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  MONEY_CHART_TEXT: `MONEY`,
  TRANSPORT_CHART_TEXT: `TRANSPORT`,
  TIME_SPEND_TEXT: `TIME-SPEND`,
};

export const TimeInMs = {
  DAY: 86400000,
  HOUR: 3600000,
  MINUTE: 60000,
  SECOND: 1000,
};

export const EventType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECK_IN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`
};

export const FormMode = {
  EDIT: `EDIT`,
  CREATE: `CREATE`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const RenderPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`
};

export const SortType = {
  DAY: `day`,
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
  OFFERS: `offers`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const BLANK_POINT = {
  type: `TAXI`,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  offers: [],
  isFavorite: false,
  price: 0,
  totalPrice: 0
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATISTICS: `STATISTICS`
};

export const FILTER = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter(isPointFromTheFuture),
  [FilterType.PAST]: (points) => points.filter(isPointFromThePast)
};
