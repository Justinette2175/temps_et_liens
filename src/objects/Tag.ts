import { Position, TagData } from "../types";

const X_PADDING = 10;

class Tag {
  localDraw: any;
  data: TagData;
  relativePosition: Position;
  elements: {
    rect: any;
    text: any;
  };

  constructor(
    draw: any,
    data: TagData,
    relativePosition?: Position,
    displayOnCreate?: boolean
  ) {
    this.data = data;
    this.localDraw = draw.group();
    this.elements = {
      rect: null,
      text: null
    };
    this.relativePosition = relativePosition || { x: 0, y: 0 };
    if (displayOnCreate) {
      this.display();
    }
  }

  getWidth() {
    return this.elements.rect?.width();
  }

  getHeight() {
    return this.elements.rect?.height();
  }

  hide() {
    this.localDraw.hide();
  }

  show() {
    this.localDraw.show();
  }

  display() {
    this.elements.text = this.localDraw
      .text(this.data.name)
      .attr({ y: 20, x: X_PADDING });
    const textWidth = this.elements.text.length();
    this.elements.rect = this.localDraw
      .rect(textWidth + X_PADDING * 2, 30)
      .attr({ fill: "#ffab91" });
    this.elements.text.before(this.elements.rect);
  }

  moveTo(location: Position) {
    this.localDraw.transform({
      translateX: location.x,
      translateY: location.y
    });
  }
}
export default Tag;
