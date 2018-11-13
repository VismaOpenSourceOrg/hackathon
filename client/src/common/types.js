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

export type Idea = {
  uuid: string,
  title: string,
  description: string,
  tags: Array<IdeaTag>,
  createdBy: User,
  created: string,
  likes: Array<User>,
  numberOfComments?: number
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

export type IdeaTag = {
	uuid: string,
	name: string
};
