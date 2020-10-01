import { initialState } from "../state/state";
import { ActionTypes } from "../actions";
import { IGridAction } from "./types";
import { LOCATION_CHANGE } from "connected-react-router";
import { getSummaryData } from "../components/grid/renderers";

export const grid = (state = initialState, action: IGridAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_GRID_DATA:
      return Object.assign({}, state, {
        rowData: action.payload,
        pinnedTopRowData: getSummaryData(action.payload),
      });
    case ActionTypes.RECEIVE_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        preventDataSourceUpdate: true,
        lastRow: null,
        preventUpdates: false,
      });
    case LOCATION_CHANGE:
      return Object.assign({}, state, { preventUpdates: false });
    default:
      return state;
  }
};
