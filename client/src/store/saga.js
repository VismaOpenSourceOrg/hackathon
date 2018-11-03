// @flow

import { takeEvery, call, put, fork, select } from "redux-saga/effects";
import { push } from "connected-react-router";

import type { Idea } from "../common/types";

function* fetchUsers(): * {
  const response = yield call(fetch, "/api/user", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "USERS_SUCCESS", data });
}

function* fetchAuth(): * {
  try {
    const response = yield call(fetch, "/api/auth", {
      credentials: "same-origin"
    });
    const data = yield call([response, response.json]);

    yield put({ type: "AUTH_SUCCESS", data });
  } catch (error) {
    yield put({ type: "AUTH_FAILURE", error });
  }
}

function* authSuccess(): * {
  const state = yield select();
  if (!state.router.location || state.router.location.pathname === "/") {
    yield put(push("/ideas"));
  }
}

function* authFailure(): * {
  const state = yield select();
  if (state.router.location && state.router.location.pathname !== "/") {
    yield put(push("/"));
  }
}

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

function* initialLoad(): * {
  yield put({ type: "AUTH_REQUESTED" });
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

type LocationType = {
  hash: string,
  pathname: string,
  search: string,
  state: any
};

function* routerChange(props: {
  payload: { action: string, location: LocationType }
}): * {
  const { pathname } = props.payload.location;
  console.debug("Navigating to ", pathname);

  if (pathname === "/ideas") {
    yield put({ type: "IDEAS_REQUESTED" });
    return;
  }
  if (pathname === "/people") {
    yield put({ type: "USERS_REQUESTED" });
    return;
  }

  const m = /^\/ideas\/([^\/]+)/.exec(pathname);
  if (m) {
    const uuid = m[1];
    yield put({ type: "IDEA_REQUESTED", uuid });
  }
}

export default function*(): any {
  yield takeEvery("USERS_REQUESTED", fetchUsers);
  yield takeEvery("AUTH_REQUESTED", fetchAuth);
  yield takeEvery("IDEAS_REQUESTED", fetchIdeas);
  yield takeEvery("IDEA_REQUESTED", fetchIdea);

  yield takeEvery("CREATE_IDEA", createIdea);
  yield takeEvery("DELETE_IDEA", deleteIdea);
  yield takeEvery("UPDATE_IDEA", updateIdea);
  yield takeEvery("TOGGLE_LIKE_IDEA", toggleLike);

  yield takeEvery("AUTH_SUCCESS", authSuccess);
  yield takeEvery("AUTH_FAILURE", authFailure);

  yield takeEvery("@@router/LOCATION_CHANGE", routerChange);

  yield fork(initialLoad);
}
