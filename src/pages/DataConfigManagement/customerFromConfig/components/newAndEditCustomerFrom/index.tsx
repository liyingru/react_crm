import React from 'react';
import Form, { FormComponentProps } from 'antd/es/form';
import { Select, Input, Switch, Button, Radio } from 'antd';
import { CustomerFromConfigDataItem } from '../../data';
import CrmUtil from '@/utils/UserInfoStorage';

const { Option } = Select;

interface CollectionsProps extends FormComponentProps {
    data: CustomerFromConfigDataItem;
    // 1 是添加 2是修改 
    type: number;
    saveFunction: Function;
    onCancel: Function;
    allChannelList: any[];
}

class CustomerFromPages extends React.Component<CollectionsProps> {

    constructor(props: CollectionsProps) {
        super(props);
        this.state = {
        }
    }

    onSaveClick = () => {
        const { form, saveFunction, data, type } = this.props;

        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
            // 1 是添加 2是修改 
            if (data) {

                // 修改
                if (data && data.childlist?.length > 0) {
                    values['domain'] = data?.domain
                }
                values['channelId'] = data?.id
            }

            if (CrmUtil.getCompanyType() === 2) {
                const statusBool = values['status']
                if (statusBool) {
                    console.log('开启')
                    values['status'] = 1
                } else {
                    console.log('关闭')
                    values['status'] = 0
                }
            }

            saveFunction(values, form, type)
        });
    }

    onCancelClick = () => {
        const { onCancel, form } = this.props;
        form.resetFields()
        onCancel()
    }

    // 是否展示配置与域
    isShowDomainUI = () => {

        const { type, data, form } = this.props;
        const { getFieldDecorator } = form;

        // 1 是添加 2是修改 
        if (type != 1) {
            if (data && data?.childlist?.length > 0) {
                return (
                    null
                )
            }
        }

        if (CrmUtil.getCompanyType() === 2) {
            return (
                <Form.Item label="配置域："   >
                    {getFieldDecorator('domain', {
                        initialValue: type == 1 ? '' : data && data?.domain,
                        rules: [{ required: false, message: '请填选择状态' }]
                    })(
                        <Radio.Group >
                            <Radio value={1}>公域</Radio>
                            <Radio value={2}>私域</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
            )
        }

    }

    onChange = value => {
        console.log(value);
    };

    render() {
        const { form, data, type, allChannelList } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div style={{ width: '100%' }}>
                <Form layout='horizontal'>
                    {/* {type == 1 ? <div>{(data && (data?.name?.length > 0 ? data?.name : '无')) ?? '无'}</div> : <div>{(data && (data?.pid_txt?.length > 0 ? data?.pid_txt : '无')) ?? '无'}</div>} */}

                    <Form.Item label="上级渠道："  >
                        {getFieldDecorator('pid', {
                            initialValue: data?.pid ?? '',
                            rules: [{ required: false, message: '请填写上级渠道' }]
                        })(
                            <Select
                                placeholder="请选择"
                                showSearch
                                optionFilterProp="children" >
                                {
                                    allChannelList && allChannelList?.map(item => (
                                        <Option value={item.id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )}

                    </Form.Item>
                    <Form.Item label="渠道名称："  >
                        {getFieldDecorator('name', {
                            initialValue: type == 1 ? '' : (data && (data?.name ?? '')),
                            rules: [{ required: false, message: '请填写渠道名称' }]
                        })(
                            <Input placeholder={'请填写渠道名称'} />
                        )}
                    </Form.Item>


                    {this.isShowDomainUI()}

                    <Form.Item label="状态："  >
                        {getFieldDecorator('status', {
                            initialValue: type == 1 ? true : data && (data?.status == 1),
                            rules: [{ required: false, message: '请填选择状态' }]
                        })(
                            <Switch checkedChildren='开' unCheckedChildren='关' defaultChecked={type == 1 ? true : data && (data?.status == 1)} />
                        )}
                    </Form.Item>
                </Form>
                <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                    <Button type='default' onClick={this.onCancelClick}>取消</Button>
                    <Button type='primary' onClick={this.onSaveClick}  >确定</Button>
                </div>
            </div>
        );
    }
}

export default Form.create<CollectionsProps>()(CustomerFromPages);
