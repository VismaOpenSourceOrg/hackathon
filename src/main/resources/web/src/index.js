// @flow

import React from "react";
import ReactDOM from "react-dom";

import type { User } from "./components/user";
import type { Idea } from "./components/idea";

import UserComponent from "./components/user";
import IdeaComponent from "./components/idea";

const Header = (props: { user: ?User }) => (
  <div className="header">
    <span className="header--title">Hackathon</span>
    {props.user && (
      <div className="header--auth">
        <span className="header--auth--email">{props.user.email}</span>
        <img className="header--auth--picture" src={props.user.pictureUrl} />
      </div>
    )}
  </div>
);

class Index extends React.Component<
  {},
  { auth: ?User, users: Array<User>, ideas: Array<Idea> }
> {
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

        <IdeaComponent
          ideas={ideas}
          createIdea={(title, description) =>
            this.createIdea(title, description)
          }
        />

        <UserComponent users={users} />
      </div>
    );
  }
}

const element = document.getElementById("main");
if (element) {
  ReactDOM.render(<Index />, element);
}
