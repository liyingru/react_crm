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


export interface ProductEditorProps extends FormComponentProps {
  bindedProducts: ProductInfo[];
  bindProduct: (products: ProductInfo[]) => void;
  unbindProduct: (product: ProductInfo) => void;
  onSearchProductByKeyWord: (keyword: string, hookback: (searchResult: ProductInfo[], total: number) => void) => void;
}

export interface ProductEditorState {

  /** 编辑产品窗口 */
  productModalVisible: boolean;
  searchProductList: ProductInfo[];
  /** 已选中的产品项id + 之前就绑定好的产品id */
  productIds: string[];
  setNoMoreProductsData: boolean;
}

class ProductEditor extends Component<ProductEditorProps, ProductEditorState> {

  constructor(props: ProductEditorProps) {
    super(props);
    this.state = {
      productModalVisible: false,
      searchProductList: [],
      productIds: [],
      setNoMoreProductsData: false,
    }
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
  handleSearchProductByName = (keyword: string) => {
    if (keyword) {
      const { onSearchProductByKeyWord } = this.props;
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
  handleBindProduct = () => {
    const { form } = this.props;
    const { productIds, searchProductList } = this.state
    if (productIds.length == 0) {
      message.error('请选择添加的产品');
      return;
    }
    form.validateFields((err: any, values: any) => {
      if (!err) {

        this.setState({
          productModalVisible: false,
        })

        const { bindProduct } = this.props;
        const products = searchProductList.filter(item => productIds.indexOf(item.id) >= 0)
        if (bindProduct) bindProduct(products)
      }
    });
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

  /**
   * 添加产品弹窗
   */
  renderProductModal = () => {
    const { searchProductList, productModalVisible } = this.state;
    const { bindedProducts } = this.props;
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
      onOk={() => { this.handleBindProduct() }}
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
            doSearch={keyword => { this.handleSearchProductByName(keyword) }}
            noMoreData={this.state.setNoMoreProductsData}
            optionLabelProp='title'
          >
            {
              searchProductList.length > 0 && searchProductList.map((item, index) => (
                <Select.Option title={item.name} value={item.id} key={item.name}
                  disabled={bindedProductIds.indexOf(item.id) >= 0}>
                  {item.name}{bindedProductIds.indexOf(item.id) >= 0 && <b>（已绑定）</b>} <br />
                  品类：{item.category_name} <br />
                  价格：{(item.price_min && item.price_max) ? item.price_min + "~" + item.price_max : "无"} <br />
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
    const { bindedProducts, unbindProduct } = this.props;
    return <div className={styles.productInfoStyle}>
      <div>
        {
          bindedProducts && bindedProducts.length > 0 && bindedProducts.map((item, index) =>
            <div>
              <span>产品{index + 1}:</span>
              <Tooltip title={"名称：" + item.name + "  品类：" + item.category_name} placement="topLeft" arrowPointAtCenter>
                <span>{item.merchant_name}  {(item.price_min && item.price_max) ? item.price_min + "~" + item.price_max : "未填写价格"}</span>
              </Tooltip>
              <Button type="link" onClick={() => { unbindProduct(item) }}>
                <DeleteOutlined />
              </Button>
            </div>
          )
        }
      </div>
      {
        <Button type="primary" onClick={() => {
          this.setState({
            productModalVisible: true
          })
        }}><PlusOutlined />添加产品</Button>
      }
      {this.renderProductModal()}
    </div>
  }
}

export default Form.create<ProductEditorProps>()(ProductEditor);;
