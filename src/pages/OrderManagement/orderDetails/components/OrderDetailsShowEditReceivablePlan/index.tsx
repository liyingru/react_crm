import { Modal, Form, Select, DatePicker, Input, Card, Row, Col, Button, Menu, Dropdown, message, Divider, Spin } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { PlansItem, ReceivablesRecord, rderInfoModel, ReceivablesRecord } from '../../data';
import moment from 'moment';
import { node, any, string } from 'prop-types';
import ShowEditReceivablePlanItem from "../OrderDetailsShowEditReceivablePlanItem"
import NumericInput from '@/components/NumericInput';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
import CrmUtil from '@/utils/UserInfoStorage';

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const { MonthPicker, RangePicker } = DatePicker;


interface CollectionsProps extends FormComponentProps {
  saveFunction: Function;
  onCancel: Function;
  visible: boolean;
  data: ReceivablesRecord[];
  selectModel: ReceivablesRecord;
  orderInfo: rderInfoModel;
  contractInfo: ReceivablesRecord;
}

let id = 0;


function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function disabledDateTime(current: moment) {
  let currentTime = new Date(new Date().getTime())

  var Min = currentTime.getMinutes();
  if (Min < 60) {
    Min = Min + 1
  }
  let temp = false
  if (current) {
    let c = current.format('YYYYMMDD');
    let m = moment().format('YYYYMMDD');
    temp = c == m;
  }

  if (temp) {
    return {
      disabledHours: () => range(0, 24).splice(0, currentTime.getHours()),
      disabledMinutes: () => range(0, 60).splice(0, Min),
    };
  } else {
    return {};
  }

}


