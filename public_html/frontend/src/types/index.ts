import Person from "../objects/Person";

export type CategoryId = string;
export type PersonId = string;

export type TagTypeData = {
  id: string;
  name: string;
};

export type CategoryData = {
  id: string;
  name: string;
};

export type NewTagData = Partial<CategoryData>;

export type PersonData = {
  id: string;
  name: string;
  categories: Array<CategoryData>;
};

export type NewPersonData = Pick<PersonData, "name"> & {
  category?: CategoryData["id"];
};

export type NewCategoryData = {
  name: string;
};

export type Position = {
  x: number;
  y: number;
};

export type PositionAndAngle = {
  x: number;
  y: number;
  angle: number;
};

export type BodyLabel = {
  filterId?: string;
  bodyType?: "regular" | "staticDraggable";
  dataType?: "person" | "tag";
  dataId: string;
};
