// @flow

import { takeEvery, call, put, fork, select } from "redux-saga/effects";
import { push } from "connected-react-router";

import type { Idea } from "../components/idea";

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
    yield put({ type: "AUTH_FAILED", error });
  }
}

function* authSuccess(): * {
  yield put(push("/ideas"));
}

function* fetchIdeas(): * {
  const response = yield call(fetch, "/api/idea", {
    credentials: "same-origin"
  });
  const data = yield call([response, response.json]);
  yield put({ type: "IDEAS_SUCCESS", data });
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

function* routerChange({ action: string, location: LocationType }): * {
  console.debug("Navigating to ", location.pathname);

  switch (location.pathname) {
    case "/ideas":
      yield put({ type: "USERS_REQUESTED" });
      yield put({ type: "IDEAS_REQUESTED" });
      break;
    default:
      console.warn("Unhandled location ", location.pathname);
  }
}

export default function*(): any {
  yield takeEvery("USERS_REQUESTED", fetchUsers);
  yield takeEvery("AUTH_REQUESTED", fetchAuth);
  yield takeEvery("IDEAS_REQUESTED", fetchIdeas);

  yield takeEvery("CREATE_IDEA", createIdea);
  yield takeEvery("TOGGLE_LIKE_IDEA", toggleLike);

  yield takeEvery("AUTH_SUCCESS", authSuccess);

  yield takeEvery("@@router/LOCATION_CHANGE", routerChange);

  yield fork(initialLoad);
}
