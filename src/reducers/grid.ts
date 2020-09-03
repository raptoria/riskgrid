import { initialState } from "./state";
import { ActionTypes } from "../actions";
import { IGridAction, IGridStateProps, IRecord } from "./types";
import { LOCATION_CHANGE } from "connected-react-router";
import NumericEditor from "../components/grid/editors/NumericEditor";
import DateEditor from "../components/grid/editors/DateEditor";

initialState.grid = ((): IGridStateProps => ({
  columnDefs: [
    {
      headerName: "Product",
      field: "product",
    },
    {
      headerName: "Sector",
      field: "sector",
    },
    {
      headerName: "MV (USD)",
      field: "mv",
      editable: true,
      filter: "agNumberColumnFilter",
      cellEditorParams: { showButtons: true },
    },
    {
      headerName: "Delta ADJCTS",
      field: "delta",
      editable: true,
    },
    {
      headerName: "Gamma CTS",
      field: "gamma",
      editable: true,
    },
    {
      headerName: "VegaUSD",
      field: "vega",
      editable: true,
      minWidth: 120,
    },
    {
      headerName: "ThetaUSD",
      field: "theta",
    },
  ],
  autoGroupColumnDef: {
    headerName: "",
    minWidth: 210,
    maxWidth: 500,
    pinned: "left",
  },
  defaultColDef: {
    //minWidth: 90,
    //maxWidth: 200,
    enableCellChangeFlash: true,
    menuTabs: ["filterMenuTab", "generalMenuTab"],
  },
  getRowNodeId: (data: IRecord) => {
    if (data.athlete) {
      return data.athlete.toString();
    } else {
      throw Error("Athlete is null for some values");
    }
  },
  deltaRowDataMode: true,
  enableFilter: true,
  enableColResize: true,
  enableSorting: true,
  editType: "fullRow",
  frameworkComponents: {
    numericEditor: NumericEditor,
    dateEditor: DateEditor,
  },
  rowSelection: "single",
  animateRows: true,
}))();

export const grid = (state = initialState, action: IGridAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_INSERT_UPDATE_RECORD:
      const gridData: Array<IRecord> = JSON.parse(
        JSON.stringify((state as any).gridData)
      );
      const newRecord: IRecord = action.payload as IRecord;
      const existingIndex: number = gridData.findIndex(
        (record: IRecord) => record.athlete === newRecord.athlete
      );
      if (existingIndex !== -1) {
        console.log("inside reducer splicing gridData", newRecord);
        gridData.splice(existingIndex, 1, newRecord); //this causes weird data mismatch during editing. waiting for AG-2542 fix
      } else {
        gridData.push(newRecord);
      }
      return Object.assign({}, state, {
        gridData,
        error: null,
        createExemptionData: [{}],
      });
    case ActionTypes.RECEIVE_GRID_DATA:
      return Object.assign({}, state, { gridData: action.payload });
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
