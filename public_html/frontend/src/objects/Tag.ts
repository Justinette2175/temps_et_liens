import { Position, CategoryData } from "../types";
import $ from "jquery";

const COMMON_CLASSES =
  "my-1 mx-1 inline-block rounded-full border-0 text-base px-2 py-1 font-bold transition duration-200 bg-grey-light";

class Tag {
  localDraw: any;
  data: CategoryData;
  $viewToggle: JQuery<HTMLElement>;
  $selectedToggle: JQuery<HTMLElement>;
  element: JQuery<HTMLElement>;
  parent: JQuery<HTMLElement>;
  visible: boolean;
  selected: boolean;
  onVisibilityClick: (newVisibility: boolean) => void;
  onAddPersonClick: () => void;

  constructor(
    data: CategoryData,
    parent: JQuery<HTMLElement>,
    onVisibilityClick: (newVisibility: boolean) => void,
    onAddPersonClick: () => void,
    visible: boolean = false,
    selected: boolean = true
  ) {
    this.data = data;
    this.parent = parent;
    this.visible = visible;
    this.selected = selected;
    this.onAddPersonClick = onAddPersonClick;
    this.onVisibilityClick = onVisibilityClick;
    [this.element, this.$viewToggle, this.$selectedToggle] = this.display();
    this.updateVisibleStyle();
    // this.updateSelectedStyle();
  }

  updateSelectedStyle() {
    if (this.selected && this.$selectedToggle) {
      this.$selectedToggle?.empty();
      this.$selectedToggle?.append('<i class="far fa-check-square"></i>');
    } else {
      this.$selectedToggle?.empty();
      this.$selectedToggle?.append('<i class="far fa-square"></i>');
    }
  }

  updateVisibleStyle() {
    if (this.visible && this.$viewToggle) {
      this.$viewToggle?.empty();
      this.$viewToggle?.append('<i class="far fa-eye"></i>');
    } else {
      this.$viewToggle?.empty();
      this.$viewToggle?.append('<i class="far fa-eye-slash"></i>');
    }
  }

  display() {
    const $element = $(
      `<div data-tag-id="${this.data.id}" class="${COMMON_CLASSES}">${this.data.name}</div>`
    );
    const $viewToggle = $('<button class="mx-1"></button>');
    const $selectedToggle = $('<button class="mx-1"></button>');
    const $addToggle = $(
      '<button class="mx-1"><i class="fas fa-plus"></i></button>'
    );
    $addToggle.on("click", this.onAddPersonClick);
    $viewToggle.on("click", () => {
      this.visible = !this.visible;
      this.updateVisibleStyle();
      this.onVisibilityClick(this.visible);
    });
    // $selectedToggle.on("click", () => {
    //   this.selected = !this.selected;
    //   this.updateSelectedStyle();
    //   // this.onVisibilityClick(this.visible);
    // });
    $element.prepend($viewToggle);
    // $element.prepend($selectedToggle);
    $element.prepend($addToggle);
    this.parent.append($element);
    return [$element, $viewToggle, $selectedToggle];
  }
}
export default Tag;
