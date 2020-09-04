import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Spin, Form, Card, Select, Row, Col, Input, Radio, Button, message, Checkbox } from 'antd';
import { Action, Dispatch } from 'redux';
import { ConfigList } from "@/pages/CustomerManagement/commondata";
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { StateType } from './model';
import styles from './index.less';
import ImageUpload from '@/components/ImageUpload';

const { Option } = Select;
const FormItem = Form.Item;

interface NewProductProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'newProduct/configCtrl'
      | 'newProduct/getAddProduct'
      | 'newProduct/storeList'
    >
  >;
  loading: boolean;
  config: ConfigList;
  newProduct: StateType;
}

interface NewProductState {
  loading: boolean,
  value: number,
  fileList: [],
  previewVisible: boolean,
  previewImage: '',
  imgList: [],
  categoryDisabled: boolean,
  blurDirty: boolean,
}



@connect(
  ({
    newProduct,
    loading,
  }: {
    newProduct: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newProduct,
    loading: loading.models.newProduct,
  }),
)


class NewProduct extends Component<NewProductProps, NewProductState> {
  constructor(props: NewProductProps) {
    super(props);
    // 初始化
    this.state = {
      loading: false,
      value: 0,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      imgList: [],
      categoryDisabled: true,
      blurDirty: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newProduct/configCtrl'
    })
  }

  onRadioChange = (e: any) => {
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    this.setState({
      categoryDisabled: false
    });
    setFieldsValue({ "merchantId": '' });
    getFieldsValue();
    this.getStoreList(Number(e.slice(0, 1)))
  };

  getStoreList = (category: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newProduct/storeList',
      payload: {
        category: category
      }
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    const { dispatch, form } = this.props;
    const { fileList, imgList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fileList && fileList.map(item => {
        imgList.push(item.url)
      })

      const values = {
        ...fieldsValue,
        accessory: imgList && imgList.join(),
        category: fieldsValue.category ? fieldsValue.category.toString() : '',
      }
      dispatch({
        type: 'newProduct/getAddProduct',
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


  handleFormReset = () => {
    const { form } = this.props;
    // 表单重置
    form.resetFields();
    this.setState({
      fileList: [],
    })
  };

  handleCancel = () => this.setState({ previewVisible: false });

  onUploadDone = (fileList) => {
    this.setState({
      fileList: fileList,
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
    const { loading, categoryDisabled } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      newProduct: { config, storeData }
    } = this.props;
    const { fileList } = this.state;
    const priceMax = getFieldValue('priceMax');

    return (
      <>
        <PageHeaderWrapper >
          <div>
            <Spin spinning={loading} size="large" />
          </div>
          <Card className={styles.card} bordered={false}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSubmit} layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={8}>
                    <FormItem label="产品名称">
                      {getFieldDecorator('name', { rules: [{ required: true, message: "请输入产品名称且不超过20个字段", max: 20 }] })(<Input style={{ width: '100%', }} placeholder="请输入产品名称" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <FormItem label="负责品类：">
                      {getFieldDecorator('category', { rules: [{ required: true, message: "请选择负责品类" }], })(
                        <Checkbox.Group style={{ width: '100%', }} onChange={this.onRadioChange} >
                          {
                            config.category.map(category => (
                              <Checkbox value={category.id} >{category.name}</Checkbox>))
                          }
                        </Checkbox.Group>

                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={10}>
                    <FormItem label="所属商家：">
                      {getFieldDecorator('merchantId',
                        { rules: [{ required: true, message: "请选择所属商家" }] })(
                          <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="请选择所属商家"
                            allowClear
                            optionLabelProp="label"
                            disabled={categoryDisabled}
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
                  <Col span={16}>
                    <FormItem label="产品价格：">
                      <Input.Group style={{ width: '100%' }}>
                        {getFieldDecorator('priceMin', {
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
                        })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最低价格(元)" />
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
                          rules: [
                            { required: false, message: "请填写产品价格", pattern: /^([1-9]\d{0,9})([.]?|(\.\d{1,2})?)$/ig },
                          ],
                        })(
                          <Input
                            style={{
                              width: 100,
                              textAlign: 'center',
                              borderLeftWidth: 0
                            }}
                            placeholder="最高价格(元)"
                          />)}
                      </Input.Group>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="产品单位：">
                      {getFieldDecorator('unit', { rules: [{ required: true, message: "请选择产品单位" }] })(
                        <Select placeholder="选择产品单位"
                          style={{ width: '100%', }}
                          allowClear
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
                        <ImageUpload fileList={fileList} onUploadDone={this.onUploadDone} ></ImageUpload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                  <Col span={8}>
                    <FormItem label="状态：">
                      {getFieldDecorator('status', { rules: [{ required: true, message: "请选择组状态" }] })(
                        <Radio.Group>
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
                  <Col offset={3}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                      <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                    </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    )
  }
}

export default Form.create<NewProductProps>()(NewProduct);
