import Form, { FormComponentProps } from "antd/lib/form";
import { Component } from "react";
import Table, { ColumnProps, TableProps } from "antd/lib/table";
import { ThirdRecordItem, CustomListItem, ThirdRecordData } from "../../data";
import { notification } from "antd";

interface ThirdRecordProps extends FormComponentProps {
    reqId: string;
    loading?: boolean;
    data: ThirdRecordData;
    fun_fetchThirdRecordDataList: Function;
}

class ThirdRecord extends Component<ThirdRecordProps> {

    componentDidMount() {
        const { fun_fetchThirdRecordDataList, reqId } = this.props
        fun_fetchThirdRecordDataList(reqId, 1, 10)
    }

    getListItems = () => {
        const columns: CustomListItem[] = [];
        columns.push(this.creatCustomListItem('订单号', 'order_id'));
        columns.push(this.creatCustomListItem('业务品类', 'service_type'));
        columns.push(this.creatCustomListItem('酒店ID', 'common_id'));
        columns.push(this.creatCustomListItem('酒店名称', 'common_name'));
        columns.push(this.creatCustomListItem('拨打时间', 'calltime'));
        columns.push(this.creatCustomListItem('呼叫对象', 'caller_name'));
        columns.push(this.creatCustomListItem('是否接通', 'istalk'));
        columns.push(this.creatCustomListItem('响铃时长', 'TalkLen'));
        columns.push(this.creatCustomListItem('通话时长', 'Talktype'));
        columns.push(this.creatCustomListItem('通话状态', 'auth_user_name'));
        return columns;
    }
    creatCustomListItem = (name: string, id: string) => {
        return {
            id,
            name,
        }
    }
    createColum = (title: string | React.ReactNode, dataIndex: string, fixed?: boolean | "right" | "left" | undefined): ColumnProps<ThirdRecordItem> => {
        const colum: ColumnProps<ThirdRecordItem> = {
            title,
            dataIndex,
            fixed,
        }
        if (title == '操作') {
            return {
                ...colum,
                render: (text: any, record: ThirdRecordItem) => {
                    return (
                        <a onClick={() => { this.playMP3(record) }} >播放</a>
                    )
                }
            }
        }
        return colum
    }
    playMP3 = (record: ThirdRecordItem) => {
        const key = `open${Date.now()}`;
        const description = (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <audio src={record.audio_url} autoPlay={true} controls style={{ width: '100%' }} />
            </div>
        );
        const message = (
            <div style={{ width: '100%' }}>
                <ul>
                    <li style={{ fontSize: 16 }}>播放</li>
                </ul>
            </div>
        );
        notification.open({
            type: undefined,
            style: { width: 500, marginLeft: 385 - 500, },
            message: message,
            description: description,
            duration: 0,
            key
        });
    }
    createColums = (): ColumnProps<ThirdRecordItem>[] => {
        const columns: ColumnProps<ThirdRecordItem>[] = [];
        this.getListItems().map(item => {
            columns.push(this.createColum(item.name, item.id));
        })
        columns.push(this.createColum('操作', '', 'right'));
        return columns;
    }
    handleTableChange: TableProps<ThirdRecordItem>['onChange'] = (
        pagination,
        filters,
        sorter,
        ...rest
    ) => {
        const { fun_fetchThirdRecordDataList, reqId } = this.props
        fun_fetchThirdRecordDataList(reqId, pagination.current, pagination.pageSize)
    };

    render() {
        const { loading, data } = this.props
        return (
            <div>
                <Table
                    scroll={{ x: 'max-content' }}
                    size={'middle'}
                    loading={loading}
                    dataSource={data.list}
                    pagination={data.pagination}
                    columns={this.createColums()}
                    onChange={this.handleTableChange} />
            </div>
        )
    }
}

export default Form.create<ThirdRecordProps>()(ThirdRecord);