import { Component } from "react";
import React from "react";
import { Col, Row, Select, Input, InputNumber } from "antd";
import { FormComponentProps } from 'antd/es/form';
import { percentUserlistInfoItem } from "../../../data";


interface inputPercentItemProps extends FormComponentProps {
    index: number;
    personChange: Function;
    percentValueChange: Function;
    userList: percentUserlistInfoItem[];
}

interface inputPercentItemState {
    inputString: string;
}


class inputPercentItem extends Component<inputPercentItemProps,inputPercentItemState> {

    constructor(props: inputPercentItemProps) {
        super(props);
        this.state = {
            inputString: ''
        }
    }
    selectPersonChange = (value) => {
        const { personChange, index } = this.props
        personChange(value, index)
    }

    percentInputText = (e) => {
        const { percentValueChange, index } = this.props;
        var string = e.target.value

        //先把非数字的都替换掉，除了数字和.   
        string = string.replace(/[^\d\.]/g,'');     
        //必须保证第一个为数字而不是.     
        string = string.replace(/^\./g,''); 
        //保证第一位只能有一个或0个0
        string = string.replace(/^0{2,}/,'0'); 
        //以0开始的第二位只能为小数点
        string =string.replace(/^0[\d]/,'0');
        //保证只有出现一个.而没有多个.     s
        string = string.replace(/\.{2,}/g,'.');
        //保证.只出现一次，而不能出现两次以上     
        string = string.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
        
        this.setState({
            inputString:string
        })
        percentValueChange(string, index)
        
    }

    render() {
        const { index, userList } = this.props;
        const {inputString} = this.state;
        const { Option } = Select;
        return (
            <Row gutter={[8, 16]} >
                <Col span={6}>
                    <div>{'策划师' + (index + 1)}</div>
                </Col>
                <Col span={9}>
                    <Select placeholder='请选择人员' style={{ width: "100%" }} onChange={this.selectPersonChange}>
                        {
                            userList && userList.map(item => (
                                <Option value={item.id} key={item.name}>{item.name}</Option>))
                        }
                    </Select>
                </Col>
                <Col span={9}>
                    <Input placeholder='请输入占比系数' value={inputString} onChange={this.percentInputText}/>
                </Col>
            </Row>
        );
    }
}
export default inputPercentItem