import { initialState } from "./state";
import { ActionTypes } from "../actions";
import { IGridAction, IGridStateProps, IRecord } from "./types";
import { LOCATION_CHANGE } from "connected-react-router";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";

initialState.grid = ((): IGridStateProps => ({
  modules: [
    ClientSideRowModelModule,
    RowGroupingModule,
    MenuModule,
    SetFilterModule,
    ColumnsToolPanelModule,
  ],
  columnDefs: [
    {
      headerName: "Product",
      field: "product",
    },
    {
      headerName: "Sector",
      field: "sector",
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "MV (USD)",
      field: "mv",
      filter: "agNumberColumnFilter",
      cellEditorParams: { showButtons: true },
    },
    {
      headerName: "Delta ADJCTS",
      field: "delta",
    },
    {
      headerName: "Gamma CTS",
      field: "gamma",
    },
    {
      headerName: "VegaUSD",
      field: "vega",
      minWidth: 120,
    },
    {
      headerName: "ThetaUSD",
      field: "theta",
    },
  ],
  autoGroupColumnDef: {
    headerName: "Group",
    minWidth: 210,
    maxWidth: 500,
    pinned: "left",
  },
  defaultColDef: {
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    sortable: true,
    filter: true,
    flex: 1,
    enableCellChangeFlash: true,
    menuTabs: ["filterMenuTab", "generalMenuTab"],
  },
  sideBar: "columns",
  getRowNodeId: (data: IRecord) => {
    if (data.product) {
      return data.product.toString();
    } else {
      throw Error("Product is null for some values");
    }
  },
  enableFilter: true,
  enableColResize: true,
  enableSorting: true,
  rowSelection: "single",
  animateRows: true,
}))();

export const grid = (state = initialState, action: IGridAction) => {
  switch (action.type) {
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
