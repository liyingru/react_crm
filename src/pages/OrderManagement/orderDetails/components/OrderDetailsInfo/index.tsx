import React, { Component } from 'react';
import { Icon, message, Select, Button, Form, Modal } from 'antd';
import Axios from "axios";
import URL from '@/api/serverAPI.config';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import NumericInput from '@/components/NumericInput';
import { rderInfoModel, ProductInfo } from '../../data';
import styles from './index.less';
import { StateType } from '../../model';
import CrmUtil from '@/utils/UserInfoStorage';
import { ConfigCommon } from '@/commondata';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import CrmInfos, { InfoItemType } from '@/components/CrmInfosTabPanel';
const FormItem = Form.Item;
const { Option } = Select;

interface orderInfoState {
  /** 记录各个组件的编辑状态 */
  itemEditingStatus: boolean[];
  /** 添加产品的弹窗 */
  productModalVisible: boolean;
  /** 搜索的产品结果列表 */
  searchProductList: ProductInfo[];
  /** 选中的产品信息 */
  productInfo: ProductInfo[];
  notFoundContentDesc: string;
}

interface orderInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  product: ProductInfo[];
  orderInfo: rderInfoModel;
  config: ConfigCommon;
  data: rderInfoModel;
}
@connect(
  ({
    getDetailsModelType,
    loading,
  }: {
    getDetailsModelType: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    getDetailsModelType,
    loading: loading.models.getDetailsModelType,
  }),
)

class orderDetailsInfo extends Component<orderInfoProps, orderInfoState>{

