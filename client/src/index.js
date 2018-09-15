// @flow

import babelPolyfill from "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import type { User } from "./components/user";
import type { Idea } from "./components/idea";

import ConnectedUserComponent from "./components/user";
import IdeaComponent from "./components/idea";

import saga from "./store/saga";
import reducer from "./store/reducer";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);

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

let globalAuth;

class Index extends React.Component<{}, { auth: ?User, ideas: Array<Idea> }> {
  constructor(props) {
    super(props);

    this.state = {
      auth: null,
      ideas: []
    };
  }

  componentDidMount() {
    fetch("/api/auth", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => {
        this.setState({ ...this.state, auth: data });
        globalAuth = data;
      });

    fetch("/api/idea", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, ideas: data }));
  }

  createIdea(title: string, description: string) {
    fetch("/api/idea", {
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

  updateIdea(list: Array<Idea>, idea: Idea) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].uuid === idea.uuid) {
        list[i] = idea;
        break;
      }
    }
    return list;
  }

  toggleLike(idea: Idea) {
    const already = idea.likes.filter(user => user.uuid === globalAuth.uuid);

    fetch(
      "/api/idea/" + idea.uuid + "/" + (already.length ? "unlike" : "like"),
      {
        method: "put",
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          ...this.state,
          ideas: this.updateIdea([...this.state.ideas], data)
        })
      );
  }

  render() {
    const { auth, ideas } = this.state;
    return (
      <div>
        <Header user={auth} />

        <IdeaComponent
          ideas={ideas}
          createIdea={this.createIdea.bind(this)}
          toggleLike={this.toggleLike.bind(this)}
        />

        <ConnectedUserComponent />
      </div>
    );
  }
}

const element = document.getElementById("main");
if (element) {
  ReactDOM.render(
    <Provider store={store}>
      <Index />
    </Provider>,
    element
  );
}
