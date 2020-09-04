import {
  Card,
  Form,
  message,
  Tabs,
  Descriptions,
  Col,
  Spin,
  Button,
} from 'antd';
import getUserInfo from '@/utils/UserInfoStorage'
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import styles from '../list/style.less';
import LOCAL from '@/utils/LocalStorageKeys';

import CustomerInfo from '@/pages/CustomerManagement/customerDetail/components/customerinfo';
import ContactTab from '@/pages/CustomerManagement/customerDetail/components/contactlist';
import { CustomerData, ContactUserData } from '@/pages/CustomerManagement/customerDetail/dxl/data';
import FollowTable from './components/StandardTable';
import { TableListPagination } from '../data';
import PicBrowser from '@/components/PicBrowser';
import DealWithCustomerComplaint from '../list/components/DealWithCustomerComplaint';
import CrmUtil from '@/utils/UserInfoStorage';

const { TabPane } = Tabs;

interface CustomerComplaintDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customerComplaintDetailModel/fetchComplaintDetail'
      | 'customerComplaintDetailModel/submitDealWith'
      | 'customerComplaintDetailModel/fetchCustomerDetail'
      | 'customerComplaintDetailModel/fetchFollowList'
      | 'customerComplaintDetailModel/updateCustomerInfo'
      | 'customerComplaintDetailModel/getConfigInfo'
      | 'customerComplaintDetailModel/updateContactInfo'
      | 'customerComplaintDetailModel/createContactInfo'
    >
  >;
  loading: boolean;
  customerComplaintDetailModel: StateType;
}

interface CustomerComplaintDetailState {
  id: string | undefined;
  modalVisible: boolean;
  submitLoading: boolean;
}

@connect(
  ({
    customerComplaintDetailModel,
    loading,
  }: {
    customerComplaintDetailModel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerComplaintDetailModel,
    loading: loading.models.customerComplaintDetailModel,
  }),
)

class CustomerComplaintDetail extends Component<CustomerComplaintDetailProps, CustomerComplaintDetailState> {
  reqStatus: any;
  cityCode: string | undefined;
  currentUserInfo: any;

  saveParams: any;

  constructor(props: CustomerComplaintDetailProps) {
    super(props);
    this.currentUserInfo = CrmUtil.getUserInfo();
  }

