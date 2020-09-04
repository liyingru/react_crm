import { Modal, Form, Select } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};

const { Option } = Select;


interface NewEditProjectMembersProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: boolean;
    customer: any;
    orderDetail: any;
    showStyle: number;
    allUser: any[];
    projectMembersModel: any;

}

const NewEditProjectMembersCreateForm = Form.create({ name: 'from_new_edit' })(
    class extends React.Component<> {

        // constructor(props: any) {
        //     super(props);
        // }



        componentWillReceiveProps(nextProps: any) {
            const { visible } = nextProps;
            if (visible !== this.props?.visible) {
                // 进行初始化

                this.props?.form?.resetFields();
            }
        }

        okTestCreate = () => {
            this.props?.form.validateFields((err: any, values: any) => {
                if (!err) {
                    const { onCreate } = this.props;
                    onCreate(values)
                }
            });
        }

        render() {
            const { visible, onCancel, form, categoryList, allUser, projectMembersModel } = this.props;
            const { getFieldDecorator } = form;


            const isEditC = projectMembersModel?.category_id > 0 ? true : false;

            return (
                <Modal
                    visible={visible}
                    title=""
                    okText="确定"
                    onCancel={onCancel}
                    onOk={this.okTestCreate}
                    centered
                >
                    <div >
                        <Form layout='horizontal' onSubmit={this.okTestCreate}>

                            <Form.Item label="选择品类："  {...formItemLayout} >
                                {getFieldDecorator('category', {
                                    initialValue: projectMembersModel?.category_id ?? undefined,
                                    rules: [{ required: true, message: '请选择选择品类' }]
                                })(
                                    <Select placeholder="请选择选择品类"
                                        optionFilterProp="children"
                                        disabled={isEditC}
                                        showSearch>
                                        {categoryList && categoryList?.map(item => (
                                            <Option title={item?.name} value={item?.id}>{item?.name}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item label="选择成员："  {...formItemLayout} >
                                {getFieldDecorator('teamUserIds', {
                                    initialValue: projectMembersModel?.team_ids ?? [],
                                    rules: [{ required: true, message: '请选择成员' }]
                                })(
                                    <Select placeholder="请选择成员"
                                        optionFilterProp="children"
                                        mode="multiple"
                                        showSearch>
                                        {allUser && allUser?.map(item => (
                                            <Option title={item?.name} value={item?.id?.toString()}>{item?.name}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Form>
                    </div>

                </Modal>
            );
        }
    },
);


class NewEditProjectMembersPage extends React.Component<NewEditProjectMembersProps> {
    saveFormRef: any;

    constructor(props: NewEditProjectMembersProps) {
        super(props);

        this.state = {
            categoryList: []
        }

        this.initData()
    }

    componentWillReceiveProps(nextProps: NewEditProjectMembersProps) {
        const { visible } = nextProps;
        if (visible !== this.props?.visible) {
            // 进行初始化
            this.initData()

        }
    }

    // 初始化数据
    initData = () => {
        const { customer, showStyle, orderDetail } = this.props;
        var tempCategoryList = [];

        if (showStyle === 3) {
            // 订单
            console.log('orderDetail', orderDetail)

            if (orderDetail?.orderInfo?.category > 0 && orderDetail?.orderInfo?.category_txt?.length > 0) {
                const tempItem = {
                    id: orderDetail?.orderInfo?.category,
                    name: orderDetail?.orderInfo?.category_txt,
                }
                tempCategoryList.push(tempItem)

            }

        } else if (customer) {
            const category_num = customer?.exists_category ?? {}
            /** 1：需求，2：邀约，3：订单, 4：提供人  10: 客户BI列表  */
            if (showStyle === 1) {
                // 需求
                if (category_num?.leads_category_num) {
                    const tempNum = category_num?.leads_category_num;
                    for (let idx = 0; idx < tempNum.length; idx++) {
                        const item = tempNum[idx];
                        if (item.num > 0) {
                            tempCategoryList.push(item)
                        }
                    }
                }
            } else if (showStyle === 2) {
                // 邀约
                if (category_num?.req_category_num) {
                    const tempNum = category_num?.req_category_num;
                    for (let idx = 0; idx < tempNum.length; idx++) {
                        const item = tempNum[idx];
                        if (item.num > 0) {
                            tempCategoryList.push(item)
                        }
                    }
                }
            } else {
                // BI 其他
                if (category_num?.customer_category_num) {
                    const tempNum = category_num.customer_category_num;
                    for (let idx = 0; idx < tempNum.length; idx++) {
                        const item = tempNum[idx];
                        if (item.num > 0) {
                            tempCategoryList.push(item)
                        }
                    }
                }
            }
        }
        this.setState({
            categoryList: tempCategoryList,
        })
    }

    handleCancel = () => {
        this.props.onCancel()
    };

    handleCreate = (values: any) => {
        const { saveFunction, showStyle, customer, projectMembersModel } = this.props;
        var paramValues = values;
        // 这个地方需要处理搜索数据

        if (projectMembersModel?.category_id > 0) {
            paramValues['action'] = 2;
        } else {
            paramValues['action'] = 1;
        }

        paramValues['type'] = showStyle;
        paramValues['customerId'] = customer.customerId;
        const teamUserIds = paramValues?.teamUserIds;

        if (teamUserIds && teamUserIds !== undefined) {
            paramValues['teamUserIds'] = teamUserIds.join(',')
        }

        saveFunction(paramValues)
    };


    render() {
        const { visible, allUser } = this.props;
        return (
            <div>
                <NewEditProjectMembersCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    categoryList={this.state?.categoryList}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    allUser={allUser ?? []}
                    projectMembersModel={this.props?.projectMembersModel}
                />
            </div>
        );
    }
}
export default NewEditProjectMembersPage;