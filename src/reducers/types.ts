import { ColDef } from "@ag-grid-community/core";
import { GridOptions, Module } from "@ag-grid-community/core";
import { ActionCreatorsMapObject, ActionCreator, AnyAction } from "redux";

export interface IRootState {
  grid: any;
  app: any;
  router?: any;
}

export interface IGridAction extends IRootAction {}

export interface IAction extends ActionCreatorsMapObject<any> {
  receiveError: ActionCreator<any>;
  requestGridData: ActionCreator<any>;
  receiveGridData: ActionCreator<any>;
  receiveInsertUpdateRecord: ActionCreator<any>;
  requestInsertUpdateRecord: ActionCreator<any>;
}

export interface IGridStateProps extends GridOptions {
  columnDefs: Array<ColDef>;
  gridData?: any;
  error?: string;
  modules?: Array<Module>;
  sideBar: string;
}

export interface IRootAction extends AnyAction {
  error?: string;
  payload?: {};
}

export interface IDispatchProps {
  actions: IAction;
}

export interface IRecord {
  product: string;
  sector: string;
  mv: number;
  delta: number;
  gamma: string;
  vega: string;
  theta: string;
}

export interface IAppStateProps {}

declare global {
  interface IWindow extends Window {
    CONFIG_ENV?: string;
  }
}

export enum Pages {
  indexRoute = "index",
}
