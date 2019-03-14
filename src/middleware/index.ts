import { LOCATION_CHANGE } from 'connected-react-router';
import { Middleware, Dispatch } from 'redux';
import { Pages, IRootAction } from '../reducers/types';
import { RouteComponentProps } from 'react-router';

export let prevPathname = '';

export const routeChangeMiddleware: Middleware = () => (
  next: Dispatch<IRootAction>
) => (action: any) => {
  if (action.type === LOCATION_CHANGE) {
    const activeRoute = action.payload.location.pathname.replace('/', '');
    const newAction = {
      ...action,
      payload: {
        ...action.payload,
        prevPathname,
        activeRoute: activeRoute === '' ? Pages.indexRoute : activeRoute
      }
    };
    prevPathname = action.payload
      ? (action.payload as RouteComponentProps<any, any, any>).location.pathname
      : '/';
    return next(newAction);
  }
  return next(action);
};
