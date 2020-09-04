import { Form, Select, Button, Modal, message, Tooltip, Input } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import NumericInput from '../NumericInput';
import { ProductInfo } from '@/pages/OrderManagement/orderDetails/data';
import PageLoadingSelect from '../PageLoadingSelect';
import AreaSelect from '../AreaSelect';
import TextArea from 'antd/es/input/TextArea';
const FormItem = Form.Item;
const { Option } = Select;

export interface InfoItemType<T> {
  name: string;
  index: string | string[];
  renderText?: (record: T) => string;
  initialValue?: (record: T) => any;
  editType?: 'select' | 'numeric' | 'input' | 'textarea' | 'product' | 'address' | 'phone' | 'weChat';
  editable?: (record: T) => boolean;
  /** 前提是 editType='select' */
  selectOptions?: () => { id: string | number, name: string }[];
  /** 前提是 editType='product' */
  productInfo?: ProductInfoType;
  /** 前提是 editType='address' */
  addressInfo?: AddressInfoType<T>;
  encryptInfo?: EncryptInfoType;
}

interface ProductInfoType {
  getBindedProducts: () => ProductInfo[];
  bindProduct: (productIdsString: string) => void;
  unbindProduct: (product: ProductInfo) => void;
  onSearchProductByKeyWord: (keyword: string, hookback: (searchResult: ProductInfo[], total: number) => void) => void;
  allowUnbind: boolean;
}

interface AddressInfoType<T> {
  getCityCode: (record: T) => string;
}

interface EncryptInfoType {
  /** 是否显示查看明文按钮 */
  showCheck: () => boolean;
  /** 点击查看明文按钮 */
  onCheckEncrypt: () => void;
}

export interface CrmInfosProps<T> extends FormComponentProps {
  data: T;
  infoItems: InfoItemType<T>[];
  requestUpdateInfo: (params: any) => void;
  title?: string;
}

export interface CrmInfosState {
  /** 记录各个组件的编辑状态 */
  itemEditingStatus: boolean[];
  /** 编辑产品窗口 */
  productModalVisible: boolean;
  searchProductList: ProductInfo[];
  /** 已选中的产品项id + 之前就绑定好的产品id */
  productIds: string[];
  setNoMoreProductsData: boolean;
}

class CrmInfos<T> extends Component<CrmInfosProps<T>, CrmInfosState> {

  constructor(props: CrmInfosProps<T>) {
    super(props);
    this.state = {
      itemEditingStatus: [],
      productModalVisible: false,
      searchProductList: [],
      productIds: [],
      setNoMoreProductsData: false,
    }
  }

  /** 渲染编辑字段的操作按钮 */
  renderActionButtons = (index: string | string[], isEditing: boolean) => {
    return <div className={styles.editingIcon}>
      {
        isEditing ? <>
          <CheckOutlined onClick={() => this.checkClick(index)} />
          <CloseOutlined onClick={() => this.closeClick(index)} style={{ marginLeft: 10 }} />
        </> : <><EditOutlined onClick={() => this.editClick(index)} /></>
      }
    </div>
  }

  /** 渲染查看加密字段的操作按钮 */
  renderCheckEncryptButton = (encryptInfo: EncryptInfoType) => {
    return <div className={styles.editingIcon}>
      <EyeOutlined onClick={() => { encryptInfo.onCheckEncrypt(); }} ></EyeOutlined>
    </div>
  }

  /** 保存编辑项 */
  checkClick = (index: string | string[]) => {
    const { form } = this.props;
    if (typeof (index) == 'string') {
      form.validateFields([index], (err, fieldsValue) => {
        if (err) return;
        if (fieldsValue[index] != this.props.data[index]) {
          const { requestUpdateInfo } = this.props;
          if (requestUpdateInfo) {
            requestUpdateInfo(fieldsValue);
          }
        }
      })
    } else {
      form.validateFields(index, (err, fieldsValue) => {
        if (err) return;
        const { requestUpdateInfo } = this.props;
        if (requestUpdateInfo) {
          requestUpdateInfo(fieldsValue);
        }
      })
    }
    const { itemEditingStatus } = this.state;
    itemEditingStatus[index.toString()] = false;
    this.setState({ itemEditingStatus });
  }

