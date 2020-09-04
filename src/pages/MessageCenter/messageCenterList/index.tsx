import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { Form, Radio, Card, Spin } from 'antd';
import { connect } from 'dva';
import { StateType } from './model';
import Axios from 'axios';
import URL, { ENVIRONMENT } from '@/api/serverAPI.config';
import LOCAL from '@/utils/LocalStorageKeys';
import { KeepAlive } from 'umi';
import { MassageItemModel, NoticeJumpParams } from './data';
import eventEmitter from '@/utils/Evt';
import { routerRedux } from 'dva/router';
import CrmStandardTable, { getCrmTableColumn, CrmStandardTableColumnProps } from '@/components/CrmStandardTable';
// import { globalContext } from '@/utils/context';


interface MessageCenterListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'messageCenterList/fetch'
    >
  >;
  loading: boolean;
  messageCenterList: StateType;
}

interface MessageCenterLisState {
  status: string,
  page: number,
  isEditReadNoticeRequetsFinish: boolean,
}

@connect(
  ({
    messageCenterList,
    loading,
  }: {
    messageCenterList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    messageCenterList,
    loading: loading.models.messageCenterList,
  }),
)

class MessageCenterList extends Component<MessageCenterListProps, MessageCenterLisState> {

  constructor(props: MessageCenterListProps) {
    super(props);
    this.state = {
      status: '',
      page: 1,
      isEditReadNoticeRequetsFinish: true
    }
  }

  componentDidMount() {
    const { location } = this.props;
    if (location && location.state?.unread) {
      this.setState({
        status: location.state.unread
      }, () => {
        this.getNoticeList(this.state?.status);
      });
    } else {
      this.getNoticeList(this.state?.status);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const isRefresh = localStorage ? localStorage.getItem(LOCAL.MESSAGE_CENTER_REFRESH)?.toString() : '';
    if (isRefresh?.length > 0) {
      localStorage?.setItem(LOCAL.MESSAGE_CENTER_REFRESH, '');

      const nextStatus = nextProps.location?.state?.unread ?? '';
      this.setState({
        status: nextStatus,
        page: 1,
      }, () => {
        this.getNoticeList(nextStatus);
      });
    }
  }

  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<MassageItemModel>[] => {
    const columns: CrmStandardTableColumnProps<MassageItemModel>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('title', '标题', { width: 100 }));
    columns.push(get('content', '内容', {
      width: 150,
      render: content => {
        if (content) {
          return (
            <ul style={{ margin: 0, padding: 0 }}>
              {
                content.split('_').map((item) => (
                  <li style={{ padding: '2px 0px 2px 0px' }}>{item}</li>
                ))
              }
            </ul>
          )
        } else {
          return <span>&nbsp;</span>
        }
      }
    }));
    columns.push(get('type', '类型', {
      width: 50,
      render: type => type === 1 ? <span>线索</span>
        : type === 2 ? <span>有效单</span>
          : type === 3 ? <span>订单</span>
            : type === 4 ? <span>合同</span>
              : type === 5 ? <span>客户</span>
                : type === 6 ? <span>回款</span>
                  : <span>其他</span>
    }));
    columns.push(get('status', '状态', {
      width: 50,
      render: status => status == 0 ? <div style={{ color: 'red' }}>未读</div> : <div>已读</div>
    }));
    columns.push(get('create_time', '创建时间', { width: 100 }));
    columns.push(get('id', '操作', {
      fixed: 'right',
      width: 150,
      render: id => <a onClick={() => this.checkMassageAction(id)}>查看</a>
    }));
    return columns;
  }

  // 列表表头
  columns: CrmStandardTableColumnProps<MassageItemModel>[] = this.generateStandardTableColumnProps();

  // 页码变更
  handleChangePage = (page: number, pageSize: number) => {
    const { dispatch } = this.props;
    const valuesResult = {
      pageSize,
      page,
      status: this.state?.status
    };

    dispatch({
      type: 'messageCenterList/fetch',
      payload: valuesResult,
    });
  }

  // 点击tab
  tabChange = (e: any) => {
    let tab = e.target?.value;
    this.setState({
      status: tab,
      page: 1
    }, () => {
      this.getNoticeList(tab)
    })
  }

  // 获取列表
  getNoticeList = (status: string) => {
    const { dispatch } = this.props;
    const valuesResult = {
      page: this.state?.page,
      status
    };
    dispatch({
      type: 'messageCenterList/fetch',
      payload: valuesResult,
    });
  }

