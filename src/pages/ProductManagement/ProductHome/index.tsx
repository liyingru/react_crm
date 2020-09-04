import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { ColumnProps } from 'antd/es/table'; // 引用table中的行参数
import { Spin, Form, Col, Row, DatePicker, Select, Button, Input, Radio, Popconfirm, Card, Table, Divider, message, Cascader, InputNumber } from 'antd';
import moment from 'moment';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { StateType } from './model';
import styles from './index.less';
import { ConfigListItem } from './data';
import { KeepAlive } from 'umi';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

interface ProductMangementProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'productMangement/fetch'
      | 'productMangement/delProduct'
      | 'productMangement/storeList'
    >
  >;
  loading: boolean;
  productMangement: StateType;
}

interface ProductMangementState {
  province: string;
  city: string;
  code: string;
  searchParams: Object,
  rangeValue: string;
  // formValues: {
  //   [key: string]: string;
  // };
  value: string;
  tableListData: Array<TableListDataItem>;
  busDisabled: boolean;
  originalFormValus: any;

}

interface TableListDataItem {
  id: string; // 自增id
  userType: number;  // 用户类型 1:医生, 2:用户, 3:患者
  userId: string;                 // 用户ID
  remark: string;                  // 备注
  status: number;                  // 状态 1:启用(默认), -1:禁用
  isDeleted: number;              // 删除标识 0:默认, 1:已删除
  createUser: string;             // 创建者
  updateUser: string;             // 更新者
  createTime: string;             // 创建时间
  updateTime: string;             // 更新时间

}

interface ConfigState {
  channel: ConfigListItem[];
  customerLevel: ConfigListItem[];
  identity: ConfigListItem[];
  gender: ConfigListItem[];
  weddingStyle: ConfigListItem[];
  category: ConfigListItem[];
  contactTime: ConfigListItem[];
  contactWay: ConfigListItem[];
  payType: ConfigListItem[];
  requirementStatus: ConfigListItem[];
  followTag: ConfigListItem[];
  leadsFollowStatus: ConfigListItem[];
  customerFollowStatus: ConfigListItem[];
  orderFollowStatus: ConfigListItem[];
  leadsStatus: ConfigListItem[];
  banquetType: ConfigListItem[];
  carBrand: ConfigListItem[];
  photoStyle: ConfigListItem[];
}

@connect(
  ({
    productMangement,
    loading,
  }: {
    productMangement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    productMangement,
    loading: loading.models.productMangement,
  }),
)

class ProductMangement extends Component<ProductMangementProps, ProductMangementState, ConfigState> {

  state = {
    tableListData: [],
    // formValues: {},
    searchParams: {},
    province: '',
    city: '',
    code: '',
    value: '0',
    rangeValue: '',
    busDisabled: true,
    originalFormValus: {}
  }

  configData: ConfigState = {
    channel: [],
    customerLevel: [],
    identity: [],
    gender: [],
    weddingStyle: [],
    category: [],
    contactTime: [],
    contactWay: [],
    payType: [],
    requirementStatus: [],
    followTag: [],
    leadsFollowStatus: [],
    customerFollowStatus: [],
    orderFollowStatus: [],
    leadsStatus: [],
    banquetType: [],
    carBrand: [],
    photoStyle: [],
  }


