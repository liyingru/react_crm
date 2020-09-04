import { Modal, Form, Select, Input, Radio, Spin } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
const { Option } = Select;


/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


interface TelephoneChannelsProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: false;
    defaultDict: any;
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor(props: Readonly<{}>) {
            super(props);
            this.state = {
                // 电话号码数组
                telephoneNumberList: [],
                // 选中的渠道
                telephoneChannelId: 2,
                // 选中渠道的线路
                telephoneStyle: 0,
                // 选中的城市
                selectCity: '',
                // 是否可编辑外显号码
                editTelephoneNumber: false,
                // 是否请求完成
                isRequetsFinish: true,
                // 选择城市数组
                cityList: [],
                // 号码数组
                telephoneList: []
            }
        }


        componentDidMount = () => {
            this.setState({
                isRequetsFinish: false
            })
            Axios.post(URL.truncitylist).then(
                res => {
                    if (res.code === 200) {
                        this.setState({
                            cityList: res.data.result.diqu
                        })
                    }
                    this.setState({
                        isRequetsFinish: true
                    })
                }
            );
        }

        componentWillReceiveProps = (nextProps: any) => {
            const { visible, defaultDict } = nextProps;

            let tChannelId = 2;
            let tStyle = 0;
            let selectCity = undefined;
            let editTelephoneNumber = false;

            if (visible !== this.props?.visible) {

                tChannelId = defaultDict?.telephoneChannel ?? 2;

                tStyle = defaultDict?.telephoneStyle ?? 0;

                selectCity = defaultDict?.city ?? undefined;

                if (selectCity !== undefined && selectCity > 0) {
                    editTelephoneNumber = true;
                } else {
                    editTelephoneNumber = false;
                }

                this.setState({
                    telephoneChannelId: tChannelId,
                    telephoneStyle: tStyle,
                    selectCity: selectCity,
                    editTelephoneNumber: editTelephoneNumber
                })

            }
        }


        okClick = (e: { preventDefault: () => void; }) => {
            e?.preventDefault();
            const { onCreate } = this.props;
            // const { leadId, getFollowList, hiddenFollowInfo, refreshFunction } = this.props;
            // const { customer: { customerId } } = this.props;
            // const { moorId } = this.state;

            this.props.form?.validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    onCreate(values);
                }
            });
        }

        clickCancel = () => {
            const { onCancel } = this.props;
            onCancel();
            this.props?.form?.resetFields();
        }

        // 根据城市获取对应的电话列表
        telephoneListRequest = (e: any) => {
            if (e > 0 || e?.length > 0) {

                const values = { area: e }

                this.setState({
                    isRequetsFinish: false
                })

                Axios.post(URL.trunlist, values).then(
                    res => {
                        if (res.code === 200) {
                            this.setState({
                                telephoneList: res.data.result.phone,
                            })
                        }
                        this.setState({
                            isRequetsFinish: true
                        })
                    }
                );
            }


            // telephoneList
        }

        // 选中渠道
        onChangeSelectTelephoneChannel = (e: any) => {
            this.setState({
                telephoneChannelId: e.target.value,
                // 选中渠道的线路
                telephoneStyle: 0,
                // 选中的城市
                selectCity: '',
                // 是否可编辑外显号码
                editTelephoneNumber: false,
            })
        }

        // 选中渠道线路
        onChangeSelectTelephoneStyle = (e: any) => {
            this.setState({
                // 选中渠道的线路
                telephoneStyle: e,
                // 选中的城市
                selectCity: '',
                // 是否可编辑外显号码
                editTelephoneNumber: false,
            })
        }

        // 选中城市
        onChangeSelectCity = (e: any) => {
            this.setState({
                // 选中的城市
                selectCity: e,
                // 是否可编辑外显号码
                editTelephoneNumber: true,
                // 清空选择的数据
                telephoneList: [],
            })

            this.props?.form.setFieldsValue({ 'telephoneNumber': '' })

            // 请求电话借口
            this.telephoneListRequest(e)

        }

        render() {
            const { visible, form } = this.props;

            const { getFieldDecorator } = form;

            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 6 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            };
            return (
                <Modal
                    visible={visible}
                    okText="确定"
                    onCancel={this.clickCancel}
                    onOk={this.okClick}
                >
                    <div>
                        <div hidden={this.state?.isRequetsFinish} style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%', height: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.8)' }}>
                            <Spin />
                        </div>
                        <Form layout='horizontal' onSubmit={this.okClick}
                        >
                            <Form.Item label="运营商：" {...formItemLayout}>
                                {getFieldDecorator('telephoneChannel', {
                                    initialValue: this.props?.defaultDict?.telephoneChannel ?? 2,
                                    rules: [{ required: true, message: '请选择运营商' }]
                                })(
                                    <Radio.Group onChange={this.onChangeSelectTelephoneChannel} buttonStyle="solid">
                                        <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={2}>天润</Radio.Button>
                                        <Radio.Button style={{ borderRadius: 4, marginLeft: 8, marginBottom: 8 }} value={1}>七陌</Radio.Button>
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            {this.state?.telephoneChannelId === 2 ?
                                <Form.Item label="运营线路：" {...formItemLayout}>
                                    {getFieldDecorator('telephoneStyle', {
                                        initialValue: this.props?.defaultDict?.telephoneStyle ?? 0,
                                        rules: [{ required: true, message: '请选择运营线路' }]
                                    })(
                                        <Select onChange={this.onChangeSelectTelephoneStyle} >
                                            <Option value={0}>官方线路</Option>
                                            <Option value={1}>第三方线路</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                : ''}
                            {this.state?.telephoneStyle === 1 ? <>
                                <Form.Item label="归属地：" {...formItemLayout}>
                                    {getFieldDecorator('city', {
                                        initialValue: this.props?.defaultDict?.city,
                                        rules: [{ required: true, message: '请选择归属地' }]
                                    })(
                                        <Select placeholder="请选择归属地" onChange={this.onChangeSelectCity} >
                                            {this.state?.cityList && this.state?.cityList?.map(item => (
                                                <Option value={item.code}>{item.area}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>


                                <Form.Item label="外显号：" {...formItemLayout}>
                                    {getFieldDecorator('telephoneNumber', {
                                        initialValue: this.props?.defaultDict?.telephoneNumber,
                                        rules: [{ required: true, message: '请选择外显号' }]
                                    })(
                                        <Select placeholder='请先选择归属地' disabled={!this.state?.editTelephoneNumber} >
                                            {this.state?.telephoneList && this.state?.telephoneList?.map(item => (
                                                <Option value={item}>{item}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </> : ''}
                        </Form>
                    </div>

                </Modal>
            );
        }
    },
);

class ChooseTelephoneChannels extends React.Component<TelephoneChannelsProps> {

    constructor(props: TelephoneChannelsProps) {
        super(props);
        this.state = {

        }
    }

    handleCancel = () => {
        this.props.onCancel()
    };

    handleCreate = (values: any) => {
        this.props.saveFunction(values)
    };

    render() {
        const { visible, defaultDict } = this.props;

        return (
            <div>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    defaultDict={defaultDict}
                />
            </div>
        );
    }
}
export default ChooseTelephoneChannels;