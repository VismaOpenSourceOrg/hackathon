// @flow

import type { User } from "../components/user";
import type { Idea } from "../components/idea";

type State = {
  +auth: ?User,
  +ideas: Array<Idea>,
  +users: Array<User>
};

const initialState: State = {
  auth: null,
  ideas: [],
  users: []
};

function reducer(state: State = initialState, action: any) {
  console.log("Got action", action);
  switch (action.type) {
    case "USERS_SUCCESS":
      return { ...state, users: action.data };
    case "AUTH_SUCCESS":
      return { ...state, auth: action.data };
    case "IDEA_SUCCESS":
      return { ...state, ideas: action.data };
    default:
      return state;
  }
}

export default reducer;