  componentDidMount() {
    const { dispatch } = this.props;
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            this.configData = res.data.result;
            // 拉取表单信息
            dispatch({
              type: 'productMangement/fetch',
            });
          }
        }
      );
  }

  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem('isRefresh')?.toString() : '';
    if (isRefresh?.length > 0) {
      localStorage?.setItem('isRefresh', '')
      this.handleFormReset()
    }
  }

  // 获取列表 表头
  getTableColumns = (): ColumnProps<any>[] => [
    {
      width: 150,
      title: '产品名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      width: 100,
      title: '业务品类',
      dataIndex: 'category_name',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 150,
      title: '商家名称',
      dataIndex: 'merchant_name',
    },
    {
      width: 100,
      title: '最低价格',
      dataIndex: 'price_min',
    },
    {
      width: 100,
      title: '最高价格',
      dataIndex: 'price_max',
    },
    {
      width: 100,
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return <>{text === 0 ? '下架' : '上架'}</>
      }
    },
    {
      width: 150,
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'isCanFreeze',
      width: 150,
      render: (text, record) => (
        <>
          <a onClick={() => this.handleDetaill(text, record)}>
            详情
            </a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否确认删除改产品?"
            onConfirm={() => this.handleClickDelete(text, record)}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];


  handleClickDelete = (text: any, record: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productMangement/delProduct',
      payload: {
        id: record.id,
      },
      callback: this.distributeUserCallback
    });
  }

  handleDetaill = (text: any, record: any) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/product/productDetails`,
      query: {
        id: record.id,
      }
    }))
  }

  distributeUserCallback = (data: any) => {
    const { dispatch } = this.props
    if (data.code == 200) {
      message.success('删除成功')
      localStorage.setItem('isRefresh', 'productIsRefresh')
    }
    dispatch({
      type: 'productMangement/fetch',
    });
  }


  handleNewGroup = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/product/newProduct',
    }))
  };

  requestListData = (e: any) => {
    const { dispatch } = this.props;
    const { code, searchParams } = this.state;
    this.setState({
      value: e.target.value,
    });

    const valuesResult = {
      status: e.target.value,
      areaCode: code,
      ...searchParams
    };
    dispatch({
      type: 'productMangement/fetch',
      payload: valuesResult,
    });
  }

  // 筛选
  handleSearch = (e: React.FormEvent) => {
    const {
      form: { validateFieldsAndScroll },
      productMangement: { data },
      dispatch,
    } = this.props;

    const { pagination } = data;

    validateFieldsAndScroll((error, values) => {
      e.preventDefault();
      if (!error) {
        // submit the values
        const { timeArray } = values;
        if (values.timeArray !== undefined && values.timeArray.length > 0) {
          values.startTime = moment(values.timeArray[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.timeArray[1]).format('YYYY-MM-DD');
          delete values.timeArray
        }

        if (pagination !== undefined) {
          // values['page'] = pagination.current;
          values.pageSize = pagination.pageSize;
          values.page = 1;
        }

        const valuesResult = {
          ...values,
        }
        for (const i in valuesResult) {
          if (valuesResult[i] == undefined) {
            valuesResult[i] = '';
          }
        }

        this.setState({
          searchParams: valuesResult,
          originalFormValus: valuesResult,
        }, () => { this.state.originalFormValus.timeArray = timeArray })

        dispatch({
          type: 'productMangement/fetch',
          payload: valuesResult,
        });
      }
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    // 表单重置
    form.resetFields();

    const obj = { name: "", startTime: "", endTime: "", merchantId: '', category: '', priceMax: "", priceMin: "", status: '' }
    this.setState({
      searchParams: {},
      busDisabled: true,
      originalFormValus: null,
    })
    dispatch({
      type: 'productMangement/fetch',
      payload: obj
    });

  };

  // 分页
  handleChangePage = (page: any) => {
    const { dispatch } = this.props;
    const { searchParams } = this.state;
    const valuesResult = {
      ...searchParams,
      pageSize: page.pageSize,
      page: page.current
    };

    dispatch({
      type: 'productMangement/fetch',
      payload: valuesResult,
    });
  }

  dateChange = (e: any) => {
    const dateObj = {}
    console.log(e)
    if (JSON.stringify(e) != '[]') {
      dateObj.startCreateTime = moment(e[0]).format('YYYY-MM-DD');
      dateObj.endCreateTime = moment(e[1]).format('YYYY-MM-DD');
    } else {
      dateObj.startCreateTime = undefined;
      dateObj.endCreateTime = undefined;
    }
    console.log(dateObj)
  }

  categoryChange = (e: any) => {
    this.setState({
      busDisabled: false
    })
    this.getStoreList(e)
  }

  getStoreList = (category: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productMangement/storeList',
      payload: {
        category: category
      }
    });
  }

  renderForm() {
    const {
      form: { getFieldValue, getFieldDecorator },
      productMangement: { data, storeData }
    } = this.props;
    const { rangeValue, busDisabled } = this.state;
    const priceMax = getFieldValue('priceMax');
    return (
      <div className={styles.tableListForm}>
        <Form >
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <FormItem label="创建日期">
                {getFieldDecorator('timeArray', { initialValue: this.state.originalFormValus?.timeArray })(
                  <RangePicker
                    value={rangeValue}
                    onChange={this.dateChange}
                    placeholder={['开始日期', '结束日期']}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="负责品类：">
                {getFieldDecorator('category', { initialValue: this.state.originalFormValus?.category })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.categoryChange}
                  >
                    {this.configData.category && this.configData.category.map(value => (
                      <Option value={value.id}>{value.name}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="产品名称">
                {getFieldDecorator('name', { initialValue: this.state.originalFormValus?.name })(<Input maxLength={5} placeholder="请输入产品名称" />)}
              </FormItem>
            </Col>

          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

            <Col span={8}>
              <FormItem label="商家名称">
                {getFieldDecorator('merchantId', { initialValue: this.state.originalFormValus?.merchantId })(
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="请选择所属商家"
                    allowClear
                    disabled={busDisabled}
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {storeData && storeData.map(item =>
                      <Option value={item.id} label={item.name}>
                        <div>
                          <div className={styles.store_top}>
                            <span>{item.name}</span><span>推荐等级：{item.level}</span>
                          </div>
                          <div>所在区域：{item.city} {item.region ? '-' : ''}{item.region}</div>
                        </div>
                      </Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="产品价格">
                <InputGroup compact style={{ width: '100%' }}>
                  {getFieldDecorator('priceMin', {
                    initialValue: this.state.originalFormValus?.priceMin,
                    rules: [
                      { required: false, message: "请填写产品价格", pattern: /^([1-9]\d{0,9})([.]?|(\.\d{1,2})?)$/ig },
                      {
                        validator: (rule, value, callback) => {
                          if (priceMax != null && value !== '') {
                            if (priceMax != null && priceMax !== '' && Math.round(parseFloat(value)) > Math.round(parseFloat(priceMax))) {
                              callback('最低价格应小于最高价格');
                            }
                          }
                          callback();
                        }
                      }
                    ],
                  })(<InputNumber min={0} placeholder="最低价格(元)" style={{ width: '40%', textAlign: 'center' }} />)}
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      borderLeftWidth: 0,
                      pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                  />
                  {getFieldDecorator('priceMax', {
                    initialValue: this.state.originalFormValus?.priceMax
                  })(<InputNumber placeholder="最高价格(元)" min={0} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} />)}
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="状态：">
                {getFieldDecorator('status', {
                  initialValue: this.state.originalFormValus?.status
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  >
                    {this.configData.auditConfigStatus && this.configData.auditConfigStatus.map(value => (
                      <Option value={value.id}>{value.name}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <div style={{ display: 'flex' }}>
                <Button style={{ marginLeft: '100px', flexGrow: 1, borderColor: '#1791FF', color: '#1791FF' }} onClick={this.handleFormReset}>重置</Button>
                <Button id="fsubmit" type="primary" onClick={this.handleSearch} style={{ marginLeft: '20px', flexGrow: 1 }}>筛选</Button>
              </div>
            </Col>
          </Row>
          <Divider />
        </Form>
      </div>
    )
  }

  render() {
    const {
      productMangement: { data },
      loading
    } = this.props;
    const { pagination } = data;
    const columns = this.getTableColumns()
    return (
      <>

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" icon='plus' onClick={this.handleNewGroup}>新建产品</Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={data.list}
              pagination={{
                ...pagination,
                showTotal: (total: number, range: [number, number]) => `正在显示第：${range[0]}-${range[1]}条，共计 ${total} 条`,
                onChange: page => this.handleChangePage
              }}
              onChange={this.handleChangePage}
              columns={columns}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>
      </>
    )
  }
}
class ProductMangement1 extends Component<ProductMangementProps, ProductMangementState, ConfigState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <ProductMangement {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}

export default Form.create<ProductMangementProps>()(ProductMangement1);
