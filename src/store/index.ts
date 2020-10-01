import { Store, createStore, applyMiddleware, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createRootReducer from "../reducers";
import { IRootState } from "../reducers/types";
import { createEpicMiddleware } from "redux-observable";
import combinedGridEpics from "../actions/gridEpics";
import { initialState } from "../state/state";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { loadState } from "../connectivity/localStorage";
import { routeChangeMiddleware } from "../middleware";

export const history = createBrowserHistory();
const epicMiddleware = createEpicMiddleware();

export function configureStore(state?: IRootState): Store<IRootState> {
  let middleware = applyMiddleware(
    routeChangeMiddleware,
    routerMiddleware(history),
    epicMiddleware
  );

  if ((window as IWindow).CONFIG_ENV !== "prod") {
    middleware = composeWithDevTools(middleware);
  }

  const persistedState = loadState();
  const combinedState = Object.assign({}, state as IRootState, persistedState);
  const newStore = createStore(
    createRootReducer(history) as Reducer<IRootState>,
    combinedState,
    middleware
  ) as Store<IRootState>;

  epicMiddleware.run(combinedGridEpics);

  if (module.hot) {
    module.hot.accept("../reducers", () => {
      const nextReducer = require("../reducers");
      newStore.replaceReducer(nextReducer);
    });
  }

  return newStore;
}

export const store = configureStore(initialState);
