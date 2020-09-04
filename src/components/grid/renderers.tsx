import React from "react";
import { IRecord } from "../../reducers/types";
import { ICellRendererParams } from "@ag-grid-community/core";

export const negativeNumRenderer: React.FC<ICellRendererParams> = ({
  value,
}) => <span className={parseInt(value) < 0 ? "negative" : ""}>{value}</span>;

export const uppercaseRenderer: React.FC<ICellRendererParams> = ({ value }) => (
  <span>{value ? value.toUpperCase() : value}</span>
);

export const summaryRow: React.FC<ICellRendererParams> = ({ value }) => (
  <span className="summary">{value}</span>
);

export const getSummaryData = (data: Array<IRecord>) => {
  let mv: number = 0;
  let delta: number = 0;
  let gamma: number = 0;
  let vega: number = 0;
  let theta: number = 0;

  data.forEach((record: IRecord) => {
    delta += record.delta;
    gamma += record.gamma;
    vega += record.vega;
    theta += record.theta;
  });
  return [
    {
      product: "TOTAL",
      sector: null,
      mv,
      delta,
      gamma,
      vega,
      theta,
    },
  ];
};