  state: CustomerComplaintDetailState = {
    id: undefined,
    modalVisible: false,
    submitLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      location: { state: { id, customerId } },
    } = this.props;
    this.setState({ id })
    // 拉取客诉单详情信息
    dispatch({
      type: 'customerComplaintDetailModel/fetchComplaintDetail',
      payload: { id }
    });
    //拉取配置信息
    dispatch({
      type: 'customerComplaintDetailModel/getConfigInfo',
    });
    // 拉取客户信息
    dispatch({
      type: 'customerComplaintDetailModel/fetchCustomerDetail',
      payload: { customerId }
    });
    // 拉取跟进信息
    dispatch({
      type: 'customerComplaintDetailModel/fetchFollowList',
      payload: {
        id,
        pageSize: 10,
        page: 1,
      }
    });

  }


  /**
   * 提交处理单
   */
  handleSubmitDealWith = (fieldsValue: any) => {
    this.setState({
      submitLoading: true,
    })
    fieldsValue = {
      ...fieldsValue,
      id: this.state.id,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'customerComplaintDetailModel/submitDealWith',
      payload: {
        ...fieldsValue
      },
      callback: (result: boolean, msg: string) => {
        this.setState({
          submitLoading: false,
          modalVisible: false,
        })
        if (result) {
          message.success('处理单提交成功');
          // 处理完更新数据
          // 拉取客诉单详情信息
          dispatch({
            type: 'customerComplaintDetailModel/fetchComplaintDetail',
            payload: { id: this.state.id }
          });
          // 拉取跟进信息
          dispatch({
            type: 'customerComplaintDetailModel/fetchFollowList',
            payload: {
              id: this.state.id,
              pageSize: 10,
              page: 1,
            }
          });
        }
      }
    });
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  /**
   * 更新客户信息，成功后刷新客户信息展示
   */
  updateCustomerInfo = (params: CustomerData, callback: () => void) => {
    const { customerComplaintDetailModel: { customerDetail } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'customerComplaintDetailModel/updateCustomerInfo',
      payload: {
        ...params,
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('操作成功');
          dispatch({
            type: 'customerComplaintDetailModel/fetchCustomerDetail',
            payload: {
              customerId: customerDetail.customerData.customerId,
            }
          });
        }
      }
    });
  }

  onContactChanged = (bean: ContactUserData) => {
    const { customerComplaintDetailModel: { customerDetail: { customerData } } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: bean.contactId && bean.contactId.length > 0 ? 'customerComplaintDetailModel/updateContactInfo' : 'customerComplaintDetailModel/createContactInfo',
      payload: {
        ...bean,
        customerId: customerData.customerId,
      },
      callback: (success: boolean, msg: string) => {
        if (success) {
          message.success('操作成功');
          dispatch({
            type: 'customerComplaintDetailModel/fetchCustomerDetail',
            payload: {
              customerId: customerData.customerId,
            }
          });
        }
      }
    });
  }


  handleStandardTableChange = (pagination: Partial<TableListPagination>) => {
    // this.setState({
    //   selectedRows: [],
    // });

    const { dispatch } = this.props;
    // const { filterFormValues } = this.state;

    //状态 //分页信息
    const params = {
      id: this.state.id,
      page: pagination.current,
      pageSize: pagination.pageSize
    };

    dispatch({
      type: 'customerComplaintDetailModel/fetchFollowList',
      payload: params,
    });
  };

  /**
   * 客诉单信息
   */
  renderComplaintInfo = () => {
    const { customerComplaintDetailModel: { customerComplaintDetail } } = this.props;
    return customerComplaintDetail ? (
      <Descriptions column={1}>
        <Descriptions.Item label="客户姓名">{customerComplaintDetail.customer_name}</Descriptions.Item>
        <Descriptions.Item label="客户编号">{customerComplaintDetail.customer_id}</Descriptions.Item>
        <Descriptions.Item label={customerComplaintDetail.from == 1 ? "线索id" : "有效单编号"}>{customerComplaintDetail.id_num}</Descriptions.Item>
        <Descriptions.Item label="客诉单类型">{customerComplaintDetail.type_txt}</Descriptions.Item>
        <Descriptions.Item label="客诉内容">{customerComplaintDetail.content}</Descriptions.Item>
        <Descriptions.Item label="附件">
          <div style={{ display: "flex", flexDirection: "row" }}>
            {
              customerComplaintDetail.file.map(item => (
                // <div style={{ marginLeft: 10, marginTop: 10 }}>
                <span style={{ marginLeft: 10, marginTop: 10 }}>
                  <PicBrowser wt={50} ht={50} imgSrc={item} />
                </span>

                // </div>
                // <a href={item} target="_blank">{item}</a>
              ))
            }
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="状态">{customerComplaintDetail.status_txt}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{customerComplaintDetail.create_time}</Descriptions.Item>
        <Descriptions.Item label="最新处理时间">{customerComplaintDetail.update_time ? customerComplaintDetail.update_time : "--"}</Descriptions.Item>
        <Descriptions.Item label="最新处理结果">{customerComplaintDetail.new_content ? customerComplaintDetail.new_content : "--"}</Descriptions.Item>
      </Descriptions>
    ) : null
  }

  /**
   * 客户信息
   */
  renderCustomerInfo = () => {
    const { customerComplaintDetailModel: { customerDetail: { customerData }, config } } = this.props;
    return customerData && config ? (
      <CustomerInfo editable={0} customerData={customerData} config={config} onChange={this.updateCustomerInfo} />
    ) : null
  }

  /**
   * 联系人列表
   */
  renderContactsList = () => {
    const { customerComplaintDetailModel: { customerDetail: { contactUserData }, config } } = this.props;
    return contactUserData && config ? (
      <ContactTab editable={false} contactUserData={contactUserData} config={config} onChanged={this.onContactChanged}></ContactTab>
    ) : null
  }

  /**
   * 跟进信息表格
   */
  renderFollowTable = () => {
    const { customerComplaintDetailModel: { followList } } = this.props;
    return followList ? (
      <FollowTable
        // loading={loading}
        data={followList}
        onChange={this.handleStandardTableChange}
      />
    ) : null
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderWrapper title="客诉单详情">
        <Spin spinning={loading}>
          <Card >
            <div className={styles.boxInline}>
              <div className={styles.headerMaxTitle}>客诉单编号：{this.state.id}</div>
              <Button
                type="primary"
                style={{ marginLeft: 30 }}
                onClick={() => { this.setState({ modalVisible: true }) }}>处理客诉</Button>
            </div>

            <Tabs type="card" style={{
              paddingTop: 20,
            }}>
              <TabPane tab="客诉单信息" key="1">
                {this.renderComplaintInfo()}
              </TabPane>
              <TabPane tab="客户信息" key="2">
                {this.renderCustomerInfo()}
              </TabPane>
              <TabPane tab="联系人" key="3">
                {this.renderContactsList()}
              </TabPane>
              <TabPane tab="跟进信息" key="4">
                {this.renderFollowTable()}
              </TabPane>
            </Tabs>
          </Card>
          <DealWithCustomerComplaint
            loading={this.state.submitLoading}
            modalVisible={this.state.modalVisible}
            handleSubmitDealWith={this.handleSubmitDealWith}
            handleModalVisible={this.handleModalVisible}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }

}

export default Form.create<CustomerComplaintDetailProps>()(CustomerComplaintDetail);
