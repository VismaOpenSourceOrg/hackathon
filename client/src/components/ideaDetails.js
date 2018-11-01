// @flow

import React from "react";
import moment from "moment";

import { connect } from "react-redux";

import ReactMarkdown from "react-markdown";

import ThumbUpSharp from "@material-ui/icons/ThumbUpSharp";

import type { User } from "./user";

import type { Idea } from "./idea";
import { push } from "connected-react-router";
import { joinNatural } from "../common/util";

const LoadingInfo = () => <div>Loading ...</div>;

const IdeaDetailsComponent = (props: {
  idea: ?Idea,
  toggleLike: (idea: Idea) => any
}) => (
  <div>
    {!props.idea ? (
      <LoadingInfo />
    ) : (
      <IdeaEntry idea={props.idea} toggleLike={props.toggleLike} />
    )}
  </div>
);

const IdeaEntry = (props: { idea: Idea, toggleLike: (idea: Idea) => any }) => (
  <div className="ideas--entry">
    <img
      className="ideas--entry--picture entry--picture"
      src={props.idea.createdBy.pictureUrl}
      title={props.idea.createdBy.fullName}
    />
    <div className="ideas--entry--content">
      <div className="ideas--entry--header">
        <span className="ideas--entry--title">{props.idea.title}</span>
        <span className="ideas--entry--timestamp">
          {moment(props.idea.created).fromNow()}
        </span>
      </div>
      <span className="ideas--entry--description md">
        <ReactMarkdown source={props.idea.description} />
      </span>
      <span
        className="likes ideas--entry--likes"
        onClick={() => props.toggleLike(props.idea)}
      >
        <ThumbUpSharp className="likes--icon" />
        {props.idea.likes.length === 0 ? (
          ""
        ) : (
          <span>
            <span className="likes--count">{props.idea.likes.length}</span>
            <span className="likes--names">
              {joinNatural(props.idea.likes.map(user => user.firstName))} likes
              this
            </span>
          </span>
        )}
      </span>
    </div>
  </div>
);

const mapStateToProps: any = state => {
  return {
    idea: state.idea
  };
};

const mapDispatchToProps: any = dispatch => {
  return {
    toggleLike: (idea: Idea) => {
      dispatch({ type: "TOGGLE_LIKE_IDEA", data: { idea: idea } });
    }
  };
};

const ConnectedIdeaDetailsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdeaDetailsComponent);

export default ConnectedIdeaDetailsComponent;
