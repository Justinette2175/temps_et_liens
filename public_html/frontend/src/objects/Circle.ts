class Circle {
  _x: number;
  _y: number;
  _r: number;
  localDraw: any;
  body: any;
  attr: any;
  constructor(draw: any, x: number, y: number, r: number, attr: any = {}) {
    this.localDraw = draw;
    this._x = x;
    this._y = y;
    this._r = r;
    this.body = undefined;
    this.attr = attr;
  }

  moveTo(x: number, y: number) {
    this._x = x;
    this._y = y;
    if (this.body) {
      this.body.transform({
        translateX: this._x - this._r,
        translateY: this._y - this._r
      });
    }
  }

  display() {
    this.body = this.localDraw.circle(this._r * 2).attr(this.attr);
    this.moveTo(this._x, this._y);
    // this.localDraw
    //   .text((add: any) => {
    //     add
    //       .tspan(
    //         this.name
    //           .split(" ")
    //           .map((c) => c.charAt(0))
    //           .join("")
    //       )
    //       .newLine();
    //   })
    //   .attr({ width: this._r * 2 });
  }
}

export default Circle;
