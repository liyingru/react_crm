import React, { Component } from 'react';
import {
  G2,
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  Legend
} from "bizcharts";
import { SalesFunnel } from '../../data';
import { Empty } from 'antd';

export interface CrmFunnelProps {
  title?: React.ReactNode;
  width?: number;
  height?: number;
  padding?: [number, number, number, number];
  hasLegend?: boolean;
  data: SalesFunnel;
  colors?: string[];
  animate?: boolean;
  forceFit?: boolean;
  tickCount?: number;
  style?: React.CSSProperties;

}

interface CrmFunnelState {
}


class CrmFunnel extends Component<CrmFunnelProps, CrmFunnelState> {

  componentDidMount() {
  }

  componentDidUpdate(preProps: CrmFunnelProps) {
  }

  render() {
    const {
      data,
      width = 450,
      height = 350,
      padding = [60, 120, 95, 60] as [number, number, number, number],
    } = this.props;

    if (data.leads && data.requirement && data.order && data.sign_order) {
      let funnelData = [
        {
          title: "线索",
          count: data.leads.count ? data.leads.count : 0,
          items: data.leads.items
        },
        {
          title: "建单",
          count: data.requirement.count ? data.requirement.count : 0,
          items: data.requirement.items
        },
        {
          title: "订单",
          count: data.order.count ? data.order.count : 0,
          items: data.order.items
        },
        {
          title: "签单",
          count: data.sign_order.count ? data.sign_order.count : 0,
          items: data.sign_order.items
        }
      ];

      const cols = {
        percent: {
          nice: false
        }
      };

      const colors = ["#0050B3", "#1890FF", "#40A9FF", "#69C0FF", "#BAE7FF"];

      var leadsDetals = '';
      data.leads.items && data.leads.items.map((item, index) => (
        leadsDetals += `<li data-index=${index}><span style="background-color:${colors[index]};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>${item.name}: ${item.val}</li>`
      ));

      var requirementDetals = '';
      data.requirement.items && data.requirement.items.map((item, index) => (
        requirementDetals += `<li data-index=${index}><span style="background-color:${colors[index]};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>${item.name}: ${item.val}</li>`
      ));

      var orderDetals = '';
      data.order.items && data.order.items.map((item, index) => (
        orderDetals += `<li data-index=${index}><span style="background-color:${colors[index]};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>${item.name}: ${item.val}</li>`
      ));

      var sign_orderDetals = '';
      data.sign_order.items && data.sign_order.items.map((item, index) => (
        sign_orderDetals += `<li data-index=${index}><span style="background-color:${colors[index]};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>${item.name}: ${item.val}</li>`
      ));

      const tooltipCfg = {
        custom: true,
        containerTpl: '<div class="g2-tooltip">'
          + '<div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>'
          + '<div class="g2-tooltip-list"></div>'
          + '</div>',
        itemTpl: `<ul>{items}</ul>`
      };

      return (
        <div>
          <Chart
            width={width}
            height={height}
            data={funnelData}
            scale={cols}
            padding={padding}
            forceFit
          >
            <Tooltip {...tooltipCfg} />
            <Coord type="rect" transpose scale={[1, -1]} />
            <Legend />
            <Geom
              type="intervalSymmetric"
              position="title*count*items"
              shape="pyramid"
              color={[
                "title",
                ["#0050B3", "#1890FF", "#40A9FF", "#69C0FF", "#BAE7FF"]
              ]}
              tooltip={['title*count*items', (title, count) => {
                if (title === '线索') {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: 'funnel',
                    title: title,
                    count: count,
                    items: leadsDetals
                  };
                }
                else if (title === '建单') {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: 'funnel',
                    title: title,
                    count: count,
                    items: requirementDetals
                  };
                }
                else if (title === '订单') {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: 'funnel',
                    title: title,
                    count: count,
                    items: orderDetals
                  };
                }
                else {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: 'funnel',
                    title: title,
                    count: count,
                    items: sign_orderDetals
                  };
                }
              }]}
            >
              <Label
                content={[
                  "title*count*items",
                  (title, count) => {
                    return title + " " + count;
                  }
                ]}
                offset={35}
                labeLine={{
                  lineWidth: 1,
                  stroke: "rgba(0, 0, 0, 0.15)"
                }}
              />

            </Geom>
          </Chart>
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

export default CrmFunnel;
