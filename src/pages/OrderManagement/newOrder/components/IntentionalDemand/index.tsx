import { FormComponentProps } from 'antd/es/form';
import React, { Component, Dispatch, Fragment } from 'react';
import { Form, Table, Select, Button, Modal, message, Divider, Menu, Dropdown, Input, DatePicker, Radio, Icon, Row, Col } from 'antd';
import { StateType } from '../../model';
import { Action } from 'redux';
import { connect } from 'dva';
import { ColumnProps } from 'antd/lib/table/interface';
import styles from './style.less';

interface IntentionalDemandProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<any>
  >;
  loading: boolean;
  newOrderAndOrderTableList: StateType;
}

interface IntentionalDemandState {
  banquetTj: Object[];
  reqId: string;
  category: string;
  customerId: string;
}

@connect(
  ({
    newOrderAndOrderTableList,
    loading,
  }: {
    newOrderAndOrderTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newOrderAndOrderTableList,
    loading: loading.models.newOrderAndOrderTableList,
  }),
)

class IntentionalDemand extends Component<IntentionalDemandProps, IntentionalDemandState> {
  selectCityCode: string | undefined;
  state: IntentionalDemandState = {
    banquetTj: [''],
    reqId: '',
    category: '',
    customerId: ''
  }
  //
  getTodoItem(type, obj) {
    return (
      obj.map((item, index) => {
        return (
          <div key={index} style={{ marginBottom: 10 }}>
            <Input
              onChange={(e) => { this.merchantChange(index, e, type) }}
              name={type} style={{ width: 200 }}
              placeholder="请填写推荐商户" value={item} />
            {obj.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                style={{ marginLeft: 7 }}
                onClick={() => this.handleItemDelete(index, type)}
              />
            ) : null}
          </div>
        )
      })
    )
  }
  componentDidMount() { }
  addHotelMerchant = (type) => {
    if (type == 'banquetTj') {
      this.state.banquetTj.push('');
      this.setState((prevState) => ({
        banquetTj: [...prevState.banquetTj],
      }));
    }
  }
  handleItemDelete(index, type) {
    if (type == 'banquetTj') {
      this.setState((prevState) => {
        const list = [...prevState.banquetTj];
        list.splice(index, 1);
        return { banquetTj: list }
      })
    }
  }

  merchantChange = (index, e, type) => {
    let value = e.target.value;
    if (type == 'banquetTj') {
      this.state.banquetTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.banquetTj];
        return { banquetTj: list }
      })
    }
  }
  //选中
  handleRecommend = (data: any) => {
    this.setState({
      reqId: data.id,
      category: data.category,
      customerId: data.customer_id
    }, () => {
      if (this.state.reqId != '') {
        message.success('已选中');
        return;
      }
    });

  }

  validateCtrl = (e: any, falg: boolean) => {
    const { dispatch } = this.props;
    let obj = {};
    obj.phone = this.props.phone
    obj.reqId = this.state.reqId;
    obj.category = this.state.category;
    obj.customerId = this.state.customerId;
    obj.merchant = this.state.banquetTj.join(',');

    if (obj.phone == '') {
      message.info('请填写手机号');
      return;
    }

    if (obj.reqId == '') {
      message.info('请选择需求品类');
      return;
    }
    if (obj.merchant == '') {
      message.info('请添加商家');
      return;
    }
    dispatch({
      type: 'newOrderAndOrderTableList/submitAdvancedForm',
      payload: obj,
      callback: this.onAddOrdersCallback,
    });

  }
  onAddOrdersCallback(falg: boolean, msg: string, data: any) {
    if (falg) {
      message.success('创建成功');
    } else {
      message.success('创建失败');
    }
  }

  renderTable = (details: any) => {
    if (details.category_id == 1) {
      return this.renderHYTable(details.category_name, details.data);
    } else if (details.category_id == 2) {
      return this.renderHQTable(details.category_name, details.data);
    } else if (details.category_id == 3) {
      return this.renderHSSYTable(details.category_name, details.data);
    } else if (details.category_id == 4) {
      return this.renderQDTable(details.category_name, details.data);
    } else if (details.category_id == 5) {
      return this.renderHCTable(details.category_name, details.data);
    } else if (details.category_id == 6) {
      return this.renderYZSTable(details.category_name, details.data);
    }
    return null;
  }

  render() {
    const { loading, newOrderAndOrderTableList, contentArr: { requirement_list } } = this.props;

    return (
      <div >
        {
          requirement_list != undefined ? requirement_list.other.map(details => (
            this.renderTable(details)
          )) : ''
        }
        <div className={styles.rt_content} style={{ marginTop: 30 }}>
          <div className={styles.newStore}>
            <p className={styles.labelName}>推荐商户:</p>
            <div style={{ marginTop: -2 }}>
              {this.getTodoItem('banquetTj', this.state.banquetTj)}
            </div>
          </div>
          <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('banquetTj') }}>添加商户</Button>
        </div>
        <Form.Item wrapperCol={{ span: 20, offset: 10 }}>
          <Button style={{ width: 100, marginTop: 30 }} type="primary" onClick={(e) => { this.validateCtrl(e, false) }}>生成订单</Button>
        </Form.Item>
      </div>
    );
  };

  //婚宴columns
  hyColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => {
        return (<div>{record.full}</div>)
      },
    },
    {
      title: '每桌预算',
      dataIndex: 'budget',
    },
    {
      title: '意向商家',
      dataIndex: 'merchant',
    },
    {
      title: '星级',
      dataIndex: 'hotel_star_txt',
    },
    {
      title: '桌数',
      dataIndex: 'hotel_tables',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>

          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }

          {/* {
            record.status == '1' ?  <Radio.Group onChange={()=>{this.handleRecommend(1)}}>
            <Radio value={false}>选中</Radio>
          </Radio.Group> : null
          } */}



        </Fragment>
      ),
    }
  ];

  //婚宴
  renderHYTable = (name: string, datas: any[]) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.hyColumns}
        dataSource={datas} />
    );
  }

  //婚庆columns
  hqColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
      width: '120',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '意向商家',
      dataIndex: 'merchant',
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '酒店名称',
      dataIndex: 'hotel',
    },
    {
      title: '厅名',
      dataIndex: 'hotel_hall',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }

        </Fragment>
      ),
    }
  ];

  //婚庆
  renderHQTable = (name: string, datas: any[]) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.hqColumns}
        dataSource={datas} />
    );
  }

  //婚纱摄影columns
  hssyColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '意向商家',
      dataIndex: 'merchant',
    },
    {
      title: '婚照风格',
      dataIndex: 'photo_style_txt',
    },
    {
      title: '拍摄时间',
      dataIndex: 'photo_time',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>

          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }

        </Fragment>
      ),
    }
  ];

  //婚纱摄影
  renderHSSYTable = (name: string, datas: any[]) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.hssyColumns}
        dataSource={datas} />
    );
  }

  //庆典or喜宴columns
  qdColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '意向商家',
      dataIndex: 'merchant',
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '酒店名称',
      dataIndex: 'hotel',
    },
    {
      title: '厅名',
      dataIndex: 'hotel_hall',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }
        </Fragment>
      ),
    }
  ];

  //庆典or喜宴
  renderQDTable = (name: string, datas: any[]) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.qdColumns}
        dataSource={datas} />
    );
  }

  //婚车colums
  hcColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '用车品牌',
      dataIndex: 'car_brand',
    },
    {
      title: '用车型号',
      dataIndex: 'car_series',
    },
    {
      title: '用车数量',
      dataIndex: 'car_num',
    },
    {
      title: '用车时间',
      dataIndex: 'car_time',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>

          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }

        </Fragment>
      ),
    }
  ];

  //婚车
  renderHCTable = (name: string, datas: any[]) => {
    return (
      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.hcColumns}
        pagination={false}
        dataSource={datas} />
    );
  }

  //一站式colums
  yzsColumns: ColumnProps<any>[] = [
    {
      title: '有效单编号',
      dataIndex: 'req_num',
    },
    {
      title: '业务城市',
      dataIndex: 'city_info',
      render: (record) => (
        <div>{record.full}</div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '意向商家',
      dataIndex: 'merchant',
    },
    {
      title: '婚礼风格',
      dataIndex: 'wedding_style_txt',
    },
    {
      title: '预计到店时间',
      dataIndex: 'est_arrival_time',
    },
    {
      title: '状态',
      dataIndex: 'status_txt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>

          {
            record.status == '1' ? <a onClick={() => this.handleRecommend(record)}>选中</a> : null
          }

        </Fragment>
      ),
    }
  ];

  //一站式
  renderYZSTable = (name: string, datas: any[]) => {
    return (

      <Table
        scroll={{ x: 'max-content' }}
        size={"middle"}
        pagination={false}
        title={() => <div className={styles.headerMaxTitle}>{name}</div>}
        columns={this.yzsColumns}
        dataSource={datas} />

    );
  }
}
export default Form.create<IntentionalDemandProps>()(IntentionalDemand);
