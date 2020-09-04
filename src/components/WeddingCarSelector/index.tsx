import { Component } from "react";
import Form, { FormComponentProps } from "antd/es/form";
import { Button, Modal, Card, Row, Col, Select, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ConfigItemCommon } from "@/commondata";
const FormItem = Form.Item;
const { Option } = Select;
import styles from './index.less';

interface WeddingCarSelectorProps extends FormComponentProps {
    /** 配置项 */
    carBrandConfig: ConfigItemCommon[];
    /** 之前保存的品牌 */
    selectedCarBrands?: CarBrandInfo[];
    /** 接收参数 */
    setCarBrandList: (carList: CarBrandInfo[]) => void;
}

export interface WeddingCarSelectorState {
    selectedCarBrandList: CarBrandInfo[];
    visible: boolean;
    count: number;
}

export interface CarBrandInfo {
    carBrandName?: string
    carBrand?: string;
    carNum?: string;
}

class WeddingCarSelector extends Component<WeddingCarSelectorProps, WeddingCarSelectorState> {

    state: WeddingCarSelectorState = {
        selectedCarBrandList: [],
        visible: false,
        count: 1,
    }

    componentWillMount() {
        const editValue = this.props.selectedCarBrands ?? [];
        const copiedList = JSON.parse(JSON.stringify(editValue));
        this.setState({
            selectedCarBrandList: copiedList,
            count: copiedList.length == 0 ? 1 : copiedList.length
        })
        // if (editValue) {
        //     // 编辑-初始值回显-客资来源
        //     const initialChannels = editValue.channel?.split(',');
        //     const initialCategorys = editValue.category?.split(',');

        //     this.setState({
        //         initialChannels,
        //         initialCategorys
        //     }, () => {
        //         this.setState({
        //             isReadyForEdit: true,
        //         })
        //     })
        // } else {
        //     this.setState({
        //         isReadyForEdit: true,
        //     })
        // }
    }

    componentWillReceiveProps(nextProps: WeddingCarSelectorProps) {
        console.log("nextProps =   " + JSON.stringify(nextProps.selectedCarBrands));
        // const { visible } = nextProps
        // if (this.state.visible) {

        // }
        // this.state.selectedCarBrandList != nextProps.selectedCarBrands
        // const editValue = nextProps.selectedCarBrands ?? [];
        // const copiedList = JSON.parse(JSON.stringify(editValue));
        // this.setState({
        //     selectedCarBrandList: copiedList,
        //     count: copiedList.length == 0 ? 1 : copiedList.length
        // })
    }

    showSelectModal = () => {
        const { selectedCarBrandList } = this.state;
        if (selectedCarBrandList.length == 0) {
            selectedCarBrandList.push({ carBrand: "", carNum: "", carBrandName: "" })
        }
        this.setState({
            visible: true,
            selectedCarBrandList
        })
    }

    // 添加用车品牌
    addCarBrand = (e: React.FormEvent) => {
        let { count } = this.state;
        count += 1;
        this.setState({ count });
        const { selectedCarBrandList } = this.state;
        selectedCarBrandList.push({ carBrand: "", carNum: "", carBrandName: "" });
        this.setState({ selectedCarBrandList });
    }

    handleDelete = (index: number) => {
        let { count } = this.state;
        count -= 1;
        this.setState({ count });
        const { selectedCarBrandList } = this.state;
        selectedCarBrandList.splice(index, 1);
        console.log("selectedCarBrandList  = " + JSON.stringify(selectedCarBrandList));
        this.setState({ selectedCarBrandList });
        const { form } = this.props;
        selectedCarBrandList.map((item, index) => {
            const obj = {};
            obj['brand' + index] = item.carBrand;
            obj['number' + index] = item.carNum;
            form.setFieldsValue(obj)
        })

    }

    onBrandChange = (e, index) => {
        const { selectedCarBrandList } = this.state;
        selectedCarBrandList[index].carBrand = e;
        this.setState({ selectedCarBrandList });
    }

