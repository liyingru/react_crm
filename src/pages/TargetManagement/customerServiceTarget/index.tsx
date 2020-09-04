import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Row, Col, Tabs } from 'antd';
import TargetTable from '../components/TargetTable';
import TargetConditions from '../components/TargetConditions';
import StructureQuarterlyTargetInput from '../components/StructureQuarterlyTargetInput';
import EmployeeQuarterlyTargetInput from '../components/EmployeeQuarterlyTargetInput';
import StructureMonthlyTargetInput from '../components/StructureMonthlyTargetInput';
import EmployeeMonthlyTargetInput from '../components/EmployeeMonthlyTargetInput';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TargetModalState } from '../model';
import { ModalState } from './model';
import LOCAL from '@/utils/LocalStorageKeys';

// const { Option } = Select;
const { TabPane } = Tabs;
interface CustomerServiceTargetState {
  currentUser: {};
  structureId: string;
  listLoading: boolean;
  structureQuarterlyTargetInputVisible: boolean;
  structureMonthlyTargetInputVisible: boolean;
  employeeQuarterlyTargetInputVisible: boolean;
  employeeMonthlyTargetInputVisible: boolean;
}

interface CustomerServiceTargetProps {
  structureList: [],
  userList: [],
  fuck: '',
  fuck1: ''
}
@connect(
  ({
    targetManagement: {
      structureList,
      userList
    },
    // customerSerivceTargetManagement: {
    //   fuck,
    //   fuck1,
    // },
    loading,
  }: {
    targetManagement: TargetModalState;
    customerSerivceTargetManagement: ModalState;
    loading: { effects: any };
  }) => ({
    structureList,
    userList,
    // listLoading: loading.effects['customerSerivceTargetManagement/fetchCustomerServiceTargetList']
  }),
)

class CustomerServiceTarget extends Component<CustomerServiceTargetProps, CustomerServiceTargetState> {
  state: CustomerServiceTargetState = {
    currentUser: {},
    structureId: '',
    listLoading: false,
    structureQuarterlyTargetInputVisible: false,
    employeeQuarterlyTargetInputVisible: false
  }

  componentDidMount() {
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    if (currentUserInfoStr) {
      const currentUserInfo = JSON.parse(currentUserInfoStr);
      const that = this;
      const { dispatch } = this.props;
      this.setState({
        currentUser: currentUserInfo
      }, () => {
        dispatch({
          type: 'targetManagement/fetchStructureList',
          payload: { companyId: currentUserInfo.company_id },
        });
      });
    }
  }

  structureOnChange = (value: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetManagement/fetchUserList',
      payload: { structureId: value }
    });
  }

  employeeOnChange = (value: string) => {

  }

  showStructureQuarterlyTargetInput = () => {

  }

  render() {
    const { structureList, userList } = this.props;
    const { currentUser, structureQuarterlyTargetInputVisible, structureMonthlyTargetInputVisible, employeeQuarterlyTargetInputVisible, employeeMonthlyTargetInputVisible } = this.state;
    const that = this;
    return (
      <PageHeaderWrapper>
        <StructureQuarterlyTargetInput
          companyId={currentUser.company_id}
          structureValue=''
          structureList={structureList}
          visible={structureQuarterlyTargetInputVisible}
          onOk={(fieldsValue) => {
            console.log('部门业绩录入值：' + fieldsValue.quarter1);
            that.setState({
              structureQuarterlyTargetInputVisible: false
            });
          }}
          onCancel={() => {
            that.setState({
              structureQuarterlyTargetInputVisible: false
            });
          }}
        />
        <EmployeeQuarterlyTargetInput
          companyId={currentUser.company_id}
          structureValue=''
          structureList={structureList}
          userList={userList}
          visible={employeeQuarterlyTargetInputVisible}
          onOk={(fieldsValue) => {
            console.log('员工业绩录入值：' + fieldsValue.quarter1);
            that.setState({
              employeeQuarterlyTargetInputVisible: false
            });
          }}
          onCancel={() => {
            that.setState({
              employeeQuarterlyTargetInputVisible: false
            });
          }}
        />
        <StructureMonthlyTargetInput
          companyId={currentUser.company_id}
          structureValue=''
          structureList={structureList}
          userList={userList}
          visible={structureMonthlyTargetInputVisible}
          onOk={(fieldsValue) => {
            console.log('员工业绩录入值：' + fieldsValue.quarter1);
            that.setState({
              structureMonthlyTargetInputVisible: false
            });
          }}
          onCancel={() => {
            that.setState({
              structureMonthlyTargetInputVisible: false
            });
          }}
        />
        <EmployeeMonthlyTargetInput
          companyId={currentUser.company_id}
          structureValue=''
          structureList={structureList}
          userList={userList}
          visible={employeeMonthlyTargetInputVisible}
          onOk={(fieldsValue) => {
            console.log('员工业绩录入值：' + fieldsValue.quarter1);
            that.setState({
              employeeMonthlyTargetInputVisible: false
            });
          }}
          onCancel={() => {
            that.setState({
              employeeMonthlyTargetInputVisible: false
            });
          }}
        />
        <Card>
          <Row>
            <Col>
              <Tabs type="card">
                <TabPane tab="部门业绩" key="1">
                  <Row>
                    <Col>
                      <TargetConditions
                        structureList={structureList}
                        userList={userList}
                        structureOnChange={this.structureOnChange}
                        userOnChange={this.employeeOnChange}
                        onReset={() => {
                          this.setState({
                            structureQuarterlyTargetInputVisible: true,
                            employeeQuarterlyTargetInputVisible: false
                          });
                        }} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetTable />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="员工业绩" key="2">
                  <Row>
                    <Col>
                      <TargetConditions
                        structureList={structureList}
                        userList={userList}
                        structureOnChange={this.structureOnChange}
                        userOnChange={this.employeeOnChange}
                        onReset={() => {
                          this.setState({
                            structureQuarterlyTargetInputVisible: false,
                            employeeQuarterlyTargetInputVisible: false,
                            structureMonthlyTargetInputVisible: true,
                            employeeMonthlyTargetInputVisible: false
                          });
                        }} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetTable />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerServiceTarget;
