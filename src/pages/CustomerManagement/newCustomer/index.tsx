import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Row,
  Col,
  Checkbox,
  message,
  Modal,
  Cascader,
  Switch,
  Spin,
} from 'antd';
import React, { Component, ChangeEvent } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import AreaSelect from '@/components/AreaSelect';
import e from 'express';
import TransferToUserForm, { FormValueType } from '@/components/TransferToUserForm';
import { range } from 'lodash';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import NumericInput from '@/components/NumericInput';
import CustomerRepeatConfirmModal from '@/components/CustomerRepeatConfirmModal';
import { CustomerInfoState } from './data';
import { ConfigListItem } from '../../CustomerManagement/customerlist/data';
import CustomerSellerCategory from './components/CustomerSellerCategory';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const { confirm } = Modal;
import CrmUtil from '@/utils/UserInfoStorage';


function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')));
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

interface NewCustomerFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<
    Action<
      | 'customerManagement/createReq'
      | 'customerManagement/addLeads'
      | 'customerManagement/transferCustomer'
      | 'customerManagement/demandManagementPage'
      | 'customerManagement/customerManagementPage'
      | 'customerManagement/router'
    >
  >;
} // 构建state类型

interface pageState {
  liveCityCode: string;
  workCityCode: string;
  likeCityCode: string;
  options: [];
  lables: [];
  modalVisible: boolean; // 是否显示转让同事的view

  customerId: string; // 客户id

  phoneStatus: boolean;
  wechatStatus: boolean;
  buttonDisabled: boolean;
  customerInfoState: CustomerInfoState;
  configData: ConfigState;
  confirmVisible: boolean;
  selectingCustomer: any;
  targetSimilarCustomer: any;
  type: string;
  spinning: boolean;
  fromTag: string;
  receive_user: [];
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
  activity: ConfigListItem[];
  hotelFeature: ConfigListItem[];
}

class NewCustomerForm extends Component<NewCustomerFormProps, pageState, ConfigState> {
  // 初始化
  state: pageState = {
    liveCityCode: '',
    workCityCode: '',
    likeCityCode: '',
    options: [],
    lables: [],
    modalVisible: false,
    customerId: '',
    phoneStatus: true,
    wechatStatus: true,
    buttonDisabled: false,
    customerInfoState: {},
    configData: {
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
      activity: [],
    },
    confirmVisible: false,
    selectingCustomer: {},
    targetSimilarCustomer: {},
    type: '',
    spinning: false,
    fromTag: '',
    receive_user: []
  }