    onNumberChange = (e, index) => {
        console.log(e.target.value);
        const { selectedCarBrandList } = this.state;
        selectedCarBrandList[index].carNum = e.target.value;
        this.setState({ selectedCarBrandList });
    }

    // 确认
    handleOk = (e: React.FormEvent) => {
        const { setCarBrandList, form, carBrandConfig } = this.props;
        const { count } = this.state;
        form.validateFields((error, values) => {
            if (error) return;
            this.setState({
                visible: false
            })
            console.log(JSON.stringify(values));
            const result: CarBrandInfo[] = [];
            for (let i = 0; i < count; i++) {
                if (!values['brand' + i]) break;
                const brand = values['brand' + i].toString();
                const number = values['number' + i].toString();
                if (brand && brand.length > 0 && number && number.length > 0) {
                    const carInfo = carBrandConfig.filter(item => item.id + "" == brand)[0];
                    result.push({
                        carBrand: brand,
                        carBrandName: carInfo.name,
                        carNum: number
                    })
                }
            }
            setCarBrandList(result)
        })
    }

    /** 取消 */
    handleCancel = (e: React.FormEvent) => {
        const editValue = this.props.selectedCarBrands ?? [];
        const copiedList = JSON.parse(JSON.stringify(editValue));
        this.setState({
            selectedCarBrandList: copiedList,
            count: copiedList.length == 0 ? 1 : copiedList.length,
            visible: false
        })
    }

    render() {
        const { selectedCarBrands, carBrandConfig, form: { getFieldDecorator } } = this.props;
        return (
            <div>
                <FormItem label="品牌要求">
                    <Button style={{ width: 120, marginBottom: 10 }} type="primary" onClick={this.showSelectModal}><PlusOutlined />添加</Button>
                    <div>
                        {
                            selectedCarBrands?.map((item, index) => (
                                item.carBrandName != '' && item.carNum != '' ? (
                                    <span key={"span" + index}>{index == 0 ? '' : '、'}{item.carBrandName}{item.carNum}辆</span>)
                                    : ''
                            ))
                        }
                    </div>
                </FormItem>

                <Modal
                    title="用车品牌"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                // destroyOnClose={true}
                >
                    <div className={styles.tableListForm}>
                        <FormItem label="填写品牌要求">
                            <Button style={{ width: 100, marginBottom: 10 }} type="primary" onClick={(e) => { this.addCarBrand(e) }} ><PlusOutlined />添加</Button>
                        </FormItem>
                        <div style={{ marginTop: -2, height: 400, overflowY: 'auto' }}>
                            <Form className={styles.tableListForm}>
                                {this.state.selectedCarBrandList?.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 10 }}>
                                        <Card style={{ width: '100%' }} size="small" extra={
                                            index > 0 && <a onClick={event => { this.handleDelete(index) }}>
                                                <DeleteOutlined style={{ fontSize: 15 }} />
                                            </a>
                                        }>
                                            <FormItem label="品牌要求" >
                                                {getFieldDecorator('brand' + index, {
                                                    rules: [{ required: false }],
                                                    // initialValue: selectedCarBrands[index]?.carBrand
                                                    initialValue: item.carBrand
                                                })(
                                                    <Select onChange={e => { this.onBrandChange(e, index) }} placeholder="请选择品牌" style={{ width: '100%', }}>
                                                        {
                                                            carBrandConfig?.map(carBrand => (
                                                                <Option key={carBrand.id} value={carBrand.id + ""}>{carBrand.name}</Option>))
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label="车辆数量" >
                                                {getFieldDecorator('number' + index, {
                                                    rules: [{ required: false }],
                                                    // initialValue: selectedCarBrands[index]?.carNum
                                                    initialValue: item.carNum
                                                })(
                                                    <Input onChange={e => { this.onNumberChange(e, index) }} autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入车辆数量" />
                                                )}
                                            </FormItem>
                                        </Card>
                                    </div>
                                )
                                )}
                            </Form>
                        </div>
                    </div>
                </Modal>


            </div>
        )
    }
}

export default Form.create<WeddingCarSelectorProps>()(WeddingCarSelector);