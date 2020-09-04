import React from 'react';
import Form, { FormComponentProps } from 'antd/es/form';
import { Select, Input, Button, Col, Row, DatePicker } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
interface ActivityPagesProps extends FormComponentProps {
    saveFunction: Function;
}

class ActivityConfigHeader extends React.Component<ActivityPagesProps> {

    constructor(props: ActivityPagesProps) {
        super(props);
        this.state = {
        }
    }

    onSaveClick = () => {
        const { saveFunction } = this.props;
        const { form } = this.props;

        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
            console.log(values)
            saveFunction(values, form)
        });
    }

    onCancelClick = () => {
        const { form } = this.props;
        form.resetFields()
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;


        return (
            <div>
                <Form layout='horizontal'>
                    <Row gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                    }}>
                        <Col span={8} >
                            <Form.Item label="创建时间："  >
                                {getFieldDecorator('createTime', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择创建时间' }]
                                })(
                                    <RangePicker/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="活动名称："  >
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请填写活动名称' }]
                                })(
                                    <Input style={{ width: '100%' }} placeholder={'请填写活动名称'} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="活动状态："  >
                                {getFieldDecorator('status', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择活动状态' }]
                                })(
                                    <Select style={{ width: '100%' }}  >
                                        <Option value={'1'}>{'正常'}</Option>
                                        <Option value={'0'}>{'关闭'}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                </Form >
                <Row style={{ justifyContent: 'space-around', display: 'flex' }}>
                    <Button type='default' onClick={this.onCancelClick}>重置</Button>
                    <Button type='primary' onClick={this.onSaveClick}  >筛选</Button>
                </Row>
            </div >
        );
    }
}

export default Form.create<ActivityPagesProps>()(ActivityConfigHeader);
