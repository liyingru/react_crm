import React, { Component, Dispatch, Fragment } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select, Table } from 'antd';
import { Action } from "redux";
import { ColumnProps } from 'antd/es/table'; // 引用table中的行参数
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';
interface CustomerConsultProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  liheDetail: StateType;
}
let data = { "code": 200, "msg": "success", "data": { "result": { "total": 5, "rows": [{ "id": 108, "name": "c2", "type": "线下导入", "scope": "线索", "start_time": "", "end_time": null, "weight": 0, "exec_rule": "每日回收", "group_ids": "", "user_ids": "", "status": "有效", "remark": "", "create_time": "2020-04-10 12:53:19", "create_by": "完美四人组", "update_time": "2020-04-10 12:54:12", "update_by": 264, "company_id": 11, "btns": "1,2" }, { "id": 107, "name": "c1", "type": "线下导入", "scope": "线索", "start_time": "", "end_time": null, "weight": 0, "exec_rule": "每日回收", "group_ids": "", "user_ids": "", "status": "有效", "remark": "", "create_time": "2020-04-10 12:47:28", "create_by": "完美四人组", "update_time": null, "update_by": 0, "company_id": 11, "btns": "1,2" }, { "id": 106, "name": "123", "type": "线下导入", "scope": "需求单", "start_time": "", "end_time": null, "weight": 0, "exec_rule": "每日回收", "group_ids": "", "user_ids": "", "status": "有效", "remark": "", "create_time": "2020-04-09 16:42:20", "create_by": "完美四人组", "update_time": "2020-04-09 16:48:54", "update_by": 264, "company_id": 11, "btns": "1,2" }, { "id": 104, "name": "111", "type": "线下导入", "scope": "线索", "start_time": "", "end_time": null, "weight": 0, "exec_rule": "每日回收", "group_ids": "", "user_ids": "", "status": "有效", "remark": "", "create_time": "2020-04-03 12:07:01", "create_by": "完美四人组", "update_time": null, "update_by": 0, "company_id": 11, "btns": "1,2" }, { "id": 103, "name": "hanxs@baihe.com", "type": "线下导入", "scope": "线索", "start_time": "2020-03-31 至 2020-04-14", "end_time": "2020-04-14 23:59:59", "weight": 1, "exec_rule": "每日回收", "group_ids": "", "user_ids": "21", "status": "有效", "remark": "", "create_time": "2020-03-30 14:33:08", "create_by": "完美四人组", "update_time": "2020-03-30 14:33:28", "update_by": 264, "company_id": 11, "btns": "1,2" }], "page": 1, "pageSize": 10 }, "other": 0, "apver": "1.0.0" } }

@connect(
  ({
    LiheProDetail,
    loading,
  }: {
    LiheProDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProDetail,
    loading: loading.models.LiheProDetail,
  }),
)

class CustomerContract extends Component<CustomerConsultProps> {
  constructor(props) {
    super(props);
    this.state = {
      detailsId: 1,
      menuTab: 0
    }
  }
  // 获取列表 表头
  getTableColumns = (): ColumnProps<any>[] => [
    {
      width: 150,
      title: '合同标题',
      dataIndex: 'name',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.orderDetailCtrl(record)}>{text}</a>
        </Fragment>
      )

    },
    {
      width: 150,
      title: '合同总金额',
      dataIndex: 'type',
      render(text) {
        return <>{text || '-'}</>
      }
    },
    {
      width: 100,
      title: '合同时间',
      dataIndex: 'exec_rule',
    },
    {
      width: 150,
      title: '合同状态',
      dataIndex: 'create_time',
      render(text) {
        return <>{text || '-'}</>
      }
    },

    {
      width: 150,
      title: '备注',
      dataIndex: 'remark',
      render(text) {
        return <>{text || '-'}</>
      }
    },
  ];
  handleClickEdit = () => {

  }

  componentDidMount() {

  }
  // 分页
  handleChangePage = (page: any) => {
    const { form, dispatch } = this.props;
    // const valuesResult = {
    //   ...this.state.searchParams,
    //   page: page.current,
    //   pageSize: 10,
    // }
    // dispatch({
    //   type: 'taskilList/fetch',
    //   payload: valuesResult,
    // });
  }




  render() {
    const columns = this.getTableColumns();
    console.log(data)
    let pagination = {
      total: data.data.result.total,
      pageSize: data.data.result.pageSize,
      current: data ? data.page : 1,
    }
    let data1 = {
      list: data.data.result.rows,
      pagination: pagination,
    };
    return (
      <Card style={{ width: '100%' }}>
        <Table
          rowKey="id"
          dataSource={data1.list}
          columns={columns}
          onChange={this.handleChangePage}
          pagination={{
            ...pagination,
            onChange: page => this.handleChangePage
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

    );
  }
}
export default CustomerContract;