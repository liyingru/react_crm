import { Modal, Table, Button, Select, message, Spin } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';


const { Option } = Select;

interface InfoChangeModalProps {
    selectedRows: any[];
    onRef: (ref: any) => void;
    callBackSuccess?: () => void;
    configs?: any[];
    type: 1 | 2;  //1线索 2需求单
}

interface InfoChangeModalState {
    isLoading: boolean;
    selectedValue: number;
    modalVisible: boolean;
}

class InfoChangeModal extends React.Component<InfoChangeModalProps> {

    constructor(props: InfoChangeModalProps) {
        super(props)
        this.props.onRef(this)
    }

    state: InfoChangeModalState = {
        isLoading: false,
        selectedValue: -1,
        modalVisible: false,
    }

    setModalVisible = (visible: boolean) => {
        if (visible == true) {
            this.state.selectedValue = -1
        }
        this.setState({
            modalVisible: visible,
        })
    }
    onSelectChang = (value: any) => {
        this.setState({
            selectedValue: value
        })
    }
    clickModalOK = () => {
        const { selectedRows, callBackSuccess } = this.props;

        if (this.state.selectedValue === -1) {
            message.error('请选择跟进结果')
            return;
        }

        let ids = selectedRows.map((item) => {
            return item.id
        });


        let params = {
            status: this.state.selectedValue
        }
        if(this.props.type == 1){
            params['leadId'] = ids + ''
        }else if(this.props.type == 2){
            params['reqId'] = ids + ''
        }

        let url = (this.props.type == 2)?URL.reqsInfoChange:URL.leadsInfoChange

        this.setState({
            isLoading: true
        })
        Axios.post(url, params).then(
            res => {
                this.setState({
                    isLoading: false
                })
                if (res.code == 200) {
                    message.success('变更成功')
                    this.setModalVisible(false)
                    callBackSuccess && callBackSuccess()
                }
            }
        ).catch(e => 
            this.setState({
                isLoading: false
            })
        );
    }

    render() {
        const { configs, selectedRows } = this.props;
        const { isLoading } = this.state
        return (<Modal
            title="信息变更"
            okText='确定'
            cancelText='取消'
            visible={this.state.modalVisible}
            onOk={this.clickModalOK}
            onCancel={() => this.setModalVisible(false)}
            okButtonProps={{ disabled: isLoading }}
            cancelButtonProps={{ disabled: isLoading }}
            destroyOnClose>
            <Spin spinning={isLoading}>
                <div style={{ display: 'block' }}>
                    <section style={{ display: 'flex' }}><div style={{ width: '80px' }}>本次已选择：</div><div>{selectedRows.length}</div>条</section>
                    <section style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ width: '80px' }}>跟进结果：</div>
                        <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.onSelectChang}>
                            {
                                configs?.map(item => (
                                    <Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    </section>
                </div>
            </Spin>
        </Modal>
        );
    }
}
export default InfoChangeModal;