// @flow

import React from "react";

import type { User } from "./user";

export type Idea = {
  uuid: string,
  title: string,
  description: string,
  createdBy: User,
  created: string
};

const IdeaComponent = (props: {
  ideas: Array<Idea>,
  createIdea: (string, string) => any
}) => (
  <div className="ideas box">
    <span className="ideas--header box--header">Ideas</span>

    <IdeaCreator createIdea={props.createIdea} />

    {props.ideas ? (
      <div className="ideas--list">
        {props.ideas.map(idea => (
          <IdeaEntry key={idea.uuid} idea={idea} />
        ))}
      </div>
    ) : (
      <span className="ideas--empty-list">No ideas submitted yet</span>
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
          placeholder="Description"
          value={this.state.description}
          onChange={this.handleChange.bind(this)}
        />
        <button
          className="ideas--creator--create"
          onClick={() => this.createIdea()}
        >
          Create
        </button>
      </div>
    );
  }
}

const IdeaEntry = (props: { idea: Idea }) => (
  <div className="ideas--entry">
    <img
      className="ideas--entry--picture entry--picture"
      src={props.idea.createdBy.pictureUrl}
      title={props.idea.createdBy.fullName}
    />
    <span className="ideas--entry--title">{props.idea.title}</span>
    <span className="ideas--entry--description">{props.idea.description}</span>
  </div>
);

export default IdeaComponent;
