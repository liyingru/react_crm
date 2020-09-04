import React, { Component } from 'react';
import { Input, Icon, message, Select, Button, Form, Modal, InputNumber } from 'antd';
import Axios from "axios";
import URL from '@/api/serverAPI.config';
import { Permission, ConfigCommon } from '@/commondata';

import { FormComponentProps } from 'antd/es/form';
import NumericInput from '@/components/NumericInput';
import styles from './index.less';
import CrmUtil from '@/utils/UserInfoStorage';
import { rderInfoModel, ProductInfo } from '@/pages/OrderManagement/orderDetails/data';
import { UserEntity } from '../../data';
import FormItem from 'antd/lib/form/FormItem';
import { PlusOutlined, PlusCircleFilled, PlusCircleTwoTone, PlusCircleOutlined, DeleteColumnOutlined, DeleteOutlined } from '@ant-design/icons';
import PageLoadingSelect from '@/components/PageLoadingSelect';
import CrmInfos, { InfoItemType } from '@/components/CrmInfosTabPanel';

interface orderInfoState {
  productModalVisible: boolean;
  bindedProductIds: string[];
  searchProductList: ProductInfo[];
  setNoMoreProductsData: boolean;
  productIds: string[];
  modifyFlag: boolean;
  orderName: string;
  modifyOrderOwnerFlag: boolean;
  modifyOrderTwiceSellStatus: boolean;
  orderOwner: string;
  orderTwiceSellStatus: string;
}

interface orderInfoProps extends FormComponentProps {
  orderInfo: rderInfoModel;
  canUpdateOrderTag: boolean;
  bindedProducts: ProductInfo[];
  config: ConfigCommon;
  permission: Permission;
  allUsersList: UserEntity[];
  isSearchingProduct?: boolean;
  onSearchProductByKeyWord: (keyword: string, hookback: (searchResult: ProductInfo[], total: number) => void) => void;
  onBindProduct: (productIds: string) => void;
  onUpdateOrderInfo: (paramsObj: any) => void;
  onUnbindProduct: (product: ProductInfo) => void;
}

class orderDetailsInfo extends Component<orderInfoProps, orderInfoState>{
  static getDerivedStateFromProps<T>(nextProps: orderInfoProps) {
    const { orderInfo, bindedProducts } = nextProps;
    const bindedProductIds: string[] = [];
    if (bindedProducts && bindedProducts.length > 0) {
      bindedProducts.map(item => {
        bindedProductIds.push(item.id)
      });
    }
    return {
      orderTwiceSellStatus: orderInfo.phase + "",
      bindedProductIds
    };
    // return null;
  }

  infoItems: InfoItemType<rderInfoModel>[] = [
    {
      name: '订单编号',
      index: 'order_num'
    },
    {
      name: '销售负责人',
      index: 'owner_id',
      editType: this.props.permission?.bjchangeorderowner ? 'select' : undefined,
      selectOptions: () => this.props.allUsersList,
      renderText: record => record.order_owner_name
    },
    {
      name: '订单类型',
      index: 'category_txt'
    },
    {
      name: '订单标签',
      index: 'type',
      editType: this.props.canUpdateOrderTag ? 'select' : undefined,
      selectOptions: () => this.props.config.orderType,
      initialValue: record => record.type == 0 ? undefined : record.type
    },
    {
      name: '二次销售状态',
      index: 'phase',
      editType: this.props.permission?.bjchangeorderphase ? 'select' : undefined,
      selectOptions: () => this.props.config.orderPhase,
      renderText: record => record.phase_txt
    },
    {
      name: '订单金额',
      index: 'amount',
      editType: this.props.canUpdateOrderTag ? 'numeric' : undefined,
      initialValue: (record) => record.amount == '0' ? undefined : record.amount
    },
    // {
    //   name: '售卖产品',
    //   index: 'product',
    //   editType: this.props.canUpdateOrderTag ? 'product' : undefined,
    //   productInfo: {
    //     allowUnbind: true,
    //     getBindedProducts: () => this.props.bindedProducts,
    //     bindProduct: this.props.onBindProduct,
    //     unbindProduct: this.props.onUnbindProduct,
    //     onSearchProductByKeyWord: this.props.onSearchProductByKeyWord
    //   }
    // },
  ];

