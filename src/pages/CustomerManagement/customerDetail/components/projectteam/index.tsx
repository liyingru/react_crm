import { ProjectTeam, RequirementUser, RequirementData, UserEntity, RequirementBean } from "../../dxl/data";
import { Component } from "react";
import React from "react";
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, message, Divider, Dropdown, Menu, List, Icon, Empty } from 'antd';
import styles from './index.less';
import { ConfigListItem, ConfigList } from "@/pages/CustomerManagement/commondata";
import { FormComponentProps } from "antd/es/form";
import { ColumnProps } from "antd/lib/table";
import LOCAL from "@/utils/LocalStorageKeys";
import CrmUtil from "@/utils/UserInfoStorage";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


export interface TeamTabPros extends FormComponentProps {
  showStyle: number;
  teamList: ProjectTeam[];
  requirementList: RequirementUser;
  allUser: UserEntity[];
  onChanged: (params: any, isCreate: boolean, callback: () => void) => void;
  onDeleteTeam: (reqId: string) => void;
  teamRole:any;
}

export interface ContactTabState {
  modalVisible: boolean;
  selectedTeam: ProjectTeam;
  isCreate: boolean;
}

class TeamTab extends Component<TeamTabPros, ContactTabState>{

  state: ContactTabState = {
    modalVisible: false,
    selectedTeam: {
      req_id: '',
      team_name: '',
      team_member: [],
      category: '',
      owner: '',
      owner_id: '',
      category_text: ''
    },
    isCreate: true,
  }

