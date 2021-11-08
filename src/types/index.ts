import Person from "../objects/Person";

export type TagTypeData = {
  id: string;
  name: string;
};

export type TagData = {
  id: string;
  name: string;
  type: TagTypeData;
};

export type NewTagData = Partial<TagData>;

export type PersonData = {
  id: string;
  name: string;
  tags: Array<TagData>;
};

export type NewPersonData = Partial<PersonData>;

export type Position = {
  x: number;
  y: number;
};
