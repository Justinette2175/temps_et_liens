import Matter from "matter-js";
import MatterVisualization, { BodyLabel } from "./MatterVisualization";

type DisplayOptions = {
  zoomLevel: number;
};

type tagFilter = {
  name: string;
  id: number;
  type: string;
  tagId: string;
};

class Visualization {
  visualization: MatterVisualization;
  tagFilters: Array<tagFilter>;
  constructor(displayOptions: DisplayOptions) {
    this.visualization = new MatterVisualization();
    this.tagFilters = [];
  }

  addPerson(tagId?: string) {
    const labelObject: BodyLabel = {
      tagId: tagId || "main",
      objectType: "regular"
    };
    this.visualization.addCircle({
      radius: 10,
      options: { label: JSON.stringify(labelObject) }
    });
  }

  addTagFilter(tagId: string, tagName: string) {
    const labelObject: BodyLabel = {
      tagId,
      objectType: "staticDraggable"
    };
    const { id, type } = this.visualization.addAttractiveCircle({
      radius: 60,
      label: JSON.stringify(labelObject),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    this.tagFilters.push({ name: tagName, tagId, id, type });
  }
}

export default Visualization;