  submitData = () => {
    const { form, onChanged } = this.props;
    const { selectedTeam } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let params = {}
      params['reqId'] = selectedTeam.req_id
      params['teamName'] = fieldsValue['teamName']
      params['teamMember'] = []
      selectedTeam.team_member.forEach((item, index) => {
        let member = {
          team_user_id: fieldsValue['uid' + index],
          team_key_name: fieldsValue['utitle' + index],
          id: item.id
        }
        params['teamMember'].push(member)
      });
      onChanged(params, this.state.isCreate, () => this.setModalVisible(false))
    });
  }

  setModalVisible = (visible: boolean) => {
    this.setState({
      modalVisible: visible
    })
  }


  updateTeam = (recoder: ProjectTeam) => {
    this.state.selectedTeam = recoder
    this.state.isCreate = false
    this.setModalVisible(true)
  }

  createTeam = (requirementBean: RequirementBean) => {
    this.state.selectedTeam = {
      req_id: requirementBean.id,
      team_name: '',
      team_member: [],
      category: requirementBean.category,
      owner: requirementBean.user_name,
      owner_id: requirementBean.user_id,
      category_text: requirementBean.category_txt,
    }
    this.state.isCreate = true
    this.setModalVisible(true)
  }

  deleteTeam = (recoder: ProjectTeam) => {
    const { onDeleteTeam } = this.props;
    Modal.confirm({
      title: '确定删除此项目团队吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk() {
        onDeleteTeam(recoder.req_id)
      },
      onCancel() {
      },
    });
  }

  generateColumn = (item: ProjectTeam) => {
    const { showStyle } = this.props;
    let column: ColumnProps<any>[] = [];
    column.push({ dataIndex: 'team_name', title: '项目组' })
    column.push({ dataIndex: 'category_text', title: '业务品类' })
    column.push({ dataIndex: 'owner', title: '项目负责人' })
    item.team_member.forEach((member, index) => {
      column.push({ dataIndex: 'uname' + index, title: member.team_key_name })
    })

    // const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    // let currentUserInfo;
    // try {
    //   if (currentUserInfoStr) {
    //     currentUserInfo = JSON.parse(currentUserInfoStr);
    //   }
    // } catch (e) {
    //   currentUserInfo = currentUserInfoStr;
    // }
    const currentUserInfo = CrmUtil.getUserInfo();
    if (item.owner_id == currentUserInfo?.id+"" && showStyle == 1) {
      column.push({
        title: '操作',
        dataIndex: 'action',
        render: (text, recoder) => {
          return (
            <span>
              <a onClick={() => this.updateTeam(item)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.deleteTeam(item)}>删除</a>
            </span>
          )
        }
      })
    }
    return column
  }

  generateDataSource = (item: ProjectTeam) => {
    let other = {}
    item.team_member.forEach((member, index) => {
      other['uid' + index] = member.id
      other['uname' + index] = member.team_user_name
    })

    let dataSource = []
    dataSource.push({
      team_name: item.team_name,
      category: item.category,
      owner: item.owner,
      req_id: item.req_id,
      category_text: item.category_text,
      owner_id: item.owner_id,
      ...other
    })

    return dataSource
  }

  addUser = () => {
    if (this.state.selectedTeam.team_member.length >= 8) {
      message.info('最多添加8名成员!')
      return
    }
    let teamCopy = { ...this.state.selectedTeam }
    teamCopy.team_member.push({ team_key_name: '', team_user_name: '', id: '', team_user_id: '' })
    this.setState({
      selectedTeam: teamCopy
    })
  }

  deleteUser = (index: number) => {
    let teamCopy = { ...this.state.selectedTeam }
    teamCopy.team_member.splice(index, 1)
    this.setState({
      selectedTeam: teamCopy
    })
  }

  render() {
    const { teamList, showStyle, requirementList, allUser,teamRole } = this.props;
    const { selectedTeam } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const operateRequires = !requirementList.my ? [] : requirementList.my.flatMap(value => value.data).filter(value => (value.status == '1'))

    const menu = (
      <Menu>
        {
          operateRequires.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            operateRequires.map(req => (
              <Menu.Item>
                <a onClick={() => this.createTeam(req)}>
                  <span>{req.req_num}</span>
                  <span>({req.category_txt})</span>
                </a>
              </Menu.Item>
            ))
        }
      </Menu>
    );

    return (
      <div>
        <div className={styles.newcontact}>
          {
            showStyle == 0 ? '' :
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button type="primary">新建项目</Button>
              </Dropdown>
          }
        </div>
        {
          teamList.map(team => (
            <div>
              <Table style={{ marginTop: 10 }}
                size='small'
                columns={this.generateColumn(team)}
                dataSource={this.generateDataSource(team)}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </div>
          ))
        }
        <Modal
          title={!selectedTeam.team_name ? '新建项目组' + '(' + selectedTeam.category_text + ')' :
            '更新项目组' + '(' + selectedTeam.category_text + ')'}
          centered
          visible={this.state.modalVisible}
          destroyOnClose={true}
          onOk={this.submitData}
          onCancel={() => this.setModalVisible(false)}>
          <Form layout='horizontal'>
            <FormItem {...formItemLayout} label='项目组名'>
              {
                getFieldDecorator('teamName', {
                  initialValue: !selectedTeam.team_name ? '' : selectedTeam.team_name,
                  rules: [{
                    required: true,
                    message: "项目组名不能为空"
                  }]
                })(<Input placeholder="请输入" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label='项目负责人'>
              <span>{selectedTeam.owner}</span>
              <span style={{ float: "right" }} >
                <a onClick={() => this.addUser()}>+ 添加成员</a>
              </span>
            </FormItem>
            {
              selectedTeam.team_member.map((member, index) => (
                <FormItem>
                  <div className={styles.teamuser}>
                    {
                      getFieldDecorator('utitle' + index, {
                        initialValue: member.team_key_name,
                        rules: [{
                          required: true,
                          message: "职责不能为空"
                        }]
                      })(
                        // <Input style={{ width: '30%' }} placeholder="请输入职责" />
                        <Select placeholder="请选择职责" style={{ width: '30%' }}>
                          {
                            teamRole?.map(item => (
                              <Option value={item}>{item}</Option>))
                          }
                        </Select>
                      )
                    }
                    {
                      getFieldDecorator('uid' + index, {
                        initialValue: member.team_user_id,
                        rules: [{
                          required: true,
                          message: "成员不能为空"
                        }]
                      })(<Select
                        showSearch
                        style={{ width: '30%', marginLeft: 5 }}
                        placeholder="请选择成员"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {
                          (allUser && allUser.length > 0) ?
                            allUser.map(user => (
                              <Option value={user.id}>{user.name}</Option>))
                            :
                            null
                        }
                      </Select>)
                    }
                    <Icon type="delete" style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.deleteUser(index)} />
                  </div>
                </FormItem>
              ))
            }
            <FormItem>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create<TeamTabPros>()(TeamTab);