  componentDidMount() {
    const { fromTag } = this.props.location.query;
    this.setState({
      fromTag: fromTag
    })
    //配置信息
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              configData: res.data.result
            })
          }
        }
      );
  }


  //跳转到相关列表管理主页方法
  handleCustomerManagementHomePage = () => {
    const { dispatch } = this.props;
    if (this.state.fromTag == 'demand') {
      localStorage ?.setItem('demandListRefreshTag', 'reset');
      history.back();
    } else if (this.state.fromTag == 'leads') {
      localStorage ?.setItem('leadsListRefreshTag', 'reset');
      history.back();
    } else if (this.state.fromTag == 'dxlLeads') {
      localStorage ?.setItem('leadsListRefreshTag', 'reset');
      history.back();
    } else {
      localStorage ?.setItem('demandListRefreshTag', 'reset');
      dispatch({
        type: 'customerManagement/customerManagementPage'
      });
    }
  }

  handleCancelTransfer = () => {
    // 取消转让后依旧跳转到客户管理主页
    this.handleCustomerManagementHomePage();
  }; // 按钮是否可用

  setButtonDisabled = (flag: boolean) => {
    this.setState({
      buttonDisabled: flag,
      spinning: flag,
    });
  }; // 添加客户

  handleSubmit = (data: Object) => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { phone } = values;

        if (phone.indexOf('*') != -1) {
          values.phone = this.state.customerInfoState.encrypt_phone;
        }

        // if (values["category"] && values["category"].length > 0) {
        //   values['category'] = values["category"].join()
        // }

        if (values['channel'] && values['channel'].length > 0) {
          values['channel'] = values['channel'][values['channel'].length - 1]
        }

        if (values['contactTime']) {
          values['contactTime'] = moment(values['contactTime']).format('YYYY-MM-DD HH:mm')
        }

        let weddingDateFrom;
        let weddingDateEnd;
        const date_range_time = values.weddingDate;

        if (date_range_time) {
          delete values.weddingDate;
          weddingDateFrom = moment(date_range_time[0]).format('YYYY-MM-DD');
          weddingDateEnd = moment(date_range_time[1]).format('YYYY-MM-DD');
        }

        const valuesResult = {
          ...values,
          'weddingDateFrom': weddingDateFrom,
          'weddingDateEnd': weddingDateEnd,
          'liveCityCode': this.state.liveCityCode,
          'workCityCode': this.state.workCityCode,
          'likeCityCode': this.state.likeCityCode,
          'categoryReq': data,
        }

        dispatch({
          type: 'customerManagement/createReq',
          payload: valuesResult,
          callback: this.onAddCustomerCallback,
        });
      } else {
        this.setState({
          buttonDisabled: false,
          spinning: false,
        });
      }
    });
  }; // 添加客户回调

  onAddCustomerCallback = (result: boolean, msg: string, customer_id: string) => {
    this.setState({
      buttonDisabled: false,
      spinning: false,
    });

    if (result) {
      message.success(msg);
      this.handleModalVisible(false);
      this.handleCustomerManagementHomePage();
    } else {
      // 添加客户失败，并提示原因
      // message.error(msg);
      this.handleModalVisible(false);
    }
  }; // 意向区域城市回调

  cityAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      likeCityCode: code,
    });
  }; 
  
  // 居住地址回调

  liveAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      liveCityCode: code,
    });
  }; // 工作地址回调

  workAreaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.setState({
      workCityCode: code,
    });
  };



  //渠道来源选择监听
  onChannelChange = (value) => {

    const valuesResult =
    {
      'type': '2',
      'channelId': value[value.length-1]
    }
    //配置信息
    Axios.post(URL.getXPFlowInfo,valuesResult)
      .then(
        res => {
          if (res.code == 200) {
            this.setState({
              receive_user: res.data.result.receive_user
            })
          }
        }
      );
  }




  //品类选择监听
  onCategoryChange = (e: any) => {

    this.setState({
      options: []
    });

    var arr = [];
    arr.push(e.target.value);

    this.setState({
      options: arr
    });
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag, // !!可以把undefined转成false
    });
  };

  onWechatOnChange = e => {
    const { form } = this.props;

    if (e.target.value.length > 0) {
      this.setState({
        phoneStatus: false,
      });
      const phoneValue = form.getFieldValue('phone');
      form.setFieldsValue({
        phone: phoneValue,
      });
    } else {
      this.setState({
        phoneStatus: true,
      });
    }
  };

  phonePattern = () => {
    if (this.state.customerInfoState.phone) {
      if (this.state.customerInfoState.phone.indexOf('*') != -1) {
        return undefined;
      }
      return new RegExp(/^\d{11}$/, 'g');
    }
    return new RegExp(/^\d{11}$/, 'g');
  }; // 手机号输入监听

  onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const that = this;
    const { form } = this.props;

    if (e.target.value.length > 0) {
      that.setState({
        wechatStatus: false,
      });
    } else {
      that.setState({
        wechatStatus: true,
      });
    }

    if (e.target.value.length == 11) {
      const valuesResult = {
        type: '1',
        phone: e.target.value,
      }; // 获取客户信息

      Axios.post(URL.getCustomerInfo, valuesResult).then(res => {
        if (res.code == 200) {
          if (res.data.result.customer_id) {
            if (res.data.result.repeat_status == 1) {
              that.showCustomerConfirm(res.data.result);
            } else {
              that.showParentCustomerConfirm('1', res.data.result);
            }
          }
        }
      });
      const wechatValue = form.getFieldValue('wechat');
      form.setFieldsValue({
        wechat: wechatValue,
      });
    }
  };

  onWechatOnBlur = e => {
    const that = this;

    if (e.target.value.length > 0) {
      const valuesResult = {
        type: '2',
        weChat: e.target.value,
      }; // 通过微信号查看客户信息

      Axios.post(URL.getCustomerInfo, valuesResult).then(res => {
        if (res.code == 200) {
          if (res.data.result.customer_id) {
            if (res.data.result.repeat_status == 1) {
              that.showCustomerConfirm(res.data.result);
            } else {
              that.showParentCustomerConfirm('2', res.data.result);
            }
          }
        }
      });
    }
  }; // 是否同步客户信息弹框

  showCustomerConfirm = (customerInfoState: any) => {
    const that = this;
    confirm({
      title: '该客户基础信息已存在，是否同步数据？',
      okText: '确定',
      cancelText: '取消',
      centered: true,

      onOk() {
        that.setState({
          customerInfoState, // options: bookTagIntArr
        });
      },

      onCancel() {
        console.log('取消');
      },
    });
  }; // 是否同步客户信息弹框

  showParentCustomerConfirm = (type: any, customerInfoState: any) => {
    this.setState({
      selectingCustomer: customerInfoState,
      type,
    });
    const valuesResult = {
      type: '4',
      customerId: customerInfoState.similar_id,
    }; // 获取客户信息

    Axios.post(URL.getCustomerInfo, valuesResult).then(res => {
      if (res.code == 200) {
        if (res.data.result.customer_id) {
          this.setState({
            confirmVisible: true,
            targetSimilarCustomer: res.data.result,
          }); // this.showParentCustomerDialog(type,customerInfoState, res.data.result)
        }
      }
    });
  };

  showParentCustomerDialogOnOk = () => {
    const { form } = this.props;
    this.setState({
      customerInfoState: this.state.targetSimilarCustomer,
      confirmVisible: false,
    });

    if (this.state.type == '2') {
      form.setFieldsValue({
        wechat: this.state.targetSimilarCustomer.wechat,
      });
    } else if (this.state.type == '1') {
      form.setFieldsValue({
        phone: this.state.targetSimilarCustomer.phone,
      });
    }
  };

  showParentCustomerDialogOnCancel = () => {
    this.setState({
      confirmVisible: false,
    });
    const { form } = this.props;

    if (this.state.type == '2') {
      form.setFieldsValue({
        wechat: '',
      });
    } else if (this.state.type == '1') {
      form.setFieldsValue({
        phone: '',
      });
    }

    const phoneValue = form.getFieldValue('phone');
    const wechatValue = form.getFieldValue('wechat');

    if (!phoneValue && !wechatValue) {
      this.setState({
        wechatStatus: true,
        phoneStatus: true,
      });
    }
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { modalVisible, customerInfoState, configData } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleCancelTransfer: this.handleCancelTransfer,
    };
    return (
      <PageHeaderWrapper title="新建客资">
        <div className={styles.tableListForm}>
          <Form layout="inline">
            <Card bordered={false} title="基础信息">
              <Row
                gutter={{
                  md: 6,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col span={8}>
                  <FormItem label="客资来源">
                    {getFieldDecorator('channel', {
                      rules: [
                        {
                          required: true,
                          message: '请选择客资来源',
                        },
                      ],
                    })(
                      <Cascader
                        onChange={this.onChannelChange}
                        placeholder="请选择客资来源"
                        showSearch
                        style={{
                          width: '100%',
                        }}
                        options={configData.channel}
                      />,
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="客户姓名">
                    {getFieldDecorator('customerName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入客户姓名',
                        },
                      ],
                      initialValue: customerInfoState.customer_name,
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入客户姓名"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="手机号码">
                    {getFieldDecorator('phone', {
                      rules: [{ required: this.state.phoneStatus, pattern: this.phonePattern, min: 11, message: '请输入有效手机号码' }], getValueFromEvent: (event) => {
                        return event.target.value.replace(/\D/g, '')

                      },
                      initialValue: customerInfoState.phone,
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        maxLength={11}
                        style={{
                          width: '100%',
                        }}
                        placeholder="手机号/微信号二选一录入即可"
                        onChange={this.onPhoneChange}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{
                  md: 6,
                  lg: 24,
                  xl: 48,
                }}
              >
                {/* 未接/拒接、需求未明确、意向客户、已派单、不接受服务、第三方代找、问题单，其他 */}
                <Col span={8}>
                  <FormItem label="回访结果">
                    {getFieldDecorator('followStatus', {
                      rules: [
                        {
                          required: true,
                          message: '请选择回访结果',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择回访结果"
                        style={{
                          width: '100%',
                        }}
                      >
                        {configData.customerFollowStatus.map(customerFollowStatus => (
                          <Option value={customerFollowStatus.id}>
                            {customerFollowStatus.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="性别">
                    {getFieldDecorator('gender', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                      initialValue: customerInfoState.gender ? customerInfoState.gender : undefined,
                    })(
                      <Select
                        placeholder="请选择性别"
                        style={{
                          width: '100%',
                        }}
                      >
                        {configData.gender.map(gender => (
                          <Option value={gender.id}>{gender.name}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="微信号">
                    {getFieldDecorator('wechat', {
                      rules: [
                        {
                          required: this.state.wechatStatus,
                          pattern: new RegExp(/^\w{1,20}$/g, 'g'),
                          message: '请输入有效微信号',
                        },
                      ],
                      getValueFromEvent: event => {
                        return event.target.value.replace(/[\u4e00-\u9fa5]/g, '');
                      },
                      initialValue: customerInfoState.wechat,
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        style={{
                          width: '100%',
                        }}
                        placeholder="手机号/微信号二选一录入即可"
                        onBlur={this.onWechatOnBlur}
                        onChange={this.onWechatOnChange}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{
                  md: 6,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col span={8}>
                  <FormItem label="婚期">
                    {getFieldDecorator('weddingDate', { rules: [{ required: true, message: "请设置婚期" }], initialValue: customerInfoState.wedding_date_from && customerInfoState.wedding_date_end ? [moment(customerInfoState.wedding_date_from, 'YYYY-MM-DD'), moment(customerInfoState.wedding_date_end, 'YYYY-MM-DD')] : undefined })(
                      <RangePicker style={{ width: '100%', }} format="YYYY-MM-DD"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="客户身份">
                    {getFieldDecorator('identity', {
                      rules: [
                        {
                          required: true,
                          message: '请选择客户身份',
                        },
                      ],
                      initialValue: customerInfoState.identity
                        ? customerInfoState.identity
                        : undefined,
                    })(
                      <Select
                        placeholder="请选择客户身份"
                        style={{
                          width: '100%',
                        }}
                      >
                        {configData.identity.map(identity => (
                          <Option value={identity.id}>{identity.name}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="方便联系时间">
                    {getFieldDecorator('contactTime', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <DatePicker
                        style={{
                          width: '100%',
                        }}
                        placeholder="请选择时间"
                        showTime={{
                          format: 'HH:mm',
                          placeholder: '请选择时间',
                        }}
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={{ md: 6, lg: 10, xl: 5 }}>
                <Col span={11}>
                  <FormItem label="居住地址" >
                    <AreaSelect level3={true} areaSelectChange={this.liveAreaSelectChange} selectedCode={customerInfoState.live_city_code ? customerInfoState.live_city_code : undefined} />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('liveAddress', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                      initialValue: customerInfoState.live_address,
                    })(
                      <Input
                        allowClear
                        placeholder="详细地址"
                        style={{
                          width: '100%',
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={{ md: 6, lg: 24, xl: 5 }}>
                <Col span={11}>
                  <FormItem label="工作地址">
                    <AreaSelect level3={true} areaSelectChange={this.workAreaSelectChange} selectedCode={customerInfoState.work_city_code ? customerInfoState.work_city_code : undefined} />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('workAddress', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                      initialValue: customerInfoState.work_address,
                    })(
                      <Input
                        allowClear
                        placeholder="详细地址"
                        style={{
                          width: '100%',
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row
                gutter={{
                  md: 6,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col span={8}>
                  <FormItem label="推荐人">
                    {getFieldDecorator('referrerName', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入推荐人姓名"
                      />,
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="推荐手机">
                    {getFieldDecorator('referrerPhone', {
                      rules: [
                        {
                          required: false,
                          pattern: new RegExp(/^\d{11}$/, 'g'),
                          message: '请输入有效手机号码',
                        },
                      ],
                      getValueFromEvent: event => {
                        return event.target.value.replace(/\D/g, '');
                      },
                      initialValue: '',
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        maxLength={11}
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入推荐人手机号"
                      />,
                    )}
                  </FormItem>
                </Col>

                <Col span={8} >
                  <FormItem label="返佣"  >
                    {getFieldDecorator('commission')(
                      <Input maxLength={30} style={{ width: '100%' }} placeholder="请输入返佣" />
                    )}

                  </FormItem>
                </Col>
              </Row>


              <Row gutter={{ md: 6, lg: 24, xl: 5 }}>
                <Col span={11}>
                  <FormItem label="客户区域" >
                    <AreaSelect selectedCode={customerInfoState.like_city_code ? customerInfoState.like_city_code : undefined} areaSelectChange={this.cityAreaSelectChange} level3={true} />
                  </FormItem>
                </Col>
                <Col span={5} />
                {
                  (CrmUtil.getCompanyType() == 2 && configData.activity && configData.activity.length > 0) ?
                    <Col span={8}>
                      <FormItem label="投放活动" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('activityId', { rules: [{ required: false }], })(
                          <Select placeholder="请选择投放活动" style={{ width: '100%', }}>
                            {
                              configData.activity.map(activity => (
                                <Option value={activity.id}>{activity.name}</Option>))
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    : undefined
                }
              </Row>
            </Card>
    
            <Spin spinning={this.state.spinning} size='large'>
              <Card bordered={false} title="业务需求">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col span={24}>
                    <FormItem label="业务品类">
                      {getFieldDecorator('category', { rules: [{ required: true, message: "请选择业务品类" }], })(
                        <Radio.Group style={{ width: '100%', }} onChange={this.onCategoryChange} >
                          {
                            configData.category.map(category => (
                              <Radio value={category.id} >{category.name}</Radio>))
                          }
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <CustomerSellerCategory
                  receiveUser={this.state.receive_user}
                  setButtonDisabled={this.setButtonDisabled}
                  buttonDisabled={this.state.buttonDisabled}
                  validate={this.handleSubmit}
                  configData={configData}
                  submitting={submitting} checkCategorys={this.state.options} />
              </Card>
            </Spin>
          </Form>
        </div>
        <CustomerRepeatConfirmModal
          title="提示"
          goText="请选择父客户。"
          visible={this.state.confirmVisible}
          currentCustomer={this.state.selectingCustomer}
          targetSimilarCustomer={this.state.targetSimilarCustomer}
          onOk={this.showParentCustomerDialogOnOk}
          onCancel={this.showParentCustomerDialogOnCancel}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<NewCustomerFormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['leadManagementAndFormBasicForm/submitRegularForm'],
  }))(NewCustomerForm),
);
