// @flow

import type { User } from "./user";
import React from "react";

import { connect } from "react-redux";
import type { Idea } from "./idea";

const HeaderComponent = (props: { auth: ?User }) => (
  <div className="header">
    <span className="header--title">
      <img className="header--mascot" src="/images/raccoon.png" />
      <a href="/" className="header--title-text">
        Visma Hackathon
      </a>
    </span>
    {props.auth && (
      <div className="header--auth">
        <span className="header--auth--email">{props.auth.email}</span>
        <img className="header--auth--picture" src={props.auth.pictureUrl} />
      </div>
    )}
  </div>
);

const mapStateToProps: any = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps: any = dispatch => {
  return {};
};

const ConnectedHeaderComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);

export default ConnectedHeaderComponent;
