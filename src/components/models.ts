export interface Menu {
  name: string;
  items: Item[];
}

export interface Item {
  name: string;
  isButton: boolean;
  link?: string;
  clickFunction?: string;
  isSolidButton?: boolean;
  icon?: string;
  type?: string;
}