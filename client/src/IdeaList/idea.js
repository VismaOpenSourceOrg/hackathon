// @flow

import React from "react";
import moment from "moment";

import { connect } from "react-redux";
import { push } from "connected-react-router";

import ReactMarkdown from "react-markdown";

import ThumbUpSharp from "@material-ui/icons/ThumbUpSharp";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";

import type { User, Idea, Hackathon } from "../common/types";

import { joinNatural, getUserInitials } from "../common/util";
import { hasIdeaWriteAccess } from "../common/auth";

function getHackathonDescription(hackathon: Hackathon) {
  return { __html: hackathon.description };
}

const IdeaComponent = (props: {
  auth: User,
  ideas?: Array<Idea>,
  activeHackathon: ?Hackathon,
  createIdea: (string, string, string) => any,
  toggleLike: (idea: Idea) => any,
  showDetails: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any,
  editIdea: (idea: Idea) => any
}) => (
  <div>
    {props.activeHackathon && (
      <div className="box">
        <div
          className="hackathon--description"
          dangerouslySetInnerHTML={getHackathonDescription(
            props.activeHackathon
          )}
        />
      </div>
    )}
    <div className="box">
      <IdeaCreator createIdea={props.createIdea} />
    </div>
    {!props.ideas || !props.ideas.length ? (
      ""
    ) : (
      <div>
        <div className="boxish">
          <span className="ideas--header box--header">Submitted ideas</span>
        </div>
        <div className="ideas--list">
          {props.ideas.map(idea => (
            <IdeaEntry
              auth={props.auth}
              key={idea.uuid}
              idea={idea}
              toggleLike={props.toggleLike}
              showDetails={props.showDetails}
              deleteIdea={props.deleteIdea}
              editIdea={props.editIdea}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

class IdeaCreator extends React.Component<
  { createIdea: (string, string, string) => any },
  { title: string, description: string, tags: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      tags: ""
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
    const tags = this.state.tags.trim();
    if (!title || !description || !tags) return;

    this.props.createIdea(title, description, tags);
    this.setState({
      title: "",
      description: "",
      tags: ""
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
		  <input
			  className="ideas--creator--tags"
			  type="text"
			  name="tags"
			  placeholder="write;tags;here"
			  value={this.state.tags}
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
        {this.state.description && (
          <div className="ideas--creator--preview md">
            <ReactMarkdown source={this.state.description} />
          </div>
        )}
      </div>
    );
  }
}

function pluralize(count: number, word: string) {
  return String(count) + " " + (count === 1 ? word : word + "s");
}

const IdeaEntry = (props: {
  auth: User,
  idea: Idea,
  toggleLike: (idea: Idea) => any,
  showDetails: (idea: Idea) => any,
  deleteIdea: (idea: Idea) => any,
  editIdea: (idea: Idea) => any
}) => (
  <div className="ideas--entry box">
    <div className="ideas--entry--author" title={props.idea.createdBy.fullName}>
      <img
        className="ideas--entry--picture entry--picture"
        src={props.idea.createdBy.pictureUrl}
      />
      <span className="ideas--entry--initials">
        {getUserInitials(props.idea.createdBy.fullName)}
      </span>
      {hasIdeaWriteAccess(props.idea, props.auth) && (
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
      )}
    </div>
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

        <span
          className="ideas--entry--timestamp"
          title={moment(props.idea.created).format()}
        >
          {moment(props.idea.created).fromNow()}
        </span>
      </div>
		<span className="ideas--entry--tags md">
             Tags: {props.idea.tags.map(tag => (
                 <span key={tag.uuid} className="ideas--entry--tag">{tag.name}</span>
             ))}
      </span>
      <span className="ideas--entry--description md">
        <ReactMarkdown source={props.idea.description} />
      </span>
      <div className="ideas--entry--footer">
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
                {joinNatural(props.idea.likes.map(user => user.firstName))}{" "}
                likes this
              </span>
            </span>
          )}
        </span>
        <span className="ideas--entry--comments">
          <a
            href={`/ideas/${props.idea.uuid}`}
            onClick={e => {
              e.preventDefault();
              props.showDetails(props.idea);
            }}
          >
            {props.idea.numberOfComments
              ? pluralize(props.idea.numberOfComments, "comment")
              : "No comments"}
          </a>
        </span>
      </div>
    </div>
  </div>
);

const mapStateToProps: any = state => {
  return {
    auth: state.auth,
    ideas: state.ideas,
    activeHackathon: state.activeHackathon
  };
};

const mapDispatchToProps: any = dispatch => {
  return {
    createIdea: (title: string, description: string, tags: string) => {
      dispatch({ type: "CREATE_IDEA", data: { title, description, tags } });
    },
    toggleLike: (idea: Idea) => {
      dispatch({ type: "TOGGLE_LIKE_IDEA", data: { idea: idea } });
    },
    showDetails: (idea: Idea) => {
      dispatch(push(`/ideas/${idea.uuid}`));
    },
    editIdea: (idea: Idea) => {
      dispatch(push(`/ideas/${idea.uuid}/edit`));
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
