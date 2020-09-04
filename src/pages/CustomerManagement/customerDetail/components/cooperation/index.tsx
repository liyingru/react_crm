import { ContactUserData, CooperationData } from "../../dxl/data";
import { Component } from "react";
import React from "react";
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, message, List } from 'antd';
import styles from './index.less';
import { ConfigListItem, ConfigList } from "@/pages/CustomerManagement/commondata";
import { FormComponentProps } from "antd/es/form";
import { ColumnProps } from "antd/lib/table";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


export interface CooperationTabPros {
    cooperationData: CooperationData[];
}

export interface CooperationTabState {
}

class CooperationTab extends Component<CooperationTabPros, CooperationTabState>{

    state: CooperationTabState = {
    }


    render() {
        const { cooperationData } = this.props;
        return (
            <div>
                <List
                    size="small"
                    bordered
                    dataSource={cooperationData}
                    renderItem={item => <List.Item>
                        <div style={{ display: 'flex', flexDirection: 'column',width:'100%' }}>
                            <div style={{ color: 'black' }}>{item.create_time}</div>
                            <div>{item.title}</div>
                            <div>{item.comment}</div>
                            <div style={{ alignSelf: 'right',textAlign:'right' }}>操作人:  {item.create_user}</div>
                        </div>
                    </List.Item>}
                />
            </div>
        )
    }
}

export default CooperationTab;