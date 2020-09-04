import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Spin, Form, Card, Select, Row, Col, Input, Radio, Button, message, InputNumber, Upload, Modal, Checkbox } from 'antd';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import { routerRedux } from 'dva/router';
import URL from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
import { StateType } from './model';
import styles from './index.less';
import { ConfigList } from './data';
import { userList } from '@/pages/LeadsManagement/newLeads/service';
import AreaSelect from "@/components/AreaSelect";

const { Option } = Select;
const FormItem = Form.Item;

interface NewSellerProps extends FormComponentProps {
    dispatch: Dispatch<
        Action<
            | 'newSeller/configCtrl'
            | 'newSeller/userList'
            | 'newSeller/getAddSeller'
            | 'newSeller/getStoreDetail'
            | 'newSeller/editStoreInfo'
        >
    >;
    loading: boolean;
    config: ConfigList;
    userListArr: [];
    newSeller: StateType;
    storeId: string;
}

interface NewSellerState {
    loading: boolean,
    value: number,
    radioValue: [],
    customerList: Array<any>,
    resultSelectTitle: string,
    otherModelString: string,
    storeInfo: {},
    areaRest: boolean,
    citycode:any

}



@connect(
    ({
        newSeller,
        loading,
    }: {
        newSeller: StateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        newSeller,
        loading: loading.models.newSeller,
    }),
)


class NewSeller extends Component<NewSellerProps, NewSellerState> {
    constructor(props: NewSellerProps) {
        super(props);
        // 初始化
        this.state = {
            loading: false,
            value: 0,
            radioValue: [],
            customerList: [],
            resultSelectTitle: '',
            otherModelString: '',
            storeInfo: {},
            areaRest: false,
            citycode:''
        }
    }

    componentDidMount() {
        const { dispatch, form: { setFieldsValue, getFieldsValue }, storeId } = this.props;
        const { radioValue } = this.state;
        getFieldsValue();
        dispatch({
            type: 'newSeller/configCtrl'
        })
        if (storeId != undefined) {
            this.getStoreDetail();
        }
        this.getUserList('');
    }

    onRadioChange = (values) => {
        this.setState({
            radioValue: values,
        });
    };

    getUserList = (value: string) => {
        const { dispatch } = this.props;
        let param = { 'keywords': value }
        dispatch({
            type: 'newSeller/userList',
            payload: param,
            callback: (data: any) => {
                if (data.code == 200) {
                    this.setState({
                        loading: false,
                        customerList: data.data.result
                    })
                }

            }
        })
    }

    getStoreDetail = () => {
        const { dispatch, storeId} = this.props;
        dispatch({
            type: 'newSeller/getStoreDetail',
            payload: { 'storeId': storeId },
            callback: (data: any) => {
                if (data.code == 200) {
                    this.setState({
                        storeInfo: data.data.result,
                        resultSelectTitle: data.data.result.settlement_model.key,
                        otherModelString: data.data.result.settlement_model.value,
                    })
                    this.getUserList('')
                }
            }
        })
    }

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { dispatch, form, storeId  } = this.props;
        const { otherModelString,citycode } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            var temp = {}

