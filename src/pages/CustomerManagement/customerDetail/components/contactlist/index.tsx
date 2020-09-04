import { ContactUserData } from "../../dxl/data";
import { Component } from "react";
import React from "react";
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, message } from 'antd';
import styles from './index.less';
import { ConfigListItem, ConfigList } from "@/pages/CustomerManagement/commondata";
import { FormComponentProps } from "antd/es/form";
import { ColumnProps } from "antd/lib/table";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


export interface ContactTabPros extends FormComponentProps {
    editable?: boolean; // 是否可编辑
    contactUserData: ContactUserData[];
    config: ConfigList; //客户身份
    onChanged: (bean: ContactUserData,callback:() => void) => void;
}

export interface ContactTabState {
    modalVisible:boolean;
    contact: ContactUserData | undefined;
}

class ContactTab extends Component<ContactTabPros, ContactTabState>{
    
    state: ContactTabState = {
        modalVisible:false,
        contact:undefined
    }

    column:ColumnProps<ContactUserData>[] = [
        {
            title: '姓名',
            dataIndex: 'userName',
        },
        {
            title: '角色',
            dataIndex: 'identityText',
        },
        {
            title: '联系号码',
            dataIndex: 'phone',
        },
        {
            title: '微信',
            dataIndex: 'weChat',
        },
        {
            title: '职业',
            dataIndex: 'occupation',
        },
        {
            title: '方便联系',
            dataIndex: 'contactTimeText',
        },
        {
            title: '备注',
            dataIndex: 'comment',
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (text,recoder) => (
                <a onClick={() => this.updateContact(recoder)}>
                    编辑
                </a>
            )
        }
    ];

    submitData = () => {
        const { form,onChanged } = this.props;
        const { contact } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let params = {
                ...fieldsValue,
            }
            if(contact !== undefined){
                params['contactId'] = contact.contactId
                if(params['phone'] == contact.phone){
                    params['phone'] = contact.encryptPhone
                }
            }
            console.log('params' + JSON.stringify(params));
            onChanged(params,() => this.setModalVisible(false))
        });
    }

    setModalVisible = (visible: boolean) => {
        this.setState({
            modalVisible: visible
        })
    }


    updateContact = (recoder: ContactUserData) => {
        this.state.contact = recoder
        this.setModalVisible(true)
    }


    newContact = () => {
        this.state.contact = undefined
        this.setModalVisible(true)
    }

    phonePattern = () => {
        if(this.state.contact){
          if(this.state.contact.phone.indexOf("*") != -1) {
            return undefined
          }else{
            return new RegExp(/^\d{11}$/, "g")
          }
        }else{
          return new RegExp(/^\d{11}$/, "g")
        }
      }

    render() {
        const { contactUserData, editable, config, ...rest } = this.props;
        const { contact } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        if(!editable) {
            const actionIndex = this.column.findIndex(item => item.dataIndex == 'action');
            actionIndex >= 0 && this.column.splice(this.column.findIndex(item => item.dataIndex == 'action'), 1)
        }
        return (
            <div>
                {
                    editable && (
                        <div className={styles.newcontact}>
                            <Button type="primary" onClick={this.newContact}>+联系人</Button>
                        </div>
                    )
                }
                <Table style={{marginTop:10}}
                    size='small'
                    columns={this.column}
                    dataSource={contactUserData}
                    pagination={false}
                    {...rest}
                />
                {
                    !this.state.modalVisible ? '' :
                        <Modal
                            title={contact == undefined ? '新建联系人' : '更新联系人'}
                            centered
                            visible={true}
                            onOk={this.submitData}
                            onCancel={() => this.setModalVisible(false)}>
                            <Form {...formItemLayout} layout='horizontal'>
                                <FormItem label='姓名'>
                                    {
                                        getFieldDecorator('userName', {
                                            initialValue: contact == undefined ? '' : contact.userName,
                                            rules: [{
                                                required: true,
                                                message:"姓名不能为空"
                                            }]
                                        })(<Input placeholder="请输入" />)
                                    }
                                </FormItem>
                                <FormItem label='角色'>
                                    {
                                        getFieldDecorator('identity', {
                                            initialValue: contact == undefined ? '' : contact.identityText
                                        })(
                                            <Select style={{ width: '100%' }} placeholder='请选择'>
                                                {
                                                    config.identity.map(state => (
                                                        <Option value={state.id}>{state.name}</Option>))
                                                }
                                            </Select>,
                                        )
                                    }
                                </FormItem>
                                <FormItem label='电话'>
                                    {
                                        getFieldDecorator('phone', {
                                            initialValue: contact == undefined ? '' : contact.phone,
                                            rules: [{ required: true, pattern: this.phonePattern(), message: '请输入有效手机号码' }], 
                                            getValueFromEvent: (event) => {
                                                return event.target.value.replace(/\D/g, '')
                                              },
                                        })(<Input placeholder="请输入" maxLength={11}/>)
                                    }
                                </FormItem>
                                <FormItem label='微信号'>
                                    {
                                        getFieldDecorator('weChat', {
                                            initialValue: contact == undefined ? '' : contact.weChat,
                                        })(<Input placeholder="请输入" />)
                                    }
                                </FormItem>
                                <FormItem label='职业'>
                                    {
                                        getFieldDecorator('occupation', {
                                            initialValue: contact == undefined ? '' : contact.occupation,
                                        })(<Input placeholder="请输入" />)
                                    }
                                </FormItem>
                                <FormItem label='方便联系时间'>
                                    {
                                        getFieldDecorator('contactTime', {
                                            initialValue: contact == undefined ? '' : contact.contactTime
                                        })(
                                            <Select style={{ width: '100%' }} placeholder='请选择'>
                                                {
                                                    config.contactTime.map(state => (
                                                        <Option value={state.id}>{state.name}</Option>))
                                                }
                                            </Select>,
                                        )
                                    }
                                </FormItem>
                                <FormItem label='备注'>
                                    {
                                        getFieldDecorator('comment', {
                                            initialValue: contact == undefined ? '' : contact.comment,
                                        })(<TextArea placeholder="不要超过20字" rows={3} />)
                                    }
                                </FormItem>
                            </Form>
                        </Modal>
                }
            </div>
        )
    }
}

export default Form.create<ContactTabPros>()(ContactTab);