const CollectionCreateForm = Form.create({ name: 'form_in_modal_1' })(
  // eslint-disable-next-line
  class extends React.Component {

    constructor(props: Readonly<{}>) {
      super(props);
      this.state = {
        showList: [],
        combined: 0,
        isDeleteRequestFinish: true,
      };
    }

    componentWillReceiveProps = (nextProps: any) => {
      const { valueList, contractInfo } = nextProps;
      const array: any[] = [];
      const dataL: any[] = [];
      id = 0;
      valueList && valueList.map((item: PlansItem) => {
        array.push(id++)
        dataL.push(item)
      })
      this.setState({
        showList: array,
        isDeleteRequestFinish: true,
      }, () => {
        this.upLoadCombined()
      })


    }

    add = () => {
      const { form, addItem } = this.props;

      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);

      form.setFieldsValue({
        keys: nextKeys,
      });

      addItem(id)

    }

    remove = (value: any, k: any, index: any) => {
      // is_del  0:不能删除 1:可以删除
      if (value && value?.is_del == 0) {
        message.error('已有回款记录不能删除');
      } else {
        const { form, removeItem } = this.props;

        let keys = form.getFieldValue('keys');

        keys.splice(index, 1)

        form.setFieldsValue({
          keys: keys,
        });

        removeItem(value, k, index)
      }
    }



    onChangeOneData = (value: any, data: any, index: number) => {
      const { changeOneData } = this.props;
      changeOneData(value, data, index)
    }

    onChangeTowData = (value: any, data: any, index: number) => {
      const { changeTowData } = this.props;
      changeTowData(value, data, index)
    }

    upLoadCombined = () => {

      const { valueList } = this.props;
      let money = 0
      if (valueList) {
        valueList.map((item: PlansItem) => {
          money = money + parseInt(item.plan_receivables_money ? item.plan_receivables_money : '0', 0)
        })
      }
      console.log(money)
      this.setState({
        combined: money,
      })
    }

    onChangeContract = (e: any) => {
      const { contractList, onChangeContractDetail } = this.props;

      contractList?.map((item) => {
        if (item.id == e) {
          console.log(item)

          onChangeContractDetail(item)

          this.props?.form?.setFieldsValue({
            "contractAlias": item?.contract_alias,
          })

          this.props?.form?.setFieldsValue({
            "contractAmount": item?.sign_amount,
          })

          this.props?.form?.setFieldsValue({
            "signDate": item.sign_date ? moment(item.sign_date, dateFormat) : '',
          })
        }
      })
    }


    render() {
      const { visible, onCancel, onCreate, form, isHaveContractInfo, valueList, orderInfo, contractList, contractInfo } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      const { showList, combined } = this.state;
      const { Option } = Select;

      const formItemLayout =
      {
        labelCol: {
          xs: { span: 10 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }
      getFieldDecorator('keys', { initialValue: showList ? showList : [] });
      const keys = getFieldValue('keys')

      const formItems = keys.map((k: any, index: React.ReactText) => (
        <ShowEditReceivablePlanItem
          onChangeOneFunction={this.onChangeOneData}
          onChangeTowFunction={this.onChangeTowData}
          deleteFunction={this.remove}
          data={valueList[index]}
          index={index}
          key={k}
        />
      ))

      return (
        <Modal
          centered={true}
          visible={visible}
          title="配置回款计划"
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
          width={'40%'}
        >
          <div style={{ position: 'relative' }}>
            <Form layout='horizontal'>

              {isHaveContractInfo ? <div >
                <Form.Item label="合同编号：" {...formItemLayout}>
                  {getFieldDecorator('contractNum', {
                    initialValue: contractInfo && contractInfo.contract_num,
                    rules: [{ required: false, message: '请填写合同编号' }]
                  })(
                    <Input placeholder="请填写合同编号" disabled={isHaveContractInfo}></Input>
                  )}
                </Form.Item>
              </div> : <div >

                  <Form.Item label="合同编号：" {...formItemLayout}>
                    {getFieldDecorator('contractNum', {
                      initialValue: contractInfo && contractInfo.id,
                      rules: [{ required: false, message: '请选择合同编号' }]
                    })(
                      <Select disabled={true} optionLabelProp='title' placeholder="请选择合同编号" onSelect={this.onChangeContract}>
                        {contractList && contractList.map((item) => {
                          return (
                            <Option title={item?.contract_num} value={item?.id}>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    {item?.sign_date}{item?.contract_alias}{'&'}{item?.create_by}
                                  </div>
                                  <div>
                                    {item?.receivables_status_txt}
                                  </div>
                                </div>
                                <div>
                                  合同编号：{item?.contract_num}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    签约商家：{CrmUtil.getCompanyName()}
                                  </div>
                                  <div>
                                    {item?.receivables_amount}/{item?.total_amount}元
                                                                </div>
                                </div>
                                <Divider style={{ marginBottom: 0 }} />
                              </div>
                            </Option>
                          );
                        })}

                      </Select>
                    )}
                  </Form.Item>
                </div>}


              <div >
                <Form.Item label="合同标题：" {...formItemLayout}>
                  {getFieldDecorator('contractAlias', {
                    initialValue: contractInfo && contractInfo.contract_alias,
                    rules: [{ required: false, message: '请填写合同标题' }]
                  })(
                    <Input placeholder="请填写合同标题" disabled={true}></Input>
                  )}
                </Form.Item>
              </div>

              <div >
                <Form.Item label="合同总金额：" {...formItemLayout}>
                  {getFieldDecorator('contractAmount', {
                    initialValue: contractInfo && contractInfo.sign_amount,
                    // rules: [{ required: true, message: '请填写合同总金额' }]
                    rules: [{ required: true, message: '请填写回款金额' }],
                  })(
                    <NumericInput prefix="￥" placeholder="请填写合同总金额" disabled={true} />
                  )}
                </Form.Item>
              </div>

              <div >
                <Form.Item label="签约日期：" {...formItemLayout}>
                  {getFieldDecorator('signDate', {
                    initialValue: contractInfo && (contractInfo.sign_date && moment(contractInfo.sign_date, dateFormat)),
                    rules: [{ required: true, message: '请选择签约日期' }]
                  })(
                    <DatePicker placeholder='请选择签约日期' disabled={true} disabledDate={disabledDate} />
                  )}
                </Form.Item>
              </div>
              <Card style={{ borderRadius: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
                  <Button type='primary' onClick={this.add} disabled={contractInfo?.id ? false : true}>添加</Button>
                </div>
                <div>
                  <Row gutter={[8, 16]} style={{ marginTop: 10, marginBottom: 10 }}>
                    <Col span={6}>
                      <div className={styles.headerViewDIYTableStyle}>
                        期次
                                        </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles.headerViewDIYTableStyle}>
                        计划回款日期
                                        </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles.headerViewDIYTableStyle}>
                        计划回款金额
                                        </div>
                    </Col>
                    <Col span={6}>
                      <div className={styles.headerViewDIYTableStyle}>
                        操作
                                        </div>
                    </Col>
                  </Row>

                  {formItems}
                </div>
              </Card>
              <div className={styles.headerViewDIYTableStyle} style={{ padding: 10 }}>
                总计：{combined}
              </div>

            </Form>
            <div hidden={true} style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%', height: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.8)' }}>
              <Spin />
            </div>
          </div>
        </Modal >
      );
    }
  },
);