            temp['key'] = fieldsValue.resultModel;
            temp['value'] = otherModelString;
            const values = {
                ...fieldsValue,
                settlementModel: temp,
                storeId: storeId,
                cityCode:citycode,
                category:fieldsValue.category ? fieldsValue.category.toString() : '',
            }
            // console.log(values,'-----values')
            if (storeId != undefined) {
                dispatch({
                    type: 'newSeller/editStoreInfo',
                    payload: values,
                    callback: (status: boolean, msg: string) => {
                        if (status) {
                            message.success(msg);
                        }
                    }
                });

            } else {
                dispatch({
                    type: 'newSeller/getAddSeller',
                    payload: values,
                    callback: (status: boolean, msg: string) => {
                        if (status) {
                            message.success('新建成功');
                            this.handleFormReset();
                        }
                    }
                });

            }

        });

    };


    handleFormReset = () => {
        const { form } = this.props;
        // 表单重置
        form.resetFields();
        const that = this;
        this.setState({
            areaRest: true,
            citycode:'100000'
        }, () => {
            that.state.areaRest = false
            that.setState({
                citycode:'100000'
            })
        })
        // this.forceUpdate();
        // window.location.reload();

    };


    onChangeCustomer = (value: string) => {
        if (value) {
            this.props.form.setFieldsValue({
                "saleId": value,
            })
        } else {
            // 清空选项
            console.log("清空了客户选项")
            const { form } = this.props;
            form.resetFields(['saleId']);
        }
    };

    timeOut: NodeJS.Timeout | undefined = undefined;
    currentKeyWord: string | undefined = undefined;

    searchNameCtrl = (currentKey: string) => {
        if (!currentKey) {
            this.setState({
                customerList: new Array(),
            })
        };

        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
        this.currentKeyWord = currentKey;

        this.setState({
            customerList: new Array()
        })

        this.timeOut = setTimeout(() => {
            this.getUserList(currentKey);
        }, 1000);

    };

    resultModelAction = (value: string) => {
        this.setState({
            resultSelectTitle: value,
        })
    }

    otherButtonAction = (value: string) => {
        this.setState({
            otherModelString: value
        })
    }

    areaSelectChange = (code: string, province: string, city: string, district: string) => {
        this.props.form.setFieldsValue({
            cityCode: code
        });
        this.setState({
            citycode:code
        })
    }

    render() {
        const { loading, radioValue, customerList, resultSelectTitle, storeInfo, otherModelString } = this.state;
        const {
            form: { getFieldDecorator },
            newSeller: { config },
            storeId,
        } = this.props;
        const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
        
        let currentUserInfo;
        try {
            if (currentUserInfoStr) {
                currentUserInfo = JSON.parse(currentUserInfoStr);
            } else {

            }
        } catch (e) {
            currentUserInfo = currentUserInfoStr;
        }

        return (
            <>
                <PageHeaderWrapper >
                    <div>
                        <Spin spinning={loading} size="large" />
                    </div>
                    <Card className={styles.card} bordered={false}>
                        <div className={styles.tableListForm}>
                            <Form onSubmit={this.handleSubmit} layout="inline">
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={10}>
                                        <FormItem label="商家名称">
                                            {getFieldDecorator('storeName', { rules: [{ required: true, message: "请输入商家名称且不超过20个字段", max: 20 }], initialValue: storeInfo?.name, })(<Input style={{ width: '100%', }} placeholder="请输入商家名称" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={24}>
                                        <FormItem label="负责品类：">
                                            {getFieldDecorator('category', {
                                                rules: [{ required: true, message:'请选择负责品类' }],
                                                initialValue: storeInfo?.category
                                            })(
                                                <Checkbox.Group style={{ marginLeft: 8 }}>
                                                    {
                                                        config.category && config.category.map(category => (
                                                            <Checkbox value={category.id} >{category.name}</Checkbox>))
                                                    }
                                                </Checkbox.Group>,
                                            )}
                                        </FormItem>
                                        {/* <FormItem label="负责品类：">
                                            {getFieldDecorator('category', { rules: [{ required: true, message: "请选择负责品类" }], initialValue: storeInfo?.category })(
                                                <Radio.Group >
                                                    {config.category && config.category.map(item => <Radio value={item.id}>{item.name}</Radio>)}
                                                </Radio.Group>
                                            )}
                                        </FormItem> */}
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={10}>
                                        <FormItem label="所在区域">
                                            {getFieldDecorator('cityCode', { rules: [{ required: false, message: "请选择所在区域", max: 11 }], initialValue: storeInfo?.cityCode })(
                                               <AreaSelect 
                                                    areaSelectChange={this.areaSelectChange} 
                                                    level3={true}
                                                    reset={this.state.areaRest}
                                               />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={10}>
                                        <FormItem label="商家电话">
                                            {getFieldDecorator('mobile', { rules: [{ required: false, message: "请输入商家电话", max: 11 }], initialValue: storeInfo?.mobile })(<Input style={{ width: '100%', }} placeholder="请输入商家名称" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={10}>
                                        <FormItem label="负责销售：">
                                            {getFieldDecorator('saleId',
                                                { rules: [{ required: false, message: "请选择销售" }], initialValue: storeInfo?.sale_id })(
                                                    <Select
                                                        loading={loading}
                                                        optionLabelProp='label'
                                                        placeholder='输入编号、姓名、手机号或微信号搜索客户'
                                                        style={{ width: '100%' }}
                                                        showSearch={true}
                                                        filterOption={false}
                                                        showArrow={false}
                                                        defaultActiveFirstOption={false}
                                                        onSearch={this.searchNameCtrl}
                                                        onChange={this.onChangeCustomer}
                                                        allowClear={true}
                                                        value={storeInfo?.name}
                                                    // notFoundContent={this.state.dropDownTips}
                                                    >
                                                        {customerList && customerList.map(item =>
                                                            <Option value={item.id} label={item.name}>
                                                                <div>{item.name}</div>
                                                                <div>{item.account}</div>
                                                            </Option>)}
                                                    </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                                    <Col span={15}>
                                        <FormItem label="结算模式：">
                                            {getFieldDecorator('resultModel', { rules: [{ required: false, message: '请选择结算模式' }], initialValue: storeInfo?.settlement_model?.key })(
                                                <Radio.Group onChange={e => this.resultModelAction(e.target.value)}>
                                                    {config.settlementModel && config.settlementModel.map(item => <Radio value={item.name}>{item.name}{
                                                        this.state.resultSelectTitle === '其他'&& item.name == '其他' ?
                                                            <Input defaultValue={storeInfo?.settlement_model?.key == '其他' ? storeInfo?.settlement_model?.value : ''}
                                                                style={{ width: 180, marginLeft: 10 }}
                                                                max={20}
                                                                onChange={e => this.otherButtonAction(e.target.value)} /> :
                                                            null}</Radio>)}
                                                    {/* <Radio value={'喜讯通'}>喜讯通</Radio>
                                                    <Radio value={'老返佣'}>老返佣</Radio>
                                                    <Radio value={'其他'}>其他{
                                                        this.state.resultSelectTitle === '其他' ?
                                                            <Input defaultValue={storeInfo?.settlement_model?.key == '其他' ? storeInfo?.settlement_model?.value : ''}
                                                                style={{ width: 100, marginLeft: 10 }}
                                                                max={20}
                                                                onChange={e => this.otherButtonAction(e.target.value)} /> :
                                                            null}
                                                    </Radio> */}
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                                    <Col span={10}>
                                        <FormItem label="状态：">
                                            {getFieldDecorator('status', { rules: [{ required: true, message: "请选择组状态" }], initialValue: storeId == undefined ? 1 : storeInfo?.status })(
                                                <Radio.Group >
                                                    {config.auditConfigStatus && config.auditConfigStatus.map(item => <Radio value={item.id}>{item.name}</Radio>)}
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                                    <Col span={10}>
                                        <FormItem label="创建人：">
                                            {JSON.parse(window.localStorage.getItem('gcrm-user-info')).name}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={3}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                保存
                                            </Button>
                                            <Button type="primary" style={{ marginLeft: 8, visibility: ((storeId == undefined) ? 'visible' : 'hidden') }} onClick={this.handleFormReset} >
                                                重置
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Card>
                </PageHeaderWrapper>
            </>
        )
    }
}

export default Form.create<NewSellerProps>()(NewSeller);
