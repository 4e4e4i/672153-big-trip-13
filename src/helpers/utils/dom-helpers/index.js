import {RenderPosition} from "../../constants";
import Abstract from "../../../view/abstract";

export const render = (container, child, place) => {
  container = getPolymorphElement(container, Abstract);

  child = getPolymorphElement(child, Abstract);

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
  container = getPolymorphElement(container, Abstract);

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
  oldChild = getPolymorphElement(oldChild, Abstract);

  newChild = getPolymorphElement(newChild, Abstract);

  oldChild.replaceWith(newChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(isInstanceOfClass(component, Abstract))) {
    throw new Error(`Can remove only components`);
  }

  getComponentElement(component).remove();
  component.removeElement();
};

export const getPolymorphElement = (component, inheritedClass) => {
  if (isInstanceOfClass(component, inheritedClass)) {
    component = getComponentElement(component);
  }
  return component;
};

export const getComponentElement = (component) => component.getElement();

export const isInstanceOfClass = (object, parentClass) => object instanceof parentClass;
