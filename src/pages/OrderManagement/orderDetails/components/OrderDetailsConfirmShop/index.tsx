import { Modal, Form, Select, Radio, Input, DatePicker } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import styles from "./index.less";

/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
}


interface OrderDetailsConfirmShopProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: false;
    data: any[];
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor(props: Readonly<{}>) {
            super(props);
        }

        render() {
            const { visible, onCancel, onCreate, form, dataAarry, selectIdClick, selectId } = this.props;
            const { getFieldDecorator } = form;
            console.log('dataAarry', dataAarry)
            const formItemLayout =
            {
                labelCol: {
                    xs: { span: 10 },
                    sm: { span: 6 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            }

            const radioStyle = {
                display: 'block',
            };
            // const showT = `更改订单信息（当前状态：${statusTxt}）`
            const showT = <span style={{ color: 'red' }}>{'*目前对于订单有效'}{dataAarry ? dataAarry?.length - 1 : '0'}{'条预约单，请确认是否推送下一位预约人'}</span>
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
                            <Form.Item label="请选择确认到店：" {...formItemLayout}>
                                {getFieldDecorator('reserveId', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择确认到店' }]
                                })(

                                    <Radio.Group style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }} onChange={selectIdClick} >
                                        {dataAarry && dataAarry?.map((item: { id: number; name: React.ReactNode; create_time: React.ReactNode; reserve_time: React.ReactNode; user_name: React.ReactNode; }) => {
                                            if (item?.id === 99) {
                                                return (
                                                    <Radio value={item?.id}>{item?.name}</Radio>
                                                )
                                            }
                                            return (
                                                <Radio style={radioStyle} value={item?.id}>
                                                    <div >
                                                        <div>
                                                            创建时间：{item?.create_time}
                                                        </div>
                                                        <div>
                                                            预约时间：{item?.reserve_time}
                                                        </div>
                                                        <div>
                                                            预约人：{item?.user_name}
                                                        </div>
                                                    </div>
                                                </Radio>
                                            )

                                        })}

                                    </Radio.Group>

                                )}
                            </Form.Item>
                            {selectId === 99 ? 
                            <Form.Item label="到店时间：" {...formItemLayout}>
                            {getFieldDecorator('arrivalTime', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择到店时间' }]
                            })(
                                <DatePicker showTime placeholder='请选择到店时间' />
                            )}
                        </Form.Item>
                            : ''}
                            
                        </div>
                    </Form>
                </Modal>
            );
        }
    },
);

class OrderDetailsConfirmShopPage extends React.Component<OrderDetailsConfirmShopProps> {
    [x: string]: any;

    constructor(props: OrderDetailsConfirmShopProps) {
        super(props);
        this.state = {
            selectId: -1
        }
    }

    componentWillReceiveProps(nextProps: any) {
        const {visible} = nextProps;
        if (visible !== this.props?.visible) {
            const { form } = this.formRef.props;
            form.resetFields();
    
            this.setState({
              selectId: -1
            })
        }
    }

    handleCancel = () => {

        const { form } = this.formRef.props;
        form.resetFields();
        this.setState({
            selectId: -1
        })
        this.props.onCancel()
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((error: any, values: any) => {
            if (error) return;

            var tempNextContactTime = values['arrivalTime'];
            if (tempNextContactTime) {
                values['arrivalTime'] = moment(values['arrivalTime']).format('YYYY-MM-DD HH:mm');
            }

            this.props.saveFunction(values, this)
        });
    };

    saveFormRef = (formRef: any) => {
        this.formRef = formRef;
    };

    selectIdClick = (e: any) => {
        let id = e.target?.value
        this.setState({
            selectId: id
        })
    }


    render() {
        const { visible, data } = this.props;
        return (
            <div>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    dataAarry={data}
                    selectIdClick={this.selectIdClick}
                    selectId={this.state?.selectId}
                />
            </div>
        );
    }
}
export default OrderDetailsConfirmShopPage;