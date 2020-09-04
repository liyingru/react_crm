import { Modal, Form, Select, DatePicker, Input } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import styles from "./index.less";
import { PlansItemList, configDataItem, rderInfoModel } from '../../data';

const { Option } = Select;
const { TextArea } = Input;

/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


interface CollectionsProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: false;
    data: rderInfoModel;
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor(props: Readonly<{}>) {
            super(props);
        }

        render() {
            const { visible, onCancel, onCreate, form, status, statusTxt, statusAarry } = this.props;
            const { getFieldDecorator } = form;

            const formItemLayout =
            {
                labelCol: {
                    xs: { span: 10 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            }

            const showT = `更改订单信息（当前状态：${statusTxt}）`

            return (
                <Modal 
                    visible={visible}
                    title={showT}
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout='horizontal'>

                        <div >
                            <Form.Item label="状态：" {...formItemLayout}>
                                {getFieldDecorator('status', {
                                    initialValue: status,
                                    rules: [{ required: true, message: '请选择状态' }]
                                })(
                                    <Select>
                                        {statusAarry && statusAarry.map((item: { id: string | number | undefined; name: React.ReactNode; }) => (
                                                <Option value={item.id}>{item.name}</Option>
                                            ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>

                    </Form>
                </Modal>
            );
        }
    },
);

class CollectionsPage extends React.Component<CollectionsProps> {
    [x: string]: any;

    constructor(props: CollectionsProps) {
        super(props)
        // const { data: { status } } = props;

        if (props?.data?.status == 3) {
            this.state = {
                statusAarry: [
                    { id: 3, name: '已签单' },
                    { id: 4, name: '已退单' }
                ]
            }
        } else {
            this.state = {
                statusAarry: [
                    { id: 1, name: '有效单' },
                    { id: 2, name: '无效单' },
                    { id: 3, name: '已签单' },
                    { id: 4, name: '已退单' }
                ]
            }
        }

    }

    state: {
        statusAarry: any[]
    }

    handleCancel = () => {
        this.props.onCancel()
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err: any, values: any) => {
            this.props.saveFunction(values)
        });
    };

    saveFormRef = (formRef: any) => {
        this.formRef = formRef;
        console.log(formRef)
    };


    componentDidUpdate() {
        const { form } = this.formRef.props;
        form.resetFields();
    }

    render() {
        const { visible, data } = this.props;
        // const { data: { status_txt, status } } = this.props;
        const { statusAarry } = this.state;

        return (
            <div>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    statusAarry={statusAarry}
                    statusTxt={data?.status_txt}
                    status={data?.status}
                />
            </div>
        );
    }
}
export default CollectionsPage;