  // 喜庄
  xzColumns = [
    {
      label: '订单编号',
      key: 'order_num'
    },
    {
      label: '销售负责人',
      key: 'owner_id'
    },
    {
      label: '订单类型',
      key: 'category_txt'
    },
    {
      label: '订单标签',
      key: 'type',
    },
    {
      label: '二次销售状态',
      key: 'phase'
    },
    {
      label: '订单金额',
      key: 'amount'
    },
    {
      label: '肖像授权',
      key: 'avatar_grant'
    },
    {
      label: '售卖产品',
      key: 'product'
    },
    {
      label: '回款金额',
      key: 'receivables_amount'
    },
    {
      label: '未回款金额',
      key: 'no'
    },
  ]

  orderInfo = undefined;

  constructor(props: orderInfoProps) {
    super(props);
    // 初始化
    this.state = {
      modifyFlag: true,
      orderOwner: '',
      orderTwiceSellStatus: '',
      orderName: '',
      modifyOrderOwnerFlag: true,
      modifyOrderTwiceSellStatus: true,
      amountFlag: true,
      faceFlag: true,
      amount: '',
      newBindedProductList: [],
      productModalVisible: false,
      setNoMoreProductsData: false,
      avatar: '',
      // 产品模块
      isSearchingProduct: false,
      searchProductList: [],
      productIds: [],
      bindedProductIds: []
    }
  }

  componentDidMount() {
    const { bindedProducts } = this.props;
    let arr: any = [];
    if (bindedProducts && bindedProducts.length > 0) {
      bindedProducts.map((item: any) => {
        arr.push(item.id)
      });
    }
    this.setState({
      bindedProductIds: arr
    })
  }


