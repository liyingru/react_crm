import Form, { FormComponentProps } from "antd/lib/form";
import React, { Component } from "react";
import { Card, Select, Row, Col, Input, Button, Radio, Divider, Icon, message } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { connect } from "dva";
import { StateType } from "./model";
import styles from './style.less';
import { Action, Dispatch } from "redux";
import { ProcessData } from "../processList/data";
import TextArea from "antd/lib/input/TextArea";
import LOCAL from "@/utils/LocalStorageKeys";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import getUserInfo from "@/utils/UserInfoStorage";
import CrmUtil from "@/utils/UserInfoStorage";
import { ListStructureSubItem } from "@/pages/SystemManagement/UserManagement/data";

const FormItem = Form.Item;
const { Option } = Select;

interface NewProcessProps extends FormComponentProps {
    dispatch: Dispatch<
        Action<
            | 'processManagementNewProcess/new'
            | 'processManagementNewProcess/edit'
            | 'processManagementNewProcess/detail'
            | 'processManagementNewProcess/config'
            | 'processManagementNewProcess/userList'
            | 'processManagementNewProcess/goList'
            | 'processManagementNewProcess/queryListStructure'
            
        >
    >;
    loading: boolean;
    processManagementNewProcess: StateType;
}

interface NewProcessState {
    auditorIds: string[],
    auditorTitle: string[],
    processData: ProcessData | undefined,
    structureOptions: ListStructureSubItem[] | undefined,
}

@connect(
    ({
        processManagementNewProcess,
        loading,
    }: {
        processManagementNewProcess: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        processManagementNewProcess,
        loading: loading.models.processManagementNewProcess,
    }),
)

class NewProcess extends Component<NewProcessProps, NewProcessState> {
    acId: string | undefined = this.props.location.state ? this.props.location.state.id : undefined;
    currentUserInfo: any;
    state: NewProcessState = {
        auditorIds: ['null'],
        auditorTitle: ['审批人'],
        processData: undefined,
        structureOptions: undefined,
    }

