import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Row, Col, Tabs, Modal, message, Button } from 'antd';
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
import {
  StructureQuarterlySalesTargetModel,
  StructureQuarterlySalesTarget,
  EmployeeQuarterlySalesTargetModel,
  EmployeeQuarterlySalesTarget,

  StructureMonthlySalesTargetModel,
  StructureMonthlySalesTarget,
  EmployeeMonthlySalesTargetModel,
  EmployeeMonthlySalesTarget
} from './data';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;
interface SalesTargetState {
  targetType: number;
  structureYear: string;
  employeeYear: string;
  companyId: string;
  structureStructureId: string;
  employeeStructureId: string;
  staffId: string;
  currentTabKey: string;

  structureQuarterlySalesTargetModel?: StructureQuarterlySalesTargetModel;
  structureQuarterlySalesTarget?: StructureQuarterlySalesTarget;
  employeeQuarterlySalesTargetModel?: EmployeeQuarterlySalesTargetModel;
  employeeQuarterlySalesTarget?: EmployeeQuarterlySalesTarget;

  structureMonthlySalesTargetModel?: StructureMonthlySalesTargetModel;
  structureMonthlySalesTarget?: StructureMonthlySalesTarget;
  employeeMonthlySalesTargetModel?: EmployeeMonthlySalesTargetModel;
  employeeMonthlySalesTarget?: EmployeeMonthlySalesTarget;

  listLoading: boolean;
  structureQuarterlyTargetInputVisible: boolean;
  structureMonthlyTargetInputVisible: boolean;
  employeeQuarterlyTargetInputVisible: boolean;
  employeeMonthlyTargetInputVisible: boolean;
}

interface SalesTargetProps {
  structureList: [],
  staffList: [],
  structureQuarterlySalesTargetModel: StructureQuarterlySalesTargetModel,
  employeeQuarterlySalesTargetModel: EmployeeQuarterlySalesTargetModel,
  structureMonthlySalesTargetModel: StructureMonthlySalesTargetModel,
  employeeMonthlySalesTargetModel: EmployeeMonthlySalesTargetModel,
}
@connect(
  ({
    targetManagement: {
      structureList,
      staffList
    },
    salesTargetManagement: {
      structureQuarterlySalesTargetModel,
      employeeQuarterlySalesTargetModel,
      structureMonthlySalesTargetModel,
      employeeMonthlySalesTargetModel,
    },
    loading,
  }: {
    targetManagement: TargetModalState;
    salesTargetManagement: ModalState;
    loading: { effects: any };
  }) => ({
    structureList,
    staffList,
    structureQuarterlySalesTargetModel,
    employeeQuarterlySalesTargetModel,
    structureMonthlySalesTargetModel,
    employeeMonthlySalesTargetModel,
    listLoading: loading.effects['salesTargetManagement/getStructureSelltargetList']
  }),
)

class SalesTarget extends Component<SalesTargetProps, SalesTargetState> {
  state: SalesTargetState = {
    targetType: 0, // 0-季度，1-月度
    structureYear: '2020',
    employeeYear: '2020',
    companyId: '',
    structureStructureId: '',
    employeeStructureId: '',
    staffId: '',
    currentTabKey: '1',
    listLoading: false,
    structureQuarterlyTargetInputVisible: false,
    structureMonthlyTargetInputVisible: false,
    employeeQuarterlyTargetInputVisible: false,
    employeeMonthlyTargetInputVisible: false,
  }

  componentDidMount() {
    const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
    if (currentUserInfoStr) {
      const currentUserInfo = JSON.parse(currentUserInfoStr);
      const that = this;
      const { dispatch } = this.props;
      this.setState({
        companyId: currentUserInfo.company_id
      }, () => {
        dispatch({
          type: 'targetManagement/fetchStructureList',
          payload: { companyId: currentUserInfo.company_id },
          callback: () => {
            that.searchWithConditionsAction('1');
            that.searchWithConditionsAction('2');
          }
        });
      });
    }
  }

  tabChange = (key) => {
    this.setState({
      currentTabKey: key
    });
  }

  yearOnChange = (isStructure: boolean, value: string) => {
    if (isStructure) {
      this.setState({
        structureYear: value
      });
    } else {
      this.setState({
        employeeYear: value
      });
    }
  }

