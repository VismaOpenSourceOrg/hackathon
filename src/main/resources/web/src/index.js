// @flow

import React from "react";
import ReactDOM from "react-dom";


type User = {
    uuid: string,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    pictureUrl: string,
    created: string
}

type Idea = {
    uuid: string,
    title: string,
    description: string,
    createdBy: User,
    created: string,
}

const Header = (props: { user: ?User }) => (
  <div className="header">
    <span className="header--title">Hackathon</span>
	  {props.user &&
      <div className="header--auth">
		<span className="header--auth--email">{props.user.email}</span>
		<img className="header--auth--picture" src={props.user.pictureUrl} />
        </div>
    }
  </div>
);

const UserOverview = (props: { users: Array<User>}) => (
  <div className="users box">
    <span className="users--header box--header">Registered users</span>
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

const IdeaOverview = (props: { ideas: Array<Idea>, createIdea: (string, string) => any }) => (
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

class IdeaCreator extends React.Component<{createIdea: (string, string) => any} ,{ title: string, description: string }> {
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

class Index extends React.Component<{}, { auth: ?User, users: Array<User>, ideas: Array<Idea>}> {
  constructor(props) {
    super(props);

    this.state = {
      auth: null,
      users: [],
      ideas: []
    };
  }

  componentDidMount() {
    fetch("/auth", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, auth: data }));

    fetch("/user", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, users: data }));

    fetch("/idea", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, ideas: data }));
  }

  createIdea(title, description) {
    fetch("/idea", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({ title, description })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({ ...this.state, ideas: [...this.state.ideas, data] })
      );
  }

  render() {
    const { auth, users, ideas } = this.state;
    return (
      <div>
        <Header user={auth} />

        <IdeaOverview
          ideas={ideas}
          createIdea={(title, description) =>
            this.createIdea(title, description)
          }
        />

        <UserOverview users={users} />
      </div>
    );
  }
}

const element = document.getElementById("main");
if (element) {
    ReactDOM.render(<Index />, element);
}
