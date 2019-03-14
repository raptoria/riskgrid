import 'string.prototype.startswith'; //For IE compatibility this must be first
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppContainer from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import 'antd/dist/antd.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './assets/styles/vendor.css';
import './assets/styles/main.css';

ReactDOM.render(
  navigator.userAgent.indexOf('Chrome') > -1 ? (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  ) : (
    <h2 style={{ color: '#1890ff', padding: '5px' }}>
      This app is optimized for Google Chrome. Please switch browsers.
    </h2>
  ),
  document.getElementById('root') as HTMLElement
);