  /**
   * 搜索产品
   */
  handleSearchProductByKeyword = (keyword: string, hookback: (productList: ProductInfo[], total: number) => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'getDetailsModelType/searchProduct',
      payload: {
        keyword,
      },
      callback: (productList: ProductInfo[], total: number) => {
        hookback(productList, total);
      }
    });
  }

  infoItems: InfoItemType<rderInfoModel>[] = CrmUtil.getCompanyType() == 1 ? [
    {
      name: '商家回执',
      index: 'receipt'
    },
    {
      name: '订单类型',
      index: 'category_txt',
    }, {
      name: '推荐商家',
      index: 'merchant'
    }, {
      name: '商家回执',
      index: 'receipt'
    }, {
      name: '回款金额',
      index: 'amount'
    }
  ] : [
      {
        name: '商家回执',
        index: 'receipt'
      }, {
        name: '订单类型',
        index: 'category_txt'
      }, {
        name: '订单标签',
        index: 'type',
        editType: 'select',
        selectOptions: () => this.props.config.orderType,
      }, {
        name: '订单金额',
        index: 'amount',
        editType: 'numeric',
        initialValue: (record) => record.amount == '0' ? undefined : record.amount
      }, {
        name: '肖像授权',
        index: 'avatar_grant',
        editType: 'select',
        selectOptions: () => this.props.config.avatarGrant,
      }, {
        name: '参与活动',
        index: 'activity_id',
        editType: 'select',
        selectOptions: () => [{ id: 0, name: '未参与' }, { id: 1, name: '已参与' }],
      }, {
        name: '公司优惠',
        index: 'discount',
        editType: 'select',
        selectOptions: () => [{ id: 0, name: '无' }, { id: 1, name: '有' }],
      }, {
        name: '签单时间',
        index: 'contract_datetime'
      }, {
        name: '回款次数',
        index: 'receivables_num'
      }, {
        name: '回款总额',
        index: 'receivables_amount',
      }, {
        name: '未回款金额',
        index: 'no'
      }, {
        name: '最新回款',
        index: 'latest_receivables_amount'
      }, {
        name: '尾款情况',
        index: 'final_receivables_situation',
      }, {
        name: '付款方式',
        index: 'pay_type',
      }, {
        name: '售卖产品',
        index: 'product',
        editType: 'product',
        productInfo: {
          allowUnbind: true,
          getBindedProducts: () => this.props.product,
          bindProduct: productIdsString => {
            const { dispatch, orderInfo } = this.props;
            dispatch({
              type: 'getDetailsModelType/bindProductCtrlReq',
              payload: {
                orderId: orderInfo.id,
                productIds: productIdsString,
              },
              callback: (data: any) => {
                if (data.code == 200) {
                  message.success('绑定成功');
                  this.updateOrderDetail();
                }
              }
            });
          },
          unbindProduct: product => {
            const { dispatch, orderInfo } = this.props;
            dispatch({
              type: 'getDetailsModelType/unBindProduct',
              payload: {
                orderId: orderInfo.id,
                productId: product.id
              },
              callback: (success: boolean) => {
                if (success) {
                  message.success("解除绑定产品成功！");
                  this.updateOrderDetail();
                }
              }
            });
          },
          onSearchProductByKeyWord: this.handleSearchProductByKeyword
        }
      },
    ];

  columns: { label: string, key: string, editable?: boolean }[] = CrmUtil.getCompanyType() == 1 ? [
    {
      label: '商家回执',
      key: 'receipt'
    },
    {
      label: '订单类型',
      key: 'category_txt'
    }, {
      label: '推荐商家',
      key: 'merchant'
    }, {
      label: '商家回执',
      key: 'receipt'
    }, {
      label: '回款金额',
      key: 'amount',
    }
  ] : [
      {
        label: '商家回执',
        key: 'receipt'
      }, {
        label: '订单类型',
        key: 'category_txt'
      }, {
        label: '订单标签',
        key: 'type',
        editable: true,
      }, {
        label: '订单金额',
        key: 'amount',
        editable: true,
      }, {
        label: '肖像授权',
        key: 'avatar_grant',
        editable: true,
      }, {
        label: '参与活动',
        key: 'activity_id',
        editable: true,
      }, {
        label: '公司优惠',
        key: 'discount',
        editable: true,
      }, {
        label: '签单时间',
        key: 'contract_datetime'
      }, {
        label: '回款次数',
        key: 'receivables_num'
      }, {
        label: '回款总额',
        key: 'receivables_amount',
      }, {
        label: '未回款金额',
        key: 'no'
      }, {
        label: '最新回款',
        key: 'latest_receivables_amount'
      }, {
        label: '尾款情况',
        key: 'final_receivables_situation',
      }, {
        label: '付款方式',
        key: 'pay_type',
      }, {
        label: '售卖产品',
        key: 'product',
        editable: true,
      },
    ];

  businessInfoItems: InfoItemType<rderInfoModel>[] = [

  ];



  renderDetailItemSelect = <O,>(id: string, label: string, options: { disabled?: boolean, options?: O[], optionValue?: (option: O) => string | number, optionText?: (option: O) => string, initialValue?: any, }) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(id, {
            initialValue: options.initialValue
          })(
            <Select style={inputStyle} showSearch size="small"
              optionFilterProp="children" disabled={!!(options.disabled)}>
              {
                options.options && options.options.map(item => (
                  <Option key={options.optionValue ? options.optionValue(item) : item.id} value={options.optionValue ? options.optionValue(item) : item.id}>{options.optionText ? options.optionText(item) : item.name}</Option>
                ))
              }
            </Select>
          )
        }
        {
          this.renderActionButtons(id, itemEditingStatus[id])
        }
      </div>
    </FormItem>

  }

  renderDetailItemNumeric = (id: string, label: string, options: { disabled?: boolean, initialValue?: any, }) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(id, {
            initialValue: options.initialValue,
          })(
            <NumericInput size='small' style={inputStyle} placeholder="请输入" disabled={options.disabled} />
          )
        }
        {
          this.renderActionButtons(id, itemEditingStatus[id])
        }
      </div>
    </FormItem>

  }

  /**
  * 1.婚宴
  * 2.婚庆
  * 3.婚纱摄影
  * 4.婚车
  * 5.庆典or喜宴
  * 6.一站式
  */
  businessColumns = {
    1: [
      {
        label: '需求桌数',
        key: ''
      },
      {
        label: '每桌预算',
        key: ''
      },

      {
        label: '推荐商户',
        key: ''
      },
      {
        label: '预约到店时间',
        key: ''
      },
      {
        label: '补充备注',
        key: ''
      },
    ],
    2: [
      {
        label: '婚庆预算',
        key: ''
      },
      {
        label: '推荐商户',
        key: ''
      },
      {
        label: '预约到店时间',
        key: ''
      },
      {
        label: '补充备注',
        key: ''
      },
    ],
    3: [
      {
        label: '婚纱摄影预算',
        key: ''
      },
      {
        label: '婚照风格',
        key: ''
      },
      {
        label: '推荐商户',
        key: ''
      },
      {
        label: '计划到店时间',
        key: ''
      },
      {
        label: '备注',
        key: ''
      },
    ],
    4: [
      {
        label: '婚车预算',
        key: ''
      },
      {
        label: '用车日期',
        key: ''
      },
      {
        label: '车数需求',
        key: ''
      },
      {
        label: '品牌要求',
        key: ''
      },
      {
        label: '计划到店日期',
        key: ''
      },
      {
        label: '备注',
        key: ''
      },
    ],
    5: [
      {
        label: '每桌预算',
        key: ''
      },
      {
        label: '需求桌数',
        key: ''
      },
      {
        label: '婚宴类型',
        key: ''
      },
      {
        label: '宴会日期',
        key: ''
      },
      {
        label: '推荐商户',
        key: ''
      },
      {
        label: '计划到店日期',
        key: ''
      },
      {
        label: '备注',
        key: ''
      },
    ],
    6: [
      {
        label: '每桌预算',
        key: ''
      },
      {
        label: '需求桌数',
        key: ''
      },
      {
        label: '推荐商户',
        key: ''
      },
      {
        label: '计划到店日期',
        key: ''
      },
      {
        label: '备注',
        key: ''
      },
    ],
  }

  constructor(props: any) {
    super(props);
    // 初始化
    this.state = {
      itemEditingStatus: [],
      productModalVisible: false,
      searchProductList: [],
      productInfo: [],
      loading: false,
      productIds: [],
      notFoundContentDesc: '请输入关键字搜索产品',
      alreadyProductIds: []
    }
  }

  componentDidMount() {
    const { getDetailsModelType: { data }, orderInfo, product } = this.props;
    let arr: any = [];
    if (product && product.length > 0) {
      product.map((item: any) => {
        arr.push(item.id)
      });
    }
    this.setState({
      alreadyProductIds: arr
    })

    const { itemEditingStatus } = this.state;
    this.columns.filter(item => {
      if (item.editable) {
        itemEditingStatus[item.key] = false;
      }
    })
    this.setState({ itemEditingStatus });
  }

  /** 渲染编辑字段的操作按钮 */
  renderActionButtons = (key: string, isEditing: boolean) => {
    return <div className={styles.editingIcon}>
      {
        isEditing ? <>
          <CheckOutlined onClick={() => this.checkClick(key)} />
          <CloseOutlined onClick={() => this.closeClick(key)} style={{ marginLeft: 10 }} />
        </> : <><EditOutlined onClick={() => this.editClick(key)} /></>
      }
    </div>
  }

  /** 保存编辑项 */
  checkClick = (key: string) => {
    const { form } = this.props;
    const { orderInfo } = this.props;
    form.validateFields([key], (err, fieldsValue) => {
      if (err) return;
      fieldsValue['activityId'] = fieldsValue['activity_id'];
      fieldsValue['avatarGrant'] = fieldsValue['avatar_grant'];
      // fieldsValue['receivablesAmount'] = fieldsValue['receivables_amount'];
      let params = {
        ...fieldsValue,
        orderId: orderInfo.id
      }

      Axios.post(URL.updateOrder, params).then(
        res => {
          if (res.code == 200) {
            message.success('修改成功');
            this.updateOrderDetail();
            const { form } = this.props;
            form.resetFields();
            const { itemEditingStatus } = this.state;
            itemEditingStatus[key] = false;
            this.setState({ itemEditingStatus });
          }
        }
      );
    })
  }

  closeClick = (name: any) => {
    const { form } = this.props;
    form.resetFields();
    const { itemEditingStatus } = this.state;
    itemEditingStatus[name] = false;
    this.setState({ itemEditingStatus });
  }

  editClick = (name: string) => {
    const { form } = this.props;
    form.resetFields();
    const { itemEditingStatus } = this.state;
    itemEditingStatus[name] = true;
    this.setState({ itemEditingStatus });
  }

  handleProduct = () => {
    this.setState({
      productModalVisible: true
    })
    this.props.form.resetFields()
  }

  // 添加产品 Start================================;
  // 数组去重
  duplicateRemoval = (currentArr: any, newArr: any) => {
    let obj = {};
    let list = currentArr.concat(newArr);
    return list.reduce((cur: any, next: any) => {
      obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
      return cur;
    }, []);
  }
  // 搜索
  timeOut: NodeJS.Timeout | null = null;
  searchProductNameCtrl = (keyword: any) => {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
      this.timeOut = null;
    }
    this.timeOut = setTimeout(() => {
      this.resProductCtrl(keyword);
    }, 1000);
  };

  // 产品搜索
  resProductCtrl = (keyword: any) => {
    const { dispatch } = this.props;
    if (keyword) {
      dispatch({
        type: 'getDetailsModelType/searchProduct',
        payload: {
          keyword: keyword,
        },
        callback: (data: any) => {
          if (data.code == 200) {
            let res = data.data.result.rows;
            this.setState((prevState) => {
              let currentList = [...prevState.searchProductList];
              let list = this.duplicateRemoval(currentList, res);
              return {
                searchProductList: list
              }
            })
          }
        }
      });
    }
  }

  //
  poductSpliceCtrl = (arr1: any, arr2: any) => {
    for (var i = 0; i < arr2.length; i++) {
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i].id == arr1[j].id) {
          arr1.splice(j, 1);
        }
      }
    }
    return arr1
  }

  // 产品选择的数组
  onChangeProduct = (value: any) => {
    this.setState((prevState) => {
      let arr1 = [...value];
      let arr2 = [...prevState.alreadyProductIds];
      if (arr2.length > 0) {
        arr1 = this.poductSpliceCtrl(arr1, arr2);
      }
      return {
        productIds: arr1
      }
    }, () => { })
  };

  /** 产品绑定确定按钮 */
  bindProduct = () => {
    const { form, dispatch, orderInfo } = this.props;
    if (this.state.productIds.length == 0) {
      message.error('产品重复');
      return;
    }
    form.validateFields((err: any, values: any) => {
      if (!err) {
        let arr1 = [...this.state.searchProductList];
        let arr2 = [...this.state.productIds];
        let arr = this.productFilterCtrl(arr1, arr2);
        this.setState({
          productModalVisible: false,
          productInfo: arr
        })
      }
    });
    if (this.state.productIds.length == 0) return;
    dispatch({
      type: 'getDetailsModelType/bindProductCtrlReq',
      payload: {
        orderId: orderInfo.id,
        productIds: this.state.productIds.join(','),
      },
      callback: (data: any) => {
        if (data.code == 200) {
          message.success('绑定成功');
          this.updateOrderDetail();
        }
      }
    });
  }

  // 详情接口更新
  updateOrderDetail = () => {
    const { dispatch, orderInfo } = this.props;
    dispatch({
      type: 'getDetailsModelType/getDetails',
      payload: { orderId: orderInfo.id }
    });
  }

  handleEditSaveOrderInfo = (params: Object) => {
    params['activityId'] = params['activity_id'];
    params['avatarGrant'] = params['avatar_grant'];
    const { orderInfo } = this.props;
    Axios.post(URL.updateOrder, {
      ...params,
      orderId: orderInfo.id
    }).then(
      res => {
        if (res.code == 200) {
          message.success('修改成功！');
          this.updateOrderDetail();
        } else {
          message.error("修改失败！");
          this.props.form.resetFields();
        }
      }
    );
  }

  /** 筛选 */
  productFilterCtrl = (arr1: any, arr2: any) => {
    let newArr: any = [];
    if (arr2.length == 0) { return newArr; }
    arr1.map((i: any) => {
      arr2.map((j: any) => {
        if (i.id == j) {
          newArr.push(i);
        }
      })
    });
    return newArr;
  }

  /** 添加产品的弹窗 */
  renderProductModal = () => {
    const { loading } = this.props;
    const { searchProductList, notFoundContentDesc, productModalVisible } = this.state;
    return <Modal
      visible={productModalVisible}
      title="请填写产品信息"
      okText="确定"
      onCancel={() => {
        this.setState({
          productModalVisible: false
        });
      }}
      onOk={this.bindProduct}
    >
      <Form layout='inline'>
        <Form.Item name="productName" label="产品名称">
          <Select
            style={{ width: '260px' }}
            mode="multiple"
            optionLabelProp='title'
            placeholder='输入产品名称、商家名称、产品品类'
            showSearch={true}
            filterOption={false}
            showArrow={false}
            loading={loading}
            defaultActiveFirstOption={false}
            onSearch={this.searchProductNameCtrl}
            onChange={this.onChangeProduct}
            allowClear={true}
            notFoundContent={searchProductList.length == 0 ? notFoundContentDesc : ''}
          >
            {
              searchProductList.length > 0 ? searchProductList.map((item, index) => (
                <Select.Option title={item.name} value={item.id} key={item.name} >
                  {item.name} <br />
                  品类：{item.category_name} <br />
                  价格：{item.price_min}～{item.price_max} <br />
                  商家：{item.merchant_name}<br />
                </Select.Option>
              )) : null
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  }

  formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } }, };

  render() {
    const { orderInfo, config } = this.props;
    const businessInfoItems: InfoItemType<rderInfoModel>[] = new Array();
    orderInfo?.business_content?.map(item => {
      businessInfoItems.push({
        name: item.key,
        index: '',
        renderText: record => item.val
      })
    })
    return (
      <div style={{ overflowY: 'auto' }}>
        {/* <Form {...this.formItemLayout} layout='horizontal' className={styles.formStyle}>
          <div className={styles.titleFontStyle}>基础信息</div>
          {
            orderInfo && this.columns.map(item => <>
              {
                item.editable ? (
                  item.key == 'type' ? this.renderDetailItemSelect(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    options: config.orderType,
                    optionValue: option => option.id,
                    optionText: option => option.name,
                    initialValue: orderInfo[item.key] == 0 ? undefined : orderInfo[item.key]
                  }) : item.key == 'avatar_grant' ? this.renderDetailItemSelect(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    options: config.avatarGrant,
                    optionValue: option => option.id,
                    optionText: option => option.name,
                    initialValue: orderInfo[item.key]
                  }) : item.key == 'product' ? (
                    <FormItem label={item.label}>
                      <div className={styles.productInfo}>
                        <Button size='small' type="primary" onClick={this.handleProduct}><Icon type="plus" />添加产品</Button>
                        {this.renderProductModal()}
                        <ul>
                          {
                            this.state.productInfo.length > 0 && this.state.productInfo.map((title, index) =>
                              <li><span>产品{index + 1}:</span>  {title.name}  {title.price_min}~{title.price_max}</li>
                            )
                          }
                        </ul>
                      </div>
                    </FormItem>
                  ) : item.key == 'amount' ? this.renderDetailItemNumeric(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    initialValue: orderInfo[item.key] == '0' ? undefined : orderInfo[item.key]
                  }) : item.key == 'activity_id' ? this.renderDetailItemSelect(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    options: [{ id: 0, name: '未参与' }, { id: 1, name: '已参与' }],
                    optionValue: option => option.id,
                    optionText: option => option.name,
                    initialValue: orderInfo[item.key]
                  }) : item.key == 'discount' ? this.renderDetailItemSelect(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    options: [{ id: 0, name: '无' }, { id: 1, name: '有' }],
                    optionValue: option => option.id,
                    optionText: option => option.name,
                    initialValue: orderInfo[item.key]
                  }) : item.key == 'final_receivables_situation' ? this.renderDetailItemSelect(item.key, item.label, {
                    disabled: !this.state.itemEditingStatus[item.key],
                    options: [{ id: 0, name: '未完成' }, { id: 1, name: '已完成' }],
                    optionValue: option => option.id,
                    optionText: option => option.name,
                    initialValue: orderInfo[item.key]
                  }) : ""
                )
                  :
                  <FormItem label={item.label}>{orderInfo && orderInfo[item.key] ? orderInfo[item.key] : '未填写'}</FormItem>
              }

            </>)
          }
        </Form> */}

        <MyInfos
          title="基础信息"
          form={this.props.form}
          data={orderInfo}
          infoItems={this.infoItems}
          requestUpdateInfo={this.handleEditSaveOrderInfo}
        />

        <MyInfos
          title={CrmUtil.getCompanyType() == 1 ? '业务需求' : (CrmUtil.getCompanyTag() == 'XZ' ? '关联合同' : undefined)}
          form={this.props.form}
          data={orderInfo}
          infoItems={businessInfoItems}
          requestUpdateInfo={() => { }}
        />

        {/* {
          JSON.stringify(orderInfo) != '{}' && (
            <div style={{ overflowY: 'auto' }}>
              <Form {...this.formItemLayout} layout='horizontal' className={styles.formStyle}>
                <div className={styles.titleFontStyle}>{CrmUtil.getCompanyType() == 1 ? '业务需求' : (CrmUtil.getCompanyTag() == 'XZ' ? '关联合同' : '')}</div>
                {orderInfo?.business_content.map(item => (
                  <FormItem label={item.key}>{item.val}</FormItem>
                ))}
              </Form>
            </div>)
        } */}
      </div >
    );
  };
}

class MyInfos extends CrmInfos<rderInfoModel> { };

export default Form.create<orderInfoProps>()(orderDetailsInfo);
