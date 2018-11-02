// @flow

import type { User } from "../components/people";
import type { Idea } from "../components/idea";

type State = {
  +auth: ?User,
  +ideas: Array<Idea>,
  +idea: ?Idea,
  +users: Array<User>,
  +editingIdea: boolean
};

const initialState: State = {
  auth: null,
  ideas: [],
  idea: null,
  users: [],
  editingIdea: false
};

function reducer(state: State = initialState, action: any) {
  console.log("Got action", action);
  switch (action.type) {
    case "USERS_SUCCESS":
      return { ...state, users: action.data };
    case "AUTH_SUCCESS":
      return { ...state, auth: action.data };
    case "IDEAS_SUCCESS":
      return { ...state, ideas: action.data };
    case "IDEA_SUCCESS":
      return { ...state, idea: action.data };
    case "@@router/LOCATION_CHANGE":
      if (/^\/ideas\/[^\/]+\/edit$/.test(action.payload.location.pathname)) {
        return { ...state, editingIdea: true };
      } else {
        return { ...state, editingIdea: false };
      }
    default:
      console.warn("Unhandled action", action.type);
      return state;
  }
}

export default reducer;
