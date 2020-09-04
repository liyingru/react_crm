import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Spin, Form, message, Cascader, Select, Input, Icon, Radio, Button, Checkbox } from 'antd';
import { StateType } from './model';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from "@/components/AreaSelect";
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { CityInfo } from './data';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import Axios from 'axios';
import URL from '@/api/serverAPI.config';
const { Option } = Select;
export interface Attrs {
  name: string[];
  enable: boolean;
  disable: boolean;
  isEditing: boolean;
  citycode?: string;
}

export interface Options {
  id: number;
  value: string;
}

interface GroupDetailProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'groupDetail/getDetails'
      | 'groupDetail/taskConfigCtrl'
      | 'groupDetail/getUpdate'
      | 'groupDetail/deletGroupReq'
    >
  >;
  loading: boolean;
  groupDetail: StateType;
}

interface GroupDetailState {
  loading: boolean,
  itemAttrs: Attrs[];
  _code: string;
  statusOptions: Options[];
  resetArea: boolean;
  detailData: {},
}

interface MemberState {
  name: string,
  id: number,
  job_number: string,
  company_name: string,
  structure_name: string
}

@connect(
  ({
    groupDetail,
    loading,
  }: {
    groupDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    groupDetail,
    loading: loading.models.groupDetail,
  }),
)

class GroupDetail extends Component<GroupDetailProps, GroupDetailState, MemberState>{

