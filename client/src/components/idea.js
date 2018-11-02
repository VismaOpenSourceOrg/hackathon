// @flow

import React from "react";
import moment from "moment";

import { connect } from "react-redux";
import { push } from "connected-react-router";

import ReactMarkdown from "react-markdown";

import ThumbUpSharp from "@material-ui/icons/ThumbUpSharp";
import Delete from "@material-ui/icons/Delete";

import type { User } from "./user";

import { joinNatural } from "../common/util.js";

export type Idea = {
  uuid: string,
  title: string,
  description: string,
  createdBy: User,
  created: string,
  likes: Array<User>
};

const IdeaComponent = (props: {
  auth: User,
  ideas?: Array<Idea>,
  createIdea: (string, string) => any,
  toggleLike: (idea: Idea) => any,
  showDetails: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any
}) => (
  <div>
    <div className="ideas box">
      <span className="ideas--header box--header">Submit your idea!</span>

      <IdeaCreator createIdea={props.createIdea} />
    </div>
    {!props.ideas || !props.ideas.length ? (
      ""
    ) : (
      <div className="box">
        <span className="ideas--header box--header box--header--underline">
          Submitted ideas
        </span>

        <div className="ideas--list">
          {props.ideas.map(idea => (
            <IdeaEntry
              auth={props.auth}
              key={idea.uuid}
              idea={idea}
              toggleLike={props.toggleLike}
              showDetails={props.showDetails}
              deleteIdea={props.deleteIdea}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

class IdeaCreator extends React.Component<
  { createIdea: (string, string) => any },
  { title: string, description: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: ""
    };
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  createIdea() {
    const title = this.state.title.trim();
    const description = this.state.description.trim();
    if (!title || !description) return;

    this.props.createIdea(title, description);
    this.setState({
      title: "",
      description: ""
    });
  }

  render() {
    return (
      <div className="ideas--creator">
        <input
          className="ideas--creator--title"
          type="text"
          name="title"
          placeholder="Title"
          value={this.state.title}
          onChange={this.handleChange.bind(this)}
        />
        <textarea
          className="ideas--creator--description"
          name="description"
          placeholder="Description (markdown supported!)"
          value={this.state.description}
          onChange={this.handleChange.bind(this)}
        />
        <button
          className="ideas--creator--create th--button"
          onClick={() => this.createIdea()}
        >
          Submit idea
        </button>
      </div>
    );
  }
}

const IdeaEntry = (props: {
  auth: User,
  idea: Idea,
  toggleLike: (idea: Idea) => any,
  showDetails: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any
}) => (
  <div className="ideas--entry">
    <img
      className="ideas--entry--picture entry--picture"
      src={props.idea.createdBy.pictureUrl}
      title={props.idea.createdBy.fullName}
    />
    <div className="ideas--entry--content">
      <div className="ideas--entry--header">
        <span className="ideas--entry--title">
          <a
            href={`/ideas/${props.idea.uuid}`}
            onClick={e => {
              e.preventDefault();
              props.showDetails(props.idea);
            }}
          >
            {props.idea.title}
          </a>
        </span>
        {props.idea.createdBy.uuid === props.auth.uuid && (
          <span className="ideas--entry--delete">
            <Delete
              onClick={() =>
                confirm("Delete " + props.idea.title + "?") &&
                props.deleteIdea(props.idea)
              }
            />
          </span>
        )}
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
    auth: state.auth,
    ideas: state.ideas
  };
};

const mapDispatchToProps: any = dispatch => {
  return {
    createIdea: (title: string, description: string) => {
      dispatch({ type: "CREATE_IDEA", data: { title, description } });
    },
    toggleLike: (idea: Idea) => {
      dispatch({ type: "TOGGLE_LIKE_IDEA", data: { idea: idea } });
    },
    showDetails: (idea: Idea) => {
      dispatch(push(`/ideas/${idea.uuid}`));
    },
    deleteIdea: (idea: Idea) => {
      dispatch({ type: "DELETE_IDEA", data: { uuid: idea.uuid } });
    }
  };
};

const ConnectedIdeaComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdeaComponent);

export default ConnectedIdeaComponent;
