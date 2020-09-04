import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
  Guide
} from "bizcharts";

import { DataSet } from '@antv/data-set';
import { MyPerformance } from '../../data.d';
import { Empty } from 'antd';
// import styles from './index.less';

export interface CrmChartProps {
  title?: React.ReactNode;
  height?: number;
  padding?: [number, number, number, number];
  hasLegend?: boolean;
  data: MyPerformance;
  colors?: string[];
  animate?: boolean;
  forceFit?: boolean;
  tickCount?: number;
  style?: React.CSSProperties;
}

class CrmChart extends Component<CrmChartProps> {
  componentDidMount() {

  }

  render() {
    const { data } = this.props;

    if (data === undefined || data == null || data.finish_percent === undefined || data.finish_percent == null) {
      return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
    } else {
      const { DataView } = DataSet;
      const { Html } = Guide;

      const finish_order_num = data.finish_order_num ? data.finish_order_num : 0;
      const target_order_num = data.target_order_num ? data.target_order_num : 0;
      const finish_money = data.finish_money ? data.finish_money : 0;
      const target_money = data.target_money ? data.target_money : 0;

      const tempData = [
        {
          item: '已建单 ' + finish_order_num,
          count: finish_order_num
        },
        {
          item: "目标 " + target_order_num,
          count: target_order_num - finish_order_num
        },
        // {
        //   item: `已完成3 ${data.finish_money_txt ? data.finish_money_txt : "0"}`,
        //   count: 45
        // },
        // {
        //   item: `目标4 ${data.target_money_txt ? data.target_money_txt : "0"}`,
        //   count: 100
        // }
      ];

      const dv = new DataView();

      dv.source(tempData).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent"
      });

      const cols = {
        percent: {
          formatter: val => {
            val = val * 100 + "%";
            return val;
          }
        }
      };

      const {
        height = 350,
        padding = [40, 50, 40, 40] as [number, number, number, number],
      } = this.props;

      const percent_txt = `<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>已完成&nbsp;${data.finish_percent}</div>`;

      return (
        <div>
          <Chart
            height={height}
            data={dv}
            scale={cols}
            padding={padding}
            forceFit
          >
            <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
            <Axis name="percent" />
            <Legend
              position="right"
              offsetY={-height / 2 + 120}
              offsetX={-100}
              clickable={false}
            />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}</li>"
            />
            <Guide>
              <Html
                // position={["50%", "50%"]}
                offsetY={0}
                offsetX={150}
                alignX="middle"
                alignY="middle"
                html="<div style=&quot;width:100px;height:100px;background-color:red&quot;>adfadfasdfasdf</div>"
              />
              <Html
                position={["50%", "50%"]}
                html={percent_txt}
                alignX="middle"
                alignY="middle"
              />
            </Guide>
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  percent = percent * 100 + "%";
                  return {
                    name: item,
                    value: percent
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
            </Geom>
          </Chart>
        </div>
      );
    }
  }
}

export default CrmChart;
