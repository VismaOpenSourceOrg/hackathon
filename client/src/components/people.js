// @flow

import React from "react";
import { connect } from "react-redux";

import type { User, Idea } from "../common/types";

const PeopleComponent = (props: { users?: Array<User> }) => (
  <div className="users box">
    <span className="users--header box--header box--header--underline">
      People
    </span>
    <div className="users--list">
      {props.users &&
        props.users.map(user => <UserEntry key={user.uuid} user={user} />)}
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

const mapStateToProps: any = state => {
  return {
    users: state.users
  };
};

const mapDispatchToProps: any = dispatch => {
  return {};
};

const ConnectedPeopleComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleComponent);

export default ConnectedPeopleComponent;
