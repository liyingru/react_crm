import { Modal, Form, Select, Input } from 'antd';
import React, { ChangeEvent } from 'react';
import styles from "./index.less";
const { Option } = Select;
const { TextArea } = Input;
import { FormComponentProps } from 'antd/es/form';
import { contactsInfoItem, configDataItem } from '../../data';

interface CollectionsProps extends FormComponentProps {
    saveFunction: (values: any, objc: any) => void;
    onCancel: (objc: any) => void;
    visible: boolean;
    data?: contactsInfoItem;
    identity: configDataItem[];
    contactTimeList: configDataItem[];
}

class CollectionsPage extends React.Component<CollectionsProps> {

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isShowPhoneRegExp: false
        }
    }

    handleCreate = () => {
        const { data, form, saveFunction } = this.props;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            var phone = values['phone']
            if (phone && phone?.length > 0) {
                if (phone == data?.phone) {
                    values['phone'] = data?.encryptPhone
                }
            }

            saveFunction(values, this);
            // if (data && data.contactId) {

            // } else {
            //     form.resetFields();
            // }
        });
    };

    onCancelFunction = () => {
        const { onCancel } = this.props;
        onCancel(this)
    }

    phonePattern = () => {
        const { data } = this.props;
        if (data && data?.phone) {
            if (data && data?.phone.indexOf("*") != -1) {
                return undefined
            } else {
                return new RegExp(/^\d{11}$/, "g")
            }
        } else {
            return new RegExp(/^\d{11}$/, "g")
        }
    }

    render() {
        // const { visible, data, identity, contactTimeList } = this.props;
        const { visible, form, data, identity, contactTimeList } = this.props;
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

        return (
            <Modal
                visible={visible}
                title={data && data.contactId ? '编辑联系人' : '新建联系人'}
                okText="保存"
                onCancel={this.onCancelFunction}
                onOk={this.handleCreate}
            >
                <Form layout='horizontal'>
                    <div >
                        <Form.Item label="姓名：" {...formItemLayout}>
                            {getFieldDecorator('userName', {
                                initialValue: data ? data.userName : undefined,
                                rules: [{ required: true, message: '请输入姓名' }]
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item label="角色：" {...formItemLayout} >
                            {getFieldDecorator('identity', {
                                initialValue: data && (data.identity != 0 ? data.identity : undefined),
                                rules: [{ required: false, message: '请选择角色' }]
                            })(<Select>
                                {identity && identity.map((item) => {
                                    return (
                                        <Option value={item.id}>{item.name}</Option>
                                    );
                                })}
                            </Select>)}
                        </Form.Item>
                    </div>
                    <div  >
                        <Form.Item label="手机号：" {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                initialValue: data ? data.phone : undefined,
                                rules: [{ required: true, pattern: this.phonePattern, min: 11, message: '请输入手机号' }], getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\D/g, '')
                                },
                            })(
                                <Input placeholder="请输入手机号" maxLength={11}></Input>
                            )}
                        </Form.Item>
                    </div>

                    <div  >
                        <Form.Item label="微信号：" {...formItemLayout} >
                            {getFieldDecorator('weChat', {
                                initialValue: data ? data.weChat : undefined,
                                rules: [{ required: false, message: '请输入微信号' }]
                            })(
                                <Input placeholder="请输入微信号" ></Input>
                            )}
                        </Form.Item>
                    </div>

                    <div className={styles.contentViewStyle}>
                        <Form.Item label="职位：" {...formItemLayout}>
                            {getFieldDecorator('occupation', {
                                initialValue: data ? data.occupation : undefined,
                                rules: [{ required: false, message: '请输入职位' }]
                            })(
                                <Input placeholder="请输入职位" ></Input>
                            )}
                        </Form.Item>
                    </div>

                    <div  >
                        <Form.Item label="方便联系：" {...formItemLayout}>
                            {getFieldDecorator('contactTime', {
                                initialValue: data && (data.contactTime != 0 ? data.contactTime : undefined),
                                rules: [{ required: false, message: '请选择联系时段' }]
                            })(
                                <Select style={{ width: 300 }}>
                                    {contactTimeList.map((item) => {
                                        return (
                                            <Option value={item.id}>{item.name}</Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div >备注：</div>
                        <Form.Item >
                            {getFieldDecorator('comment', {
                                initialValue: data ? data.comment : undefined,
                                rules: [{ required: false, message: '请输入备注' }]
                            })(
                                <TextArea rows={4} style={{ marginTop: 10 }}></TextArea>
                            )}
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        );
    }
}
export default Form.create<CollectionsProps>()(CollectionsPage);