  structureOnChange = (isStructure: boolean, value: string) => {
    const { dispatch } = this.props;
    const { companyId } = this.state;
    if (isStructure) {
      this.setState({
        structureStructureId: value
      });
    } else {
      this.setState({
        employeeStructureId: value
      });
    }

    const filter = {
      company_id: companyId,
      structure_id: value,
    }
    const op = {};
    for (let key in filter) {
      if (key == 'company_id') {
        op[key] = '=';
      }
      else if (key == 'structure_id') {
        op[key] = '=';
      }
      else {
        op[key] = 'IN';
      }
    }

    dispatch({
      type: 'targetManagement/fetchUserList',
      payload: {
        filter,
        op,
      }
    });
  }

  employeeOnChange = (value: string) => {
    this.setState({
      staffId: value
    });
  }

  onSearch = () => {
    const { currentTabKey } = this.state;
    this.searchWithConditionsAction(currentTabKey);
  }

  searchWithConditionsAction = (type: string) => {
    const { dispatch } = this.props;
    const { targetType, structureYear, employeeYear, companyId, structureStructureId, employeeStructureId, staffId } = this.state;
    if (type === '1') {
      dispatch({
        type: 'salesTargetManagement/getStructureSelltargetList',
        payload: {
          type: targetType == 0 ? 'quarter' : 'month',
          year: structureYear,
          companyId: companyId,
          structureId: structureStructureId
        },
        targetType: targetType
      });
    } else {
      dispatch({
        type: 'salesTargetManagement/getUserSelltargetList',
        payload: {
          type: targetType == 0 ? 'quarter' : 'month',
          year: employeeYear,
          companyId: companyId,
          structureId: employeeStructureId,
          staffId: staffId
        },
        targetType: targetType
      });
    }
  }

  addStructureSalesTarget = () => {
    const { targetType } = this.state;
    this.setState({
      structureStructureId: '',
      staffId: '',
      structureQuarterlySalesTarget: undefined,
      structureQuarterlyTargetInputVisible: targetType == 0 ? true : false,
      structureMonthlySalesTarget: undefined,
      structureMonthlyTargetInputVisible: targetType == 1 ? true : false,
    });
  }

  addUserSalesTarget = () => {
    const { targetType } = this.state;
    this.setState({
      employeeStructureId: '',
      staffId: '',
      employeeQuarterlySalesTarget: undefined,
      employeeQuarterlyTargetInputVisible: targetType == 0 ? true : false,
      employeeMonthlySalesTarget: undefined,
      employeeMonthlyTargetInputVisible: targetType == 1 ? true : false,
    });
  }

