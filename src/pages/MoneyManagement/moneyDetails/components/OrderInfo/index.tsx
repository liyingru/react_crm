import { FormComponentProps } from 'antd/es/form';
import React, { Component} from 'react';
import { Form } from 'antd';
import {OrderData} from '../../data'
import styles from './index.less'

interface OrderInfoProps extends FormComponentProps {
  loading: boolean;
  customerId: string;
  orderInfo:Partial<OrderData>;
}

interface OrderInfoState {
  // orderList: OrderData[];
}

class OrderInfo extends Component<OrderInfoProps, OrderInfoState> {
  state: OrderInfoState = {
  }

  render() {
    const {orderInfo} = this.props;
    const attrs = [{
        name:'创建时间：',
        value:orderInfo.create_time
    },{
        name:'订单编号：',
        value:orderInfo.order_num
    },{
        name:'订单状态：',
        value:orderInfo.status_txt
    },{
        name:'业务品类：',
        value:orderInfo.category_txt
    },{
        name:'城市：',
        value:orderInfo.merchant_city
    },{
        name:'区域：',
        value:orderInfo.merchant_district
    },{
        name:'商家：',
        value:orderInfo.merchant
    },{
        name:'商家回执：',
        value:''
    },{
        name:'签单金额：',
        value:''
    }]
    return (
      <div className={styles.container}>
          <ul className={styles.ullist}>
              {
                  attrs.map(item=><li><span>{item.name}</span><span>{item.value}</span></li>)
              }
          </ul>
      </div>
    );
  };
}
export default Form.create<OrderInfoProps>()(OrderInfo);
