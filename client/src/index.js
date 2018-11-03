// @flow

import babelPolyfill from "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import { createBrowserHistory } from "history";
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from "connected-react-router";
import { Route, Switch } from "react-router";

import ConnectedHeaderComponent from "./components/header";
import ConnectedPeopleComponent from "./PeopleList/people";
import ConnectedIdeaComponent from "./IdeaList/idea";
import ConnectedIdeaDetailsComponent from "./IdeaDetails/ideaDetails";

import saga from "./store/saga";
import reducer from "./store/reducer";

const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  connectRouter(history)(reducer),
  {},
  composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))
);
sagaMiddleware.run(saga);

const Index = () => (
  <div className="login-page">
    <a
      href="/oauth2/authorization/google"
      className="login-page--link th--button"
    >
      Log in
    </a>
  </div>
);

const element = document.getElementById("main");
if (element) {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <ConnectedHeaderComponent />
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" render={() => <Index />} />
            <Route
              exact
              path="/ideas"
              render={() => <ConnectedIdeaComponent />}
            />
            <Route
              exact
              path="/people"
              render={() => <ConnectedPeopleComponent />}
            />
            <Route
              path="/ideas/:id"
              render={() => <ConnectedIdeaDetailsComponent />}
            />
            <Route render={() => <div>No such page</div>} />
          </Switch>
        </ConnectedRouter>
      </div>
    </Provider>,
    element
  );
}
