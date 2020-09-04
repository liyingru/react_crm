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
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import AreaSelect from '@/components/AreaSelect';
import moment from 'moment';
import { StateType } from './model';

import { ConfigListItem, customerParams, cityInfo } from './data';
import Axios from 'axios';
import { Dispatch, Action } from 'redux';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import URL from '@/api/serverAPI.config';
import { type } from 'os';
import { required } from 'yargs';
import check from '@/components/Authorized/CheckPermissions';
import NumericInput from '@/components/NumericInput';
import WeddingCelebrationContract from './components/WeddingCelebrationContract';
import WeddingBanquetContract from './components/WeddingBanquetContract';
import { connect } from 'dva'
import WeddingCommonContract from './components/WeddingCommonContract';
const { confirm } = Modal;


interface FormBasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<
    Action<
      | 'contractManagement/addContract'
      | 'contractManagement/getContractConfig'
      | 'contractManagement/searchUser'
    >
  >;
}

//构建state类型
interface pageState {
  orderId: string
  categoryId: string
}


const dateFormat = 'YYYY-MM-DD';

function onChange(checkedValues: any) {
  console.log('checked = ', checkedValues);
}

@connect(() => ({}))
class FormBasicForm extends Component<FormBasicFormProps, pageState> {

  state: pageState = {
    orderId: '',
    categoryId: ''
  }


  componentDidMount() {
    const { dispatch } = this.props;
    const { orderId, categoryId } = this.props.location.query;
    this.setState({
      orderId: orderId,
      categoryId: categoryId
    })
    let values = {
      'orderId': orderId
    }
    //拉取配置信息
    dispatch({
      type: 'contractManagement/getContractConfig',
      payload: values,
    });

    //拉取配置信息
    dispatch({
      type: 'contractManagement/searchUser',
      payload: values,
    });

  }

  render() {
    const { orderId, categoryId } = this.props.location.query;
    if (categoryId == 1) {
      return (
        <PageHeaderWrapper title="新建合同" >
          <WeddingBanquetContract orderId={orderId} categoryId={categoryId} />
        </PageHeaderWrapper >
      );
    } else if (categoryId == 2) {
      return (
        <PageHeaderWrapper title="新建合同" >
          <WeddingCelebrationContract orderId={orderId} categoryId={categoryId} />
        </PageHeaderWrapper >
      );
    } else {
      return (
        <PageHeaderWrapper title="新建合同" >
          <WeddingCommonContract orderId={orderId} categoryId={categoryId} />
        </PageHeaderWrapper >
      );
    }

  }
}

export default Form.create<FormBasicFormProps>()(FormBasicForm);
