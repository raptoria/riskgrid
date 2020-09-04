import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../actions";
import { AgGridReact } from "@ag-grid-community/react";
import { IGridStateProps } from "../../reducers/types";
import { IRootState, IDispatchProps } from "../../reducers/types";
import { Alert } from "antd";
import {
  GridReadyEvent,
  GridApi,
  ColumnApi,
  GetMainMenuItemsParams,
} from "@ag-grid-community/core";
import { RouteComponentProps } from "react-router";

export interface IGridProps extends RouteComponentProps<any> {
  gridHeight: string;
  id: string;
}

class Grid extends React.Component<
  IGridProps & IGridStateProps & IDispatchProps,
  {}
> {
  private gridApi: GridApi | null;
  private columnApi: ColumnApi | null;

  constructor(props: IGridProps & IGridStateProps & IDispatchProps) {
    super(props);

    this.gridApi = null;
    this.columnApi = null;
  }

  public componentDidMount() {
    this.props.actions.requestGridData();
  }

  public render() {
    return (
      <div
        style={{
          height: this.props.gridHeight,
          width: "100%",
          boxSizing: "border-box",
        }}
        className="ag-theme-alpine"
      >
        {this.props.error ? (
          <Alert type="error" showIcon={true} message={this.props.error} />
        ) : null}
        {this.props.gridData ? (
          <AgGridReact
            modules={this.props.modules}
            columnDefs={this.props.columnDefs}
            rowData={this.props.gridData}
            onGridReady={this.onGridReady}
            autoGroupColumnDef={this.props.autoGroupColumnDef}
            defaultColDef={this.props.defaultColDef}
            getMainMenuItems={this.getMainMenuItems}
            sideBar={this.props.sideBar}
          />
        ) : null}
      </div>
    );
  }

  private onGridReady = (params: GridReadyEvent) => {
    const id = this.props.id;

    if (id && params.api && params.columnApi) {
      this.columnApi = params.columnApi;
      this.gridApi = params.api;
      //this.columnApi.autoSizeAllColumns();
      this.gridApi?.sizeColumnsToFit(); //do this for window onResize later
      console.log("onGridReady");
    }
  };

  private getMainMenuItems = (params: GetMainMenuItemsParams) => {
    const itemsToExclude = ["resetColumns", "valueAggSubMenu", "separator"];
    const newItems = params.defaultItems.filter(
      (item: any) => itemsToExclude.indexOf(item) === -1
    );
    return newItems;
  };
}

const mapStateToProps = (state: IRootState): IGridStateProps => ({
  gridData: state.grid.gridData,
  columnDefs: state.grid.columnDefs,
  autoGroupColumnDef: state.grid.autoGroupColumnDef,
  defaultColDef: state.grid.defaultColDef,
  error: state.grid.error,
  modules: state.grid.modules,
  sideBar: state.grid.sideBar,
});

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  actions: bindActionCreators(actions, dispatch),
});
const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);

export default GridContainer;
