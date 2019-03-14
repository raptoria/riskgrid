import * as React from 'react';
import { Button } from 'antd';
import { GridApi } from 'ag-grid-community';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;

export interface INumericEditorState {
  value: number;
  highlightAllOnFocus: boolean;
}

export interface INumericEditorProps {
  charPress: any;
  keyPress: any;
  value: number;
  showButtons: boolean;
  api: GridApi;
}

export default class NumericEditor extends React.Component<
  INumericEditorProps,
  INumericEditorState
> {
  private cancelBeforeStart: any;
  private inputRef: any;

  constructor(props: INumericEditorProps) {
    super(props);

    this.inputRef = React.createRef();
    this.cancelBeforeStart =
      this.props.charPress && '1234567890'.indexOf(this.props.charPress) < 0;

    this.state = this.createInitialState(props);

    this.onKeyDown = this.onKeyDown;
    this.handleChange = this.handleChange;
  }

  public afterGuiAttached = () => {
    // get ref from React component
    const eInput = this.inputRef.current;
    if (this.state.highlightAllOnFocus) {
      this.setState({
        highlightAllOnFocus: false
      });
    } else {
      // when we started editing, we want the carot at the end, not the start.
      // this comes into play in two scenarios: a) when user hits F2 and b)
      // when user hits a printable character, then on IE (and only IE) the carot
      // was placed after the first character, thus 'apply' would end up as 'pplea'
      const length = eInput.value ? eInput.value.length : 0;
      if (length > 0) {
        eInput.setSelectionRange(length, length);
      }
    }
  };

  public focusIn() {
    this.inputRef.current.focus();
    this.inputRef.current.select();
  }

  public getValue = () => this.state.value;

  public isCancelBeforeStart = () => this.cancelBeforeStart;

  public isCancelAfterEnd = () => this.state.value > 1000000; // will reject the number if it greater than 1,000,000

  public render() {
    const buttonStyle = {
      fontSize: '12px',
      borderRadius: 0,
      marginRight: '4px'
    };
    return (
      <>
        {this.props.showButtons ? (
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '-25px',
              zIndex: 99999999
            }}
          >
            <Button size="small" type="primary" style={buttonStyle} onClick={this.onSave}>
              Save Edits
            </Button>
            <Button size="small" type="default" style={buttonStyle} onClick={this.onCancel}>
              Cancel
            </Button>
          </div>
        ) : null}
        <input
          ref={this.inputRef}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.onKeyDown}
          style={{ width: '100%', height: '26px' }}
        />
      </>
    );
  }

  private onCancel = () => {
    this.props.api.stopEditing(true);
  };

  private onSave = () => {
    this.props.api.stopEditing();
  };

  private createInitialState = (props: INumericEditorProps) => {
    let startValue;
    let highlightAllOnFocus = true;

    if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
      // if backspace or delete pressed, we clear the cell
      startValue = '';
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress;
      highlightAllOnFocus = false;
    } else {
      // otherwise we start with the current value
      startValue = props.value || '';
      if (props.keyPress === KEY_F2) {
        highlightAllOnFocus = false;
      }
    }

    return {
      value: startValue,
      highlightAllOnFocus
    };
  };

  private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  };

  private isLeftOrRight = (event: React.KeyboardEvent<HTMLInputElement>) => {
    return [37, 39].indexOf(event.keyCode) > -1;
  };

  private handleChange = (event: any) => {
    this.setState({ value: event.target.value });
  };

  private getCharCodeFromEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event = event || window.event;
    return typeof event.which === 'undefined' ? event.keyCode : event.which;
  };

  private isCharNumeric = (charStr: string) => {
    //const regexp = /^-?[0-9]*(\.{0,1}[0-9]{0,7})?$/; //for decimals
    const regexp = /^[-+]?[1-9]\d*$/;
    return regexp.test(charStr);
  };

  private isKeyPressedNumeric = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    const fullString = (event.target as any).value;
    return this.isCharNumeric(fullString + charStr);
  };

  private deleteOrBackspace = (event: React.KeyboardEvent) => {
    return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.keyCode) > -1;
  };
}
