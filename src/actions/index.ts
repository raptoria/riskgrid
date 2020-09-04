import { IGridAction, IAction, IRecord } from "../reducers/types";

export const ActionTypes = {
  RECEIVE_ERROR: "receiveError",
  REQUEST_GRID_DATA: "requestGridData",
  RECEIVE_GRID_DATA: "receiveGridData",
  CHANGE_TABS: "changeTabs",
  REQUEST_INSERT_UPDATE_RECORD: "requestInsertUpdateRecord",
  RECEIVE_INSERT_UPDATE_RECORD: "receiveInsertUpdateRecord",
};

export const actions: IAction = {
  receiveError: (error: string) => ({ type: ActionTypes.RECEIVE_ERROR, error }),
  requestGridData: (data: IGridAction) => ({
    ...data,
    type: ActionTypes.REQUEST_GRID_DATA,
  }),
  receiveGridData: (data: IGridAction) => ({
    type: ActionTypes.RECEIVE_GRID_DATA,
    payload: data,
  }),
  changeTabs: (data: string) => ({ type: ActionTypes.CHANGE_TABS, data }),
  requestInsertUpdateRecord: (data: IRecord) => ({
    type: ActionTypes.REQUEST_INSERT_UPDATE_RECORD,
    payload: data,
  }),
  receiveInsertUpdateRecord: (data: IRecord) => ({
    type: ActionTypes.RECEIVE_INSERT_UPDATE_RECORD,
    payload: data,
  }),
};