    constructor(props: NewProcessProps) {
        super(props);
        this.currentUserInfo = CrmUtil.getUserInfo() || {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        //如果有审核配置id则加载详情编辑
        if (this.acId) {
            dispatch({
                type: 'processManagementNewProcess/detail',
                payload: {
                    acId: this.acId,
                },
                callback: (processData: ProcessData) => {
                    if (processData && processData.auditor_ids.length > 0) {
                        let auditorIds: string[] = [];
                        let auditorTitle: string[] = [];
                        let defaultValues: string[] = processData.auditor_ids.split(',');
                        defaultValues.map((value, index) => {
                            auditorIds = [
                                ...auditorIds,
                                value,
                            ]
                            auditorTitle.push('审核人')
                        })
                        this.setState({
                            auditorIds: auditorIds,
                            auditorTitle: auditorTitle,
                            processData: processData,
                        })
                    } else {
                        this.setState({
                            processData: processData,
                        })
                    }
                },
            });
        } 
        //配置信息
        dispatch({
            type: 'processManagementNewProcess/config',
        });

        const currentCompanyId = this.currentUserInfo.company_id;
        dispatch({
            type: 'processManagementNewProcess/queryListStructure',
            payload: {
              companyId: currentCompanyId
            },
            callback: (success: boolean) => {
              const { processManagementNewProcess: { listStructure } } = this.props;
              const structureArray = listStructure.filter(item => item.company_id == currentCompanyId );
              const structureOptions = structureArray.length > 0 ? structureArray[0].structureList : undefined;
              this.setState({
                structureOptions
              })
            }
          });

        const filter = { company_id: this.currentUserInfo.company_id };
        const op = { company_id: '=' };
        //用户信息
        dispatch({
            type: 'processManagementNewProcess/userList',
            payload: {
                filter: filter,
                op: op,
            }
        });
    }

    handleNewOrModifyProccess = () => {
        const { dispatch, form } = this.props;
        const { processData } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            console.log(fieldsValue)
            console.log(this.state.auditorIds);
            const acturalIds = this.state.auditorIds.filter(item=>item!='null');
            if (acturalIds.length <= 0) {
                message.warn("请选择审核人");
                return;
            } 
            const auditorIds: string = acturalIds.join(",");

            const structureIds = fieldsValue.structureIds.join(',');
            
            let params = {
                ...fieldsValue,
                auditorIds,
                companyId: this.currentUserInfo.company_id,
                structureIds
            }
            // const auditorIdsValue = params['auditorIds']
            // if (auditorIdsValue !== undefined) {
            //     delete params['auditorIds'];
            // }
            // params['auditorIds'] = auditorIds;
            // params['companyId'] = this.currentUserInfo.company_id;
            // console.log(processData)
            if (processData) {
                params = {
                    ...params,
                    acId: this.acId
                }
                //params['acId'] = this.acId;
                //修改
                dispatch({
                    type: 'processManagementNewProcess/edit',
                    payload: params,
                    callback: () => {
                        message.success('审批流修改成功');
                        //跳转列表页
                        dispatch({
                            type: 'processManagementNewProcess/goList',
                        })
                    },
                })
            } else {
                //新增
                dispatch({
                    type: 'processManagementNewProcess/new',
                    payload: params,
                    callback: () => {
                        message.success('新建审批流成功');
                        //跳转列表页
                        dispatch({
                            type: 'processManagementNewProcess/goList',
                        })
                    },
                })
            }
        })
    }

    handleAddAuditor = () => {
        let auditorIds = this.state.auditorIds;
        let auditorTitle = this.state.auditorTitle;
        auditorIds.push('null');
        auditorTitle.push('审核人');
        this.setState({
            auditorIds,
            auditorTitle,
        })
    }

    handleDeleteAuditor = (index: number) => {
        console.log("要删除的是第 " + (index+1) + "个");
        let auditorIds = this.state.auditorIds;
        let auditorTitle = this.state.auditorTitle;
        console.log("删除前： " + JSON.stringify(auditorIds));
        auditorIds.splice(index, 1);
        console.log("删除后： " + JSON.stringify(auditorIds));
        auditorTitle.splice(index, 1);
        this.setState({
            auditorIds,
            auditorTitle,
        })
    }

    render() {
        const { processData } = this.state;
        let buttonTxt = '新建';
        let title = '新建审批流';
        if (processData) {
            buttonTxt = '修改'
            title = '修改审批流'
        }
        return (
            <PageHeaderWrapper title={title}>
                <Card bordered={false}>
                    {/* <div className={styles.alertTextTitle}>新建审批流</div> */}
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <Row>
                        <Col span={10}>

                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <Button type="primary" style={{ width: '30%' }} onClick={this.handleNewOrModifyProccess}>{buttonTxt}</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </PageHeaderWrapper >
        );
    }

    expandedStructures : ListStructureSubItem[] = new Array();
  expandStructures = (structures: ListStructureSubItem[]) => {
    structures.map(struc => {
      this.expandedStructures.push(struc);
      if(struc.childlist&&struc.childlist.length>0) {
        this.expandStructures(struc.childlist);
      }
    })
  }

  reRenderOption = (item : ListStructureSubItem) => {
    if(item.tier > 1) {
      const arr : any[] = new Array(item.tier-1);
      for(let i = 0; i < item.tier-1; i++) {
        arr[i] = "fake";
      }
      return (
        <div>
          {
            arr.map((a,index) => (
              <span>&nbsp;&nbsp;</span>
            ))
          }
          <span>{item.name}</span>
        </div>
      )
    } else {
      return (
        <span>{item.name}</span>
      )
    }
  }

    renderForm() {
        const { form, processManagementNewProcess: { config } } = this.props;
        const { getFieldDecorator } = form;
        const { processData } = this.state;
        let defualtStatusValue: string | undefined;
        if (processData) {
            defualtStatusValue = processData.status;
        } else if (config.auditConfigStatus && config.auditConfigStatus.length > 0) {
            defualtStatusValue = config.auditConfigStatus[0].id;
        } else {
            defualtStatusValue = undefined;
        }


    console.log("处理前的部门： " + JSON.stringify(this.state.structureOptions));
    if(this.expandedStructures) {
      this.expandedStructures = new Array();
      if(this.state.structureOptions) {
        this.expandStructures(this.state.structureOptions);
      } 
    }
    console.log("处理后的部门： " + JSON.stringify(this.expandedStructures));

        return (
            <Form>
                <Row>
                    <Col span={10}>
                        <FormItem label="审批流名称">
                            {getFieldDecorator('name', {
                                initialValue: processData ? processData.name : undefined,
                                rules: [{ required: true, message: '请填写审批流名称' }],
                            })(<Input placeholder="请输入审批流名称" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label="操作场景">
                            {getFieldDecorator('type', {
                                initialValue: processData ? processData.type : undefined,
                                rules: [{ required: true, message: '请选择操作场景' }],
                            })(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    {
                                        config.auditType ? config.auditType.map(auditType => (
                                            <Option value={auditType.id}>{auditType.name}</Option>)) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label="触发部门">
                            {getFieldDecorator('structureIds', {
                                initialValue: processData && processData.structure_ids ? processData.structure_ids.split(',') as string[] : undefined,
                                rules: [{ required: true, message: '请选择触发部门' }],
                            })(
                                <Select mode="multiple" placeholder="请选择（可多选）" style={{ width: '100%' }} optionLabelProp="title" >
                                {
                                  this.expandedStructures.map(item => (
                                    <Option value={item.id+""} title={item.name} >
                                      {
                                        this.reRenderOption(item)
                                      }
                                    </Option>
                                  ))
                                }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label="审批节点">
                            {getFieldDecorator('auditorIds2', {
                                initialValue: defualtStatusValue,
                                // rules: [{ required: true, message: '请至少选择1个审核人' }],
                            })(
                                this.renderAuditor()
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label="流程说明">
                            {getFieldDecorator('remark', {
                                initialValue: processData ? processData.remark : undefined,
                            })(<TextArea placeholder="请输入流程说明" style={{ width: '100%' }} autoSize={{ minRows: 5, maxRows: 5 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem label="状态">
                            {getFieldDecorator('status', {
                                initialValue: defualtStatusValue,
                                rules: [{ required: true, message: '请选择状态' }],
                            })(
                                this.renderRadioGroup()
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderRadioGroup() {
        const { processManagementNewProcess: { config } } = this.props;
        return (
            <Radio.Group>
                {
                    (config.auditConfigStatus && config.auditConfigStatus.length > 0) ? config.auditConfigStatus.map(config => (
                        <Radio value={config.id}>{config.name}</Radio>)) : null
                }
            </Radio.Group >
        );
    }

    renderAuditor() {
        return (
            <div>
                <Row>
                    {
                        this.state.auditorTitle.map((title, index) =>
                            this.renderAuditorSelect(index)
                        )
                    }
                </Row>
                <a onClick={this.handleAddAuditor}><Icon type="plus" />添加审批层级</a>
            </div>
        );
    }

    //将数字（整数）转为汉字，从零到一亿亿，需要小数的可自行截取小数点后面的数字直接替换对应arr1的读法就行了
    convertToChinaNum(num) {
        var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值
        if (!num || isNaN(num)) {
            return "零";
        }
        var english = num.toString().split("")
        var result = "";
        for (var i = 0; i < english.length; i++) {
            var des_i = english.length - 1 - i;//倒序排列设值
            result = arr2[i] + result;
            var arr1_index = english[des_i];
            result = arr1[arr1_index] + result;
        }
        //将【零千、零百】换成【零】 【十零】换成【十】
        result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
        //合并中间多个零为一个零
        result = result.replace(/零+/g, '零');
        //将【零亿】换成【亿】【零万】换成【万】
        result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
        //将【亿万】换成【亿】
        result = result.replace(/亿万/g, '亿');
        //移除末尾的零
        result = result.replace(/零+$/, '')
        //将【零一十】换成【零十】
        //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
        //将【一十】换成【十】
        result = result.replace(/^一十/g, '十');
        return result;
    }

    renderAuditorSelect(index: number) {
        const { processManagementNewProcess: { users } } = this.props;
        var numberStr = this.convertToChinaNum(index + 1);
        let selectTitle = numberStr + '级审批'
        let selectedValue: number | undefined;
        if (this.state.auditorIds[index] != 'null') {
            selectedValue = parseInt(this.state.auditorIds[index]);
        }
        console.log("selectedValue = " + selectedValue);
        return (
            <Col span={24}>
                <div >
                    <Row >
                        <Col span={24}>
                            <span> {selectTitle}</span>
                        </Col>
                        <Col span={24}>
                            <Select showSearch placeholder="请选择" style={{ width: '100%' }}  
                                value={selectedValue}
                                // labelInValue={true}
                                onChange={(value: number) => {
                                    let auditorIds = this.state.auditorIds ;
                                    let id = value+"";
                                    auditorIds.splice(index, 1, id)
                                    this.setState({
                                        auditorIds,
                                    })
                                }}
                                optionFilterProp="children"
                            >
                                {
                                users ? users.map((user,index) => (
                                    <Option title={user.name} value={parseInt(user.id)}>{user.name}</Option>
                                    )) : null
                                }
                            </Select>
                        </Col>
                    </Row>

                    {
                    index > 0 && (
                        <a  onClick={() => this.handleDeleteAuditor(index)}>删除</a>
                    )}
                </div>
                <Divider />
            </Col >
        );
    }
}

export default Form.create<NewProcessProps>()(NewProcess);