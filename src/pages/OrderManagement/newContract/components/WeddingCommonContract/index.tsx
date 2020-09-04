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
  Checkbox,
  Row,
  Col,
  message,
  Modal,
  Cascader,
} from 'antd';

import React, { Component, ChangeEvent } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import moment from 'moment';
import { StateType } from './model';

import { ConfigListItem, customerParams, cityInfo } from './data';
import Axios from 'axios';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import URL from '@/api/serverAPI.config';
import { type } from 'os';
import { required } from 'yargs';
import check from '@/components/Authorized/CheckPermissions';
import NumericInput from '@/components/NumericInput';
import { ContractConfigData } from '../../data';
import PaymentPicture from '../PaymentPicture';
import { routerRedux } from 'dva/router';
const { confirm } = Modal;

function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')))
}

//构建state类型
interface pageState {
  contractPicList: []
  billPicList: []
  receivablesPlanList: []
  isReset:boolean
  
}

interface CreateFormProps extends FormComponentProps {
  orderId: string
  categoryId: string
  visible: boolean;
  dispatch: Dispatch<
    Action<
      | 'contractManagement/addContract'
      | 'contractManagement/getContractConfig'
    >
  >;
  loading: boolean;
  contractManagement: StateType;
}


/* eslint react/no-multi-comp:0 */
@connect(
  ({
    contractManagement,
    loading,
  }: {
    contractManagement: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    contractManagement,
    loading: loading.models.contractManagement,
  }),
)

class CreateForm extends Component<CreateFormProps>  {

  static defaultProps = {
    orderId: '',
    categoryId: ''
  };

  state: pageState = {
    contractPicList: [],
    billPicList: [],
    receivablesPlanList: [],
    isReset:false
  }

  setContractPicList = (data: any) => {
    this.setState({
      contractPicList: data
    })
  }

  setBillPicList = (data: any) => {
    this.setState({
      billPicList: data
    })
  }

  setReceivablesPlanList = (data: any) => {
    this.setState({
      receivablesPlanList: data
    })
  }