class CollectionsPage extends React.Component<CollectionsProps> {
  [x: string]: any;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      valueList: [],
      contractList: [],
      contractDetail: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    const { contractInfo } = nextProps;
    if (contractInfo !== this.props.contractInfo) {
      this.parsingPlansFunction(contractInfo)
      this.getContractList()
    }
  }

  // 处理回款记录的数据
  parsingPlansFunction(contractInfo: ReceivablesRecord) {
    let v = contractInfo && contractInfo.plans ? contractInfo.plans : [];
    console.log('1111', v)
    this.setState({
      valueList: v,
      contractDetail: contractInfo
    })
  }

  // 获取合同的回款计划
  getContractPlans(contractInfo: ReceivablesRecord) {

    var values = {}
    values['contractId'] = contractInfo?.id;

    Axios.post(URL.getPlanInfo, values).then(
      res => {
        if (res.code == 200) {

          var resD = res.data.result
          this.parsingPlansFunction(resD)
        }
      }
    );
  }

  // 请求合同列表
  getContractList() {
    const { orderInfo } = this.props;
    const { contractList } = this.state;

    if (contractList && contractList.length <= 0) {
      var values = {}
      values['orderId'] = orderInfo?.id;
      values['auditStatus'] = 3

      Axios.post(URL.contractList, values).then(
        res => {
          if (res.code == 200) {
            this.setState({
              contractList: res.data.result.rows,
            })
          } else {
            this.setState({
              contractList: [],
            })
          }
        }
      );
    }
  }
  ///////////   ----------- 交互方法 ----------
  // 取消操作
  handleCancel = () => {

    this.setState({
      valueList: [],
      contractList: [],
    })

    this.props.onCancel()

    const { form } = this.formRef.props;
    form.resetFields();
  };

  // 创建操作
  handleCreate = () => {
    const { contractDetail } = this.state;
    const { form } = this.formRef.props;
    // const { data, planId } = this.props;
    if (contractDetail?.id) {
      form.validateFields((err: any, values: any) => {

        const { valueList } = this.state;
        var paramsPlan = [];
        valueList.map((item: any) => {
          console.log(item)
          let tempI = {};
          tempI['planId'] = item.plan_id;
          tempI['title'] = item.title;
          tempI['planReceivablesDate'] = item.plan_receivables_date;
          tempI['alreadyReceivablesMoney'] = item.already_receivables_money;
          tempI['overdueNoReceivablesMoney'] = item.overdue_no_receivables_money;
          tempI['noReceivablesMoney'] = item.no_receivables_money;
          tempI['status'] = item.status;
          tempI['statusTxt'] = item.status_txt;
          tempI['list'] = item.list;
          tempI['planReceivablesMoney'] = item.plan_receivables_money;
          tempI['planReceivablesMoneyTxt'] = item.plan_receivables_money_txt;
          tempI['alreadyReceivablesMoneyTxt'] = item.already_receivables_money;
          tempI['alreadyReceivablesMoneyTxt'] = item.already_receivables_money_txt;
          tempI['overdueNoReceivablesMoneyTxt'] = item.overdue_no_receivables_money_txt;
          tempI['noReceivablesMoneyTxt'] = item.no_receivables_money_txt;
          console.log(item)
          paramsPlan.push(tempI)
        });

        console.log(paramsPlan)
        values['planInfo'] = paramsPlan;
        values['signDate'] = moment(values['signDate']).format('YYYY-MM-DD');
        values['contractId'] = contractDetail?.id
        this.props.saveFunction(values, this)
      });
    } else {
      message.info('请选择合同')
    }

  };

  // 储存表单
  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  // 添加回款计划
  addItem = (id: number) => {

    let item: PlansItem = {
      plan_id: '',
      title: `第${id}期回款计划`,
      plan_receivables_date: '',
      plan_receivables_money: '',
      already_receivables_money: '',
      overdue_no_receivables_money: '',
      no_receivables_money: '',
      status: '',
      status_txt: '',
      list: [],
      plan_receivables_money_txt: '',
      already_receivables_money_txt: '',
      overdue_no_receivables_money_txt: '',
      no_receivables_money_txt: '',

    }

    let v = this.state.valueList;
    v.push(item)
    this.setState({
      valueList: v,
    })

  }

  // 移除回款计划
  removeItem = (value: any, k: any, index: any) => {
    let v = this.state.valueList;
    v.splice(index, 1)
    this.setState({
      valueList: v,
    })
  }

  // 修改回款计划第一个信息
  changeOneData = (value: any, data: any, index: number) => {
    let v = this.state.valueList;

    let item: PlansItem = v[index];
    console.log(item)
    item.plan_receivables_date = value;
    v[index] = item;

    this.setState({
      valueList: v,
    })
  }

  // 修改回款计划第二个信息
  changeTowData = (value: any, data: any, index: number) => {
    console.log(value)
    let v = this.state.valueList;
    let item: PlansItem = v[index];

    item.plan_receivables_money = value;
    v[index] = item;

    this.setState({
      valueList: v,
    })
  }

  onChangeContractDetails = (contractInfo: ReceivablesRecord) => {
    this.setState({
      contractDetail: contractInfo,
    })
    this.getContractPlans(contractInfo)
  }

  render() {

    const { visible, data, contractInfo, orderInfo } = this.props;
    const { valueList, contractList, contractDetail } = this.state;
    console.log(data)
    let isHave = false

    if (contractInfo && contractInfo.id) {
      isHave = true
    }
    return (
      <div>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          changeTowData={this.changeTowData}
          changeOneData={this.changeOneData}
          addItem={this.addItem}
          removeItem={this.removeItem}
          isHaveContractInfo={isHave}
          contractInfo={contractDetail}
          valueList={valueList}
          orderInfo={orderInfo}
          contractList={contractList}
          onChangeContractDetail={this.onChangeContractDetails}
        />
      </div>
    );
  }
}
export default CollectionsPage;
