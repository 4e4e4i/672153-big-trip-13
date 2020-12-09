import {RenderPosition} from "../../constants";
import Abstract from "../../../view/abstract";

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = getComponentElement(container);
  }

  if (child instanceof Abstract) {
    child = getComponentElement(child);
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof Abstract) {
    container = getComponentElement(container);
  }

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

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = getComponentElement(oldChild);
  }

  if (newChild instanceof Abstract) {
    newChild = getComponentElement(newChild);
  }

  oldChild.replaceWith(newChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  getComponentElement(component).remove();
  component.removeElement();
};

export const getComponentElement = (component) => component.getElement();
