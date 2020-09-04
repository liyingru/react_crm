import { Modal, Form, Select, DatePicker, Input, Card, Row, Col, Button, Menu, Dropdown, message } from 'antd';
import React, { Component, Dispatch } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { inputPercentParams } from '../../data';
import InputPercentItem from './InputPercentItem';
import { StateType } from '../../model';
import { connect } from 'dva';
import list from '@/pages/CustomerComplaintManagement/list';

interface inputhPercentProps extends FormComponentProps {
    // saveFunction: Function;
    onCancel: Function;
    visible: boolean;
    contractId: string;
    dispatch: Dispatch<any>;

    getDetailsModelType: StateType;
}

interface inputPercentState {
    listArray: Array<inputPercentParams>,
}

@connect(
    ({
        getDetailsModelType,
    }: {
        getDetailsModelType: StateType;
    }) => ({
        getDetailsModelType,
    })
  )

class orderDetailsInputPercentInfo extends React.Component<inputhPercentProps, inputPercentState> {

    constructor(props: inputhPercentProps) {
        super(props);
        this.state = {
            listArray: []
        }
    }

    addPersonFunction = () => {
        const { listArray } = this.state;
        var tempArray = listArray;
        let item: inputPercentParams = {
            id: '',
            percent: ''
        };
        tempArray.push(item);
        this.setState({
            listArray: tempArray,
        })
    }

    personSelectChange = (id: string, index: number) => {
        const { listArray } = this.state
        let item = listArray[index]
        let tempItem: inputPercentParams = {
            id: id,
            percent: item.percent
        };
        listArray[index] = tempItem
        this.setState({
            listArray:listArray
        })
    }

    percentTextChange = (text: string, index: number) => {
        const { listArray } = this.state
        let item = listArray[index]
        let tempItem: inputPercentParams = {
            id: item.id,
            percent: text
        };
        listArray[index] = tempItem
        this.setState({
            listArray:listArray
        })
    }

    componentDidMount() {
        this.getUserList()
    }

    getUserList (){
        const { dispatch } = this.props;
        let params = {};
        dispatch({
            type: 'getDetailsModelType/getPercentUserList',
            payload: params,
        });
    }

    updateUserList = () => {
        const { dispatch,contractId } = this.props;
        const {listArray} = this.state;
        var itemArray = [];
        var total = 0.0;
        for (let index = 0; index < listArray.length; index++) {
            const item = listArray[index];
            let tempDic = {'userId':item.id,'ratio':item.percent}
            total = total + parseFloat(item.percent)
            itemArray.push(tempDic)
        }
        if (total > 1) {
            message.error('分配总和不可超过百分百');
        }else {
            let params = {'contractId':contractId,'ratioInfo':JSON.stringify(itemArray)};
            dispatch({
                type: 'getDetailsModelType/updatePercentUser',
                payload: params,
                callback:this.onUpdatePercentCallback
            });
        }
    }


  //添加录占比回调
  onUpdatePercentCallback = (status: boolean, msg: string) => {
    if (status) {
      message.success(msg);
     this.props.onCancel()
    } else {//录占比失败 提示失败原因
    }
  };

    componentWillReceiveProps = (nextProps) => {

        const array: inputPercentParams[] = [];
        this.setState({
            listArray: array,
        })
    }

    render() {
        const { visible, onCancel, getDetailsModelType:{percentUserList}} = this.props;
        const { listArray } = this.state

        const showItem = listArray.map((k: any, index: React.ReactText) => (
            <InputPercentItem
                index={index}
                personChange={this.personSelectChange}
                percentValueChange={this.percentTextChange}
                userList={percentUserList ? percentUserList : []}
            />
        ))

        return (
            <Modal
                visible={visible}
                onCancel={onCancel}
                onOk={this.updateUserList}
                title={'填写销售占比'}
                closable={false}
            >
                <Button type='primary' onClick={this.addPersonFunction}>+添加人员</Button>
                <Card style={{ borderRadius: 20, top: 10 }}>
                    {showItem}
                </Card>
            </Modal>
        );
    }
}
export default orderDetailsInputPercentInfo;


