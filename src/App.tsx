import * as React from "react";
import GridContainer from "./components/grid/GridContainer";
import "ag-grid-enterprise";
import { Pages } from "./reducers/types";
import { IAppStateProps } from "./reducers/types";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store";
import { Route, Switch, Redirect, RouteComponentProps } from "react-router";

class App extends React.Component<IAppStateProps> {
  private gridHeight: string;

  constructor(props: IAppStateProps) {
    super(props);

    const nonGridHeight = 30; //parseInt(styles.headerHeight, 10);
    this.gridHeight = "calc(100% - " + nonGridHeight + "px)";
  }

  public render() {
    return (
      <ConnectedRouter history={history}>
        <div className="app">
          <>
            {this.renderHeader()}
            <Switch key="routerSwitch">
              <Route
                path={"/" + Pages.indexRoute}
                key={Pages.indexRoute}
                render={this.renderGrid(Pages.indexRoute)}
              />
              <Redirect to={"/" + Pages.indexRoute} />
            </Switch>
          </>
        </div>
      </ConnectedRouter>
    );
  }

  private renderHeader = () => (
    <header className="header">
      <h3 className="title">Risk Dashboard</h3>
    </header>
  );

  private renderGrid = (id: string) => (props: RouteComponentProps<any>) => {
    return (
      <GridContainer
        id={id}
        gridHeight={this.gridHeight}
        key={props.location.pathname}
        {...props}
      />
    );
  };
}

export default App;
