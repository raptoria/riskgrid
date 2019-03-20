import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../actions';
import { AgGridReact } from 'ag-grid-react';
import { IGridStateProps } from '../../reducers/types';
import { IRootState, IDispatchProps, IRecord } from '../../reducers/types';
import { Alert } from 'antd';
import {
  GridReadyEvent,
  GridApi,
  ColumnApi,
  GetMainMenuItemsParams,
  RowEditingStoppedEvent,
  RowEditingStartedEvent,
  CellFocusedEvent
} from 'ag-grid-community';
import { RouteComponentProps } from 'react-router';
import { ColDef } from 'ag-grid-community/dist/lib/entities/colDef';
import {
  DynamicComponentParams,
  DynamicComponentDef
} from 'ag-grid-community/dist/lib/components/framework/componentResolver';

export interface IGridProps extends RouteComponentProps<any> {
  gridHeight: string;
  id: string;
}

class Grid extends React.Component<IGridProps & IGridStateProps & IDispatchProps, {}> {
  private gridApi: GridApi|null;
  private columnApi: ColumnApi|null;
  private rowBeingEdited: IRecord|null;
  private editingRowIndex: number | null;
  constructor(props: IGridProps & IGridStateProps & IDispatchProps) {
    super(props);
    this.editingRowIndex = null;
    this.gridApi = null;
    this.columnApi = null;
    this.rowBeingEdited = null;
  }

  public componentDidMount() {
    this.props.actions.requestGridData();
  }

  public render() {
    console.log('re-rendered ' + this.props.id);
    return (
      <div
        style={{
          height: this.props.gridHeight,
          width: '100%',
          boxSizing: 'border-box'
        }}
        className="ag-theme-balham"
      >
        {this.props.error ? <Alert type="error" showIcon={true} message={this.props.error} /> : null}
        {this.props.gridData ? (
          <AgGridReact
            columnDefs={this.mapColumns(this.props.columnDefs)}
            rowData={this.props.gridData}
            onGridReady={this.onGridReady}
            autoGroupColumnDef={this.props.autoGroupColumnDef}
            defaultColDef={this.props.defaultColDef}
            enableFilter={true}
            getMainMenuItems={this.getMainMenuItems}
            editType={this.props.editType}
            frameworkComponents={this.props.frameworkComponents}
            onRowEditingStarted={this.onRowEditingStarted}
            onRowEditingStopped={this.onRowEditingStopped}
            rowSelection={this.props.rowSelection}
            onCellFocused={this.onCellFocused}
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
      this.columnApi.autoSizeAllColumns();
      console.log('onGridReady');
    }
  };

  private onCellFocused = (event: CellFocusedEvent) => {
    console.log('onCellFocused ' + event.rowIndex);
    if (this.gridApi && this.editingRowIndex !== null && this.editingRowIndex !== event.rowIndex) {
      //user clicked into a different row
      console.log('stop editing!');
      this.revertGridRow(false);
    }
  };

  private revertGridRow = (hasMissingFields: boolean) => {
    if (this.editingRowIndex === null) {
      return;
    }
    const selectedNode: null | any = this.gridApi ? this.gridApi.getDisplayedRowAtIndex(this.editingRowIndex) : null;
    if (selectedNode && this.rowBeingEdited && this.gridApi) {
      console.log('reverting row to old data', this.rowBeingEdited);
      //selectedNode.setData(this.rowBeingEdited);
      this.gridApi.stopEditing(true); //throw away any edits
      this.editingRowIndex = null;
      this.props.actions.receiveInsertUpdateRecord(this.rowBeingEdited);
    }
  };

  private onRowEditingStarted = (event: RowEditingStartedEvent) => {
    this.editingRowIndex = event.rowIndex;
    console.log('onRowEditingStarted ' + event.rowIndex);
    const newRecord = event.data as IRecord;
    const newRecordCopy = JSON.parse(JSON.stringify(newRecord).replace(/null/g, '""')); //deep copy, no pesky internal refs
    delete newRecordCopy.modified;
    this.rowBeingEdited = newRecordCopy;
  };

  private onRowEditingStopped = (event: RowEditingStoppedEvent) => {
    console.log('row editing stopped');
    const newRecord = event.data as IRecord;
    const newRecordCopy = JSON.parse(JSON.stringify(newRecord));
    delete newRecordCopy.modified;

    if (
      this.editingRowIndex === null ||
      JSON.stringify(this.rowBeingEdited) === JSON.stringify(newRecordCopy)
    ) {
      console.log('nothing was saved to DB');
      return; //user hit cancel or focused a new cell, so don't save any changes
    }

    console.log('new record was saved to DB');
    this.editingRowIndex = null;
    this.props.actions.requestInsertUpdateRecord(newRecord);
  };

  private mapColumns = (columnDefs: ColDef[]) => {
    for (const column of columnDefs) {
      column.cellEditorSelector = (params: DynamicComponentParams): DynamicComponentDef => {
        if (
          (params.column && params.column.getColId() === 'age') ||
          (params.column && params.column.getColId() === 'year')
        ) {
          return {
            component: 'numericEditor'
          };
        }

        if (params.column && params.column.getColId() === 'date') {
          return {
            component: 'dateEditor'
          };
        }

        return {};
      };
    }
    return columnDefs;
  };

  private getMainMenuItems = (params: GetMainMenuItemsParams) => {
    const itemsToExclude = ['resetColumns', 'valueAggSubMenu', 'separator'];
    const newItems = params.defaultItems.filter((item: any) => itemsToExclude.indexOf(item) === -1);
    return newItems;
  };
}

const mapStateToProps = (state: IRootState): IGridStateProps => ({
  gridData: state.grid.gridData,
  columnDefs: state.grid.columnDefs,
  autoGroupColumnDef: state.grid.autoGroupColumnDef,
  defaultColDef: state.grid.defaultColDef,
  error: state.grid.error,
  editType: state.grid.editType,
  frameworkComponents: state.grid.frameworkComponents,
  rowSelection: state.grid.rowSelection
});

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  actions: bindActionCreators(actions, dispatch)
});
const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
