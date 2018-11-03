// @flow

import type { User, Idea, Hackathon } from "../common/types";

type State = {
  +auth: ?User,
  +ideas: Array<Idea>,
  +idea: ?Idea,
  +users: Array<User>,
  +editingIdea: boolean,
  +activeHackathon: ?Hackathon
};

const initialState: State = {
  auth: null,
  ideas: [],
  idea: null,
  users: [],
  editingIdea: false,
  activeHackathon: null
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
    case "ACTIVE_HACKATHON_SUCCESS":
      return { ...state, activeHackathon: action.data };
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
