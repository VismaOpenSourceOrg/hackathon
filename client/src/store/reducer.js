// @flow

import type { User, Idea, Hackathon, Comment } from "../common/types";

type State = {
  +auth: ?User,
  +ideas: Array<Idea>,
  +idea: ?Idea,
  +comments: ?Array<Comment>,
  +users: Array<User>,
  +editingIdea: boolean,
  +activeHackathon: ?Hackathon
};

const initialState: State = {
  auth: null,
  ideas: [],
  idea: null,
  comments: null,
  users: [],
  editingIdea: false,
  activeHackathon: null
};

function reducer(state: State = initialState, action: any) {
  switch (action.type) {
    case "USERS_SUCCESS":
      return { ...state, users: action.data };
    case "AUTH_SUCCESS":
      return { ...state, auth: action.data };
    case "IDEAS_SUCCESS":
      return { ...state, ideas: action.data };
    case "IDEA_SUCCESS":
      return { ...state, idea: action.data };
    case "COMMENTS_SUCCESS":
      return { ...state, comments: action.data };
    case "ACTIVE_HACKATHON_SUCCESS":
      return { ...state, activeHackathon: action.data };
    case "@@router/LOCATION_CHANGE":
      if (/^\/ideas\/[^\/]+\/edit$/.test(action.payload.location.pathname)) {
        return { ...state, editingIdea: true };
      } else {
        return { ...state, editingIdea: false };
      }
    default:
      return state;
  }
}

export default reducer;
