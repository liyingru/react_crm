import { Modal, Form, Select, DatePicker, Input, Row, Col, Button } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { PlansItem } from '../../data';
import moment from 'moment';
import NumericInput from '@/components/NumericInput';

const dateFormat = 'YYYY-MM-DD';


interface CollectionsProps extends FormComponentProps {
    onChangeOneFunction: Function;
    onChangeTowFunction: Function;
    deleteFunction: Function;
    data: PlansItem;
    index: number;
    key: number;
}


class CollectionsPage extends React.Component<CollectionsProps> {
    [x: string]: any;

    constructor(props: CollectionsProps) {
        super(props)
    }

    onChangeOneFunction = (date: any, dateString: string) => {

        const { onChangeOneFunction, data, index, key } = this.props;
        onChangeOneFunction(dateString, data, index)
    }

    onChangeTowFunction = (e: any) => {
        const { onChangeTowFunction, data, index, key } = this.props;
        onChangeTowFunction(e.target.value, data, index)
    }

    deleteFunction = () => {
        const { deleteFunction, data, index, key } = this.props;
        deleteFunction(data, key, index)
    }

    render() {

        const { data, index } = this.props;

        return (
            <div>
                <Row gutter={[8, 16]} >
                    <Col span={6}>
                        <div>{data && data.title}</div>
                    </Col>
                    <Col span={6}>
                        <DatePicker disabled={index == 0} defaultValue={data && (data.plan_receivables_date && moment(data.plan_receivables_date, dateFormat))} onChange={this.onChangeOneFunction} placeholder="请选择回款日期" />
                    </Col>
                    <Col span={6}>

                        <NumericInput disabled={index == 0} prefix="￥" value={data && data.plan_receivables_money} onChange={this.onChangeTowFunction} placeholder="请填写回款金额" />
                    </Col>
                    <Col span={6}>
                        <Button disabled={index == 0} type='link' onClick={this.deleteFunction}>删除</Button>
                    </Col>
                </Row>

            </div>
        );
    }
}
export default CollectionsPage;