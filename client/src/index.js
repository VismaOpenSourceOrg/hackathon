// @flow

import babelPolyfill from "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import type { User } from "./components/user";

import ConnectedUserComponent from "./components/user";
import ConnectedIdeaComponent from "./components/idea";

import saga from "./store/saga";
import reducer from "./store/reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
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

class Index extends React.Component<{}, { auth: ?User }> {
  constructor(props) {
    super(props);

    this.state = {
      auth: null
    };
  }

  componentDidMount() {
    fetch("/api/auth", { credentials: "same-origin" })
      .then(response => response.json())
      .then(data => {
        this.setState({ ...this.state, auth: data });
      });
  }

  render() {
    const { auth } = this.state;
    return (
      <div>
        <Header user={auth} />

        <ConnectedIdeaComponent />

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
