import { Modal, Form, Select, DatePicker, Input, Divider } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { PlansItemList, configDataItem, userlistInfoItem, ReceivablesRecord, PlansItem, rderInfoModel } from '../../data';
import FileUpload from '@/components/FileUpload';
import NumericInput from '@/components/NumericInput';
import OutlinedUpload from '@/components/OutlinedUpload'
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

import moment from 'moment';
import CrmUtil from '@/utils/UserInfoStorage';
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';


interface CollectionsProps extends FormComponentProps {
  saveFunction: Function;
  onCancel: Function;
  receivablesUserIdSearch: Function;
  visible: false;
  userList: userlistInfoItem[];
  currentUserId: string;
  currentUserName: string;
  orderInfo: rderInfoModel;
  // 配置项
  moneyonfig: {}
  // 0 是不定合同和计划的模式 1 是定合同不定计划的模式 2 是定合同和订计划的模式
  type: number;
  // 锁定合同
  contactsInfo: ReceivablesRecord;
  // 锁定计划
  planInfo: PlansItem
  // 修改记录对象
  plansItemModel: any
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props: Readonly<{}>) {
      super(props);
      this.state = {
        list: [],
        isPaymentVoucher: false,
      }
    }

    onSearch = (val: any) => {
      const { receivablesUserIdSearch } = this.props;
      receivablesUserIdSearch(val)
    }

    onChangeContract = (e: any) => {
      const { getContractPlans, contractList } = this.props;
      if (contractList?.length > 0) {
        contractList?.map((item) => {
          if (item.id == e) {
            getContractPlans(item)
            this.props.form.setFieldsValue({
              "contacsinfoPlanId": '',
            })
          }
        })
      }
    }

    componentWillReceiveProps(nextProps: any) {

      const { filedList } = nextProps;
      if (filedList != this.props?.filedList) {
        if (filedList.length > 0) {
          if (this.state?.isPaymentVoucher == false) {
            this?.props?.form?.setFieldsValue({
              "paymentVoucher": 'true',
            })
            this.setState({
              isPaymentVoucher: true
            })
          }
        } else {
          if (this.state?.isPaymentVoucher == true) {
            this?.props?.form.setFieldsValue({
              "paymentVoucher": undefined,
            })
            this.setState({
              isPaymentVoucher: false
            })
          }
        }
      }
    }




    render() {
      const { visible, onCancel, onCreate, form, data, userList, userId, currentUserName, onUploadDone, filedName,
        moneyonfig, contractList, plansItemList, contractDetail, plansModel, plansItemModel, title, filedList, uploadDisabled } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout =
      {
        labelCol: {
          xs: { span: 10 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }
      
      return (
        <Modal
          centered={true}
          visible={visible}
          title={title}
          okText="提交进入审批"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout='horizontal'>
            <div>
              <Form.Item label="关联合同：" {...formItemLayout}>
                {getFieldDecorator('contractId', {
                  initialValue: contractDetail && contractDetail?.id,
                  rules: [{ required: false, message: '请选择关联合同' }]
                })(
                  <Select optionLabelProp='title' placeholder='请选择关联合同' onChange={this.onChangeContract} disabled={contractDetail?.id ? true : false}>
                    {contractList && contractList?.map((item) => {
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
            </div>

            <div>
              <Form.Item label="回款计划：" {...formItemLayout}>
                {getFieldDecorator('planId', {
                  initialValue: plansModel && plansModel?.plan_id,
                  rules: [{ required: true, message: '请选择回款计划' }]
                })(
                  <Select placeholder='请选择回款计划' disabled={plansModel?.plan_id ? true : false}>
                    {plansItemList && plansItemList?.map((item) => {
                      return (
                        <Option value={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </div>

            <div >
              <Form.Item label="回款日期：" {...formItemLayout}>
                {getFieldDecorator('receivablesDate', {
                  initialValue: plansItemModel?.receivables_date && moment(plansItemModel?.receivables_date, dateFormat),
                  rules: [{ required: true, message: '请选择回款日期' }]
                })(
                  <DatePicker placeholder='请选择回款日期' />
                )}
              </Form.Item>
            </div>

            <div >
              <Form.Item label="回款金额：" {...formItemLayout}>
                {getFieldDecorator('money', {
                  initialValue: plansItemModel && plansItemModel?.money,
                  rules: [{ required: true, message: '请填写回款金额' }],
                })(
                  <NumericInput prefix="￥" placeholder="请填写回款金额" />
                )}
              </Form.Item>
            </div>
            <div >
              <Form.Item label="回款类型：" {...formItemLayout}>
                {getFieldDecorator('receivablesType', {
                  initialValue: plansItemModel && plansItemModel?.receivables_type,
                  rules: [{ required: true, message: '请选择回款类型' }]
                })(
                  <Select placeholder='请选择回款类型' >
                    {moneyonfig?.receivablesTypeList && moneyonfig?.receivablesTypeList?.map((item) => {
                      return (
                        <Option value={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </div>

            <Divider />

            <div >
              <Form.Item label="支付方式：" {...formItemLayout}>
                {getFieldDecorator('paymentMode', {
                  initialValue: plansItemModel && plansItemModel?.payment_mode,
                  rules: [{ required: true, message: '请选择支付方式' }]
                })(
                  <Select placeholder='请选择支付方式'>
                    {moneyonfig?.paymentModeList && moneyonfig?.paymentModeList?.map((item) => {
                      return (
                        <Option value={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </div>

            <div >
              <Form.Item label="付款名称：" {...formItemLayout}>
                {getFieldDecorator('paymentUser', {
                  initialValue: plansItemModel && plansItemModel?.payment_user,
                  rules: [{ required: true, message: '请填写付款名称' }]
                })(
                  <Input placeholder='请填写付款名称' />
                )}
              </Form.Item>
            </div>

            <div >
              <Form.Item label="付款账户：" {...formItemLayout}>
                {getFieldDecorator('paymentAccount', {
                  initialValue: plansItemModel && plansItemModel?.payment_account,

                  rules: [{
                    required: true,
                    pattern: new RegExp(/^\w{1,50}$/g, "g"), message: '请填写付款账户'
                  }],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/[\u4e00-\u9fa5]/g, '')
                  },

                })(
                  <Input placeholder='请填写付款账户' />
                )}
              </Form.Item>
            </div>

            <div style={{ marginTop: 10 }}>
              {/* <div >回款说明：</div> */}
              <Form.Item label="回款说明:" {...formItemLayout}>
                {getFieldDecorator('remark', {
                  initialValue: plansItemModel && plansItemModel?.remark,
                  rules: [{ required: false, message: '请填回款说明' }]
                })(
                  <TextArea placeholder='请填回款说明' rows={4} style={{ marginTop: 10 }}></TextArea>
                )}
              </Form.Item>

            </div>
            <div >
              <Form.Item label="收款票据：" {...formItemLayout}>
                {getFieldDecorator('receiptNote', {
                  initialValue: plansItemModel && plansItemModel?.payment_user,
                  rules: [{ required: false, message: '请填写收款票据' }]
                })(
                  <Input placeholder='请填写收款票据' />
                )}
              </Form.Item>
            </div>
            <div>
              <Form.Item label='支付凭证：'{...formItemLayout}>
                {getFieldDecorator('paymentVoucher', {
                  initialValue: this.props?.filedList?.length > 0 ? 'true' : undefined,
                  rules: [{ required: true, message: '请先上传' }]
                })(
                  <OutlinedUpload text="上传凭证" defaultFileList={filedList} disabled={uploadDisabled} superFileList={filedList} requestFinsh={onUploadDone}
                  />
                )}

              </Form.Item>
            </div>

            <div >
              <Form.Item label="收款人：" {...formItemLayout}>
                {getFieldDecorator('payee', {
                  initialValue: plansItemModel && plansItemModel?.payee ? plansItemModel?.payee + ',' + plansItemModel.payee_txt : userId + ',' + currentUserName,
                  rules: [{ required: false, message: '请选择收款人' }]
                })(
                  <Select
                    placeholder='请选择收款人'
                    optionLabelProp='title'
                    showSearch
                    style={{ width: 200 }}
                  // optionFilterProp="children"
                  // onSearch={this.onSearch}
                  >
                    {userList && userList.map((item) => {
                      return (
                        <Option title={item?.username} value={item?.user_id + ',' + item?.username}>
                          <div>
                            <div>
                              {item?.username}
                            </div>
                            <div>
                              部门：{item?.group_name}
                            </div>
                            <Divider style={{ marginBottom: 0 }} />
                          </div>
                        </Option>
                      );
                    })}

                  </Select>,
                )}
              </Form.Item>
            </div>
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component<CollectionsProps> {
  [x: string]: any;

  constructor(props: CollectionsProps) {
    super(props);
    this.state = {
      contractList: [],
      plansItemList: [],
      isFinshContractList: false,
      filedList: [],
      uploadDisabled: false,
      maxUpload: 9,
    }
  }

  componentDidMount() {
    const { contactsInfo, orderInfo } = this.props;
    if (orderInfo) {
      this.getContractList(orderInfo)
    }
    if (contactsInfo) {
      this.getContractPlans(contactsInfo)
    }

  }

  componentWillReceiveProps(nextProps: any) {

    const { contractList, isFinshContractList } = this.state;
    const { contactsInfo, plansItemModel, visible, orderInfo } = nextProps;
    if (contractList?.length <= 0 && isFinshContractList == false) {
      if (orderInfo?.id > 0) {
        this.setState({
          isFinshContractList: true,
        }, () => {
          this.getContractList(orderInfo)
        })
      }
    }
    if (contactsInfo.id) {
      this.getContractPlans(contactsInfo)
    }

    if (plansItemModel?.id != this.props?.plansItemModel?.id) {
      var paymentVoucher = plansItemModel?.payment_voucher
      if (paymentVoucher?.length > 0) {

        var temp = []
        paymentVoucher?.map((item, index) => {
          let model = {}
          model.uid = index
          model.name = ''
          model.url = item
          model.thumbUrl = item
          temp.push(model)
        })
        if (temp?.length >= this.state?.maxUpload) {
          this.setState({
            filedList: temp,
            uploadDisabled: true,
          })
        } else {
          this.setState({
            filedList: temp,
            uploadDisabled: false,
          })
        }

      }
    } else {
      if (visible != this.props?.visible) {
        this.setState({
          uploadDisabled: false,
        })
      }
    }

  }


  // 获取合同的回款计划
  getContractPlans = (contactsInfo: ReceivablesRecord) => {

    var values = {}
    values['contractId'] = contactsInfo?.id;

    Axios.post(URL.getNumberList, values).then(
      res => {
        if (res.code == 200) {

          this.setState({
            plansItemList: res.data.result,
          })
        }
      }
    );
  }

  // 请求合同列表
  getContractList = (orderInfo: any) => {
    if (orderInfo?.id > 0) {
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

  }

  // ------------------ 操作 ----------------

  onUploadDone = (array: any) => {
    if (array?.length >= this.state?.maxUpload) {
      this.setState({
        filedList: array,
        uploadDisabled: true
      })
    } else {
      this.setState({
        filedList: array,
        uploadDisabled: false
      })
    }
  }

  handleCancel = () => {
    this.props?.onCancel()

    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({
      contractList: [],
      plansItemList: [],
      isFinshContractList: false,
      filedList: [],
    })
  };

  handleCreate = () => {
    const { form } = this.formRef.props;

    const { plansItemModel, contactsInfo, planInfo, type } = this.props;
    const { filedList } = this.state;

    form.validateFields((err: any, values: any) => {

      if (err) return;

      values['receivablesDate'] = moment(values['receivablesDate']).format(dateFormat);

      var isEdit = false
      if (plansItemModel.id && plansItemModel.id != '') {
        values['id'] = plansItemModel.id
        isEdit = true
      }

      var tempPayee = values['payee']
      if (tempPayee?.length > 0) {
        var payeeA = tempPayee.split(',')
        var payee = payeeA[0]
        if (payee?.length > 0) {
          values['payee'] = payee
        }
      }

      if (filedList?.length > 0) {
        var filedPatchs = ''
        filedList?.map((item, index) => {
          if (index == 0) {
            filedPatchs = filedPatchs + item.url
          } else {
            filedPatchs = filedPatchs + ',' + item.url
          }
        })
        values['paymentVoucher'] = filedPatchs;

      }


      values['isCheck'] = '1'
      this.props.saveFunction(isEdit, values, this)
      this.setState({
        contractList: [],
        plansItemList: [],
        isFinshContractList: false,
        filedList: [],
      })
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    const { visible, data, receivablesRecord, receivablesUserIdSearch, userList,
      currentUserId, currentUserName, moneyonfig, plansItemModel, contactsInfo, planInfo, type } = this.props;
    // const userId = data.payee ? data.payee : currentUserId
    const { contractList, plansItemList, filedList } = this.state;
    const userId = currentUserId
    var title = '新增回款'
    if (type == 3) {
      title = '编辑回款'
    }
    return (
      <div>
        <CollectionCreateForm
          title={title}
          wrappedComponentRef={this.saveFormRef}
          receivablesUserIdSearch={receivablesUserIdSearch}
          onUploadDone={this.onUploadDone}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          getContractPlans={this.getContractPlans}
          visible={visible}
          moneyonfig={moneyonfig}
          userList={userList}
          userId={userId}
          currentUserName={currentUserName}
          contractList={contractList}
          plansItemList={plansItemList}
          filedList={filedList}
          // 动态数据
          contractDetail={contactsInfo && contactsInfo}
          plansModel={planInfo && planInfo}
          plansItemModel={plansItemModel && plansItemModel}
          uploadDisabled={this.state?.uploadDisabled}
        />
      </div>
    );
  }
}
export default CollectionsPage;
