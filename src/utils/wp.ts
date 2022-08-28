import { MenuTreeItem } from "hooks/useWP";

export const flatListToHierarchical = (
    data = [],
    { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}
  ) => {
    const tree: Array<MenuTreeItem> = [];
    const childrenOf: any = {};
    data.forEach((item: MenuTreeItem) => {
      const newItem = { ...item };
      // @ts-ignore
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
      childrenOf[id] = childrenOf[id] || [];
      // @ts-ignore
      newItem[childrenKey] = childrenOf[id];
      parentId
        ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
        : tree.push(newItem);
    });
    return tree;
  };