  // 请求设置消息已读
  setEditReadNotice = (model: MassageItemModel) => {
    console.log("setEditReadNotice", model)

    this.setState({
      isEditReadNoticeRequetsFinish: false
    }, () => {
      const values = {};
      values['noticeId'] = model?.id;

      Axios.post(URL.noticEditReadNotice, values).then(
        res => {
          if (res.code == 200) {
            // this.getNoticeList(this.state?.status)
            this.subtractMassageCount()
            eventEmitter.emit('noticeUnreadCount', false);
            this.jump(model)
          }
          this.setState({
            isEditReadNoticeRequetsFinish: true
          })
        }
      );
    })
  }

  // 修改消息个数
  subtractMassageCount = () => {
    const unreadMsgString = localStorage && localStorage.getItem(LOCAL.UNREAD_MESSAGE_COUNT);
    console.log('UNREAD_MESSAGE_COUNT', unreadMsgString)
    const unreadMsgNumber = Number(unreadMsgString) ?? 0;

    let tempNumber = unreadMsgNumber - 1;
    if (tempNumber < 0) {
      tempNumber = 0
    }
    localStorage.setItem(LOCAL.UNREAD_MESSAGE_COUNT, tempNumber.toString() ?? '0');
    console.log('UNREAD_MESSAGE_COUNT', tempNumber);
  }

  // 处理消息详情操作
  checkMassageAction = (id: string) => {

    const { messageCenterList: { data } } = this.props;
    let model: MassageItemModel = data?.list?.filter(item => item.id + "" == id + "")[0];

    if (model?.id > 0) {
      if (model?.status === 0) {
        // 未读消息
        this.setEditReadNotice(model);
        // this.subtractMassageCount();
      } else {
        this.jump(model);
      }
    }
  }

  /** 处理跳转逻辑 */
  jump = (model: MassageItemModel) => {
    let newUrl = model.url;
    let newUrlArray = model.url.split('?');
    if (newUrlArray && newUrlArray.length > 0) {
      newUrl = newUrlArray[0];
    }

    var params: Partial<NoticeJumpParams> = {};

    if (model.customer_id && model.customer_id.toString().length > 0) {
      params.customerId = model.customer_id;
    }
    if (model.leads_id && model.leads_id.toString().length > 0) {
      params.leadsId = model.leads_id;
    }
    if (model.leads_id && model.leads_id.toString().length > 0) {
      params.leadId = model.leads_id;
    }
    if (model.user_id && model.user_id.toString().length > 0) {
      params.ownerId = model.user_id;
    }
    if (model.category_id && model.category_id.toString().length > 0) {
      params.categoryId = model.category_id;
    }
    if (model.order_id && model.order_id.toString().length > 0) {
      params.orderId = model.order_id;
    }
    if (model.audit_id && model.audit_id.toString().length > 0) {
      params.auditId = model.audit_id;
    }
    if (model.req_id && model.req_id.toString().length > 0) {
      params.reqId = model.req_id;
    }
    if (model.default_active_key && model.default_active_key.toString().length > 0) {
      params.defaultActiveKey = model.default_active_key;
    }
    if (model.show_style && model.show_style.toString().length > 0) {
      params.showStyle = model.show_style;
    }
    if (model.read_or_write && model.read_or_write.toString().length > 0) {
      params.readOrWrite = model.read_or_write;
    }
    if (model.is_qa && model.is_qa.toString().length > 0) {
      params.isQA = model.is_qa;
    }
    if (ENVIRONMENT == 'dev') console.log('messageCenterList跳转传参:', params);

    this.props.dispatch(routerRedux.push({
      pathname: newUrl,
      state: params,
      query: params
    }));
  }

  render() {
    const {
      messageCenterList: { data },
      loading
    } = this.props;
    return (
      <>
        <Card bordered={false}>

          <MyTable
            loading={loading}
            rowKey='id'
            data={data}
            columns={this.columns}
            onPaginationChanged={this.handleChangePage}
            renderTopButtons={() => (
              <div style={{ display: 'flex', width: '100%' }}>
                <Radio.Group defaultValue='' value={this.state?.status} buttonStyle="solid" style={{ marginBottom: 20 }} onChange={this.tabChange}>
                  <Radio.Button value=''>全部</Radio.Button>
                  <Radio.Button value='0'>未读</Radio.Button>
                  <Radio.Button value='1'>已读</Radio.Button>
                </Radio.Group>
              </div>
            )}
          />

          <div hidden={this.state?.isEditReadNoticeRequetsFinish} style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%', height: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.8)' }}>
            <Spin />
          </div>
        </Card>
      </>
    )
  }
}
class MessageCenterLis1 extends Component<MessageCenterListProps, MessageCenterLisState> {

  render() {
    return (
      <PageHeaderWrapper>
        <KeepAlive>
          <MessageCenterList {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }

}
class MyTable extends CrmStandardTable<MassageItemModel>{ }
export default Form.create<MessageCenterListProps>()(MessageCenterLis1);
