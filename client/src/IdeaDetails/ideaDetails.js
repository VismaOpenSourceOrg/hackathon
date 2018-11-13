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
  addComment: (content: string, idea: Idea) => any,
  editingIdea: boolean,
  toggleLike: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any,
  editIdea: (idea: Idea) => any,
  cancelEditing: (idea: Idea) => any,
  updateIdea: (idea: Idea, title: string, description: string, tags: string) => any
}) => (
  <div>
    {!props.idea ? (
      <LoadingInfo />
    ) : (
      <IdeaDetails
        idea={props.idea}
        auth={props.auth}
        comments={props.comments}
        addComment={content =>
          props.idea && props.addComment(content, props.idea)
        }
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
    updateIdea: (idea: Idea, title: string, description: string, tags: string) => any,
    addComment: (content: string) => any,
    idea: Idea,
    auth: User,
    comments: ?Array<Comment>,
    editingIdea: boolean
  },
  { title: string, description: string, tags: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      title: props.idea.title,
      description: props.idea.description,
      tags: props.idea.tags.map(x => x.name).join(";")
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
                            this.state.description,
                            this.state.tags
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
						<input
							className="ideas--creator--tags"
							type="text"
							name="tags"
							placeholder="write;tags;here"
							value={this.state.tags}
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
              <span className="ideas--entry--tags md">
              Tags: {props.idea.tags.map(tag => (
					<span key={tag.uuid} className="ideas--entry--tag">{tag.name}</span>
				))}
              </span>
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
        {props.comments && (
          <IdeaComments
            auth={props.auth}
            idea={props.idea}
            comments={props.comments}
            addComment={props.addComment}
          />
        )}
      </div>
    );
  }
}

const IdeaComments = (props: {
  comments: Array<Comment>,
  auth: User,
  idea: Idea,
  addComment: (content: string) => any
}) => (
  <div className="idea-comments">
    {props.comments.map(comment => (
      <IdeaComment key={comment.uuid} comment={comment} />
    ))}

    <div className="idea-comments--creator box comment">
      <div className="comment--left">
        <img
          className="comment--author-picture entry--picture"
          src={props.auth.pictureUrl}
        />
      </div>
      <CommentCreator submitComment={props.addComment} />
    </div>
  </div>
);

class CommentCreator extends React.Component<
  {
    content?: string,
    submitComment: (content: string) => any
  },
  {
    content: string
  }
> {
  constructor(props) {
    super(props);
    this.state = { content: props.content || "" };
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  submitComment() {
    const content = this.state.content.trim();
    if (!content) return;
    this.props.submitComment(content);
    this.setState({ content: "" });
  }

  render() {
    return (
      <div className="comment--main">
        <div className="comment--content">
          <textarea
            name="content"
            value={this.state.content}
            onChange={this.handleChange.bind(this)}
            className="comment-creator--text"
            placeholder="Add a comment"
          />
        </div>
        <div className="comment--footer">
          <button
            className="comment--post-button th--button--small"
            onClick={this.submitComment.bind(this)}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

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
    updateIdea: (idea: Idea, title: string, description: string, tags: string) => {
      dispatch({
        type: "UPDATE_IDEA",
        data: { uuid: idea.uuid, title, description, tags }
      });
    },
    addComment: (content: string, idea: Idea) => {
      dispatch({ type: "ADD_IDEA_COMMENT", data: { idea, content } });
    }
  };
};

const ConnectedIdeaDetailsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdeaDetailsComponent);

export default ConnectedIdeaDetailsComponent;