  handleSubmit = (e: React.FormEvent, isCheck: any) => {
    const { dispatch, form, orderId, categoryId } = this.props;
    const { contractManagement: { contractConfig } } = this.props;
    const { contractPicList, billPicList, receivablesPlanList } = this.state;

    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {

        const channelArr = values['structureId']
        if (channelArr !== undefined) {
          delete values['structureId']
          if (channelArr.length > 0) {
            values['structureId'] = channelArr[channelArr.length - 1]
          }
        }

        const signDate = values['signDate'];
        if (signDate != undefined && signDate != "") {
          delete values['signDate']
          values['signDate'] = moment(signDate).format('YYYY-MM-DD');
        }


        const weddingdate = values['weddingDate'];
        if (weddingdate != undefined && weddingdate != "") {
          delete values['weddingDate']
          values['weddingDate'] = moment(weddingdate).format('YYYY-MM-DD');
        }


        var billPicListStr = ''
        if (billPicList.length > 0) {
          billPicListStr = billPicList.join();
        } else {
          message.info('请上传付款单')
          return
        }

        var contractPicListStr = ''
        if (contractPicList.length > 0) {
          contractPicListStr = contractPicList.join();
        } else {
          message.info('请上传合同照片')
          return
        }

        var receivablesPlanStr = ''
        if (receivablesPlanList.length > 0) {
          receivablesPlanStr = JSON.stringify(receivablesPlanList);
        }

        const valuesResult = {
          ...values,
          'orderId': orderId,
          'customerId': contractConfig.baseInfo.customer_id,
          'category': categoryId,
          'isCheck': isCheck,
          'merchantId': contractConfig.baseInfo.merchant_id,
          'contractPic': contractPicListStr,
          'billPic': billPicListStr,
          'receivablesPlan': receivablesPlanStr,
        }
        dispatch({
          type: 'contractManagement/addContract',
          payload: valuesResult,
          callback: this.onAddContractCallback
        });
      }
    });
  };

  //创建合同回调
  onAddContractCallback = (status: boolean, msg: string, value: string) => {
    if (status) {
      message.success('提交成功');
      this.setState({
        isReset:true
      })
      this.toOrderDetailPage()
    }
  };

  //跳转到订单详情页 合同信息tab
  toOrderDetailPage = () => {
    const { orderId } = this.props;
    const { contractManagement: { contractConfig } } = this.props;
    this.props.dispatch(routerRedux.push({
      pathname: '/order/orderManagement/orderDetails',
      query: {
        orderId: orderId,
        defaultActiveKey: '5',
        customerId:contractConfig.baseInfo.customer_id
      }
    }))
  }



  render() {
    const { form: { getFieldDecorator, getFieldValue }, } = this.props;
    const { contractManagement: { contractConfig, userList } } = this.props;

    const parentMethods = {
      setContractPicList: this.setContractPicList,
      setBillPicList: this.setBillPicList,
      setReceivablesPlanList: this.setReceivablesPlanList,
    };

    return (

      <Card bordered={false} title='合同信息'>
        <div className={styles.tableListForm}>
          <Form

            style={{
              marginTop: 8, width: '100%'
            }}
          >
            <Card bordered={false}>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="合同编号" >
                    {getFieldDecorator('contractNum', { rules: [{ required: true, message: '请输入合同编号', }], })(
                      <Input autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入" />)}
                  </FormItem>
                </Col>



                <Col span={8}>
                  <FormItem label="合同标题" >
                    {getFieldDecorator('contractAlias', { rules: [{ required: true, message: '请输入合同标题', }], })(
                      <Input autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入" />)}
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="客户姓名" ><div style={{ color: '#BFBFBF' }}>{contractConfig.baseInfo.customer_name}</div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="客资来源" ><div style={{ color: '#BFBFBF' }}>线下渠道-自主拓客</div>
                  </FormItem>
                </Col>

              </Row>

              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="签订时间" >
                    {getFieldDecorator('signDate', {
                      rules: [{ required: true, message: '请选择签订时间' }],
                      initialValue: '',
                    })(
                      <DatePicker style={{ width: '100%', }} format="YYYY-MM-DD"
                        
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="商家名称" >
                    {getFieldDecorator('merchant', {
                      rules: [{ required: true, message: '请输入商家名称', }],
                      initialValue: (contractConfig.baseInfo.merchant) ? contractConfig.baseInfo.merchant : ''
                    })(
                      <Input disabled autoComplete="off" allowClear style={{ width: '100%', }} placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>


                <Col span={8}>
                  <FormItem label="合同金额">
                    {getFieldDecorator('totalAmount', {
                      rules: [{ required: true, message: '请输入合同金额' }],
                      initialValue: ''
                    })(
                      <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥"  placeholder="请输入" />
                    )}
                  </FormItem>

                </Col>
                <Col span={8}>
                  <FormItem label="签单金额">
                    {getFieldDecorator('signAmount', {
                      rules: [{ required: true, message: '请输入签单金额' }],
                      initialValue: ''
                    })(
                      <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥"  placeholder="请输入" />
                    )}
                  </FormItem>

                </Col>

              </Row>


              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="婚礼日期" >
                    {getFieldDecorator('weddingDate', {
                      rules: [{ required: false, message: '请选择婚礼时间' }],
                      initialValue: (contractConfig.baseInfo.wedding_date) ? moment(contractConfig.baseInfo.wedding_date, 'YYYY-MM-DD') : '',
                    })(
                      <DatePicker  style={{ width: '100%', }} format="YYYY-MM-DD"
                       
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="是否使用折扣" >
                    {getFieldDecorator('isDiscount', { rules: [{ required: false, message: '', }], })(
                      <Radio.Group style={{ width: '30%', }}>
                        <Radio value={0}>否</Radio>
                        <Radio value={1}>是</Radio>
                      </Radio.Group>
                    )}
                    {getFieldDecorator('discountRemark', { rules: [{ required: false, }], })(
                      <Input autoComplete="off" allowClear style={{ width: '70%', }} placeholder="折扣说明" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                <Col span={16}>
                  <FormItem label="优惠政策" >
                    {getFieldDecorator('preferential', { rules: [{ required: false, message: '请输入优惠政策', }], })(
                      <TextArea rows={2} />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <PaymentPicture {...parentMethods} isReset={this.state.isReset}/>

              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="合同状态" >
                    {getFieldDecorator('status', { rules: [{ required: true, message: '请选择合同状态', }], })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择合同状态"
                        optionFilterProp="children"
                      >
                        {
                          contractConfig.contractStatusList.map(contractStatus => (
                            <Option value={contractStatus.id}>{contractStatus.name}</Option>))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="负责人" >
                    {getFieldDecorator('ownerId', { rules: [{ required: true, message: '请选择负责人', }], })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择负责人"
                        optionFilterProp="children"
                      >
                        {
                          userList.map(user => (
                            <Option value={user.id}>{user.name}</Option>))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>

              </Row>


              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="备注">
                    {getFieldDecorator('remark', { rules: [{ required: false }], })(
                      <TextArea rows={2} allowClear style={{ width: '100%', }} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="所属部门" >
                    {getFieldDecorator('structureId', { rules: [{ required: true, message: '请选择所属部门', }], })(
                      <Cascader showSearch style={{ width: '100%', }} options={contractConfig.structureList}  />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>

            <FormItem wrapperCol={{ span: 100, offset: 2 }} style={{ marginTop: 32,marginLeft: 80 }}>
              <Button style={{ visibility:'hidden' ,width: 100}} htmlType="submit" onClick={(e) => { this.handleSubmit(e, 0) }} >暂存</Button>
              <Button style={{ marginLeft: 20, width: 200 }} type="primary" htmlType="submit" onClick={(e) => { this.handleSubmit(e, 1) }}  >提交审核 </Button>
            </FormItem>
          </Form>
        </div>
      </Card >


    );
  }

}
export default Form.create<CreateFormProps>()(CreateForm);
