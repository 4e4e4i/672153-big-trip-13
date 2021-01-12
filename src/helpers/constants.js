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

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const CITIES = [`Tokio`, `Kioto`, `Osaka`, `Nagoya`, `Saporo`];

export const ADDITIONAL_OFFERS = {
  FLIGHT: [
    {
      type: `luggage`,
      name: `Add luggage`,
      price: 50,
      isChecked: false
    },
    {
      type: `comfort`,
      name: `Switch to comfort`,
      price: 80,
      isChecked: false
    },
    {
      type: `meal`,
      name: `Add meal`,
      price: 15,
      isChecked: false
    },
    {
      type: `seats`,
      name: `Choose seats`,
      price: 5,
      isChecked: false
    }
  ],
  SHIP: [
    {
      type: `luggage`,
      name: `Add luggage`,
      price: 50,
      isChecked: false
    },
    {
      type: `comfort`,
      name: `Switch to comfort`,
      price: 80,
      isChecked: false
    },
    {
      type: `meal`,
      name: `Add meal`,
      price: 15,
      isChecked: false
    },
  ],
  TRAIN: [
    {
      type: `comfort`,
      name: `Switch to comfort`,
      price: 80
    },
    {
      type: `meal`,
      name: `Add meal`,
      price: 15
    },
    {
      type: `seats`,
      name: `Choose seats`,
      price: 5
    }
  ]
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
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
  MAJOR: `MAJOR`
};
