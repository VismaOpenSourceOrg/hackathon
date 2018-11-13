// @flow

export type User = {
  uuid: string,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  pictureUrl: string,
  created: string,
  roles: Array<string>
};

export type IdeaStatus = "REPORTED"|"IN_PROGRESS"|"DONE";

export type Idea = {
  uuid: string,
  title: string,
  description: string,
  createdBy: User,
  created: string,
  likes: Array<User>,
  numberOfComments?: number,
  status: IdeaStatus
};

export type Comment = {
  uuid: string,
  idea: Idea,
  content: string,
  createdBy: User,
  created: string
};

export type Hackathon = {
  uuid: string,
  title: string,
  description: string,
  status: "ACTIVE" | "INACTIVE",
  createdBy: User,
  created: string,
  updated: string
};
