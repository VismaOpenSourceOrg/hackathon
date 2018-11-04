// @flow

import { takeEvery, call, put, fork, select, all } from "redux-saga/effects";
import { push } from "connected-react-router";

import ideaDetailsSaga from "../IdeaDetails/IdeaDetails.saga";
import ideaListSaga from "../IdeaList/IdeaList.saga";
import peopleListSaga from "../PeopleList/PeopleList.saga";

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

function* initialLoad(): * {
  yield put({ type: "AUTH_REQUESTED" });
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

  if (pathname === "/ideas") {
    yield put({ type: "IDEAS_REQUESTED" });
    yield put({ type: "ACTIVE_HACKATHON_REQUESTED" });
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
    yield put({ type: "COMMENTS_REQUESTED", uuid });
  }
}

export default function*(): any {
  yield takeEvery("AUTH_REQUESTED", fetchAuth);

  yield takeEvery("AUTH_SUCCESS", authSuccess);
  yield takeEvery("AUTH_FAILURE", authFailure);

  yield takeEvery("@@router/LOCATION_CHANGE", routerChange);

  yield all(ideaDetailsSaga.concat(ideaListSaga).concat(peopleListSaga));

  yield fork(initialLoad);
}
