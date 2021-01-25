import Observer from "../helpers/utils/observer";

import {addOfferId} from "../api";

const getTotalPrice = (price, offers) => {
  const offersPrice = offers.reduce((acc, item) => acc + item.price, 0);
  return price + offersPrice;
};

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        {
          id: point.id,
          type: point.type.toUpperCase().replace(`-`, `_`),
          price: point.base_price,
          startTime: new Date(point.date_from),
          endTime: new Date(point.date_to),
          destination: point.destination,
          isFavorite: point.is_favorite,
          totalPrice: getTotalPrice(point.base_price, point.offers),
          offers: point.offers.map(addOfferId)
        }
    );

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        {
          "id": point.id,
          "type": point.type.toLowerCase().replace(`_`, `-`),
          "base_price": point.price,
          "date_from": point.startTime,
          "date_to": point.endTime,
          "destination": point.destination,
          "is_favorite": point.isFavorite,
          "offers": point.offers.map((offer) => ({title: offer.title, price: offer.price}))
        }
    );

    return adaptedPoint;
  }
}
