import React, { Component } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend
} from "bizcharts";

import DataSet from "@antv/data-set";
import { CallAnalysis } from "../../data";
import { Empty } from "antd";

export interface CrmBarChartProps {
  data: CallAnalysis;
  type: string;
  title?: React.ReactNode;
  height?: number;
  forceFit?: boolean;
}

interface CrmBarChartState {
}

class CrmBarChart extends Component<CrmBarChartProps, CrmBarChartState> {
  render() {
    const { type, data, height = 400 } = this.props;
    if (data) {
      data.signNum = parseInt(data.signNum + '');
      data.createNum = parseInt(data.createNum + '');
      data.connectNum = parseInt(data.connectNum + '');
      data.callOutNum = parseInt(data.callOutNum + '');
      var barData = [];
      barData.push({
        country: "签单量",
        population: data.signNum
      });
      barData.push({
        country: "建单量",
        population: data.createNum
      });
      barData.push({
        country: "接听量",
        population: data.connectNum
      });

      if (type === "normal") {
        barData.push({
          country: "来电量",
          population: data.callOutNum
        });
      } else if (type === "dialout") {
        barData.push({
          country: "呼出量",
          population: data.callOutNum
        });
      }

      const ds = new DataSet();
      const dv = ds.createView().source(barData);
      dv.source(barData).transform({
        type: "sort",
        callback(a, b) {
          // 排序依据，和原生js的排序callback一致
          return a.population - b.population > 0;
        }
      });
      return (
        <div>
          {
            (barData && barData.length > 0) ?
              <Chart height={height} data={dv} forceFit animate>
                <Coord transpose />
                <Axis
                  name="country"
                  label={{
                    offset: 12
                  }}
                />
                <Axis name="population" />
                <Legend />
                <Tooltip crosshairs={{ type: 'rect' }} showTitle={false} />
                <Geom type="interval" position="country*population" color="country" />
              </Chart> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </div>
      );
    }
    else {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    }
  }
}

export default CrmBarChart;