  closeClick = (index: string | string[]) => {
    const { form } = this.props;
    if (typeof (index) == 'string') {
      form.resetFields([index]);
    } else {
      form.resetFields(index);
    }
    const { itemEditingStatus } = this.state;
    itemEditingStatus[index.toString()] = false;
    this.setState({ itemEditingStatus });
  }

  editClick = (index: string | string[]) => {
    // const { form } = this.props;
    // form.resetFields();
    const { itemEditingStatus } = this.state;
    itemEditingStatus[index.toString()] = true;
    this.setState({ itemEditingStatus });
  }

  renderDetailItemSelect = (index: string, label: string, options: { disabled?: boolean, options?: { id: string | number, name: string }[], initialValue?: any, }) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(index, {
            initialValue: options.initialValue
          })(
            <Select style={inputStyle} showSearch size="small" placeholder="未选择"
              optionFilterProp="children" disabled={!!(options.disabled)}>
              {
                options.options && options.options.map(item => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
              }
            </Select>
          )
        }
        {
          this.renderActionButtons(index, itemEditingStatus[index])
        }
      </div>
    </FormItem>

  }

  renderDetailItemNumeric = (index: string, label: string, options: { disabled?: boolean, initialValue?: any, }) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(index, {
            initialValue: options.initialValue,
          })(
            <NumericInput size='small' style={inputStyle} placeholder="请输入" disabled={options.disabled} />
          )
        }
        {
          this.renderActionButtons(index, itemEditingStatus[index])
        }
      </div>
    </FormItem>
  }

  renderDetailItemPhone = (index: string, label: string, options: { disabled?: boolean, initialValue?: any, }, encryptInfo: EncryptInfoType) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(index, {
            rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
              return event.target.value.replace(/\D/g, '')
            },
            initialValue: options.initialValue,
          })(<Input size="small" style={inputStyle} placeholder="" disabled={options.disabled} maxLength={11} />)
        }
        {
          encryptInfo.showCheck && encryptInfo.showCheck() ?
            this.renderCheckEncryptButton(encryptInfo)
            :
            this.renderActionButtons(index, itemEditingStatus[index])
        }
      </div>
    </FormItem>
  }

  renderEncryptTextPhone = (label: string, initialValue: any, encryptInfo: EncryptInfoType) => {
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        <span style={inputStyle} >{initialValue}</span>
        {
          this.renderCheckEncryptButton(encryptInfo)
        }
      </div>
    </FormItem>
  }

  renderEncryptTextWechat = (label: string, initialValue: any, encryptInfo: EncryptInfoType) => {
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        <span style={inputStyle} >{initialValue}</span>
        {
          this.renderCheckEncryptButton(encryptInfo)
        }
      </div>
    </FormItem>
  }

  renderDetailItemWechat = (index: string, label: string, options: { disabled?: boolean, initialValue?: any, }, encryptInfo: EncryptInfoType) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div className={styles.infoItem}>
        {
          getFieldDecorator(index, {
            rules: [{ pattern: new RegExp(/^\w{3,20}$/g, "g"), message: '请输入有效微信号' }],
            getValueFromEvent: (event) => {
              return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
            },
            initialValue: options.initialValue,
          })(<Input size="small" style={inputStyle} placeholder="" disabled={options.disabled} />)
        }
        {
          encryptInfo.showCheck && encryptInfo.showCheck() && options.initialValue ?
            this.renderCheckEncryptButton(encryptInfo)
            :
            this.renderActionButtons(index, itemEditingStatus[index])
        }
      </div>
    </FormItem>
  }

  renderDetailItemAddress = (index: string[], label: string, options: { disabled?: boolean, initialValue?: { code: string, address: string } }) => {
    const { getFieldDecorator } = this.props.form;
    const { itemEditingStatus } = this.state;
    const inputStyle = { width: '50%' };
    return <FormItem label={label}>
      <div >
        <div style={inputStyle}>
          {
            getFieldDecorator(index[0])
              (
                <AreaSelect

                  size="small"
                  level3={true}
                  selectedCode={options.initialValue?.code}
                  areaSelectChange={(code) => {
                    const cityCode = {};
                    cityCode[index[0]] = code;
                    this.props.form.setFieldsValue(cityCode)
                  }}
                  disabled={options.disabled} />
              )
          }
        </div>
        <div className={styles.infoItem}>
          {
            getFieldDecorator(index[1], {
              initialValue: options.initialValue?.address,
            })(<TextArea size="small" style={inputStyle} placeholder="" disabled={options.disabled} />)
          }
          {
            this.renderActionButtons(index, itemEditingStatus[index.toString()])
          }
        </div>
      </div>
    </FormItem>
  }

  renderProductItem = (index: string, label: string, productInfo: ProductInfoType, canEdit?: boolean) => {
    if (!productInfo) return '';
    const bindedProducts = productInfo.getBindedProducts();
    return <FormItem label={label}>
      <div className={styles.productInfoStyle}>
        <div>
          {
            bindedProducts && bindedProducts.length > 0 ? bindedProducts.map((item, index) =>
              <div>
                <span>产品{index + 1}:</span>
                <Tooltip title={"名称：" + item.name + "  品类：" + item.category_name} placement="topLeft" arrowPointAtCenter>
                  <span>{item.merchant_name}  {item.price_min}~{item.price_max}</span>
                </Tooltip>
                {
                  canEdit && productInfo.allowUnbind && (
                    <Button type="link" onClick={() => { productInfo.unbindProduct(item) }}>
                      <DeleteOutlined />
                    </Button>
                  )
                }
              </div>
            ) : (
                <span>无产品</span>
              )
          }
        </div>
        {
          canEdit && <Button type="default" size="small" onClick={() => {
            this.setState({
              productModalVisible: true
            })
          }}><PlusOutlined />添加产品</Button>
        }
        {canEdit && this.renderProductModal(productInfo)}
      </div>
    </FormItem>
  }

  // 数组去重
  duplicateRemoval = (currentArr: any, newArr: any) => {
    let obj = {};
    let list = currentArr.concat(newArr);
    return list.reduce((cur: any, next: any) => {
      obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
      return cur;
    }, []);
  }

  /** 根据关键字搜索产品 */
  handleSearchProductByName = (keyword: string, productInfo: ProductInfoType) => {
    if (keyword) {
      const { onSearchProductByKeyWord } = productInfo;
      onSearchProductByKeyWord(keyword, (searchResult: ProductInfo[], total: number) => {
        console.log(JSON.stringify(searchResult))
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
  handleChangeProduct = (value: any, bindedProductIds: string[]) => {
    let arr1 = [...value];
    let arr2 = [...bindedProductIds];
    if (arr2.length > 0) {
      arr1 = this.poductSpliceCtrl(arr1, arr2);
    }
    this.setState({
      productIds: arr1
    })
  };

  /** 产品绑定确定按钮 */
  handleBindProduct = (productInfo: ProductInfoType) => {
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
        })
        //form.resetFields(["products"]); 

        const { bindProduct } = productInfo;
        if (bindProduct) bindProduct(productIds.join(','))
      }
    });
  }

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
  }

  // 产品搜索选择 ====================   END

  /**
   * 添加产品弹窗
   */
  renderProductModal = (productInfo: ProductInfoType) => {
    const { searchProductList, productModalVisible } = this.state;
    const bindedProducts = productInfo.getBindedProducts();
    if (!bindedProducts) {
      return '';
    }
    const bindedProductIds: string[] = new Array();
    bindedProducts.map(item => bindedProductIds.push(item.id));
    return <Modal
      visible={productModalVisible}
      title="添加产品"
      okText="确定"
      onCancel={() => this.setState({ productModalVisible: false })}
      onOk={() => { this.handleBindProduct(productInfo) }}
      destroyOnClose={true}
    >
      <Form layout='inline'>
        <Form.Item label="产品名称" id="products">
          <PageLoadingSelect
            mode="multiple"
            style={{ width: '260px' }}
            placeholder={'输入产品名称、商家名称、产品品类'}
            loading={false}
            onChange={values => { this.handleChangeProduct(values, bindedProductIds) }}
            // onSelect={(value, option) => this.handleSelectOption(value+"")}
            notFoundContent={searchProductList.length == 0 ? '请输入关键字搜索产品' : ''}
            onKeywordChanged={this.onProductKeywordChanged}
            doSearch={keyword => { this.handleSearchProductByName(keyword, productInfo) }}
            noMoreData={this.state.setNoMoreProductsData}
            optionLabelProp='title'
          >
            {
              searchProductList.length > 0 && searchProductList.map((item, index) => (
                <Select.Option title={item.name} value={item.id} key={item.name}
                  disabled={bindedProductIds.indexOf(item.id) >= 0}>
                  {item.name}{bindedProductIds.indexOf(item.id) >= 0 && <b>（已绑定）</b>} <br />
                  品类：{item.category_name} <br />
                  价格：{item.price_min}～{item.price_max} <br />
                  商家：{item.merchant_name}<br />
                </Select.Option>
              ))
            }
          </PageLoadingSelect>

        </Form.Item>
      </Form>
    </Modal>
  }

  formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } } };

  render() {
    const { infoItems, data, title } = this.props;
    return (
      <Form {...this.formItemLayout} layout='horizontal' className={styles.formStyle}>
        {
          title && <div className={styles.titleFontStyle} >{title}</div>
        }
        {
          infoItems && infoItems.map(item => <>
            {
              item.editType && (item.editable ? item.editable(data) : true) ? (<>
                {
                  item.editType == 'select' && this.renderDetailItemSelect(item.index, item.name, {
                    disabled: !this.state.itemEditingStatus[item.index],
                    options: item.selectOptions ? item.selectOptions() : [],
                    initialValue: item.initialValue ? item.initialValue(data) : data[item.index]
                  })
                }
                {
                  item.editType == 'numeric' && this.renderDetailItemNumeric(item.index, item.name, {
                    disabled: !this.state.itemEditingStatus[item.index],
                    initialValue: item.initialValue ? item.initialValue(data) : data[item.index]
                  })
                }
                {
                  item.editType == 'product' && item.productInfo && this.renderProductItem(item.index, item.name, item.productInfo, true)
                }
                {
                  item.editType == 'address' && this.renderDetailItemAddress(item.index, item.name, {
                    disabled: !this.state.itemEditingStatus[item.index.toString()],
                    initialValue: {
                      code: item.addressInfo?.getCityCode(data),
                      address: data[item.index[1]],
                    }
                  })
                }
                {
                  item.editType == 'phone' && typeof (item.index) == 'string' && item.encryptInfo && this.renderDetailItemPhone(item.index, item.name, {
                    disabled: !this.state.itemEditingStatus[item.index],
                    initialValue: item.initialValue ? item.initialValue(data) : data[item.index]
                  }, item.encryptInfo)
                }
                {
                  item.editType == 'weChat' && typeof (item.index) == 'string' && item.encryptInfo && this.renderDetailItemWechat(item.index, item.name, {
                    disabled: !this.state.itemEditingStatus[item.index],
                    initialValue: item.initialValue ? item.initialValue(data) : data[item.index]
                  }, item.encryptInfo)
                }
              </>)
                : (item.index == 'product' || item.productInfo) ? item.productInfo && this.renderProductItem(item.index, item.name, item.productInfo, false)
                  : item.index == 'phone' && item.encryptInfo?.showCheck && item.encryptInfo.showCheck() ? this.renderEncryptTextPhone(item.name, item.initialValue ? item.initialValue(data) : data[item.index], item.encryptInfo)
                    : item.index == 'weChat' && item.encryptInfo?.showCheck && item.encryptInfo.showCheck() ? this.renderEncryptTextWechat(item.name, item.initialValue ? item.initialValue(data) : data[item.index], item.encryptInfo)
                      :
                      <FormItem label={item.name}>{item.renderText ? item.renderText(data) : item.initialValue ? item.initialValue(data) : data[item.index] && data[item.index].toString().length > 0 ? data[item.index] : '未填写'}</FormItem>
            }

          </>)
        }
      </Form>
    )
  }
}

export default CrmInfos;
