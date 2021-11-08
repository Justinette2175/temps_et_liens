import { Position } from "../types";

class Collider {
  localDraw: any;
  boundingElement: any;

  constructor(draw: any) {
    this.localDraw = draw;
    this.boundingElement = this.localDraw;
  }

  getWidth() {
    return this.boundingElement.width();
  }

  getHeight() {
    return this.boundingElement.height();
  }

  getPosition() {
    return {
      x: this.localDraw.x(),
      y: this.localDraw.y()
    };
  }

  isColliding(object: { height: number; width: number; y: number; x: number }) {
    const myHeight = this.getHeight();
    const myWidth = this.getWidth();
    const myPosition = this.getPosition();
    return !(
      object.y + object.height < myPosition.y ||
      object.y > myPosition.y + myHeight ||
      object.x + object.width < myPosition.x ||
      object.x > myPosition.x + myWidth
    );
  }
}

export default Collider;
