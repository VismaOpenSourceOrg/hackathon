// @flow

import type { Idea, User } from "./types";

type RoleType = {
  id: string,
  title: string,
  shortTitle: string
};

export const Role = {
  MODERATOR: {
    id: "MODERATOR",
    title: "Moderator",
    shortTitle: "Mod"
  },
  ADMINISTRATOR: {
    id: "ADMINISTRATOR",
    title: "Administrator",
    shortTitle: "Admin"
  }
};

export function hasRole(auth: User, role: RoleType) {
  return auth.roles.indexOf(role) !== -1;
}

export function hasIdeaWriteAccess(idea: Idea, auth: User) {
  return (
    idea.createdBy.uuid === auth.uuid ||
    hasRole(auth, Role.MODERATOR) ||
    hasRole(auth, Role.ADMINISTRATOR)
  );
}
