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
  Upload,
  Table,
  Divider,
} from 'antd';

import React, { Component, ChangeEvent, Fragment } from 'react';
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
import { ContractConfigData, TableListItem } from '../../data';
import FileUpload from '@/components/FileUpload';
import StandardTable from '@/pages/CustomerManagement/customerList/components/StandardTable';
import { data } from 'vfile';
const { confirm } = Modal;

var billPicArray: never[] | string[] = []
var contractPicArray: never[] | string[] = []

function disabledDate(current: any) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')))
}


/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
function removeAaary(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      _arr.splice(i, 1); //删除下标为i的元素
      return _arr
      break
    }
  }
}

//构建state类型
interface pageState {
  billPicList: []//付款单图片
  contractPicList: []//合同图片
  isDisabledUpload: boolean
  modalVisible: boolean
  receivablesData: []
  editPlanEntity: {}
  isReset: boolean;
}


interface CreateFormProps extends FormComponentProps {
  isReset: boolean;
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
  setContractPicList: (data: any) => {},
  setBillPicList: (data: any) => {},
  setReceivablesPlanList: (data: any) => {},

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

class CreateForm extends Component<CreateFormProps, pageState>  {


  static defaultProps = {
    orderId: '',
    categoryId: '',
    isReset: false
  };


  constructor(props: CreateFormProps) {
    super(props);
    this.state = {
      billPicList: [],
      contractPicList: [],
      isDisabledUpload: false,
      modalVisible: false,
      receivablesData: [],
      editPlanEntity: {},
      isReset: (props.isReset ? props.isReset : false)
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const that = this;
    if (nextProps.isReset !== this.props.isReset) {
      this.setState({
        isReset: this.props.isReset !== nextProps.isReset ? nextProps.isReset : false,
      }, () => {
        if (that.state.isReset) {
          billPicArray.splice(0, billPicArray.length)
          contractPicArray.splice(0, contractPicArray.length)
          this.setState({
            billPicList: [],
            contractPicList: [],
            receivablesData: [],
            editPlanEntity: {},
          })
        }
      });
    }
  }

  componentWillUnmount() {
    billPicArray.splice(0, billPicArray.length)
    contractPicArray.splice(0, contractPicArray.length)
    this.setState({
      billPicList: [],
      contractPicList: [],
      receivablesData: [],
      editPlanEntity: {},
    })
  }

  handleSubmit = () => {
    const { dispatch, form, orderId, categoryId } = this.props;
    const { setReceivablesPlanList } = this.props;
    const { contractManagement: { contractConfig } } = this.props;
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const planReceivablesDateate = values['planReceivablesDate'];
        const planReceivablesMoney = values['planReceivablesMoney']
        const receivablesType = values['receivablesType']
        const remark = values['remark']

        var receivablesTypeTxt = ''
        for (var i = 1; i <= contractConfig.receivablesTypeList.length; i++) {
          if (contractConfig.receivablesTypeList[i].id == receivablesType) {
            receivablesTypeTxt = contractConfig.receivablesTypeList[i].name
            break
          }
        }
        const item = {
          planReceivablesDate: moment(planReceivablesDateate).format('YYYY-MM-DD'),
          planReceivablesMoney: planReceivablesMoney,
          receivablesType: receivablesType,
          receivablesTypeTxt: receivablesTypeTxt,
          remark: remark,
        }

        //编辑（先删除 后添加）
        if (this.state.editPlanEntity) {
          removeAaary(this.state.receivablesData, this.state.editPlanEntity)
        }

        this.state.receivablesData.push(item)

        this.setState({
          editPlanEntity: {},
          modalVisible: false,
        })

        setReceivablesPlanList(this.state.receivablesData)
      }
    });
  };

  onUploadBillPicDone = (url: string, info: any) => {
    console.log(url);
    if (url) {
      billPicArray.push(url)
      this.setState({
        billPicList: billPicArray,
      })

      if (billPicArray.length == 9) {
        this.setState({
          isDisabledUpload: true
        })
      }
    }
    const { setBillPicList } = this.props;
    setBillPicList(this.state.billPicList)
  }

  onUploadContractPicDone = (url: string, info: any) => {
    console.log(url);
    if (url) {
      contractPicArray.push(url)
      this.setState({
        contractPicList: contractPicArray,
      })
    }
    const { setContractPicList } = this.props;
    setContractPicList(this.state.contractPicList)
  }

  //添加回款计划
  addPlan = () => {
    this.setState({
      modalVisible: true,
    })
  }

  //删除回款计划
  deletePlan = (e: React.FormEvent, record: any) => {
    const { setReceivablesPlanList } = this.props;
    var planArray = removeAaary(this.state.receivablesData, record)
    this.setState({
      receivablesData: planArray,
      editPlanEntity: {},
    })
    console.log("数组大小为" + this.state.receivablesData.length)
    setReceivablesPlanList(this.state.receivablesData)
  }

  //编辑回款计划
  editPlan = (e: React.FormEvent, record: any) => {
    this.setState({
      editPlanEntity: record,
      modalVisible: true
    })
  }


  //取消
  cancelHandle = () => {
    this.setState({
      modalVisible: false
    })
  }

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };


  //删除付款单图片
  deleteBillPic = (e: React.FormEvent, url: any) => {
    const { setBillPicList } = this.props;
    var billPicArray = removeAaary(this.state.billPicList, url)
    this.setState({
      billPicList: billPicArray,
    })
    setBillPicList(this.state.billPicList)
  }

  //删除合同图片
  deleteContractPic = (e: React.FormEvent, url: any) => {
    const { setContractPicList } = this.props;
    var contractPicArray = removeAaary(this.state.contractPicList, url)
    this.setState({
      contractPicList: contractPicArray
    })
    setContractPicList(this.state.contractPicList)
  }


  columns = [
    {
      title: '计划回款日期',
      dataIndex: 'planReceivablesDate',
      key: 'planReceivablesDate',
    },
    {
      title: '计划回款金额',
      dataIndex: 'planReceivablesMoney',
      key: 'planReceivablesMoney',
    },
    {
      title: '回款类型',
      dataIndex: 'receivablesTypeTxt',
      key: 'receivablesTypeTxt',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',

    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          <a onClick={(e) => { this.editPlan(e, item) }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={(e) => { this.deletePlan(e, item) }}>删除</a>
        </span>
      ),
    },
  ]




  render() {
    const { form: { getFieldDecorator, getFieldValue }, isReset } = this.props;
    const { contractManagement: { contractConfig } } = this.props;

    return (
      <Fragment>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={24}>
            <FormItem label="付款单" >
              <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                {this.state.billPicList.map((url: string) => (
                  <div className={styles.picWrap}>
                    <img src={url} style={{ width: 50, height: 50, marginLeft: 2, marginRight: 20 }} />
                    <Icon type="delete" className={styles.deleteBt} onClick={(e) => { this.deleteBillPic(e, url) }} />
                  </div>
                ))}
                <FileUpload style={{ marginTop: 2 }} fileList={this.state.billPicList} disabled={this.state.isDisabledUpload} onUploadDone={this.onUploadBillPicDone} text='上传图片' />
                <div style={{ marginLeft: 20, marginTop: 2 }}>最多支持9张图片</div>
              </div>
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={24}>
            <FormItem label="合同照片" >
              <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                {this.state.contractPicList.map((url: string) => (
                  <div className={styles.picWrap}>
                    <img src={url} style={{ width: 50, height: 50, marginLeft: 2, marginRight: 20 }} />
                    <Icon type="delete" className={styles.deleteBt} onClick={(e) => { this.deleteContractPic(e, url) }} />
                  </div>
                ))}

                <FileUpload disabled={this.state.isDisabledUpload} style={{ width: '50%', marginTop: 2 }} onUploadDone={this.onUploadContractPicDone} text='上传图片' />
                <div style={{ marginLeft: 20, marginTop: 2 }}>单个文件最大支持80MB，上传请耐心等待</div>
              </div>
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={16}>
            <FormItem label="回款计划" >
              <Button style={{ borderColor: '#1791FF', color: '#1791FF' }} htmlType='button' onClick={this.addPlan}>+添加回款计划</Button>
            </FormItem>
          </Col>
        </Row>

        <Modal
          destroyOnClose
          title="新增回款计划"
          visible={this.state.modalVisible}
          centered={true}
          okText='保存'
          onOk={this.handleSubmit}
          onCancel={this.cancelHandle}
        >
          <div className={styles.tableListForm}>
            <Form >
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={22}>
                  <FormItem label="计划回款日期" >
                    {getFieldDecorator('planReceivablesDate', {
                      rules: [{ required: true, message: '请选择回款日期' }],
                      initialValue: (this.state.editPlanEntity.planReceivablesDate) ? moment(this.state.editPlanEntity.planReceivablesDate, 'YYYY-MM-DD') : '',
                    })(
                      <DatePicker style={{ width: '100%', }} format="YYYY-MM-DD"
                        disabledDate={disabledDate}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={22}>
                  <FormItem label="计划回款金额">
                    {getFieldDecorator('planReceivablesMoney', {
                      rules: [{ required: true, message: '请输入回款金额' }],
                      initialValue: (this.state.editPlanEntity.planReceivablesMoney) ? this.state.editPlanEntity.planReceivablesMoney : '',

                    })(
                      <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" />
                    )}
                  </FormItem>

                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={22}>
                  <FormItem label="回款类型" >
                    {getFieldDecorator('receivablesType', {
                      rules: [{ required: false, message: '请选择回款类型', }],
                      initialValue: (this.state.editPlanEntity.receivablesType) ? this.state.editPlanEntity.receivablesType : '',
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择回款类型"
                        optionFilterProp="children"
                      >
                        {
                          contractConfig.receivablesTypeList.map(receivablesType => (
                            <Option value={receivablesType.id}>{receivablesType.name}</Option>))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={22}>
                  <FormItem label="备注" >
                    {getFieldDecorator('remark', {
                      rules: [{ required: false, message: '请输入备注', }],
                      initialValue: (this.state.editPlanEntity.remark) ? this.state.editPlanEntity.remark : '',
                    })(
                      <TextArea rows={2} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>

        <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col span={16}>
            <Table
              pagination={false}
              bordered={true}
              style={{ marginLeft: 40, marginBottom: 25 }}
              scroll={{ x: 'max-content' }}
              dataSource={this.state.receivablesData}
              columns={this.columns}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create<CreateFormProps>()(CreateForm);
