import {RenderPosition} from "../../constants";

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const createHiddenTitle = ({text, level}, element, place) => {
  const title = `<h${level} class="visually-hidden">${text}</h${level}>`;
  renderTemplate(element, title, place);
};
