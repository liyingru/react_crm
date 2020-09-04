import { Modal, Table, Button } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';

/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


interface OperationLogModalProps extends FormComponentProps {
    onCancel: Function;
    visible: false;
    type: string;
    id: string;
}

class OperationLogModalPage extends React.Component<OperationLogModalProps> {
    [x: string]: any;

    constructor(props: OperationLogModalProps) {
        super(props)
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
        const { id } = this.props;
        this.requestData(id, 1)
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps?.id != this.props?.id) {
            this.resetData()
            this.requestData(nextProps?.id, 1)
        }
    }

    handleCancel = () => {
        this.props?.onCancel()
    };


    requestData = (id: string, page: number) => {

        if (id?.length > 0) {
            var values = {}
            values['type'] = this.props?.type?.length > 0 ? this.props?.type : '1'
            values['relationId'] = id
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
        this.requestData(this.props.id, pagination.current)

    }

    render() {
        const { visible } = this.props;
        return (
            <div>
                <Modal
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={
                        <div>
                            <Button type='primary' onClick={this.handleCancel}>取消</Button>
                        </div>
                    }
                    title='操作日志'
                    width={700}
                >
                    <div >
                        <Table
                            scroll={{ x: 'max-content' }}
                            pagination={this.state.pagination}
                            loading={false} style={{ width: '100%' }}
                            columns={this.columns}
                            dataSource={this.state?.data?.rows}
                            onChange={this.onChangePage} />
                    </div>


                </Modal>
            </div>
        );
    }
}
export default OperationLogModalPage;