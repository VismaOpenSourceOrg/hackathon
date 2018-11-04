// @flow

import { takeEvery, call, put } from "redux-saga/effects";

function* fetchUsers(): * {
  const response = yield call(fetch, "/api/user", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "USERS_SUCCESS", data });
}

export default [takeEvery("USERS_REQUESTED", fetchUsers)];
