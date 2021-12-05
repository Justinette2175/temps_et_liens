import { Position, CategoryData } from "../types";
import $ from "jquery";

const COMMON_CLASSES =
  "tag-button rounded-full border-0 text-base px-5 py-2 font-bold transition duration-200";

class Tag {
  localDraw: any;
  data: CategoryData;
  element: JQuery<HTMLElement>;
  parent: JQuery<HTMLElement>;
  selected: boolean;
  onClick: (newVisibility: boolean) => void;
  constructor(
    data: CategoryData,
    parent: JQuery<HTMLElement>,
    onClick: (newVisibility: boolean) => void
  ) {
    this.data = data;
    this.parent = parent;
    this.element = this.display();
    this.updateSelectedStyle();
    this.selected = false;
    this.onClick = onClick;
  }

  updateSelectedStyle() {
    this.element.removeClass();
    if (this.selected) {
      this.element.addClass(`${COMMON_CLASSES} bg-green`);
    } else {
      this.element.addClass(`${COMMON_CLASSES}  bg-grey-light`);
    }
  }

  display() {
    const element = $(
      `<button data-tag-id=${this.data.id} >${this.data.name}</button>`
    );
    element.on("click", () => {
      this.selected = !this.selected;
      this.updateSelectedStyle();
      this.onClick(this.selected);
    });
    this.parent.append(element);
    return element;
  }
}
export default Tag;
