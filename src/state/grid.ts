import { IGridStateProps, IRecord } from "../reducers/types";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import {
  negativeNumRenderer,
  uppercaseRenderer,
  summaryRow,
} from "../components/grid/renderers";

export const grid: IGridStateProps = {
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
      cellRenderer: "uppercaseRenderer",
    },
    {
      headerName: "Sector",
      field: "sector",
      rowGroup: true,
      hide: true,
      cellRenderer: "uppercaseRenderer",
    },
    {
      headerName: "MV (USD)",
      field: "mv",
      filter: "agNumberColumnFilter",
      cellRenderer: "negativeNumRenderer",
    },
    {
      headerName: "Delta ADJCTS",
      field: "delta",
      cellRenderer: "negativeNumRenderer",
    },
    {
      headerName: "Gamma CTS",
      field: "gamma",
      cellRenderer: "negativeNumRenderer",
    },
    {
      headerName: "Vega USD",
      field: "vega",
      cellRenderer: "negativeNumRenderer",
    },
    {
      headerName: "Theta USD",
      field: "theta",
      cellRenderer: "negativeNumRenderer",
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
    resizable: true,
    enableCellChangeFlash: true,
    menuTabs: ["filterMenuTab", "generalMenuTab"],
    pinnedRowCellRenderer: "summaryRow",
  },
  sideBar: "columns",
  frameworkComponents: {
    negativeNumRenderer,
    uppercaseRenderer,
    summaryRow,
  },
  getRowNodeId: (data: IRecord) => {
    if (data.product) {
      return data.product.toString();
    } else {
      throw Error("Product is null for some values");
    }
  },
  rowSelection: "single",
  animateRows: true,
};
