// @flow

import React from "react";

export type User = {
  uuid: string,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  pictureUrl: string,
  created: string
};

const UserComponent = (props: { users: Array<User> }) => (
  <div className="users box">
    <span className="users--header box--header box--header--underline">
      Registered users
    </span>
    <div className="users--list">
      {props.users.map(user => (
        <UserEntry key={user.uuid} user={user} />
      ))}
    </div>
  </div>
);

const UserEntry = (props: { user: User }) => (
  <div className="users--entry">
    <img
      className="users--entry--picture entry--picture"
      src={props.user.pictureUrl}
    />
    <span className="users--entry--name" title={props.user.email}>
      {props.user.fullName}
    </span>
  </div>
);

export default UserComponent;
