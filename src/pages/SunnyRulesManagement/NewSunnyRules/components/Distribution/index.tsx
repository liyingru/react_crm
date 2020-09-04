import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio, Modal, Checkbox, message, Divider, InputNumber, Icon, Popconfirm } from 'antd';
const { Option } = Select;
const InputGroup = Input.Group;
const { confirm } = Modal;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import { Dispatch, Action } from 'redux';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import { ReceiverUserData, ReceiverGroupData } from '../../model';

interface DistributionProps {
  /** 0按组名，1按人名 */
  tab: 0 | 1;
  dataCtrl: Function;
  receiverUsers: ReceiverUserData[];
  receiverGroups: ReceiverGroupData[];
  valueUsers:string[];
  valueGroups:string[];
}

interface DistributionState {
  choiceGoupId: any;
  choiceUserId: any;
  dialogTab:any;
  keyWords:any;
}

class Distribution extends Component <DistributionProps, DistributionState>{
  constructor(props: any) {
    super(props);
    this.state = {
      choiceGoupId: '',
      choiceUserId: '',
      dialogTab:'',
      keyWords:'',

    };
  }

  initGroupCtrl = (params:any)=>{
    Axios.post(URL.searchGroup, params).then(res => {
      if (res.code === 200) {
        console.log('用户数据',res.data.result)
        this.setState({
          getGroupUserData: res.data.result
        })
      } else {

      }
    });
  }
  initUserCtrl = (params:any)=>{
    Axios.post(URL.searchUser, params).then(res => {
      if (res.code === 200) {
        console.log('组数据',res.data.result)
        this.setState({
          searchUserData: res.data.result
        })
      } else {

      }
    });
  }
 
  // 查找组 或者是
  searchNameCtrl = (e: any, num: Number) => {
    const { dispatch } = this.props;
    console.log('e',e)
    const value = e;
    const obj = {};
    obj.keywords = value;
    if (num == 0) {
      this.initGroupCtrl(obj);
    }
    if (num == 1) {
      this.initUserCtrl(obj);
    }
  }
  // 客户选择 && 选择
  colleagueSelectChange = (e: any, num: Number) => {
    if (num == 0) {
      this.setState({
        choiceGoupId: e,
      });
    }
    if (num == 1) {
      this.setState({
        choiceUserId: e,
      });
    }
  }
 
  choicePersonCtrl = (searchUserData:ReceiverUserData[],getGroupUserData:ReceiverGroupData[],tab:0|1,dataCtrl:any) => {
    let {valueGroups, valueUsers} = this.props;
    valueGroups = valueGroups.filter(group => group.length>0);
    valueUsers = valueUsers.filter(user => user.length>0);
    return (
      <div style={{padding:'0 0 20px 22px'}}>
          {
            tab == 0 && (
              <Select
                placeholder='请输入组名'
                showSearch
                style={{ width: 300, maxHeight: 100, overflow:"scroll" }}
                mode="multiple"
                optionFilterProp="children"
                // onSearch={e => { this.searchNameCtrl(e, 0) }}
                onChange={e => { dataCtrl(e, 0) }}
                value={valueGroups}
                allowClear
              >
                {
                  getGroupUserData && getGroupUserData.map((item, index) => (
                    <Option value={item.id+""}  key={item.id} >{item.name}</Option>))
                }
              </Select>
            )
          }
          {
            tab == 1 && (
              <Select
                placeholder='请输入人员名字'
                showSearch
                style={{ width: 300, maxHeight: 100, overflow:"scroll" }}
                mode="multiple"
                optionFilterProp="children"
                // onSearch={e => { this.searchNameCtrl(e, 1) }}
                onChange={e => { dataCtrl(e, 1) }}
                value={valueUsers}
                allowClear
              >
                {
                  searchUserData && searchUserData.map((item, index) => (
                    <Option value={item.id+""} key={item.id} >{item.name}</Option>))
                }
              </Select>
            )
          }

      </div>
    )
  }
  render() {
    const {  receiverUsers, receiverGroups  } = this.props;
    const { tab ,dataCtrl } = this.props;
    return this.choicePersonCtrl(receiverUsers,receiverGroups,tab,dataCtrl)
  }
}
export default Distribution;