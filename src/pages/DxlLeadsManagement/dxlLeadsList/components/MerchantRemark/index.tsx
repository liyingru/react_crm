import Form, { FormComponentProps } from "antd/lib/form";
import { Component } from "react";
import { CustomListItem, MerchantRemarkItem, MerchantRemarkData } from "../../data";
import Table, { ColumnProps, TableProps } from "antd/lib/table";

interface MerchantRemarkProps extends FormComponentProps {
    reqId: string;
    loading?: boolean;
    data: MerchantRemarkData;
    fun_fetchMerchantRemarkList: Function;
}

class MerchantRemark extends Component<MerchantRemarkProps> {

    componentDidMount() {
        const { fun_fetchMerchantRemarkList, reqId } = this.props
        fun_fetchMerchantRemarkList(reqId, 1, 10)
    }

    getListItems = () => {
        const columns: CustomListItem[] = [];
        columns.push(this.creatCustomListItem('订单号', 'order_id'));
        columns.push(this.creatCustomListItem('操作时间', 'operate_time'));
        columns.push(this.creatCustomListItem('商家名', 'biz_name'));
        columns.push(this.creatCustomListItem('备注内容', 'desc'));
        columns.push(this.creatCustomListItem('操作人', 'auth_user_name'));
        return columns;
    }
    creatCustomListItem = (name: string, id: string) => {
        return {
            id,
            name,
        }
    }
    createColum = (title: string | React.ReactNode, dataIndex: string, fixed?: boolean | "right" | "left" | undefined): ColumnProps<MerchantRemarkItem> => {
        const colum: ColumnProps<MerchantRemarkItem> = {
            title,
            dataIndex,
            fixed,
        }
        return colum
    }
    createColums = (): ColumnProps<MerchantRemarkItem>[] => {
        const columns: ColumnProps<MerchantRemarkItem>[] = [];
        this.getListItems().map(item => {
            columns.push(this.createColum(item.name, item.id));
        })
        return columns;
    }
    handleTableChange: TableProps<MerchantRemarkItem>['onChange'] = (
        pagination,
        filters,
        sorter,
        ...rest
    ) => {
        const { fun_fetchMerchantRemarkList, reqId } = this.props
        fun_fetchMerchantRemarkList(reqId, pagination.current, pagination.pageSize)
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

export default Form.create<MerchantRemarkProps>()(MerchantRemark);