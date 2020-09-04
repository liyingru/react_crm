import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import AreaSelect from '@/components/AreaSelect';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import { Spin, Form, Card, Select, Row, Col, Input, Checkbox, Radio, Button, message, Cascader } from 'antd';
import { Action, Dispatch } from 'redux';
import { ConfigList } from "@/pages/CustomerManagement/commondata";
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { StateType } from './model';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;

interface NewGroupProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'newGroup/searchMember'
      | 'newGroup/configCtrl'
      | 'newGroup/addGroup'
    >
  >;
  loading: boolean;
  config: ConfigList;
  newGroup: StateType;
}

interface NewGroupState {
  loading: boolean,
  resetArea: boolean;
  code: string;
  value: number
}



@connect(
  ({
    newGroup,
    loading,
  }: {
    newGroup: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    newGroup,
    loading: loading.models.newGroup,
  }),
)


class NewGroup extends Component<NewGroupProps, NewGroupState> {
  constructor(props: NewGroupProps) {
    super(props);
    // 初始化
    this.state = {
      loading: false,
      resetArea: false,
      code: '',
      value: 0,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newGroup/configCtrl'
    })
    dispatch({
      type: 'newGroup/searchMember'
    });
    dispatch({
      type: 'newGroup/taskConfigCtrl',
    });
  }

  onCategoryChange = (checkedValues: string) => {
    console.log('checked = ', checkedValues);
  }

  citySelectChange = (code: string) => {
    this.props.form.setFieldsValue({
      'areaCode': code
    })
    this.setState({
      code,
    });
  };

  handleStatus = (e: any) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();


    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue,'----fieldsValue')
      const values = {
        name: fieldsValue.name,
        categoryId: fieldsValue.categoryId ? fieldsValue.categoryId.toString() : '',
        channelId: fieldsValue.channelId ? fieldsValue.channelId : '',
        areaCode: fieldsValue.areaCode ? fieldsValue.areaCode.toString() : '',
        membersUserIds: fieldsValue.membersUserIds.toString(),
        status: fieldsValue.status
      };

      dispatch({
        type: 'newGroup/addGroup',
        payload: values,
        callback: (status: boolean, msg: string) => {
          if (status) {
            message.success(msg);
            // form.resetFields();
            // this.setState({
            //   resetArea: true
            // });
            localStorage.setItem('isRefresh','groupsRefresh')
            dispatch(routerRedux.push({
              pathname: '/group/grouphome'
            }))
          }
        }
      });

    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    // 表单重置
    form.resetFields();
    this.setState({
      resetArea: !this.state.resetArea
    });
  };

  render() {
    const { loading } = this.state;
    const {
      form: { getFieldDecorator },
      newGroup: { config, memberData, defaultConfig }
    } = this.props;
    return (
      <>
        <PageHeaderWrapper >
          <div>
            <Spin spinning={loading} size="large" />
          </div>
          <Card className={styles.card} bordered={false}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="组名">
                      {getFieldDecorator('name', { rules: [{ required: true, message: "请输入组名" }], })(<Input style={{ width: '100%', }} placeholder="请输入成员" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={24}>
                    <FormItem label="负责品类：">
                      {getFieldDecorator('categoryId', { rules: [{ required: false, message: "请选择负责品类" }], })(
                        <Checkbox.Group style={{ width: '100%', }} onChange={this.onCategoryChange} >
                          {
                            config.category.map(category => (
                              <Checkbox value={category.id} >{category.name}</Checkbox>))
                          }
                        </Checkbox.Group>

                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="客资来源">
                      {getFieldDecorator('channelId', { rules: [{ required: false, message: "请选择客资来源" }], })(
                        // <Cascader showSearch style={{ width: '100%', }} options={config.channel}  />
                        <Select placeholder="选择客资来源"
                          mode="multiple"
                          style={{ width: '100%', }}
                          optionLabelProp="label">
                          {defaultConfig.leadsAttributeList && defaultConfig.leadsAttributeList.channelList.map(item => <Option value={item.id} label={item.name}>
                            {item.name}
                          </Option>)}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="负责区域：">
                      {getFieldDecorator('areaCode', { trigger: 'citySelectChange', rules: [{ required: false, message: "请选择负责区域" }], })(
                        <CityMultipleSelect reset={this.state.resetArea} />
                        // <AreaSelect
                        //   reset={this.state.resetArea}
                        //   areaSelectChange={this.handleCityChange} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col span={8}>
                    <FormItem label="组成员：">
                      {getFieldDecorator('membersUserIds', { rules: [{ required: true, message: "请添加组成员" }], })(
                        <Select placeholder="选择组成员"
                          showSearch
                          mode="multiple"
                          style={{ width: '100%' }}
                          optionLabelProp="label"
                          filterOption={(input, option) =>
                            option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                          {
                            memberData.map(item => {
                              let itemKey = item.name + item.company_name + item.structure_name;
                              return <Option value={item.id} key={itemKey} label={item.name}>
                                {item.name}&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;{item.company_name}
                        &nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;{item.structure_name}
                              </Option>
                            })
                          }
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                  <Col span={8}>
                    <FormItem label="组状态：">
                      {getFieldDecorator('status', { rules: [{ required: true, message: "请选择组状态" }], })(
                        <Radio.Group onChange={this.handleStatus}>
                          <Radio value={1}>有效</Radio>
                          <Radio value={2}>无效</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 5, xl: 5 }}>
                  <Col span={8}>
                    <FormItem label="创建人：">
                      {JSON.parse(window.localStorage.getItem('gcrm-user-info')).name}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col offset={3}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                      <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                    </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    )
  }
}

export default Form.create<NewGroupProps>()(NewGroup);
