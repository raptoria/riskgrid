import { ActionTypes } from "../actions";
import { combineReducers } from "redux";
import { grid } from "./grid";
import { IGridAction } from "./types";
import { initialState } from "../state/state";
import { History } from "history";
import { connectRouter } from "connected-react-router";

export const app = (state = initialState, action: IGridAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ERROR:
      return Object.assign({}, state, { error: action.error });
    default:
      return state;
  }
};

const createRootReducer = (history: History) =>
  combineReducers({
    app,
    grid,
    router: connectRouter(history),
  });

export default createRootReducer;
