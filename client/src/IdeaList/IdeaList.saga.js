// @flow

import { takeEvery, call, put, select } from "redux-saga/effects";

import type { Idea } from "../common/types";

function* fetchIdeas(): * {
  try {
    const response = yield call(fetch, "/api/idea", {
      credentials: "same-origin"
    });
    const data = yield call([response, response.json]);
    yield put({ type: "IDEAS_SUCCESS", data });
  } catch (error) {
    yield put({ type: "IDEAS_FAILURE", error });
  }
}

function* createIdea(action: {
  type: string,
  data: { title: string, description: string }
}): * {
  const response = yield call(fetch, "/api/idea", {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify({
      title: action.data.title,
      description: action.data.description
    })
  });
  const data = yield call([response, response.json]);

  yield put({ type: "IDEA_CREATED", data });
  yield put({ type: "IDEAS_REQUESTED", data }); // TODO do this in IDEA_CREATED
}

function* deleteIdea(action: { data: { uuid: string } }): * {
  yield call(fetch, `/api/idea/${action.data.uuid}`, {
    method: "delete",
    credentials: "same-origin"
  });

  yield put({ type: "IDEA_DELETED", data: action.data.uuid });
  yield put({ type: "IDEAS_REQUESTED" }); // TODO do this in IDEA_DELETED
}

function* toggleLike(action: { type: string, data: { idea: Idea } }): * {
  const state = yield select();
  const authUser = state.auth;

  const operation = action.data.idea.likes.filter(
    user => user.uuid === authUser.uuid
  ).length
    ? "unlike"
    : "like";

  const response = yield call(
    fetch,
    "/api/idea/" + action.data.idea.uuid + "/" + operation,
    {
      method: "put",
      credentials: "same-origin"
    }
  );
  const data = yield call([response, response.json]);

  yield put({ type: "LIKE_TOGGELED", data });
  yield put({ type: "IDEAS_REQUESTED", data }); // TODO update the list in LIKE_TOGGELED
}

function* fetchActiveHackathon(): * {
  try {
    const response = yield call(fetch, "/api/hackathon/active", {
      credentials: "same-origin"
    });
    const data = yield call([response, response.json]);

    yield put({ type: "ACTIVE_HACKATHON_SUCCESS", data });
  } catch (error) {
    yield put({ type: "ACTIVE_HACKATHON_FAILURE", error });
  }
}

export default [
  takeEvery("IDEAS_REQUESTED", fetchIdeas),
  takeEvery("ACTIVE_HACKATHON_REQUESTED", fetchActiveHackathon),

  takeEvery("CREATE_IDEA", createIdea),
  takeEvery("DELETE_IDEA", deleteIdea),
  takeEvery("TOGGLE_LIKE_IDEA", toggleLike)
];
