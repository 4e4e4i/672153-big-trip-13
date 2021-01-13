import {FilterType} from "../constants";
import {isPointFromTheFuture, isPointFromThePast} from "./point";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter(isPointFromTheFuture),
  [FilterType.PAST]: (points) => points.filter(isPointFromThePast)
};
