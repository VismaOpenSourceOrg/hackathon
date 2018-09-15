// @flow

import babelPolyfill from "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import ConnectedHeaderComponent from "./components/header";
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

const Index = () => (
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
      <Index />
    </Provider>,
    element
  );
}