  modifyCtrl = (key: string) => {
    const modifyFlag = key == 'owner_id' ? this.state.modifyOrderOwnerFlag : key == 'phase' ? this.state.modifyOrderTwiceSellStatus : key == 'amount' ? this.state.amountFlag : (key == 'type' ? this.state.modifyFlag : (key == 'avatar_grant' ? this.state.faceFlag : true));
    return !modifyFlag ? (<span style={{ color: 'black' }}>
      <Icon type="check" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(key)} />
      <Icon type="close" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(key)} />
    </span>) : <span style={{ color: 'black' }}><Icon type="edit" style={{ fontSize: 20, marginLeft: 20, marginTop: 7 }} onClick={() => this.editClick(key)} /></span>

  }

  upDateReqCtrl = (type: any, val: any) => {
    const { orderInfo, onUpdateOrderInfo } = this.props;
    let obj = {};
    if (type) {
      obj[type] = val;
    }
    obj = {
      ...obj,
      orderId: orderInfo.id
    }
    if (onUpdateOrderInfo) onUpdateOrderInfo(obj);
  }


  handleEditSaveOrderInfo = (params: Object) => {

    params['ownerId'] = params['owner_id'];
    // params['avatarGrant'] = params['avatar_grant'];

    const { orderInfo, onUpdateOrderInfo } = this.props;

    if (onUpdateOrderInfo) onUpdateOrderInfo({
      ...params,
      orderId: orderInfo.id
    });
    // Axios.post(URL.updateOrder, {
    //   ...params,
    //   orderId: orderInfo.id
    // }).then(
    //   res => {
    //     if (res.code == 200) {
    //       message.success('修改成功！');
    //       this.updateOrderDetail();
    //     } else {
    //       message.error("修改失败！");
    //       this.props.form.resetFields();
    //     }
    //   }
    // );
  }

  checkClick = (name: any) => {
    let val = '';
    if (name == 'owner_id') {
      this.setState({
        modifyOrderOwnerFlag: true,
      });
      val = this.state.orderOwner;
      name = 'ownerId';
    } else if (name == 'phase') {
      this.setState({
        modifyOrderTwiceSellStatus: true,
      });
      val = this.state.orderTwiceSellStatus;
    } else if (name == 'amount') {
      this.setState({
        amountFlag: true,
      });
      val = this.state.amount;
    } else if (name == 'type') {
      this.setState({
        modifyFlag: true,
      })
      val = this.state.orderName;
    } else if (name == 'avatar_grant') {
      this.setState({
        faceFlag: true
      });
      val = this.state.avatar;
    }
    this.upDateReqCtrl(name, val);
  }

  closeClick = (name: string) => {
    if (name == 'owner_id') {
      this.setState({
        modifyOrderOwnerFlag: true,
      })
    } else if (name == 'phase') {
      this.setState({
        modifyOrderTwiceSellStatus: true,
      })
    } else if (name == 'amount') {
      this.setState({
        amountFlag: true,
      })
    } else if (name == 'type') {
      this.setState({
        modifyFlag: true,
      })
    } else if (name == 'avatar_grant') {
      this.setState({
        faceFlag: true
      })
    }
  }

  editClick = (key: any) => {
    if (key == 'owner_id') {
      this.setState({
        modifyOrderOwnerFlag: false,
      })
    } else if (key == 'phase') {
      this.setState({
        modifyOrderTwiceSellStatus: false,
      })
    } else if (key == 'amount') {
      this.setState({
        amountFlag: false,
      })
    } else if (key == 'type') {
      this.setState({
        modifyFlag: false,
      })
    } else if (key == 'avatar_grant') {
      this.setState({
        faceFlag: false,
      })
    }
  }

  updateOrderOwner = (e) => {
    this.setState({
      orderOwner: e
    })
  }

  updateOrderTwiceSellStatus = (e) => {
    this.setState({
      orderTwiceSellStatus: e
    })
  }

  updateOrderName = (e: any) => {
    this.setState({
      orderName: e
    })
  }

  updateOrderAmount = (e: any) => {
    this.setState({
      amount: e.target.value
    })
  }
  updateAvatar = (e: any) => {
    this.setState({
      avatar: e
    })
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
  handleSearchProductByName = (keyword: string) => {
    if (keyword) {
      const { onSearchProductByKeyWord } = this.props;
      onSearchProductByKeyWord(keyword, (searchResult: ProductInfo[], total: number) => {
        const prevProductList = this.state.searchProductList;
        const currentProductList = this.duplicateRemoval(prevProductList, searchResult);
        this.setState({
          searchProductList: currentProductList
        })

        this.productsPagination = {
          page: this.productsPagination.page + 1,
          pageSize: this.productsPagination.pageSize,
          total
        }
        if (total <= currentProductList.length) {
          this.setState({
            setNoMoreProductsData: true
          })
        }
      });
    }
  };

  // 
  poductSpliceCtrl = (arr1: any, arr2: any) => {
    for (var i = 0; i < arr2.length; i++) {
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i] == arr1[j]) {
          arr1.splice(j, 1);
        }
      }
    }
    return arr1
  }

  // 产品选择的数组
  handleChangeProduct = (value: any) => {
    this.setState((prevState) => {
      let arr1 = [...value];
      console.log("arr1 = " + JSON.stringify(arr1));
      let arr2 = [...prevState.bindedProductIds];
      console.log("arr2 = " + JSON.stringify(arr2));
      if (arr2.length > 0) {
        arr1 = this.poductSpliceCtrl(arr1, arr2);
      }
      console.log("arr1        = " + JSON.stringify(arr1));
      return {
        productIds: arr1
      }
    }, () => {

    })
  };

  // 产品绑定确定按钮
  handleBindProduct = () => {
    const { form } = this.props;
    const { searchProductList, productIds } = this.state
    if (productIds.length == 0) {
      message.error('请选择添加的产品');
      return;
    }
    form.validateFields((err: any, values: any) => {
      if (!err) {
        let arr1 = [...searchProductList];
        let arr2 = [...productIds];
        let arr = this.productFilterCtrl(arr1, arr2);
        const arrIds = arr.map(item => item.id);
        this.setState({
          productModalVisible: false,
          bindedProductIds: arrIds
        })
        form.resetFields(["products"]);
      }
    });

    const { onBindProduct } = this.props;
    if (onBindProduct) onBindProduct(this.state.productIds.join(','))

  }

  // 数组比对取文案
  productFilterCtrl = (arr1: ProductInfo[], arr2: string[]) => {
    let newArr: ProductInfo[] = [];
    if (arr2.length == 0) { return newArr; }
    arr1.map(i => {
      arr2.map(j => {
        if (i.id == j) {
          newArr.push(i);
        }
      })
    });
    return newArr;
  }

  handleUnbindProduct = (product: ProductInfo) => {
    const { onUnbindProduct } = this.props;
    if (onUnbindProduct) {
      onUnbindProduct(product);
    }
  }

  productsPagination = {
    page: 1,
    pageSize: 100,
    total: 0
  }

  /**
   * 如果关键字改变了，搜索结果要清空，并且重新开始搜索
   */
  onProductKeywordChanged = (keyword: string | undefined) => {
    this.productsPagination = {
      page: 1,
      pageSize: 100,
      total: 0
    }
    this.setState({
      searchProductList: new Array(),
      setNoMoreProductsData: false,
    })
    // if (!keyword) {  // 如果删除了所有关键字
    //   this.setState({
    //     bindedCustomerValue: undefined,
    //     productsNotFoundTips: "请输入关键字搜索"
    //   })
    // };
  }

  // 产品搜索选择 ====================   END

  /**
   * 添加产品弹窗
   */
  renderModal = () => {
    const { isSearchingProduct } = this.props;
    const { searchProductList, productModalVisible } = this.state;
    return <Modal
      visible={productModalVisible}
      title="请填写产品信息"
      okText="确定"
      onCancel={() => this.setState({ productModalVisible: false })}
      onOk={this.handleBindProduct}
      destroyOnClose={true}
    >
      <Form layout='inline'>
        <Form.Item label="产品名称" id="products">
          <PageLoadingSelect
            mode="multiple"
            style={{ width: '260px' }}
            placeholder={'输入产品名称、商家名称、产品品类'}
            loading={isSearchingProduct}
            onChange={this.handleChangeProduct}
            // onSelect={(value, option) => this.handleSelectOption(value+"")}
            notFoundContent={searchProductList.length == 0 ? '请输入关键字搜索产品' : ''}
            onKeywordChanged={this.onProductKeywordChanged}
            doSearch={this.handleSearchProductByName}
            noMoreData={this.state.setNoMoreProductsData}
            optionLabelProp='title'
          >
            {
              searchProductList.length > 0 && searchProductList.map((item, index) => (
                <Select.Option title={item.name} value={item.id} key={item.name}
                  disabled={this.state.bindedProductIds.indexOf(item.id) >= 0}>
                  {item.name}{this.state.bindedProductIds.indexOf(item.id) >= 0 && <b>（已绑定）</b>} <br />
                  品类：{item.category_name} <br />
                  价格：{item.price_min}～{item.price_max} <br />
                  商家：{item.merchant_name}<br />
                </Select.Option>
              ))
            }
          </PageLoadingSelect>
          {/* <Select
            style={{ width: '260px' }}
            mode="multiple"
            optionLabelProp='title'
            placeholder='输入产品名称、商家名称、产品品类'
            showSearch={true}
            filterOption={false}
            showArrow={false}
            loading={isSearchingProduct}
            defaultActiveFirstOption={false}
            onSearch={this.handleSearchProductByName}
            onChange={this.handleChangeProduct}
            allowClear={true}
            notFoundContent={searchProductList.length == 0?'请输入关键字搜索产品':''}
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
          </Select> */}
        </Form.Item>
      </Form>
    </Modal>
  }

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  render() {
    const { Option } = Select;
    const { orderInfo, canUpdateOrderTag, config, bindedProducts, allUsersList, permission } = this.props;
    // const restColumns = permission?.bjchangeorderphase ? columns : columns.filter(item => item.key != 'phase' && item.key != 'owner_id');

    // this.orderInfo = {};
    // for (const key in orderInfo) {
    //   this.orderInfo[key] = orderInfo[key];
    // }

    const businessInfoItems: InfoItemType<rderInfoModel>[] = new Array();
    orderInfo?.business_content?.map(item => {
      businessInfoItems.push({
        name: item.key,
        index: '',
        renderText: record => item.val
      })
    })

    return <div>
      <MyInfos
        form={this.props.form}
        data={orderInfo}
        infoItems={this.infoItems}
        requestUpdateInfo={this.handleEditSaveOrderInfo}
      />

      <MyInfos
        form={this.props.form}
        data={orderInfo}
        infoItems={businessInfoItems}
        requestUpdateInfo={() => { }}
      />
    </div>

    return (
      <div className={styles.tableListForm}>
        <Form {...this.formItemLayout} layout='inline' >
          {
            orderInfo && restColumns.map(item => (
              <FormItem label={item.label}>
                {
                  item.key == 'owner_id' ? (
                    <Select showSearch optionFilterProp="children" defaultValue={this.orderInfo[item.key] == 0 ? undefined : this.orderInfo[item.key]} placeholder="请选择" style={{ width: '40%' }} disabled={this.state.modifyOrderOwnerFlag} onChange={e => this.updateOrderOwner(e)} >
                      {allUsersList && allUsersList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )
                    : item.key == 'phase' ? (
                      <Select value={this.state.orderTwiceSellStatus} placeholder="请选择" style={{ width: '40%' }} disabled={this.state.modifyOrderTwiceSellStatus} onChange={e => this.updateOrderTwiceSellStatus(e)} >
                        {config.orderPhase && config.orderPhase.map(item => (
                          <Option key={item.id} value={item.id + ""}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )
                      : item.key == 'type' ? (
                        <Select defaultValue={this.orderInfo[item.key] == 0 ? undefined : this.orderInfo[item.key]} placeholder="请选择" style={{ width: '40%' }} disabled={this.state.modifyFlag} onChange={e => this.updateOrderName(e)} >
                          {!!config.orderType && config.orderType.map(item => (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )
                        : item.key == 'avatar_grant' ? (
                          <Select defaultValue={this.orderInfo[item.key]} placeholder="请选择" style={{ width: '40%' }} disabled={this.state.faceFlag} onChange={e => this.updateAvatar(e)} >
                            {!!config.avatarGrant && config.avatarGrant.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )
                          : item.key == 'product' ? (
                            <div className={styles.productInfo}>

                              <div>
                                {
                                  bindedProducts && bindedProducts.length > 0 ? bindedProducts.map((item, index) =>
                                    <div>
                                      <span>产品{index + 1}:</span>
                                      <span>{item.merchant_name}  {item.price_min}~{item.price_max}</span>
                                      <Button type="link" onClick={() => { this.handleUnbindProduct(item) }}>
                                        <DeleteOutlined />
                                      </Button>
                                    </div>
                                  ) : (
                                      <span>无产品</span>
                                    )
                                }
                              </div>
                              {
                                canUpdateOrderTag && (
                                  <Button type="default" size="small" onClick={this.handleProduct}><PlusOutlined />添加产品</Button>
                                )
                              }
                              {canUpdateOrderTag && this.renderModal()}
                            </div>
                          )
                            : item.key == 'amount' ? (
                              <NumericInput defaultValue={this.orderInfo[item.key]} style={{ width: '40%' }} placeholder="请输入" disabled={this.state.amountFlag} onChange={e => this.updateOrderAmount(e)} />
                            )
                              :
                              this.orderInfo && this.orderInfo[item.key] == '' ? '未填写' : this.orderInfo[item.key]

                }

                {CrmUtil.getCompanyType() != 1 && (item.key == 'owner_id' || item.key == 'phase' || ((item.key == 'type' || item.key == 'amount' || item.key == 'avatar_grant') && canUpdateOrderTag)) && this.modifyCtrl(item.key)}
                {/* </span> */}

              </FormItem>
            ))
          }

          {orderInfo && orderInfo.business_content.map(item => (
            <FormItem label={item.key}>
              {/* <span className={styles.contentKeyStyle}>{item.key}：</span> */}
              <span >{item.val}</span>
            </FormItem>
          )
          )}
        </Form>
      </div>

    );
  };
}


class MyInfos extends CrmInfos<rderInfoModel> { };
export default Form.create<orderInfoProps>()(orderDetailsInfo);
