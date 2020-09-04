import {
    Button,
    Card,
    Select,
    Divider,
    DatePicker,
    message,
    Spin,
    Modal,
    Popconfirm,
} from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { Component, Dispatch } from "react";
import { connect } from 'dva';
import Form, { FormComponentProps } from "antd/lib/form";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { KeepAlive } from 'umi';

import { StateType } from './model'
import CrmStandardTable, { CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
import { DayOffListItem } from './data';
import AddOrEditModal from './components/AddOrEditModal';
import CrmFilterForm from '@/components/CrmFilterForm';
import { PlusOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';

interface TableListProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    loading: boolean;
    paidLeaveTableHomeModel: StateType;
}

interface TableListState {
    addOrEditModalVisibile: boolean;
    editItem: DayOffListItem | undefined;
    originValues: {};
    formValues: {};
}

@connect(
    ({
        paidLeaveTableHomeModel,
        loading,
    }: {
        paidLeaveTableHomeModel: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        paidLeaveTableHomeModel,
        loading: loading.models.paidLeaveTableHomeModel,
    }),
)

class TableList extends Component<TableListProps, TableListState> {

    state: TableListState = {
        addOrEditModalVisibile: false,
        editItem: undefined,
        originValues: {},
        formValues: {}
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/fetchSchedulingList',
            payload: {
                page: 1,
                pageSize: 10
            }
        })
        dispatch({
            type: 'paidLeaveTableHomeModel/fetchUserList',
        });
    }

    getTableColumns = (): CrmStandardTableColumnProps<DayOffListItem>[] => [
        {
            title: '日期',
            dataIndex: 'date_time',
        },
        {
            title: '调休人员',
            dataIndex: 'user_id_list_txt',
        },
        {
            title: '操作',
            fixed: 'right',
            align: 'center',
            dataIndex: 'btns',
            key: 'action',
            render: (text, record) => (
                <div hidden={record.is_edit == 1}>
                    <a onClick={() => this.handleEditItem(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        placement="topLeft"
                        title="是否确认删除？删除后将不执行休假规则。"
                        onConfirm={() => this.handleDeleteItem(record.id)}
                        onCancel={() => { }}
                        okText="删除"
                        cancelText="取消"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    handlePaginationChanged = (page: number, pageSize: number) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/fetchSchedulingList',
            payload: {
                ...this.state.formValues,
                page,
                pageSize,
            },
        });
    }

    // 提交搜索
    handleSearch = () => {
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            this.setState({
                originValues: fieldsValue,
            })

            // 表单信息和状态
            const formValues = {
                ...fieldsValue,
            };

            // 取出起始和结束时间
            const { date_range_time } = fieldsValue
            if (date_range_time !== undefined && date_range_time != '') {
                delete formValues.date_range_time
                formValues.dateStartTime = moment(date_range_time[0]).format('YYYY-MM-DD');
                formValues.dateEndTime = moment(date_range_time[1]).format('YYYY-MM-DD');
            };

            formValues.userIdList = formValues.userIdList?.join(',');

            this.setState({
                formValues,
            });

            // 取出分页信息
            const { pagination } = this.props.paidLeaveTableHomeModel.dayOffList;
            dispatch({
                type: 'paidLeaveTableHomeModel/fetchSchedulingList',
                payload: {
                    ...formValues,
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                },
            });
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
            originValues: {},
        });

        const { pagination } = this.props.paidLeaveTableHomeModel.dayOffList;
        dispatch({
            type: 'paidLeaveTableHomeModel/fetchSchedulingList',
            payload: {
                //   page: pagination.current,
                page: 1,
                pageSize: pagination.pageSize,
            },
        });
    };

    refreshList = () => {
        const { dispatch, paidLeaveTableHomeModel: { dayOffList: { pagination } } } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/fetchSchedulingList',
            payload: {
                page: pagination.current,
                pageSize: pagination.pageSize,
            }
        });
    }

    handleAddDayOffItem = () => {
        this.setState({
            addOrEditModalVisibile: true,
            editItem: undefined
        })
    }

    handleEditItem = (item: DayOffListItem) => {
        this.setState({
            addOrEditModalVisibile: true,
            editItem: item
        })
    }

    handleDeleteItem = (id: number) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/deleteScheduling',
            payload: { id },
            callback: (success: boolean) => {
                this.setState({
                    addOrEditModalVisibile: false
                });
                this.refreshList();
            }
        })
    }

    handleSubmitAdd = (params: { dateTime: string, userIdList: string }) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/addScheduling',
            payload: params,
            callback: (success: boolean) => {
                this.setState({
                    addOrEditModalVisibile: false
                });
                if (success) {
                    message.success("添加成功")
                }
                this.refreshList();
            }
        })
    }

    handleSubmitEdit = (params: { id: number, dateTime: string, userIdList: string }) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'paidLeaveTableHomeModel/editScheduling',
            payload: params,
            callback: (success: boolean) => {
                this.setState({
                    addOrEditModalVisibile: false
                });
                if (success) {
                    message.success("编辑成功")
                }
                this.refreshList();
            }
        })
    }

    renderFilterForm = () => {
        const { form, paidLeaveTableHomeModel: { userList } } = this.props;
        const { getFieldDecorator } = form;

        const formItemList: JSX.Element[] = new Array();
        formItemList.push(
            <FormItem label="日期">
                {getFieldDecorator('date_range_time', {
                    initialValue: this.state.originValues?.date_range_time
                })(
                    <RangePicker style={{ width: '100%' }} />
                )}
            </FormItem>
        );
        formItemList.push(
            <FormItem label="调休人员">
                {getFieldDecorator('userIdList', {
                    initialValue: this.state.originValues?.userIdList
                })(
                    <Select showSearch style={{ width: '100%', }} mode="multiple" placeholder="请选择" >
                        {
                            userList && userList.map(user => (
                                <Option value={user.id + ""} key={user.id}>{user.name}</Option>
                            ))
                        }
                    </Select>
                )}
            </FormItem>
        );
        return formItemList;
    }

    render() {
        const { addOrEditModalVisibile } = this.state;
        const { paidLeaveTableHomeModel: { dayOffList, userList }, loading } = this.props
        return (
            <Spin spinning={loading} delay={300} >
                <Card>
                    <CrmFilterForm
                        formItemList={this.renderFilterForm()}
                        onFilterReset={this.handleFormReset}
                        onFilterSearch={this.handleSearch}
                    />

                    <Divider />

                    <MyTable
                        rowKey="id"
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        data={dayOffList}
                        columns={this.getTableColumns()}
                        onPaginationChanged={this.handlePaginationChanged}
                        columnsEditable={false}
                        // selecteMode="checkbox"
                        renderTopButtons={
                            () => (
                                <Button type="primary" onClick={this.handleAddDayOffItem}><PlusOutlined />添加</Button>
                            )
                        }
                    />
                    <AddOrEditModal
                        modalVisible={addOrEditModalVisibile}
                        onSubmitAdd={this.handleSubmitAdd}
                        onSubmitEdit={this.handleSubmitEdit}
                        userList={userList}
                        onCancel={() => {
                            this.setState({
                                addOrEditModalVisibile: false
                            })
                        }}
                        editValue={this.state.editItem}
                    />
                </Card>
            </Spin>
        )
    }
}

class TableList1 extends Component<TableListProps, TableListState> {
    render() {
        return (
            <PageHeaderWrapper >
                <KeepAlive>
                    <TableList {...this.props} />
                </KeepAlive>
            </PageHeaderWrapper>
        )
    }
}
class MyTable extends CrmStandardTable<DayOffListItem>{ }
export default Form.create<TableListProps>()(TableList1);