import {EventType, CITIES} from "../helpers/constants";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const ADDITIONAL_OFFERS = {
  FLIGHT: [
    {
      type: `luggage`,
      name: `Add luggage`,
      price: 50,
    },
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
  ],
  SHIP: [
    {
      type: `luggage`,
      name: `Add luggage`,
      price: 50
    },
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

const getRandomDescription = () => {
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const descriptionArray = description.split(`. `);
  const descriptionLength = descriptionArray.length - 1;

  return descriptionArray.slice(getRandomInteger(0, descriptionLength / 2), getRandomInteger(descriptionLength / 2, descriptionLength)).join(`.`);
};

const getRandomDuration = () => {
  const startTime = +new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
  const maxEndTime = +new Date(startTime).setHours(42);
  const endTime = +new Date(startTime + Math.random() * (maxEndTime - startTime));
  return {
    startTime,
    endTime
  };
};

const getOffers = (eventType) => {
  const additionalOffers = ADDITIONAL_OFFERS[eventType] ? ADDITIONAL_OFFERS[eventType] : [];
  return additionalOffers.map((item) => (Object.assign({}, item, {isChecked: Boolean(getRandomInteger())})));
};

const getRandomKey = (obj) => {
  const types = Object.keys(obj);
  return types[getRandomInteger(0, types.length - 1)];
};

const getRandomPictures = () => {
  return Array(getRandomInteger(1, 5)).fill().map(() => `http://picsum.photos/248/152?r=${getRandomInteger(1, 5)}`);
};

const getOffersPrice = (offers) => {
  if (!offers.length) {
    return 0;
  } else {
    return offers.reduce((acc, {price}) => {
      acc += price;
      return acc;
    }, 0);
  }
};

const getFullPrice = (price, offersPrice) => {
  return price + offersPrice;
};

export const generateTripEvent = () => {
  const {startTime, endTime} = getRandomDuration();
  const randomEventType = getRandomKey(EventType);
  const offers = getOffers(randomEventType);
  const offersPrice = getOffersPrice(offers);
  const eventPrice = getRandomInteger(10, 200);

  return {
    id: 1,
    type: randomEventType,
    destination: {
      name: CITIES[getRandomInteger(0, CITIES.length - 1)],
      description: getRandomDescription(),
      photos: getRandomPictures(),
    },
    startTime,
    endTime,
    offers,
    isFavorite: Boolean(getRandomInteger()),
    price: eventPrice,
    totalPrice: getFullPrice(eventPrice, offersPrice)
  };
};

