import PointsModel from "../model/points-model";
import {isOnline} from "../helpers/utils/helpers";
import {UpdateType} from "../helpers/constants";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, pointsModel) {
    this._api = api;
    this._store = store;
    this._pointsModel = pointsModel;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const storedTripPoints = createStoreStructure(points);
          this._store.setItems(storedTripPoints);

          return points;
        });
    }

    const storeTripEvents = Object.values(this._store.getPoints());

    return Promise.resolve(storeTripEvents.map(PointsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItems(offers);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getOffers());
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItems(destinations);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getDestinations());
    return Promise.resolve(storeDestinations);
  }

  getData() {
    if (isOnline()) {
      return this._api.getData()
        .then((response) => {
          const tripEvents = createStoreStructure(response.points.map(PointsModel.adaptToServer));

          this._store.setOffers(response.offers);
          this._store.setDestinations(response.destinations);
          this._store.setItems(tripEvents);

          return response;
        });
    }

    const storedPoints = Object.values(this._store.getPoints()).map(PointsModel.adaptToClient);
    const localData = Object.assign({},
        {points: storedPoints},
        {destinations: this._store.getDestinations()},
        {offers: this._store.getOffers()});

    return Promise.resolve(localData);
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedTripEvent) => {
          this._store.setItem(updatedTripEvent.id, updatedTripEvent);

          return updatedTripEvent;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(point));
          return newPoint;
        });
    }

    return Promise.reject(new Error(`Add task failed`));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error(`Delete point failed`));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);

          const syncedItems = Object.values(items).map(PointsModel.adaptToClient);
          this._pointsModel.setPoints(UpdateType.MAJOR, syncedItems);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
