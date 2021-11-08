import Collider from "./Collider";
import { PersonData, Position, TagData } from "../types";
import Tag from "./Tag";
import PersonTagsList from "./PersonTagsList";
import RADIUS_BY_ZOOM_LEVEL from "../utils/zoom";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

type DisplayOptions = {
  zoomLevel?: number;
  location?: Position;
};

class Person extends Collider {
  name: PersonData["name"];
  id: PersonData["id"];
  displayOptions: DisplayOptions;
  tags: Array<Tag>;
  circle: any;
  onDragEnd: (person: Person) => void;
  tagsList?: PersonTagsList;
  tagsData: PersonData["tags"];
  constructor(
    draw: any,
    personData: PersonData,
    displayOptions: DisplayOptions,
    onDragEnd: (person: Person) => void
  ) {
    super(draw);
    this.name = personData.name;
    this.id = personData.id;
    this.displayOptions = displayOptions;
    this.localDraw = draw.group().draggable();
    this.tagsData = personData.tags;
    this.tags = [];
    this.circle = null;
    this.onDragEnd = onDragEnd;
    this.display();
    this.moveTo(displayOptions.location || { x: 0, y: 0 });
    this.tagsList = undefined;
    this.listenToDrag();
  }

  addTag(tagData: TagData) {
    if (!this.tagsList) {
      return;
    }
    this.tagsList.addTag(tagData);
  }

  makeTagsList(tagsData?: PersonData["tags"]) {
    this.tagsList = new PersonTagsList(
      this.localDraw,
      tagsData || [],
      this.getAbsolutePosition()
    );
  }

  getAbsolutePosition() {
    return {
      x: this.localDraw.transform().translateX + this.localDraw.x(),
      y: this.localDraw.transform().translateY + this.localDraw.y()
    };
  }

  listenToDrag() {
    this.localDraw.on("dragend.namespace", (e: any) => {
      // this.onDragEnd(this);
    });
  }

  changeZoomLevel(newZoomLevel: number) {
    this.displayOptions.zoomLevel = newZoomLevel;
    this.localDraw.clear();
  }

  getRadius() {
    return RADIUS_BY_ZOOM_LEVEL[this.displayOptions.zoomLevel || 2];
  }

  getHeight() {
    return this.getRadius() * 2;
  }

  getWidth() {
    return this.getRadius() * 2;
  }

  display() {
    const radius = this.getRadius();
    this.circle = this.localDraw
      .circle(radius * 2)
      .attr({ fill: "#fff", x: 0, y: 0 });

    this.localDraw
      .text((add: any) => {
        add
          .tspan(
            this.name
              .split(" ")
              .map((c) => c.charAt(0))
              .join("")
          )
          .newLine();
      })
      .attr({ width: radius * 2 });
  }

  moveTo(location: Position) {
    this.localDraw.transform({
      translateX: location.x,
      translateY: location.y
    });
  }
}

export default Person;
