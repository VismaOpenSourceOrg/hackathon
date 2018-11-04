// @flow

import { takeEvery, call, put } from "redux-saga/effects";
import { push } from "connected-react-router";

import type { Idea } from "../common/types";

function* fetchIdea(action: { uuid: string }): * {
  try {
    const response = yield call(fetch, `/api/idea/${action.uuid}`, {
      credentials: "same-origin"
    });
    const data = yield call([response, response.json]);
    yield put({ type: "IDEA_SUCCESS", data });
  } catch (error) {
    yield put({ type: "IDEA_FAILURE", error });
  }
}

function* fetchComments(action: { uuid: string }): * {
  try {
    const response = yield call(fetch, `/api/idea/${action.uuid}/comments`, {
      credentials: "same-origin"
    });
    const data = yield call([response, response.json]);
    yield put({ type: "COMMENTS_SUCCESS", data });
  } catch (error) {
    yield put({ type: "COMMENTS_FAILURE", error });
  }
}

function* updateIdea(action: {
  data: { uuid: string, title: string, description: string }
}) {
  const response = yield call(fetch, `/api/idea/${action.data.uuid}`, {
    method: "put",
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
  yield put({ type: "IDEA_UPDATED", data });
  yield put(push(`/ideas/${action.data.uuid}`));
}

function* addIdeaComment(action: { data: { idea: Idea, content: string } }): * {
  const response = yield call(
    fetch,
    `/api/idea/${action.data.idea.uuid}/comments`,
    {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({
        content: action.data.content
      })
    }
  );
  const data = yield call([response, response.json]);
  yield put({ type: "COMMENT_CREATED", data });
  yield put({ type: "COMMENTS_REQUESTED", uuid: action.data.idea.uuid });
}

export default [
  takeEvery("IDEA_REQUESTED", fetchIdea),
  takeEvery("COMMENTS_REQUESTED", fetchComments),

  takeEvery("UPDATE_IDEA", updateIdea),
  takeEvery("ADD_IDEA_COMMENT", addIdeaComment)
];
