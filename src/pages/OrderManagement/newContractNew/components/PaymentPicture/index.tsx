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
  contractPicList: []//合同图片
  isDisabledUpload: boolean
  modalVisible: boolean
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
  contractPicInfo:[]

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
    isReset: false,
  };


  constructor(props: CreateFormProps) {
    super(props);


    this.state = {
      contractPicList: this.props.contractPicInfo,
      isDisabledUpload: false,
      modalVisible: false,
      isReset: (props.isReset ? props.isReset : false)
    }

    
    
  }

  componentWillReceiveProps(nextProps: any) {
    const that = this;
    if (nextProps.isReset != this.props.isReset) {
      this.setState({
        isReset: this.props.isReset !== nextProps.isReset ? nextProps.isReset : false,
      }, () => {
        if (that.state.isReset) {
          this.setState({
            contractPicList: [],
          })
        }
      });
    }

    if(nextProps.contractPicInfo!==this.props.contractPicInfo){
      this.setState({
        contractPicList:nextProps.contractPicInfo
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      contractPicList: [],
    })
  }




  onUploadContractPicDone = (url: string, info: any) => {
    console.log(url);
    if (url) {
      
      this.state.contractPicList.push(url)
      this.setState({
        contractPicList: this.state.contractPicList,
      })
    }
    const { setContractPicList } = this.props;
    setContractPicList(this.state.contractPicList)
  }





  //取消
  cancelHandle = () => {
    this.setState({
      modalVisible: false
    })
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




  render() {
    const { form: { getFieldDecorator, getFieldValue }, isReset } = this.props;
    const { contractManagement: { contractConfig } } = this.props;

    return (
      <Fragment>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col span={24}>
            <FormItem label="合同照片" >
              {getFieldDecorator('pic', {
                rules: [{ required: true, message: '请上传合同照片', }],

              })(
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
              )}
            </FormItem>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create<CreateFormProps>()(CreateForm);
