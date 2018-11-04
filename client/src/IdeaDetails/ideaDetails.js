// @flow

import React from "react";
import moment from "moment";

import { connect } from "react-redux";
import { push } from "connected-react-router";
import ReactMarkdown from "react-markdown";

import type { User, Idea, Comment } from "../common/types";

import { hasIdeaWriteAccess } from "../common/auth";

import { getUserInitials, joinNatural } from "../common/util";

import Edit from "@material-ui/icons/Edit";
import ThumbUpSharp from "@material-ui/icons/ThumbUpSharp";
import Delete from "@material-ui/icons/Delete";
import Save from "@material-ui/icons/Save";
import Cancel from "@material-ui/icons/Cancel";

const LoadingInfo = () => <div>Loading ...</div>;

const IdeaDetailsComponent = (props: {
  idea: ?Idea,
  auth: User,
  comments: ?Array<Comment>,
  editingIdea: boolean,
  toggleLike: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any,
  editIdea: (idea: Idea) => any,
  cancelEditing: (idea: Idea) => any,
  updateIdea: (idea: Idea, title: string, description: string) => any
}) => (
  <div>
    {!props.idea ? (
      <LoadingInfo />
    ) : (
      <IdeaDetails
        idea={props.idea}
        auth={props.auth}
        comments={props.comments}
        editingIdea={props.editingIdea}
        toggleLike={props.toggleLike}
        deleteIdea={props.deleteIdea}
        editIdea={props.editIdea}
        cancelEditing={props.cancelEditing}
        updateIdea={props.updateIdea}
      />
    )}
  </div>
);

class IdeaDetails extends React.Component<
  {
    toggleLike: (idea: Idea) => any,
    deleteIdea: (idea: Idea) => any,
    editIdea: (idea: Idea) => any,
    cancelEditing: (idea: Idea) => any,
    updateIdea: (idea: Idea, title: string, description: string) => any,
    idea: Idea,
    auth: User,
    comments: ?Array<Comment>,
    editingIdea: boolean
  },
  { title: string, description: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      title: props.idea.title,
      description: props.idea.description
    };
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { props } = this;

    return (
      <div>
        <div className="box">
          <div className="ideas--entry">
            <div
              className="ideas--entry--author"
              title={props.idea.createdBy.fullName}
            >
              <img
                className="ideas--entry--picture entry--picture"
                src={props.idea.createdBy.pictureUrl}
              />
              <span className="ideas--entry--initials">
                {getUserInitials(props.idea.createdBy.fullName)}
              </span>
              {hasIdeaWriteAccess(props.idea, props.auth) &&
                (props.editingIdea ? (
                  <span className="ideas--entry--actions">
                    <span className="ideas--entry--save">
                      <Save
                        title="Save changes"
                        onClick={() =>
                          props.updateIdea(
                            props.idea,
                            this.state.title,
                            this.state.description
                          )
                        }
                      />
                    </span>
                    <span className="ideas--entry--cancel">
                      <Cancel
                        title="Discard changes"
                        onClick={() =>
                          confirm(
                            "Discard changes to " + props.idea.title + "?"
                          ) && props.cancelEditing(props.idea)
                        }
                      />
                    </span>
                  </span>
                ) : (
                  <span className="ideas--entry--actions">
                    <span className="ideas--entry--edit">
                      <Edit
                        title="Edit idea"
                        onClick={() => props.editIdea(props.idea)}
                      />
                    </span>
                    <span className="ideas--entry--delete">
                      <Delete
                        title="Delete idea"
                        onClick={() =>
                          confirm("Delete " + props.idea.title + "?") &&
                          props.deleteIdea(props.idea)
                        }
                      />
                    </span>
                  </span>
                ))}
            </div>
            <div className="ideas--entry--content">
              <div className="ideas--entry--header">
                <span className="ideas--entry--title">
                  {props.editingIdea ? (
                    <div>
                      <input
                        className="ideas--creator--title"
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={this.state.title}
                        onChange={this.handleChange.bind(this)}
                      />
                    </div>
                  ) : (
                    props.idea.title
                  )}
                </span>

                <span
                  className="ideas--entry--timestamp"
                  title={moment(props.idea.created).format()}
                >
                  {moment(props.idea.created).fromNow()}
                </span>
              </div>
              {props.editingIdea && (
                <div className="ideas--entry--editor">
                  <textarea
                    className="ideas--creator--description"
                    name="description"
                    placeholder="Description (markdown supported!)"
                    value={this.state.description}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
              )}
              <span className="ideas--entry--description md">
                <ReactMarkdown
                  source={
                    props.editingIdea
                      ? this.state.description
                      : props.idea.description
                  }
                />
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
                    <span className="likes--count">
                      {props.idea.likes.length}
                    </span>
                    <span className="likes--names">
                      {joinNatural(
                        props.idea.likes.map(user => user.firstName)
                      )}{" "}
                      likes this
                    </span>
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        {props.comments && <IdeaComments comments={props.comments} />}
      </div>
    );
  }
}

const IdeaComments = (props: { comments: Array<Comment> }) =>
  props.comments.map(comment => <IdeaComment comment={comment} />);

const IdeaComment = (props: { comment: Comment }) => (
  <div className="box comment">
    <div className="comment--left">
      <img
        className="comment--author-picture entry--picture"
        src={props.comment.createdBy.pictureUrl}
      />
    </div>
    <div className="comment--main">
      <div className="comment--header">
        <span className="comment--author-name">
          {props.comment.createdBy.fullName}
        </span>
        <span
          className="comment--created-date"
          title={moment(props.comment.created).format()}
        >
          {moment(props.comment.created).fromNow()}
        </span>
      </div>
      <div className="comment--content md">
        <ReactMarkdown source={props.comment.content} />
      </div>
    </div>
  </div>
);

const mapStateToProps: any = state => {
  return {
    idea: state.idea,
    auth: state.auth,
    comments: state.comments,
    editingIdea: state.editingIdea
  };
};

const mapDispatchToProps: any = dispatch => {
  return {
    toggleLike: (idea: Idea) => {
      dispatch({ type: "TOGGLE_LIKE_IDEA", data: { idea: idea } });
    },
    deleteIdea: (idea: Idea) => {
      dispatch({ type: "DELETE_IDEA", data: { uuid: idea.uuid } });
    },
    editIdea: (idea: Idea) => {
      dispatch(push(`/ideas/${idea.uuid}/edit`));
    },
    cancelEditing: (idea: Idea) => {
      dispatch(push(`/ideas/${idea.uuid}`));
    },
    updateIdea: (idea: Idea, title: string, description: string) => {
      dispatch({
        type: "UPDATE_IDEA",
        data: { uuid: idea.uuid, title, description }
      });
    }
  };
};

const ConnectedIdeaDetailsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdeaDetailsComponent);

export default ConnectedIdeaDetailsComponent;
