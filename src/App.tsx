import * as React from "react";
import GridContainer from "./components/grid/GridContainer";
import { Pages } from "./reducers/types";
import { IAppStateProps } from "./reducers/types";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store";
import { Route, Switch, Redirect, RouteComponentProps } from "react-router";

const renderHeader = () => (
  <header className="header">
    <h3 className="title">Risk Dashboard</h3>
  </header>
);

const renderGrid = (id: string) => (props: RouteComponentProps<any>) => {
  const headerHeight = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--headerHeight");

  const gridHeight = `calc(100% - ${headerHeight} )`;
  return (
    <GridContainer
      id={id}
      gridHeight={gridHeight}
      key={props.location.pathname}
      {...props}
    />
  );
};

const App: React.FC<IAppStateProps> = () => {
  return (
    <ConnectedRouter history={history}>
      <div className="app">
        <>
          {renderHeader()}
          <Switch key="routerSwitch">
            <Route
              path={"/" + Pages.indexRoute}
              key={Pages.indexRoute}
              render={renderGrid(Pages.indexRoute)}
            />
            <Redirect to={"/" + Pages.indexRoute} />
          </Switch>
        </>
      </div>
    </ConnectedRouter>
  );
};

export default App;
