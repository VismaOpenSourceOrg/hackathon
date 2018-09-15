// @flow

import { takeEvery, call, put, fork } from "redux-saga/effects";

function* fetchUsers(): * {
  const response = yield call(fetch, "/api/user", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "USERS_SUCCESS", data });
}

function* fetchAuth(): * {
  const response = yield call(fetch, "/api/auth", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "AUTH_SUCCESS", data });
}

function* fetchIdeas(): * {
  const response = yield call(fetch, "/api/idea", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "IDEAS_SUCCESS", data });
}

function* initialLoad(): * {
  yield put({ type: "USERS_REQUESTED" });
  yield put({ type: "AUTH_REQUESTED" });
  yield put({ type: "IDEAS_REQUESTED" });
}

export default function*(): any {
  yield takeEvery("USERS_REQUESTED", fetchUsers);
  yield takeEvery("AUTH_REQUESTED", fetchAuth);
  yield takeEvery("IDEAS_REQUESTED", fetchIdeas);

  yield fork(initialLoad);
}
