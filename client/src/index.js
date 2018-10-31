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
import ConnectedUserComponent from "./components/user";
import ConnectedIdeaComponent from "./components/idea";

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
  <div>
    <ConnectedHeaderComponent />
    <div>
      <a href="/oauth2/authorization/google">
        Sign in with your @visma.com e-mail address
      </a>
    </div>
  </div>
);

const IdeasPage = () => (
  <div>
    <ConnectedHeaderComponent />
    <ConnectedIdeaComponent />
    <ConnectedUserComponent />
  </div>
);

const element = document.getElementById("main");
if (element) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" render={() => <Index />} />
          <Route exact path="/ideas" render={() => <IdeasPage />} />
          <Route render={() => <div>No such page</div>} />
        </Switch>
      </ConnectedRouter>
    </Provider>,
    element
  );
}
