import { Modal, Table, Button } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';


interface OperationLogModalProps {
    logRef: (ref: any) => void;
    customerId: string;
    type: number;
    id?: number;
}

class OperationLogPage extends React.Component<OperationLogModalProps> {
    [x: string]: any;

    constructor(props: OperationLogModalProps) {
        super(props)
        this.props.logRef(this)
        this.state = {
            pagination: {},
            page: 1,
            data: {},
            isLoding: true
        }

    }

    columns = [
        {
            title: '操作时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: '30%',
        },
        {
            title: '操作人',
            dataIndex: 'operate_user',
            key: 'operate_user',
            width: '30%',
        },
        {
            title: '操作内容',
            dataIndex: 'comment',
            key: 'comment',
            width: '30%',
        },
    ]

    componentDidMount() {
        this.requestData(1)
    }

    // componentWillReceiveProps(nextProps: any) {
    //     if (nextProps?.id != this.props?.id) {
    //         this.resetData()
    //         this.requestData(nextProps?.id, 1)
    //     }
    // }


    requestData = (page: number) => {
        if(page == 1){
            this.resetData()
        }
        var values = {}
        values['customerId'] = this.props.customerId
        values['type'] = this.props.type
        if (this.props.id) {
            values['relationId'] = this.props.id
        }
        values['page'] = page
        values['pageSize'] = '10'
        this.setState({
            isLoding: true
        })

        Axios.post(URL.operateList, values).then(
            res => {
                if (res.code == 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = res.data.result?.total;
                    this.setState({
                        data: res.data.result,
                        pagination,
                    })
                }
                this.setState({
                    isLoding: false
                })
            }
        );
    }

    resetData = () => {
        const pager = { ...this.state.pagination };
        pager.current = 1;
        this.setState({
            pagination: pager,
            page: 1,
            data: {},
            isLoding: true
        });
    }

    onChangePage = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
            page: pagination.current
        });
        this.requestData(pagination.current)

    }

    render() {
        return (
            <div >
                <Table
                    size='small'
                    scroll={{ x: 'max-content' }}
                    pagination={this.state.pagination}
                    loading={false} style={{ width: '100%' }}
                    columns={this.columns}
                    dataSource={this.state?.data?.rows}
                    onChange={this.onChangePage} />
            </div>
        );
    }
}
export default OperationLogPage;