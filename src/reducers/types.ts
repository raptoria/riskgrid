import { ColDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { ActionCreatorsMapObject, ActionCreator, AnyAction } from 'redux';

export interface IRootState {
  grid: any;
  app: any;
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
  gridData: any;
  error?: string;
}

export interface IRootAction extends AnyAction {
  error?: string;
  payload?: {};
}

export interface IDispatchProps {
  actions: IAction;
}

export interface IRecord {}

export interface IAppStateProps {}

declare global {
  interface IWindow extends Window {
    CONFIG_ENV?: string;
  }
}

export enum Pages {
  indexRoute = 'index'
}
