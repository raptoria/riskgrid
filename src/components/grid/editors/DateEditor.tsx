import * as React from 'react';
import * as moment from 'moment';
import { DatePicker } from 'antd';
import { RowNode } from 'ag-grid-community';
import { IExemptionRecord } from '~/reducers/types';
import { actions } from '../../../actions';
import { store } from '../../../store';

export interface IDateEditorState {
  value: moment.Moment;
}

export interface IDateEditorProps {
  value: string;
  startDate: boolean;
  node: RowNode;
}

export default class DateEditor extends React.Component<IDateEditorProps, IDateEditorState> {
  private rowData: IExemptionRecord;

  constructor(props: IDateEditorProps) {
    super(props);

    this.state = {
      value: moment(this.props.value, 'DD/MM/YYYY')
    };
    this.rowData = this.props.node.data;
  }

  public getValue = () => this.state.value.format('DD/MM/YYYY'); //used to populate the grid after row editing is saved

  public render() {
    return (
      <DatePicker
        size="small"
        /*    disabledDate={this.props.startDate ? this.disabledStartDate : this.disabledEndDate} */
        className="gridDatePicker"
        value={this.state.value}
        onChange={this.onChange}
        defaultValue={this.state.value}
      />
    );
  }

  /*   private disabledStartDate = (startValue: moment.Moment) => {
    const state = store.getState();
    const endValue = state.dropdowns.effectiveEnd || moment(this.rowData.EffectiveEndDate, 'YYYY-MM-DD');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.isBefore(moment().startOf('day')) || (startValue.valueOf() > endValue.valueOf());
  }

  private disabledEndDate = (endValue: moment.Moment) => {
    const state = store.getState();
    const startValue = state.dropdowns.effectiveStart || moment(this.rowData.EffectiveStartDate, 'YYYY-MM-DD');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
 */
  private onChange = (event: any) => {
    const newDate = event as moment.Moment;
    this.setState({ value: newDate });
  };
}
