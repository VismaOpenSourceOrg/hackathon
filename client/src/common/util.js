// @flow

export function joinNatural(list: Array<any>) {
  if (!list.length) return null;
  if (list.length === 1) return list[0];

  const firstParts = list.slice(0, -1).join(", ");
  return firstParts + " and " + list[list.length - 1];
}

export function getUserInitials(name: string) {
  return name.replace(/[^A-ZÆØÅ]+/g, "");
}
