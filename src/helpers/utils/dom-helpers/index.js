import {RenderPosition} from "../../constants";
import Abstract from "../../../view/abstract";

export const render = (container, child, place) => {
  if (isInstanceOfClass(container, Abstract)) {
    container = getComponentElement(container);
  }

  if (isInstanceOfClass(child, Abstract)) {
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
  if (isInstanceOfClass(container, Abstract)) {
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
  if (isInstanceOfClass(oldChild, Abstract)) {
    oldChild = getComponentElement(oldChild);
  }

  if (isInstanceOfClass(newChild, Abstract)) {
    newChild = getComponentElement(newChild);
  }

  oldChild.replaceWith(newChild);
};

export const remove = (component) => {
  if (!(isInstanceOfClass(component, Abstract))) {
    throw new Error(`Can remove only components`);
  }

  getComponentElement(component).remove();
  component.removeElement();
};

export const getComponentElement = (component) => component.getElement();

export const isInstanceOfClass = (object, parentClass) => object instanceof parentClass;
