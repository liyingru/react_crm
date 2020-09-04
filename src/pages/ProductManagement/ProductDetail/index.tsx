import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Spin, Form, Card, Select, Row, Col, Input, Radio, Button, message, Modal } from 'antd';
import { Action, Dispatch } from 'redux';
import { ConfigList } from "@/pages/CustomerManagement/commondata";
import { connect } from 'dva';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/ImageUpload';
import { routerRedux } from 'dva/router';
import { StateType } from './model';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;

interface ProductDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'productDetail/configCtrl'
      | 'productDetail/getEditProduct'
      | 'productDetail/storeList'
      | 'productDetail/getDetails'
      | 'productDetail/delProduct'
    >
  >;
  loading: boolean;
  config: ConfigList;
  productDetail: StateType;
}

interface ProductDetailState {
  loading: boolean,
  value: number,
  radioValue: number,
  fileList: '',
  previewVisible: boolean,
  previewImage: '',
  imgList: [],
  detailData: {},
  allDisabled: boolean,
  flag: boolean,
}



@connect(
  ({
    productDetail,
    loading,
  }: {
    productDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    productDetail,
    loading: loading.models.productDetail,
  }),
)


class ProductDetail extends Component<ProductDetailProps, ProductDetailState> {
  constructor(props: ProductDetailProps) {
    super(props);
    // 初始化
    this.state = {
      loading: false,
      value: 0,
      radioValue: 1,
      fileList: '',
      previewVisible: false,
      previewImage: '',
      imgList: [],
      detailData: {},
      allDisabled: false,
      flag: false
    }
  }

  componentDidMount() {
    const { dispatch, form: { setFieldsValue, getFieldsValue } } = this.props;
    const id = this.props.location.query.id
    dispatch({
      type: 'productDetail/getDetails',
      payload: {
        id: id,
      },
      callback: (res: any) => {
        this.setState({
          detailData: res.data.result,
          allDisabled: true,
          fileList: res.data.result.accessory
        })
        setFieldsValue({ "category": res.data.result.category });
        getFieldsValue();
        this.getStoreList(res.data.result.category)
      }
    });
    dispatch({
      type: 'productDetail/configCtrl'
    })
  }

  onRadioChange = (e: any) => {
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    this.setState({
      radioValue: e.target.value,
    });
    setFieldsValue({ "merchantId": '' });
    getFieldsValue();
    this.getStoreList(e.target.value)
  };

