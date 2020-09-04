import { Button, Modal, Form, Select, DatePicker, Input, message } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { contactsInfoItem, configDataItem } from '../../dxl/data';
import FileUpload from '@/components/FileUpload';
import moment, { min } from 'moment';
import { throws } from 'assert';
import { configDataItem } from '@/pages/OrderManagement/orderDetails/data';

const { Option } = Select;
const { TextArea } = Input;


interface CollectionsProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: false;
    contactWay: configDataItem[];
    flowStatus: configDataItem[];
    followTag: configDataItem[];
}

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current: moment) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}


function disabledDateTime(current: moment) {
    let currentTime = new Date(new Date().getTime())

    var Min = currentTime.getMinutes();
    if (Min < 60) {
        Min = Min + 1
    }
    let temp = false
    if (current) {
        let c = current.format('YYYYMMDD');
        let m = moment().format('YYYYMMDD');
        temp = c == m;
    }

    if (temp) {
        return {
            disabledHours: () => range(0, 24).splice(0, currentTime.getHours()),
            disabledMinutes: () => range(0, 60).splice(0, Min),
        };
    } else {
        return {};
    }

}


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor(props: Readonly<{}>) {
            super(props);

            this.state = {
                isRequiredNextTime: true,
            }
        }

        onChangeTag = (e: any) => {
            if (e == 4) {
                this.setState({
                    isRequiredNextTime: false,
                })
            } else {
                this.setState({
                    isRequiredNextTime: true,
                })
            }
        }


        render() {
            const { visible, onCancel, onCreate, form, contactWay, flowStatus, onUploadDone, filedName, onUploadError, followTag } = this.props;
            const { getFieldDecorator } = form;
            const { isRequiredNextTime } = this.state;

            const formItemLayout =
            {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            }

            return (
                <Modal style={{ paddingTop: 240 }}
                    visible={visible}
                    title="录跟进"
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout='horizontal'>
                        <div>
                            <Form.Item label="回访方式：" {...formItemLayout} >
                                {getFieldDecorator('contactWay', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择回访方式' }]
                                })(
                                    <Select >
                                        {contactWay.map((item: { id: string | number | undefined; name: React.ReactNode; }) => {
                                            return (
                                                <Option value={item.id}>{item.name}</Option>
                                            );
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="回访策略：" {...formItemLayout} >
                                {getFieldDecorator('tag', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择回访策略' }]
                                })(
                                    <Select onChange={this.onChangeTag}>
                                        {followTag && followTag.map((item: { id: string | number | undefined; name: React.ReactNode; }) => {
                                            return (
                                                <Option value={item.id}>{item.name}</Option>
                                            );
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div >

                            <Form.Item label="回访结果：" {...formItemLayout} >
                                {getFieldDecorator('results', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择跟进结果' }]
                                })(
                                    <Select >
                                        {flowStatus && flowStatus.map((item: { id: string | number | undefined; value: React.ReactNode; }) => {
                                            return (
                                                <Option value={item.id}>{item.name}</Option>
                                            );
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div  >

                            <Form.Item label="下次回访时间：" {...formItemLayout} >
                                {getFieldDecorator('nextContactTime', {
                                    initialValue: '',
                                    rules: [{ required: isRequiredNextTime, message: '请选择下次回访时间' }]
                                })(
                                    <DatePicker showTime placeholder="请选择下次回访时间" disabledDate={disabledDate} disabledTime={disabledDateTime} showToday={false}
                                    />
                                )}

                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="附件：" {...formItemLayout}>
                                <FileUpload text={filedName && filedName.length > 0 ? '重新上传' : '上传文件'} onUploadDone={onUploadDone} onUploadError={onUploadError}></FileUpload>
                                {filedName && (filedName.length > 0 ? <div>{filedName}</div> : <span />)}
                            </Form.Item>
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            <div >沟通内容：</div>
                            <Form.Item label=""  >
                                {getFieldDecorator('comment', {
                                    initialValue: '',
                                    rules: [{ required: false, message: '请填写沟通内容' }]
                                })(
                                    <TextArea rows={4} style={{ marginTop: 10, resize: "none", width: '100%' }}></TextArea>
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
        super(props);
        this.state = {
            filedPatch: '',
            filedName: '',
            isUploadFile: false,

        }
    }

    onUploadDone = (url: string, info: any) => {
        console.log(url);
        this.state.isUploadFile = true
        this.setState({
            filedPatch: url,
            filedName: info.file.name,
        })
    }

    onUploadError = (info: any, msg: any) => {
        message.error(`${msg}`);
    }

    handleCancel = () => {
        this.props.onCancel()
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            var nextContactTime = values['nextContactTime']
            if (nextContactTime) {
                values['nextContactTime'] = moment(values['nextContactTime']).format('YYYY-MM-DD HH:mm');
            }

            if (this.state.filedPatch.length > 0) {
                values['attachment'] = this.state.filedPatch;
            }

            this.props.saveFunction(values)
        });
    };

    saveFormRef = (formRef: any) => {
        this.formRef = formRef;
    };

    componentDidUpdate() {
        if (this.state.isUploadFile == true) {
            this.state.isUploadFile = false
        } else {
            const { form } = this.formRef.props;
            form.resetFields();
            this.state.filedPatch = '';
            this.state.filedName = '';
        }
    }


    render() {
        const { visible, flowStatus, contactWay, followTag } = this.props;
        const { filedName } = this.state;
        return (
            <div>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    flowStatus={flowStatus}
                    contactWay={contactWay}
                    followTag={followTag}
                    filedName={filedName}
                    onUploadDone={this.onUploadDone}
                    onUploadError={this.onUploadError}
                />
            </div>
        );
    }
}
export default CollectionsPage;