  attrs: Attrs[] = [{
    name: ['name'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['leader'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['categoryId'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['channelId'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['areaCode'],
    enable: true,
    disable: true,
    isEditing: false,
    citycode: '100000',
  }, {
    name: ['status'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['membersUserIds'],
    enable: true,
    disable: true,
    isEditing: false,
  }, {
    name: ['create_by'],
    enable: false,
    disable: false,
    isEditing: false,
  }, {
    name: ['create_time'],
    enable: true,
    disable: true,
    isEditing: false,
  }]


  constructor(props: GroupDetailProps) {
    super(props);
    //初始化
    this.state = {
      loading: false,
      itemAttrs: this.attrs,
      _code: '',
      resetArea: false,
      detailData: {},
      statusOptions: [
        { id: 1, value: '有效' },
        { id: 2, value: '冻结' },
      ]
    }
  }

  memberAllData: MemberState = {
    name: '',
    id: 0,
    job_number: '',
    company_name: '',
    structure_name: ''
  }


  formatDefaultInput = (propName: string | undefined) => {
    if (propName != undefined && propName != null) {
      return propName
    }
    return null
  }

  // formatDefaultCode = (cityinfo?: CityInfo) => {
  //   if (cityinfo) {  //if(a) 可以过滤 undefined ，null，空字符串，0
  //     if (cityinfo.city_code) {
  //       return cityinfo.city_code
  //     }
  //   }
  //   return '100000'
  // }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    // this.props.groupDetail.detailData.area_code = []

    Axios.post(URL.groupMember)
      .then(
        res => {
          if (res.code == 200) {
            this.memberAllData = res.data.result;
          }
        }
      );

    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            this.configData = res.data.result;
          }
        }
      );

    dispatch({
      type: 'groupDetail/taskConfigCtrl',
    });

    this.initFetch(id)

  };

  initFetch = (id: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupDetail/getDetails',
      payload: {
        groupId: id,
      },
      callback: (res: any) => {
        this.setState({
          detailData: res.data.result,
          _code: res.data.result.area_code,
          itemAttrs: this.attrs,
          loading: false
        })
      }
    });
  }

  citySelectChange = (codes: string) => {
    this.setState({
      _code: codes
    })
  };

  editClick = (item: Attrs) => {
    const { itemAttrs } = this.state;
    this.props.form.resetFields()
    let attrs = itemAttrs.map(value => {
      let attr = { ...value }
      if (attr.name == item.name && attr.enable) {
        attr.disable = false
        attr.isEditing = true
      } else {
        attr.disable = true
        attr.isEditing = false
      }
      return attr;
    })
    this.setState({
      itemAttrs: attrs,
      loading: false,
    })
  }

  closeClick = (item: Attrs) => {
    this.props.form.resetFields()
    this.setState({
      itemAttrs: this.attrs,
      loading: false,
    })
    if (item.name[0] === 'areaCode') {
      window.location.reload()
    }
  }

  checkClick = (item: Attrs) => {
    const { form, dispatch } = this.props;
    const { detailData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let params = {
        ...fieldsValue,
        areaCode: fieldsValue && fieldsValue.areaCode && fieldsValue.areaCode.toString()
      }

      params['groupId'] = detailData.id
      this.setState({
        loading: true
      })

      dispatch({
        type: 'groupDetail/getUpdate',
        payload: params,
        callback: (status: boolean, msg: string) => {
          if (status) {
            message.success(msg)
            this.initFetch(detailData.id)
          }
        }
      });
    })
  }

  // 返回
  backGroup = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/group/grouphome'
    }))
    localStorage.setItem('isRefresh', 'groupIsRefresh')
  }

  // 删除
  deleteGroupCtrl = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'groupDetail/deletGroupReq',
      payload: {
        groupId: id,
      },
      callback: (data: any) => {
        if (data.code == 200) {
          message.success('删除成功');
          history.back();
          localStorage.setItem('isRefresh', 'groupIsRefresh')
        }
      }
    });
  }

  render() {
    let { loading, itemAttrs, statusOptions, detailData } = this.state;
    console.log(detailData.area_code)
    const { groupDetail: { defaultConfig }, form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const operateArea = (index: number) => {
      let item = itemAttrs[index];
      return !item.enable ? '' : (
        item.isEditing ? (<div className={styles.editingIcon}>
          <Icon type={'check'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.checkClick(item)} />
          <Icon type={'close'} style={{ fontSize: 20, marginLeft: 20 }} onClick={() => this.closeClick(item)} />
        </div>) : <Icon type={'edit'} style={{ fontSize: 20, marginLeft: 20, marginTop: 7 }} onClick={() => this.editClick(item)} />)

    }

    return (
      <PageHeaderWrapper content="分组管理/分组详情" className={styles.main}>
        <Spin spinning={loading} size="large">
          <Form {...formItemLayout} layout='horizontal'>
            <Form.Item label="组名">
              <div style={{ display: 'flex' }}>
                {getFieldDecorator(itemAttrs[0].name[0], {
                  rules: [{ required: true, message: "请输入组名" }],
                  initialValue: this.formatDefaultInput(detailData.name),
                })(<Input style={{ width: '40%' }} placeholder="请输入组名" disabled={itemAttrs[0].disable} />)}
                {operateArea(0)}
              </div>
            </Form.Item>
            <Form.Item label="负责人">
              <div style={{ display: 'flex' }}>
                {getFieldDecorator(itemAttrs[1].name[0], {
                  initialValue: this.formatDefaultInput(detailData.leader),
                })(<Input style={{ width: '40%' }} placeholder="请输入负责人" disabled={itemAttrs[1].disable} />)}
                {operateArea(1)}
              </div>
            </Form.Item>
            <Form.Item label="负责品类">
              <div style={{ display: 'flex', marginTop: 10 }}>
                {getFieldDecorator(itemAttrs[2].name[0], {
                  initialValue: detailData.category_id,
                  rules: [{
                    required: false,
                    message: '请选择负责品类'
                  }]
                })(<Checkbox.Group disabled={itemAttrs[2].disable}>
                  {
                    this.configData && this.configData.category.map(item => {
                      return <Checkbox value={item.id}>{item.name}</Checkbox>
                    })
                  }
                </Checkbox.Group>)}
                {operateArea(2)}
              </div>
            </Form.Item>
            <Form.Item label="客资来源">
              <div style={{ display: 'flex' }}>
                {getFieldDecorator(itemAttrs[3].name[0], {
                  initialValue: detailData.channel,
                  rules: [{
                    required: false,
                    message: "请选择客资来源"
                  }]
                })(
                  <Select placeholder="选择客资来源"
                    mode="multiple"
                    style={{ width: '55%', }}
                    disabled={itemAttrs[3].disable}
                    optionLabelProp="label">
                    {defaultConfig.leadsAttributeList && defaultConfig.leadsAttributeList.channelList.map(item => <Option value={item.id} label={item.name}>
                      {item.name}
                    </Option>)}
                  </Select>,
                )}
                {operateArea(3)}
              </div>
            </Form.Item>
            <Form.Item label="负责区域">
              {JSON.stringify(detailData) != '{}' ?
                <div style={{ width: '60%', display: "flex" }}>
                  {getFieldDecorator(itemAttrs[4].name[0], {
                    // initialValue: detailData.area_code,
                    trigger: 'citySelectChange',
                    getValueFromEvent: (...rest) => {
                      return rest
                    }
                  })(
                    <CityMultipleSelect
                      reset={this.state.resetArea}
                      selectedCodes={detailData && detailData.area_code ? (detailData.area_code).toString().split(',') : []}
                      disabled={itemAttrs[4].disable} />
                  )}
                  {operateArea(4)}
                </div> : null}
            </Form.Item>
            <Form.Item label="组状态">
              <div style={{ display: 'flex' }}>
                {getFieldDecorator(itemAttrs[5].name[0], {
                  rules: [{ required: true, message: "请选择组状态" }],
                  initialValue: detailData.status,
                })(<Radio.Group disabled={itemAttrs[5].disable}>
                  {statusOptions && statusOptions.map(item => {
                    return <Radio value={item.id}>{item.value}</Radio>
                  })}
                </Radio.Group>,
                )}
                {operateArea(5)}
              </div>
            </Form.Item>
            <Form.Item label="组成员">
              <div style={{ width: '60%', display: "flex" }}>
                {getFieldDecorator(itemAttrs[6].name[0], {
                  rules: [{ required: true, message: "请添加组成员" }],
                  initialValue: detailData.members_user_ids,
                })(<Select placeholder="选择组成员"
                  disabled={itemAttrs[6].disable}
                  mode="multiple"
                  style={{ width: '100%' }}
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                  {Array.from(this.memberAllData).map(item => {
                    let itemKey = item.name + item.company_name + item.structure_name;
                    return <Option value={item.id} key={itemKey} label={item.name}>
                      {item.name}&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;{item.company_name}
                        &nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;{item.structure_name}
                    </Option>
                  })}
                </Select>)}
                {operateArea(6)}
              </div>
            </Form.Item>
            <Form.Item label="创建人">
              {getFieldDecorator(itemAttrs[7].name[0], {
                initialValue: this.formatDefaultInput(detailData.create_by),
              })(<span>{detailData.create_by}</span>)}
            </Form.Item>
            <Form.Item label="创建时间">
              {getFieldDecorator(itemAttrs[8].name[0], {
                initialValue: this.formatDefaultInput(detailData.create_time),
              })(<span>{detailData.create_time}</span>)}
            </Form.Item>
          </Form>
          <div className={styles.journal}>
            <h4>历史操作日志：</h4>
            <ul>
              <li className={styles.title}>
                <span>操作时间</span>
                <span>操作人</span>
                <span>操作内容</span>
              </li>
            </ul>
            <div style={{ overflowY: 'auto', maxHeight: 300, marginBottom: 20 }}>
              <ul>
                {detailData.logs && detailData.logs.map(item => {
                  return (
                    <li className={styles.content}>
                      <span>{item.create_time}</span>
                      <span>{item.create_by}</span>
                      <span>{item.content}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div style={{ textAlign: 'center', paddingBottom: 20 }}>
              <Button type="primary" onClick={this.backGroup}>
                返回
              </Button>
              <Button type="primary" onClick={this.deleteGroupCtrl} style={{ marginLeft: 80 }}>
                删除
              </Button>
            </div>
          </div>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<GroupDetailProps>()(GroupDetail);
