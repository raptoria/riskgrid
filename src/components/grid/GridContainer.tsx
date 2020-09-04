import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../actions";
import { AgGridReact } from "@ag-grid-community/react";
import { IGridStateProps } from "../../reducers/types";
import { IRootState, IDispatchProps } from "../../reducers/types";
import { Alert } from "antd";
import {
  GridReadyEvent,
  GetMainMenuItemsParams,
} from "@ag-grid-community/core";
import { RouteComponentProps } from "react-router";

export interface IGridProps extends RouteComponentProps<any> {
  gridHeight: string;
  id: string;
}

const onGridReady = (params: GridReadyEvent) => {
  //params.columnApi?.autoSizeAllColumns();
  params.api?.sizeColumnsToFit(); //do this for window onResize later
};

const getMainMenuItems = (params: GetMainMenuItemsParams) => {
  const itemsToExclude = ["resetColumns", "valueAggSubMenu", "separator"];
  const newItems = params.defaultItems.filter(
    (item: any) => itemsToExclude.indexOf(item) === -1
  );
  return newItems;
};

const Grid: React.FC<IGridProps & IGridStateProps & IDispatchProps> = ({
  actions,
  gridHeight,
  error,
  gridData,
  modules,
  columnDefs,
  autoGroupColumnDef,
  sideBar,
  defaultColDef,
}) => {
  useEffect(() => {
    actions.requestGridData();
  }, [actions]);

  return (
    <div
      style={{
        height: gridHeight,
        width: "100%",
        boxSizing: "border-box",
      }}
      className="ag-theme-alpine"
    >
      {error ? <Alert type="error" showIcon={true} message={error} /> : null}
      {gridData ? (
        <AgGridReact
          modules={modules}
          columnDefs={columnDefs}
          rowData={gridData}
          onGridReady={onGridReady}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          getMainMenuItems={getMainMenuItems}
          sideBar={sideBar}
        />
      ) : null}
    </div>
  );
};

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
