export const isPointFromThePast = (point) => point.startTime < new Date().getTime();

export const isPointFromTheFuture = (point) => point.startTime > new Date().getTime();
