import { ajax } from "rxjs/ajax";
import { ActionsObservable, ofType, combineEpics } from "redux-observable";
import { of } from "rxjs";
import { takeUntil, switchMap, catchError, map } from "rxjs/operators";
import { ActionTypes, actions } from "./";
import { IGridAction } from "../reducers/types";
import { Services } from "../connectivity/services";
import moment from "moment";

const serviceHost = Services.serviceHosts[Services.env];

const requestGridDataEpic = (action$: ActionsObservable<any>) =>
  action$.ofType(ActionTypes.REQUEST_GRID_DATA).pipe(
    switchMap((action: IGridAction) => {
      return ajax({
        method: "GET",
        url:
          "https://raw.githubusercontent.com/raptoria/editablegrid/master/src/assets/data/risk.json",
        //headers: Services.headers,
        //body: action.payload,
        //withCredentials: true,
        responseType: "json",
      }).pipe(
        map((data: any) => actions.receiveGridData(data.response)),
        catchError((error: any) => {
          return of(
            actions.receiveError(
              error.response
                ? error.response.Message
                : "Error retrieving grid data"
            )
          );
        }),
        takeUntil(action$.pipe(ofType(ActionTypes.CHANGE_TABS)))
      );
    })
  );

const updateOrInsertRecordEpic = (action$: ActionsObservable<any>) =>
  action$.ofType(ActionTypes.REQUEST_INSERT_UPDATE_RECORD).pipe(
    switchMap((action: IGridAction) => {
      const newRecord = Object.assign(action.payload, {
        modified: moment().format("DD/MM/YYYY"),
      });
      console.log("updateOrInsert: ", newRecord);
      //normally this would be an AJAX POST that would return a similar object
      return of(actions.receiveInsertUpdateRecord(newRecord));
    })
  );

export default combineEpics(requestGridDataEpic, updateOrInsertRecordEpic);