  getStoreList = (category: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productDetail/storeList',
      payload: {
        category: category
      }
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { fileList, imgList } = this.state;
    const id = this.props.location.query.id;
    // console.log(fileList,'-----fileList')
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fileList && fileList.map(item => {
        if (item.status) {
          imgList.push(item.url)
        } else {
          imgList.push(item)
        }
      })

      const values = {
        ...fieldsValue,
        id: id,
        accessory: imgList.toString()
      }

      // console.log(values,'-----values')

      dispatch({
        type: 'productDetail/getEditProduct',
        payload: values,
        callback: (status: boolean, msg: string) => {
          if (status) {
            message.success(msg);
            form.resetFields();
            this.setState({
              fileList: [],
            })
            localStorage.setItem('isRefresh', 'productIsRefresh')
            dispatch(routerRedux.push({
              pathname: '/product/productHome'
            }))
          }
        }
      });

    });
  };

  onUploadDone = (fileList) => {
    this.setState({
      fileList: fileList,
    })
  }

  handleDel = () => {
    const { dispatch } = this.props;
    const id = this.props.location.query.id;
    confirm({
      title: '是否确认删除产品?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'productDetail/delProduct',
          payload: {
            id: id,
          },
          callback: () => {
            message.success('删除成功')
            localStorage.setItem('isRefresh', 'productIsRefresh')
            dispatch(routerRedux.push({
              pathname: '/product/productHome'
            }))
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleFormCancel = () => {
    const { form } = this.props;
    const { detailData } = this.state;
    form.resetFields();
    this.setState({
      allDisabled: true,
      flag: false,
      fileList: detailData.accessory
    })
  }

  handleEdit = () => {
    this.setState({
      allDisabled: false,
      flag: true
    })
  }

  renderStyle = (type: any) => {
    if (type == '婚宴') {
      return styles.wedding_tag
    } else if (type == '婚庆') {
      return styles.wedding_celebration_tag
    } else if (type == '婚车') {
      return styles.car_tag
    } else if (type == '婚纱摄影') {
      return styles.photography_tag
    } else if (type == '庆典') {
      return styles.celebration_tag
    } else if (type == '一站式') {
      return styles.stop_tag
    }
  }

  render() {
    const { loading, detailData, allDisabled, flag } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      productDetail: { config, storeData }
    } = this.props;
    const { fileList } = this.state;
    const priceMax = getFieldValue('priceMax');

    return (
      <>
        <PageHeaderWrapper title={flag ? '编辑产品' : '产品详情'}>
          <div>
            <Spin spinning={loading} size="large" />
          </div>
          <Card className={styles.card} bordered={false}>
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={8}>
                    <FormItem label="产品名称">
                      {getFieldDecorator('name', { rules: [{ required: true, message: "请输入产品名称且不超过20个字段", max: 20 }], initialValue: detailData && detailData.name })(
                        <Input style={{ width: '100%', }} placeholder="请输入成员" disabled={allDisabled} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <FormItem label="负责品类：">
                      {getFieldDecorator('category',
                        { rules: [{ required: true, message: "请选择负责品类" }], initialValue: detailData && detailData.category })(
                          <Radio.Group name="radiogroup" style={{ width: '100%' }} onChange={this.onRadioChange} value={this.state.radioValue} disabled={allDisabled}>
                            {config.category && config.category.map((content, index) => (
                              <Radio key={content.id} value={content.id} >
                                {content.name}
                              </Radio>
                            ))}
                          </Radio.Group>,
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={10}>
                    <FormItem label="所属商家：">
                      {getFieldDecorator('merchantId',
                        { rules: [{ required: true, message: "请选择所属商家" }], initialValue: detailData && detailData.merchant_id })(
                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="请选择所属商家"
                            allowClear
                            disabled={allDisabled}
                            optionLabelProp="label"
                            filterOption={(input, option) =>
                              option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {storeData && storeData.map(item =>
                              <Option value={item.id} label={item.name}>
                                <div>
                                  <div className={styles.store_top}>
                                    <span>{item.name}</span><span className={this.renderStyle(item.category_name)}>{item.category_name}</span>
                                  </div>
                                  <div>所在区域：{item.city} {item.region ? '-' : ''}{item.region}</div>
                                </div>
                              </Option>)}
                          </Select>
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={8}>
                    <FormItem label="产品价格：">
                      <Input.Group compact>
                        {getFieldDecorator('priceMin', {
                          rules: [
                            { required: false, message: "请填写产品价格", pattern: /^([1-9]\d{0,9})([.]?|(\.\d{1,2})?)$/ig, },
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
                          initialValue: detailData && detailData.price_min
                        })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最低价格(元)" disabled={allDisabled} />
                        )}
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
                          initialValue: detailData && detailData.price_max,
                          rules: [{ required: false, message: "请填写产品价格", pattern: /^([1-9]\d{0,9})([.]?|(\.\d{1,2})?)$/ig, }],
                        })(
                          <Input
                            style={{
                              width: 100,
                              textAlign: 'center',
                              borderLeftWidth: 0
                            }}
                            disabled={allDisabled}
                            placeholder="最高价格(元)"
                          />)}
                      </Input.Group>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="产品单位：">
                      {getFieldDecorator('unit', { rules: [{ required: true, message: "请选择产品单位" }], initialValue: detailData && detailData.unit })(
                        <Select placeholder="选择产品单位"
                          style={{ width: '100%', }}
                          allowClear
                          disabled={allDisabled}
                          optionLabelProp="label">
                          {config.productUnit && config.productUnit.map(item => <Option value={item.name} label={item.name}>
                            {item.name}
                          </Option>)}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={15}>
                    <FormItem label="上传附件：">
                      {getFieldDecorator('accessory')(
                        <ImageUpload fileList={fileList} onUploadDone={this.onUploadDone} disabled={allDisabled}></ImageUpload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                  <Col span={8}>
                    <FormItem label="状态：">
                      {getFieldDecorator('status', { rules: [{ required: true, message: "请选择组状态" }], initialValue: detailData && detailData.status })(
                        <Radio.Group disabled={allDisabled}>
                          {config.auditConfigStatus && config.auditConfigStatus.map(item => <Radio value={item.id}>{item.name}</Radio>)}
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                  <Col span={8}>
                    <FormItem label="创建人：">
                      {JSON.parse(window.localStorage.getItem('gcrm-user-info')).name}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  {flag ?
                    <Col offset={3}>
                      <Form.Item>
                        <Button type="primary" onClick={this.handleSubmit}>
                          保存
                    </Button>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleFormCancel}>
                          取消
                    </Button>
                      </Form.Item>
                    </Col> : <Col offset={3}>
                      <Form.Item>
                        <Button type="primary" onClick={this.handleEdit}>
                          编辑
                    </Button>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleDel}>
                          删除
                    </Button>
                      </Form.Item>
                    </Col>}
                </Row>
              </Form>
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    )
  }
}

export default Form.create<ProductDetailProps>()(ProductDetail);
