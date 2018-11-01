// @flow

export const joinNatural = (list: Array<any>) => {
  if (!list.length) return null;
  if (list.length === 1) return list[0];

  const firstParts = list.slice(0, -1).join(", ");
  return firstParts + " and " + list[list.length - 1];
};