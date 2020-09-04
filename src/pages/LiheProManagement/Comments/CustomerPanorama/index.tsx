import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Form, Button, Select, Modal, Input, DatePicker } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';
import FollowView from '../FollowView';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from "./index.less";

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import moment from 'moment';

interface CustomerConsultProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  form: WrappedFormUtils<any>;
  liheDetail: StateType;
}
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

class CustomerPanorama extends Component<CustomerConsultProps> {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      // 测试数据------START
      followList: [
        {
          followTime: "2020-04-17 18:19",
          callDuration: "",
          type: 3,
          followTag: "重点跟进",
          results: "需求客户",
          state: "有效",
          nextContactTime: "",
          arrivalTime: "",
          contactWay: "电话",
          comment: "",
          attachment: [],
          followUser: "完美四人组",
          productName: "",
          couponName: "",
        },
        {
          followTime: "2020-04-17 18:19",
          callDuration: "",
          type: 1,
          followTag: "重点跟进",
          results: "需求客户",
          state: "有效",
          nextContactTime: "",
          arrivalTime: "",
          contactWay: "电话",
          comment: "",
          attachment: [],
          followUser: "完美四人组",
          productName: "",
          couponName: "",
        }
      ],
      followData: {
        showFollowButton: 1,
        followTab: [
          {
            key: 1,
            val: "我的跟进"
          },
          {
            key: 2,
            val: "有效单跟进"
          }
        ]
      }
      // 测试数据------END
    }
  }
  componentDidMount() {

  }

  addFollowCtrl = () => {
    this.setState({
      modalVisible: true,
    });
  }

  getFollowListFuntion = () => {
    console.log('getFollowListFuntion')
  }
  handleModalOk = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (values.statusDate) {
        let startTime = moment(values.statusDate[0]).format('YYYY-MM-DD');
        let endTime = moment(values.statusDate[1]).format('YYYY-MM-DD');
        values.statusDate = startTime + '~' + endTime;
      }
      const valuesResult = {
        ...values,
      }
      console.log('valuesResult',valuesResult)
    });
    this.handleCancel();
  }

  // 关闭浮层
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  textChange = (e) => {
  }

  dialogTemplateCtrl = () => {
    const { LiheProDetail: { configData } ,form:{getFieldDecorator}} = this.props;
    return (
      <Modal
        title="写跟进"
        visible={this.state.modalVisible}
        onOk={this.handleModalOk}
        onCancel={this.handleCancel}
        destroyOnClose>
           {getFieldDecorator('textArea')(
        <TextArea placeholder="填写沟通内容（必填）" style={{ resize: 'none', height: '80px' }} onChange={this.textChange} />
        )}
        <div style={{ display: 'flex', height: '40px', lineHeight: '40px', margin: '10px 0 10px 0' }}>
          <p style={{width:'100px'}}>下次跟进时间：</p>
          <div>
          {getFieldDecorator('statusDate')(
            <RangePicker
              ranges={{
                '本周': [moment().startOf('week'), moment().endOf('week')],
              }}
              placeholder={['开始日期', '结束日期']}
              style={{ width: 300 }} />
              )}
          </div>
        </div>
        <div style={{ display: 'flex', height: '40px', lineHeight: '40px', margin: '0px 0 10px 0' }}>
          <p style={{width:'100px'}}>跟进状态：</p>
          <div>
          {getFieldDecorator('activityId')(
            <Select placeholder="跟进状态"
              mode="multiple"
              style={{ width: 300 }}
              optionLabelProp="label">
              {configData.customerFollowStatus && configData.customerFollowStatus.map(item => {
                return <Option value={item.id} label={item.name}>
                  {item.name}
                </Option>
              })}
            </Select>
              )}
            </div>
        </div>
      </Modal>
    )
  }

  render() {
    const { followList, followData } = this.state;
    return (
      <>
        <Row gutter={24}>
          <Col span={16}>
            <div className={styles.container}>
              <div className={styles.titleFontStyle}>基本资料</div>
              <div className={styles.wrap}>
                <div className={styles.content}>
                  <p> <b>客户状态：</b></p>
                  <p> <b>联系电话：</b></p>
                </div>
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.titleFontStyle}>待完成</div>
              <div className={styles.wrap}>
                <div className={styles.content2}>
                  <p> <b>客户咨询</b></p>
                  <p> <b>已完成：</b></p>
                  <p> <b>待完成：</b></p>
                  <p> <b>备注：</b></p>
                </div>
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.titleFontStyle}>合同</div>
              <div className={styles.wrap}>
                <div className={styles.content3}>
                  <p> <b>合同编号</b></p>
                  <p> <b>￥1231231231</b></p>
                  <p> <b>已签单</b></p>
                </div>
              </div>
            </div>

          </Col>
          <Col span={8}>
            <Card style={{ height: 900, overflowY: 'auto' }} >
              <FollowView
                followList={followList}
                followData={followData}
                addFollowCtrl={this.addFollowCtrl}
                getFollowFounction={this.getFollowListFuntion} />
            </Card>
          </Col>
        </Row>
        {this.dialogTemplateCtrl()}
      </>

    );
  }
}
export default Form.create<CustomerConsultProps>()(CustomerPanorama);