  render() {
    const {
      dispatch,
      structureList,
      staffList,
      structureQuarterlySalesTargetModel,
      employeeQuarterlySalesTargetModel,
      structureMonthlySalesTargetModel,
      employeeMonthlySalesTargetModel,
    } = this.props;
    const {
      targetType,
      structureYear,
      employeeYear,
      structureStructureId,
      employeeStructureId,
      staffId,
      companyId,
      currentTabKey,
      structureQuarterlySalesTarget,
      employeeQuarterlySalesTarget,
      structureMonthlySalesTarget,
      employeeMonthlySalesTarget,
      structureQuarterlyTargetInputVisible,
      structureMonthlyTargetInputVisible,
      employeeQuarterlyTargetInputVisible,
      employeeMonthlyTargetInputVisible
    } = this.state;
    const that = this;
    return (
      <PageHeaderWrapper>
        <StructureQuarterlyTargetInput
          companyId={companyId}
          structureValue=''
          structureList={structureList}
          targetModel={structureQuarterlySalesTarget}
          visible={structureQuarterlyTargetInputVisible}
          onOk={(fieldsValue, targetId) => {
            console.log('部门业绩录入值：' + fieldsValue);
            if (targetId) {
              dispatch({
                type: 'salesTargetManagement/editStructureSelltarget',
                payload: {
                  id: targetId,
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('部门业绩已更新');
                    that.setState({
                      structureQuarterlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            } else {
              dispatch({
                type: 'salesTargetManagement/addStructureSelltarget',
                payload: {
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('部门业绩已添加');
                    that.setState({
                      structureYear: '2020',
                      structureStructureId: '',
                      structureQuarterlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            }
          }}
          onCancel={() => {
            that.setState({
              structureQuarterlyTargetInputVisible: false
            });
          }}
        />
        <EmployeeQuarterlyTargetInput
          companyId={companyId}
          structureValue=''
          staffValue=''
          structureList={structureList}
          staffList={staffList}
          targetModel={employeeQuarterlySalesTarget}
          visible={employeeQuarterlyTargetInputVisible}
          onStructureChange={(value) => {
            that.setState({
              employeeStructureId: value
            });
            const filter = {
              company_id: companyId,
              structure_id: value,
            }
            const op = {};
            for (let key in filter) {
              if (key == 'company_id') {
                op[key] = '=';
              }
              else if (key == 'structure_id') {
                op[key] = '=';
              }
              else {
                op[key] = 'IN';
              }
            }
            dispatch({
              type: 'targetManagement/fetchUserList',
              payload: { filter, op }
            });
          }}
          onOk={(fieldsValue, targetId) => {
            console.log('员工业绩录入值：' + fieldsValue);
            if (targetId) {
              dispatch({
                type: 'salesTargetManagement/editUserSelltarget',
                payload: {
                  id: targetId,
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('员工业绩已更新');
                    that.setState({
                      employeeQuarterlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            } else {
              dispatch({
                type: 'salesTargetManagement/addUserSelltarget',
                payload: {
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('员工业绩已添加');
                    that.setState({
                      employeeYear: '2020',
                      employeeStructureId: '',
                      staffId: '',
                      employeeQuarterlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            }
          }}
          onCancel={() => {
            that.setState({
              employeeQuarterlyTargetInputVisible: false
            });
          }}
        />
        <StructureMonthlyTargetInput
          companyId={companyId}
          structureValue=''
          structureList={structureList}
          targetModel={structureMonthlySalesTarget}
          visible={structureMonthlyTargetInputVisible}
          onOk={(fieldsValue, targetId) => {
            console.log('部门业绩录入值：' + fieldsValue);
            if (targetId) {
              dispatch({
                type: 'salesTargetManagement/editStructureSelltarget',
                payload: {
                  id: targetId,
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('部门业绩已更新');
                    that.setState({
                      structureMonthlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            } else {
              dispatch({
                type: 'salesTargetManagement/addStructureSelltarget',
                payload: {
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('部门业绩已添加');
                    that.setState({
                      structureYear: '2020',
                      structureStructureId: '',
                      structureMonthlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            }
          }}
          onCancel={() => {
            that.setState({
              structureMonthlyTargetInputVisible: false
            });
          }}
        />
        <EmployeeMonthlyTargetInput
          companyId={companyId}
          structureValue=''
          staffValue=''
          structureList={structureList}
          staffList={staffList}
          targetModel={employeeMonthlySalesTarget}
          visible={employeeMonthlyTargetInputVisible}
          onStructureChange={(value) => {
            that.setState({
              employeeStructureId: value
            });
            const filter = {
              company_id: companyId,
              structure_id: value,
            }
            const op = {};
            for (let key in filter) {
              if (key == 'company_id') {
                op[key] = '=';
              }
              else if (key == 'structure_id') {
                op[key] = '=';
              }
              else {
                op[key] = 'IN';
              }
            }
            dispatch({
              type: 'targetManagement/fetchUserList',
              payload: { filter, op }
            });
          }}
          onOk={(fieldsValue, targetId) => {
            console.log('员工业绩录入值：' + fieldsValue);
            if (targetId) {
              dispatch({
                type: 'salesTargetManagement/editUserSelltarget',
                payload: {
                  id: targetId,
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('员工业绩已更新');
                    that.setState({
                      employeeMonthlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            } else {
              dispatch({
                type: 'salesTargetManagement/addUserSelltarget',
                payload: {
                  ...fieldsValue
                },
                callback: (res) => {
                  if (res.code === 200) {
                    message.success('员工业绩已添加');
                    that.setState({
                      employeeYear: '2020',
                      employeeStructureId: '',
                      staffId: '',
                      employeeMonthlyTargetInputVisible: false
                    });
                    that.searchWithConditionsAction(currentTabKey);
                  }
                }
              });
            }
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
              <Tabs type="card" onChange={this.tabChange}>
                <TabPane tab="部门业绩" key="1">
                  <Row>
                    <Col>
                      <Button type='primary' onClick={this.addStructureSalesTarget}>添加部门业绩</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetConditions
                        yearValue={structureYear}
                        structureValue={structureStructureId}
                        structureList={structureList}
                        userList={staffList}
                        yearOnChange={(value) => {
                          this.yearOnChange(true, value);
                        }}
                        structureOnChange={(value) => {
                          this.structureOnChange(true, value);
                        }}
                        onSearch={this.onSearch}
                        onReset={() => {
                          that.setState({
                            structureYear: '2020',
                            structureStructureId: '',
                            staffId: '',
                            structureQuarterlyTargetInputVisible: false,
                            employeeQuarterlyTargetInputVisible: false,
                            structureMonthlyTargetInputVisible: false,
                            employeeMonthlyTargetInputVisible: false
                          });
                        }} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetTable
                        structureQuarterlySalesTargetModel={structureQuarterlySalesTargetModel}
                        structureMonthlySalesTargetModel={structureMonthlySalesTargetModel}
                        targetEditClick={(model) => {
                          that.setState({
                            structureQuarterlySalesTarget: targetType == 0 ? model : undefined,
                            structureMonthlySalesTarget: targetType == 1 ? model : undefined,
                            structureQuarterlyTargetInputVisible: targetType == 0 ? true : false,
                            employeeQuarterlyTargetInputVisible: false,
                            structureMonthlyTargetInputVisible: targetType == 1 ? true : false,
                            employeeMonthlyTargetInputVisible: false
                          });
                        }}
                        targetDeleteClick={(targetId) => {
                          confirm({
                            title: '您确定删除此业绩吗？',
                            icon: <ExclamationCircleOutlined />,
                            okText: '删除',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                              dispatch({
                                type: 'salesTargetManagement/delStructureSelltarget',
                                payload: {
                                  id: targetId
                                },
                                callback: (res) => {
                                  if (res.code === 200) {
                                    message.success('部门业绩已删除');
                                    that.searchWithConditionsAction(currentTabKey);
                                  }
                                }
                              });
                            },
                            onCancel() {

                            },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="员工业绩" key="2">
                  <Row>
                    <Col>
                      <Button type='primary' onClick={this.addUserSalesTarget}>添加员工业绩</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetConditions
                        yearValue={employeeYear}
                        structureValue={employeeStructureId}
                        userValue={staffId}
                        structureList={structureList}
                        userList={staffList}
                        yearOnChange={(value) => {
                          this.yearOnChange(false, value);
                        }}
                        structureOnChange={(value) => {
                          this.structureOnChange(false, value);
                        }}
                        userOnChange={this.employeeOnChange}
                        onSearch={this.onSearch}
                        onReset={() => {
                          that.setState({
                            employeeYear: '2020',
                            employeeStructureId: '',
                            staffId: '',
                            structureQuarterlyTargetInputVisible: false,
                            employeeQuarterlyTargetInputVisible: false,
                            structureMonthlyTargetInputVisible: false,
                            employeeMonthlyTargetInputVisible: false
                          });
                        }} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TargetTable
                        employeeQuarterlySalesTargetModel={employeeQuarterlySalesTargetModel}
                        employeeMonthlySalesTargetModel={employeeMonthlySalesTargetModel}
                        targetEditClick={(model) => {
                          const filter = {
                            company_id: companyId,
                            structure_id: model.structureId,
                          }
                          const op = {};
                          for (let key in filter) {
                            if (key == 'company_id') {
                              op[key] = '=';
                            }
                            else if (key == 'structure_id') {
                              op[key] = '=';
                            }
                            else {
                              op[key] = 'IN';
                            }
                          }
                          dispatch({
                            type: 'targetManagement/fetchUserList',
                            payload: { filter, op },
                            callback: () => {
                              that.setState({
                                employeeQuarterlySalesTarget: targetType == 0 ? model : undefined,
                                employeeMonthlySalesTarget: targetType == 1 ? model : undefined,
                                structureQuarterlyTargetInputVisible: false,
                                employeeQuarterlyTargetInputVisible: targetType == 0 ? true : false,
                                structureMonthlyTargetInputVisible: false,
                                employeeMonthlyTargetInputVisible: targetType == 1 ? true : false
                              });
                            }
                          });
                        }}
                        targetDeleteClick={(targetId) => {
                          confirm({
                            title: '您确定删除此业绩吗？',
                            icon: <ExclamationCircleOutlined />,
                            okText: '删除',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                              dispatch({
                                type: 'salesTargetManagement/delUserSelltarget',
                                payload: {
                                  id: targetId
                                },
                                callback: (res) => {
                                  if (res.code === 200) {
                                    message.success('员工业绩已删除');
                                    that.searchWithConditionsAction(currentTabKey);
                                  }
                                }
                              });
                            },
                            onCancel() {

                            },
                          });
                        }}
                      />
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

export default SalesTarget;

