import URL from '@/api/serverAPI.config';
import AreaSelect from '@/components/AreaSelect';
import NumberRangeInput from '@/components/NumberRangeInput';
import OperationLogModalPage from '@/components/OperationLogModal';
import { CategoryConfigItem, ConfigData, CustomerLeadsData, CustomerLeadsListData, ReqButton } from '@/pages/LeadsManagement/leadsDetails/data';
import CrmUtil from '@/utils/UserInfoStorage';
import { Checkbox, DatePicker, Divider, Form, Icon, Input, message, Modal, Radio, Select, Spin, Switch, Table, Tabs, List } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { ColumnProps } from 'antd/lib/table/interface';
import Axios from 'axios';
import moment from 'moment';
import styles from '../../index.less';
import React, { Component, Fragment } from 'react';
import { DistributeCompany, ReceiveUser } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';

const { Option } = Select;
const { TabPane } = Tabs;

interface CustomerLeadsProps extends FormComponentProps {
  onCustomerLeadsRef?: (ref: any) => void;
  customerLeadsListData: CustomerLeadsListData[],
  config: ConfigData;
  //0不可操作（不显示） 1可操作（显示） undefined可操作（默认显示）
  optionable?: number;
  //刷新客户和客户线索列表
  fun_refreshCustomerLeadsAll: (categoryId: string) => void;
  //刷新客户线索列表
  fun_refreshCustomerLeadsList: Function;
  defaultCategoryId: string; //默认切换到的tab
  fun_reqLeadsRender?: Function  //渲染线索单号
  leadsId?: string;//线索主id
  customerId?: string; // 客户id，针对喜铺（因为喜铺是没有主线索的，所以不会有leadsId，只能传进来customer_id）；
  ownerId: string;
  category_num?: any;
}

interface CustomerLeadsState {
  alertLoading: boolean;
  optionLoading: boolean;
  closeModalVisible: boolean,

  optionModalVisible: boolean,
  optionCategoryTitle: string,
  optionCategoryValue: number,
  editReq: CustomerLeadsData | undefined, //编辑的有效单
  optionCategoryType: number, //0为创建， 1为更新

  carBrandType: string[],
  carBrandNum: string[],

  buttonModalVisible: boolean,
  inviteReceiveUser: ReceiveUser[],
  distributeCompany: DistributeCompany[],

  categoryId: string | undefined;

  logModalVisible: boolean,
  logModalLeadId: string,
}

class CustomerLeads extends Component<CustomerLeadsProps, CustomerLeadsState> {

  constructor(props: Readonly<CustomerLeadsProps>) {
    super(props)
    if (this.props.onCustomerLeadsRef != undefined) {
      this.props.onCustomerLeadsRef(this)
    }
  }

  state = {
    alertLoading: false,
    optionLoading: false,
    closeModalVisible: false,

    optionModalVisible: false,
    optionCategoryTitle: "",
    optionCategoryValue: 1,
    editReq: undefined,
    optionCategoryType: 0,

    carBrandType: ['null'],
    carBrandNum: ['null'],

    buttonModalVisible: false,
    inviteReceiveUser: [],
    distributeCompany: [],

    categoryId: undefined,

    logModalVisible: false,
    logModalLeadId: '',
  }

  //创建线索
  createCategoryLeads(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.insertLeads, params).then(
      res => {
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
        this.setState({
          alertLoading: false,
        })
      }
    );
  }

  //更新线索
  updateCategoryLeads(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.updateLeads, params).then(
      res => {
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
        this.setState({
          alertLoading: false,
        })
      }
    );
  }

  //有效
  validCategoryLeads(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.leadsYouXiao, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //待定(退回公海)
  tobeCategoryLeads(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.leadsDaiding, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //无效(退回公海)
  invalidCategoryLeads(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.leadsWuXiao, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //更新线索对话框确认
  handleUpdateOk = () => {
    const { form, config, ownerId } = this.props;
    if (this.state.optionCategoryValue == 0) {
      message.error("品类出错");
      return;
    }
    let formFeilds: string[] = [];
    if (this.state.optionCategoryValue == 1) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'siteType', 'scheduleType', 'hotel', 'perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 2) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 3) {
      formFeilds = ['photoStyle', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 4) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'hotel', 'hotelHall', 'perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 5) {
      formFeilds = ['carTime', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 6) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 7) {
      formFeilds = ['dressUseWay', 'dressType', 'dressModel', 'dressNum', 'budgetFrom', 'budgetEnd'];
    }
    const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    if (categorys && categorys.length == 1 && categorys[0].children) {
      formFeilds.push('finalCategory');
    }
    formFeilds.push('cityCode');
    formFeilds.push('remark');
    if ((CrmUtil.getCompanyType() == 1)) {
      formFeilds.push('needAutoDistribute');
    }
    form.validateFieldsAndScroll(formFeilds, (err, values) => {
      if (err) {
        return;
      }
      if ((CrmUtil.getCompanyType() == 1)) {
        //组装数据
        values['needAutoDistribute'] = !!values['needAutoDistribute'] ? 1 : 0;
      }
      const carTimeForUtc = values['carTime']
      if (carTimeForUtc != undefined) {
        values['carTime'] = moment(carTimeForUtc).format('YYYY-MM-DD HH:mm')
      }
      const dressType: string[] = values['dressType']
      if (dressType != undefined) {
        let types: string = "";
        dressType.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressType.length) {
            types = types + ",";
          }
        })
        values['dressType'] = types;
      }
      const dressModel: string[] = values['dressModel']
      if (dressModel != undefined) {
        let types: string = "";
        dressModel.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressModel.length) {
            types = types + ",";
          }
        })
        values['dressModel'] = types;
      }
      const categoryChild = {
        ...values,
      }
      if (this.state.optionCategoryValue == 5) {
        const carJson: any = [];
        this.state.carBrandType.map((type, index) => {
          const num = this.state.carBrandNum[index];
          if (type != 'null' && num != 'null') {
            const child = {
              carBrand: type,
              carNum: num,
            }
            carJson.push(child)
          }
        })
        categoryChild['carJson'] = carJson;
      }
      const categoryReq = {

      }
      const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
      if (!categorys || categorys.length != 1 || !categorys[0].children) {
        categoryChild['finalCategory'] = this.state.optionCategoryValue
      }
      if (this.state.optionCategoryValue == 1) {
        categoryReq['banquet'] = categoryChild;
      } else if (this.state.optionCategoryValue == 2) {
        categoryReq['wedding'] = categoryChild;
      } else if (this.state.optionCategoryValue == 3) {
        categoryReq['photography'] = categoryChild;
      } else if (this.state.optionCategoryValue == 4) {
        categoryReq['celebration'] = categoryChild;
      } else if (this.state.optionCategoryValue == 5) {
        categoryReq['car'] = categoryChild;
      } else if (this.state.optionCategoryValue == 6) {
        categoryReq['oneStop'] = categoryChild;
      } else if (this.state.optionCategoryValue == 7) {
        categoryReq['dress'] = categoryChild;
      }

      if (this.state.optionCategoryType == 0) { //创建
        const params = {
          customer_id: this.props.customerId,
          leads_id: this.props.leadsId,
          req: categoryReq,
          category: this.state.optionCategoryValue,
          ownerId: ownerId,
        };
        this.createCategoryLeads(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }

          //关闭弹窗和重制
          this.setState({
            optionModalVisible: false,
            optionCategoryTitle: "",
            optionCategoryValue: 1,
            optionCategoryType: 0,
            editReq: undefined,
            carBrandType: ['null'],
            carBrandNum: ['null'],
          })

          message.success(msg);
          this.refreshTagList()
          this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
        });
      } else if (this.state.optionCategoryType == 1) { //更新
        if (!this.state.editReq) {
          message.error("出现未知错误");
          return;
        }
        const params = {
          req: categoryReq,
          leads_id: this.state.editReq?.id,
        };
        this.updateCategoryLeads(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }

          //关闭弹窗和重制
          this.setState({
            optionModalVisible: false,
            optionCategoryTitle: "",
            optionCategoryValue: 1,
            optionCategoryType: 0,
            editReq: undefined,
            carBrandType: ['null'],
            carBrandNum: ['null'],
          })

          message.success('客户线索更新成功');
          this.refreshTagList()
          this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
        });
      }
    });
  }

  refreshTagReset = () => {
    localStorage?.setItem('demandListRefreshTag', 'reset')
    localStorage?.setItem('leadsListRefreshTag', 'reset')
  }

  refreshTagList = () => {
    localStorage?.setItem('demandListRefreshTag', 'list')
    localStorage?.setItem('leadsListRefreshTag', 'list')
  }

  //更新线索对话框取消
  handleUpdateCancel = () => {
    this.setState({
      optionModalVisible: false,
      optionCategoryTitle: "",
      optionCategoryValue: 1,
      optionCategoryType: 0,
      editReq: undefined,
    })
  }

  //增加品牌邀请
  handleAddCarBrand = () => {
    let carBrandType = this.state.carBrandType;
    let carBrandNum = this.state.carBrandNum;
    carBrandType.push('null');
    carBrandNum.push('null');
    this.setState({
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //创建线索
  handleCreateLeads = (name: string, value: number) => {
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 0,
      editReq: undefined,
      carBrandType: ['null'],
      carBrandNum: ['null'],
    })

  }

  //编辑线索
  handleEidtLeads = (name: string, value: number, data: CustomerLeadsData) => {
    let carBrandType: string[] = [];
    let carBrandNum: string[] = [];
    console.log(JSON.stringify(data.car_info))
    if (data.car_info && data.car_info.length > 0) {
      data.car_info.map(info => {
        carBrandType.push(info.carBrand);
        carBrandNum.push(info.carNum);
      })
    }
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 1,
      editReq: data,
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //有效线索
  handleValidLeads = (data: CustomerLeadsData) => {
    this.setState({
      optionLoading: true,
    })
    const params = {
      channelId: data.channel,
      type: '1',
      level: data.level,
      dataId: data.id,
    }
    Axios.post(URL.getXPFlowInfo, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          if (res.data.result.distribute_company.length > 0 || res.data.result.receive_user.length > 0) {
            //打开弹窗
            this.setState({
              inviteReceiveUser: res.data.result.receive_user,
              distributeCompany: res.data.result.distribute_company,
              buttonModalVisible: true,
              editReq: data,
            })
          } else {
            const params = {
              leads_id: data.id,
            };
            this.validCategoryLeads(params, (code: number, msg: string) => {
              if (code != 200) {
                return;
              }
              this.refreshTagList()
              this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
            });
          }
        }
      }
    );
  }

  //待定线索
  handleTobeLeads = (data: CustomerLeadsData) => {
    const params = {
      leads_id: data.id,
    };
    this.tobeCategoryLeads(params, (code: number, msg: string) => {
      if (code != 200) {
        return;
      }
      message.success('待定成功')
      this.refreshTagList()
      this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
    });
  }

  //无效线索
  handleInvalidLeads = (data: CustomerLeadsData) => {
    this.setState({
      closeModalVisible: true,
      editReq: data,
    })
  }

  //日志打开
  handleOpenLogModal = (data: CustomerLeadsData) => {
    this.setState({
      logModalVisible: true,
      logModalLeadId: data.id?.toString(),
    })
  }

  //日志关闭
  handleCloseLogModal = () => {
    this.setState({
      logModalVisible: false,
      logModalLeadId: '',
    })
  }

  //按钮操作
  /**
   * 125编辑
   * 100有效
   * 105待定
   * 110无效
   * 120无效原因
   * 115日志
   * 
   */
  handleButton = (record: CustomerLeadsData, button: ReqButton) => {
    if (button.type == 125) {  //编辑
      let type = record.top_category
      let name = '编辑婚宴意向'
      if (type == 1) {
        name = '编辑婚宴意向'
      } else if (type == 2) {
        name = '编辑婚庆意向'
      } else if (type == 3) {
        name = '编辑婚纱摄影意向'
      } else if (type == 4) {
        name = `编辑${React.$celebrationOrWeddingBanquet()}意向`
      } else if (type == 5) {
        name = '编辑婚车意向'
      } else if (type == 6) {
        name = '编辑一站式意向'
      } else if (type == 7) {
        name = '编辑婚纱礼服意向'
      }
      this.handleEidtLeads(name, type, record)
    } else if (button.type == 100) {  //有效
      this.handleValidLeads(record)
    } else if (button.type == 105) {  //待定
      this.handleTobeLeads(record)
    } else if (button.type == 110) {  //无效
      this.handleInvalidLeads(record)
    } else if (button.type == 120) {  //关闭原因
      this.handleCloseLeadsAlert(button.name, record)
    } else if (button.type == 115) {  //日志
      this.handleOpenLogModal(record)
    }
  }

  //确定
  handleButtonOk = () => {
    const { form } = this.props;
    let formFeilds: string[] = ['user_id', 'company'];
    form.validateFields(formFeilds, (err, values) => {
      if (err) {
        return;
      }
      const params = {
        ...values,
        leads_id: this.state.editReq?.id,
      };
      this.setState({
        alertLoading: true,
      })
      Axios.post(URL.leadsYouXiao, params).then(
        res => {
          if (res.code == 200) {
            //关闭弹窗和重制
            this.setState({
              buttonModalVisible: false,
              editReq: undefined,
              inviteReceiveUser: [],
              distributeCompany: [],
            })
            this.refreshTagList()
            this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
          }
          this.setState({
            alertLoading: false,
          })
        }
      );
    });
  }

  //取消
  handleButtonCancel = () => {
    this.setState({
      buttonModalVisible: false,
      editReq: undefined,
      inviteReceiveUser: [],
      distributeCompany: [],
    })
  }

  //无效确认
  handleCloseReqOk = () => {
    const { form } = this.props;
    let formFeilds: string[] = ['reason'];
    form.validateFields(formFeilds, (err, values) => {
      if (err) {
        message.error('请填写无效原因');
        return;
      }
      const params = {
        ...values,
        id: this.state.editReq?.id,
      };
      this.invalidCategoryLeads(params, (code: number, msg: string) => {
        if (code != 200) {
          return;
        }
        this.setState({
          closeModalVisible: false,
          editReq: undefined,
        })
        this.refreshTagList()
        this.props.fun_refreshCustomerLeadsAll(this.state.categoryId);
      });
    });
  }

  //无效取消
  handleCloseReqCancel = () => {
    this.setState({
      closeModalVisible: false,
      editReq: undefined,
    })
  }

  //无效原因说明提示
  handleCloseLeadsAlert = (title: string, data: CustomerLeadsData) => {
    Modal.info({
      title: title,
      okText: '知道了',
      content: data.return_reason,
      centered: true,
      onOk() { },
    });
  }

  handleCityChange = (code: string, province: string, city: string, district: string) => {
    const { form } = this.props;
    form.setFieldsValue({
      cityCode: code
    });
  }

  renderTable = (details: CustomerLeadsListData) => {
    /**
     * 当前支持类型1-7
     * 服务器增加类型涉及的改动
     * 1、该处放开到适定范围
     * 2、新建和编辑的标题文案增加
     * 3、table表colums适配
     * 4、编辑弹窗属性适配
     */
    if (details.category_id < 1 || details.category_id > 7) {
      return null
    }
    return (

      // <Table
      //   scroll={{ x: 'max-content' }}
      //   size={"middle"}
      //   pagination={false}
      //   columns={this.createColums(details.category_id)}
      //   dataSource={details.data} />

      <List
        size="small"
        bordered
        dataSource={details.data}
        renderItem={item => <List.Item>
          <div>
            <div className={styles.itemWrapper}>
              {
                item.show_array && item.show_array.map(value =>
                  <div style={{ width: '33.3%', marginBottom: 5 }}>{value}</div>
                )
              }
            </div>
            <div style={{ float: "right" }}>
              {
                this.renderOption(item)
              }
            </div>
          </div>
        </List.Item>}
      />
    );
  }

  renderGroup = (reqDataList: CustomerLeadsListData[]) => {
    return (
      reqDataList.map(details => (
        this.renderTable(details)
      ))
    );
  }

  render() {
    const { form, config, reqGroupDetails, defaultCategoryId, customerLeadsListData } = this.props;
    const { getFieldDecorator } = form;

    this.state.categoryId = this.state.categoryId ? this.state.categoryId : defaultCategoryId
    return (
      <div>
        <Spin spinning={this.state.optionLoading}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div />
            <OperationLogModalPage
              onCancel={this.handleCloseLogModal}
              visible={this.state.logModalVisible}
              type={'1'}
              id={this.state.logModalLeadId}
            />
            <Modal
              title={'接受对象'}
              visible={this.state.buttonModalVisible}
              onOk={this.handleButtonOk}
              destroyOnClose={true}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              onCancel={this.handleButtonCancel}>
              <Spin spinning={this.state.alertLoading}>
                <Form>
                  {
                    this.state.inviteReceiveUser && this.state.inviteReceiveUser.length > 0 ?
                      <FormItem label="指定邀约" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        <div style={{ marginLeft: 5 }} >
                          {
                            getFieldDecorator('user_id', {
                              rules: [{ required: CrmUtil.getCompanyType() == 2 ? false : true, message: '请选择指定邀约' }],
                            })(
                              <Select
                                allowClear
                                showSearch
                                placeholder={"请选择指定邀约"}
                                optionFilterProp="children">
                                {
                                  this.state.inviteReceiveUser && this.state.inviteReceiveUser.map(item => (
                                    <Option value={item.id}>
                                      {item.name}
                                    </Option>
                                  )
                                  )
                                }
                              </Select>
                            )
                          }
                        </div>
                      </FormItem>
                      : null
                  }
                  {
                    this.state.distributeCompany && this.state.distributeCompany.length > 0 ?
                      <FormItem label="派发公司" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        <div style={{ marginLeft: 5 }} >
                          {
                            getFieldDecorator('company', {
                              rules: [{ required: true, message: '请选择派发公司' }],
                            })(
                              <Select
                                allowClear
                                showSearch
                                placeholder={"请选择派发公司"}
                                optionFilterProp="children">
                                {
                                  this.state.distributeCompany && this.state.distributeCompany.map(item => (
                                    <Option value={item.id}>
                                      {item.name}
                                    </Option>
                                  )
                                  )
                                }
                              </Select>
                            )
                          }
                        </div>
                      </FormItem>
                      : null
                  }
                </Form>
              </Spin>
            </Modal>
            <Modal
              title={"无效原因"}
              visible={this.state.closeModalVisible}
              onOk={this.handleCloseReqOk}
              destroyOnClose={true}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              onCancel={this.handleCloseReqCancel}>
              <Spin spinning={this.state.alertLoading}>
                <Form>
                  {getFieldDecorator('reason', {
                    rules: [{ required: true, message: '请输入无效原因' }],
                  })(
                    <TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder="请输入无效原因" />
                  )}
                </Form>
              </Spin>
            </Modal>
            <Modal
              title={this.state.optionCategoryTitle}
              visible={this.state.optionModalVisible}
              onOk={this.handleUpdateOk}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              destroyOnClose={true}
              width={600}
              onCancel={this.handleUpdateCancel}>
              <Spin spinning={this.state.alertLoading}>
                <Form>
                  {
                    this.renderHaveCategory2()
                  }
                  <FormItem label="意向区域" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    <div style={{ marginLeft: 5 }} >
                      {getFieldDecorator('cityCode', {
                        rules: [{ required: true, message: "请选择意向区域", }],
                        initialValue: ''
                      })(
                        <AreaSelect areaSelectChange={this.handleCityChange} level3={true} selectedCode={this.state.editReq ? this.state.editReq.city_code : undefined} />
                      )}
                    </div>
                  </FormItem>

                  {
                    (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? <FormItem label="婚礼风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('weddingStyle', {
                        initialValue: this.state.editReq ? this.state.editReq.wedding_style : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.weddingStyle) ? config.weddingStyle.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 3) ? <FormItem label="拍照风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('photoStyle', {
                        initialValue: this.state.editReq ? this.state.editReq.photo_style : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.photoStyle) ? config.photoStyle.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6 || this.state.optionCategoryValue == 4) ? <FormItem label={(this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? "婚礼桌数" : "举办桌数"} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'hotelTablesFrom'} maximumField={'hotelTablesEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_end) : undefined} />
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1) ? <FormItem label="场地类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('siteType', {
                        initialValue: this.state.editReq ? this.state.editReq.site_type : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.siteType) ? config.siteType.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1) ? <FormItem label="档期类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('scheduleType', {
                        initialValue: this.state.editReq ? this.state.editReq.schedule_type : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.scheduleType) ? config.scheduleType.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                      <FormItem label="预定酒店" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('hotel', {
                          initialValue: this.state.editReq ? this.state.editReq.hotel : '',
                        })(
                          <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                        )}
                      </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                      <FormItem label="宴会厅" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('hotelHall', {
                          initialValue: this.state.editReq ? this.state.editReq.hotel_hall : '',
                        })(
                          <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                        )}
                      </FormItem> : null
                  }
                  {
                    this.state.optionCategoryValue == 5 ? <FormItem label="用车时间" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('carTime', {
                        initialValue: (this.state.editReq && this.state.editReq.car_time != '') ? moment(this.state.editReq.car_time, 'YYYY-MM-DD HH:mm') : undefined,
                      })(
                        <DatePicker style={{ marginLeft: 5 }}
                          format="YYYY-MM-DD HH:mm"
                          showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                          placeholder='请选择用车时间' />
                      )}
                    </FormItem> : null
                  }
                  {
                    this.state.optionCategoryValue == 5 ? <FormItem label="品牌要求" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {
                        this.renderCarBrand()
                      }
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="使用方式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressUseWay', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_use_way : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressUseWay) ? config.dressUseWay.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="服饰类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressType', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_type?.split(',').map(Number) : undefined,
                      })(
                        <Checkbox.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressType) ? config.dressType.map(style => (
                              <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                          }
                        </Checkbox.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="礼服款式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressModel', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_model?.split(',').map(Number) : undefined,
                      })(
                        <Checkbox.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressModel) ? config.dressModel.map(style => (
                              <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                          }
                        </Checkbox.Group>
                      )}
                    </FormItem> : null
                  }
                  {(this.state.optionCategoryValue == 7) ? <FormItem label="礼服数量" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('dressNum', {
                      initialValue: this.state.editReq ? this.state.editReq.dress_num : '',
                    })(
                      <Input autoComplete="off" maxLength={5} style={{ width: '100%', marginLeft: 5 }} suffix="套" placeholder="请输入" />
                    )}
                  </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) && <FormItem label="每桌预算" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'perBudgetFrom'} maximumField={'perBudgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.per_budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.per_budget_end) : undefined} />
                    </FormItem>
                  }
                  {
                    <FormItem label={this.state.optionCategoryValue == 1 ? "婚宴预算" : this.state.optionCategoryValue == 2 ? "婚庆预算" : this.state.optionCategoryValue == 3 ? "婚纱摄影预算" : this.state.optionCategoryValue == 4 ? `${React.$celebrationOrWeddingBanquet()}预算` : this.state.optionCategoryValue == 5 ? "婚车预算" : this.state.optionCategoryValue == 6 ? "整体预算" : this.state.optionCategoryValue == 7 ? "婚服预算" : ""} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'budgetFrom'} maximumField={'budgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.budget_end) : undefined} />
                    </FormItem>
                  }
                  <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('remark', {
                      initialValue: this.state.editReq ? this.state.editReq.remark : '',
                    })(
                      <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  {
                    CrmUtil.getCompanyType() == 1 ?
                      <FormItem label="是否自动分配" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('needAutoDistribute', {
                          rules: [{ required: false }],
                          valuePropName: "checked",
                          initialValue: this.state.editReq?.need_auto_distribute == 0 ? false : true
                        })(
                          <Switch style={{ marginLeft: 5 }} size="default" />
                        )}
                      </FormItem>
                      :
                      null
                  }
                </Form>
              </Spin>
            </Modal>
          </div>
          {
            this.renderCategoryTab()
          }
          {
            this.renderGroup(customerLeadsListData)
          }
        </Spin>
      </div >
    );
  };

  renderCategoryTab() {
    const { config, category_num, defaultCategoryId } = this.props;
    let realcate: any[] = []
    if (category_num?.leads_category_num && config.category && config.category.length > 0) {
      var map = new Map()
      category_num.leads_category_num.forEach(element => {
        map.set(element.id, element.num)
      });
      config.category.forEach(element => {
        if (map.has(element.id)) {
          let temp = map.get(element.id)
          // temp = temp > 0?1:0
          realcate.push({
            ...element,
            num: temp,
          })
        }
      })
    }
    if (realcate.length == 0) {
      realcate = config.category
    }

    // 喜铺、尼克、蘭、北京数据中心  在详情页中不显示“婚纱礼服”品类  2020-5-25 by杨玉
    if (CrmUtil.getCompanyType() == 2) {
      realcate = realcate.filter(cate => cate.id + "" != "7");
    }

    return (
      realcate && realcate.length > 0 && this.state.categoryId && (
        <Tabs activeKey={this.state.categoryId + ''} onChange={this.changeCategory}>
          {
            realcate.map(categ => (
              <TabPane tab={categ.name + '(' + categ.num + ')'} key={categ.id} />
            ))
          }
        </Tabs >
      )
    )
  }

  changeCategory = (categoryId: string) => {
    this.setState({
      categoryId,
    }, () => {
      setTimeout(() => {
        this.props.fun_refreshCustomerLeadsList(this.state.categoryId)
      }, 300)
    })
  }

  renderHaveCategory2() {
    const { config } = this.props;
    const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    return (
      categorys && categorys.length == 1 && categorys[0].children ? this.renderCategory2(categorys[0].children) : null
    );
  }

  renderCategory2(category2: CategoryConfigItem[]) {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(category2);
    return (
      category2 ? <FormItem label="二级品类" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
        {getFieldDecorator('finalCategory', {
          initialValue: this.state.editReq ? this.state.editReq.final_category : undefined,
          rules: [{ required: true, message: '请选择二级品类' }],
        })(
          <Radio.Group style={{ marginLeft: 5 }} disabled={this.state.optionCategoryType == 0 ? false : true}>
            {
              category2.map(style => (<Radio value={style.value}>{style.label}</Radio>))
            }
          </Radio.Group>
        )}
      </FormItem> : null
    );
  }

  renderCarBrand() {
    return (
      <div>
        {
          this.state.carBrandType.map((title, index) =>
            this.renderCarBrandItem(index, this.state.carBrandType.length)
          )
        }
        <a onClick={this.handleAddCarBrand} style={{ marginBottom: '0px', marginTop: '0px' }}> <Icon type="plus" />添加</a>
      </div>
    );
  }
  renderCarBrandItem(index: number, length: number) {
    const { config } = this.props;

    let defaultTypeValue: string | undefined;
    let defaultNumValue: string | undefined;
    console.log(this.state.carBrandType);
    console.log(this.state.carBrandNum);
    if (this.state.carBrandType && this.state.carBrandType.length > index && this.state.carBrandType[index] != 'null') {
      defaultTypeValue = this.state.carBrandType[index]
    }
    if (this.state.carBrandNum && this.state.carBrandNum.length > index && this.state.carBrandNum[index] != 'null') {
      defaultNumValue = this.state.carBrandNum[index]
    }
    console.log("defaultTypeValue:" + defaultTypeValue + "---defaultNumValue:" + defaultNumValue)
    return (
      <div>
        {
          <FormItem label="用车品牌" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <Select placeholder="请选择" style={{ marginLeft: 5 }} defaultValue={defaultTypeValue} onChange={(value: string) => {
              let carBrandType = this.state.carBrandType;
              carBrandType.splice(index, 1, value)
              this.setState({
                carBrandType: carBrandType,
              })
            }}>
              {
                (config && config.carBrand) ? config.carBrand.map(style => (
                  <Option key={style.id} value={style.id + ""}>{style.name}</Option>)) : null
              }
            </Select>
          </FormItem>
        }
        {
          <FormItem label="用车数量" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <Input placeholder="请输入" style={{ marginLeft: 5 }} value={defaultNumValue} onChange={(e) => {
              const { value } = e.target;
              let carBrandNum = this.state.carBrandNum;
              carBrandNum.splice(index, 1, value)
              this.setState({
                carBrandNum: carBrandNum,
              })
            }} />
          </FormItem>
        }
        {
          index < length - 1 ? <Divider style={{ marginBottom: '15px', marginTop: '15px' }} /> : null
        }
      </div>
    );
  }

  /**
  * @param title 
  * @param dataIndex 
  */
  createColum = (title: string | React.ReactNode, dataIndex: string): ColumnProps<CustomerLeadsData> => {
    const { fun_reqLeadsRender } = this.props
    const colum: ColumnProps<CustomerLeadsData> = {
      title,
      dataIndex,
    }
    if (dataIndex == 'city_info') {
      return {
        ...colum,
        render: (text: any, record: CustomerLeadsData) => {
          return (<div>{text?.full}</div>)
        },
      }
    } else if (dataIndex == 'options') {
      return {
        ...colum,
        fixed: 'right',
        render: (text: any, record: CustomerLeadsData) => {
          return (<div>
            {
              this.renderOption(record)
            }
          </div>)
        },
      }
    } else if (dataIndex == 'id') {
      return {
        ...colum,
        render: (text: any, record: CustomerLeadsData) => fun_reqLeadsRender ? fun_reqLeadsRender(text, record) : <div>{text}</div>
      }
    }
    return colum
  }

  /**
   * @param categoryId 1婚宴 2婚庆 3婚纱摄影 4庆典(喜宴) 5婚车 6一站式 7婚纱礼服
   */
  createColums = (categoryId: number): ColumnProps<CustomerLeadsData>[] => {
    const { optionable } = this.props
    const columns: ColumnProps<CustomerLeadsData>[] = [];
    columns.push(this.createColum('线索编号', 'id'));
    columns.push(this.createColum('业务品类', 'final_category_txt'));
    columns.push(this.createColum('意向区域', 'city_info'));
    if (categoryId == 1) {    //婚宴
      columns.push(this.createColum('婚礼桌数', 'hotel_tables'));
      columns.push(this.createColum('场地类型', 'site_type_txt'));
      columns.push(this.createColum('档期类型', 'schedule_type_txt'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('婚宴预算', 'budget'));
    } else if (categoryId == 2) {   //婚庆
      columns.push(this.createColum('举办桌数', 'hotel_tables'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('婚庆预算', 'budget'));
    } else if (categoryId == 3) {   //婚纱摄影
      columns.push(this.createColum('拍照风格', 'photo_style_txt'));
      columns.push(this.createColum('婚摄预算', 'budget'));
    } else if (categoryId == 4) {   //庆典(喜宴)
      columns.push(this.createColum('举办桌数', 'hotel_tables'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum(`${React.$celebrationOrWeddingBanquet()}预算`, 'budget'));
    } else if (categoryId == 5) {   //婚车
      columns.push(this.createColum('用车时间', 'car_time'));
      columns.push(this.createColum('选择品牌', 'car_brand'));
      columns.push(this.createColum('用车数量', 'car_num'));
      columns.push(this.createColum('婚车预算', 'budget'));
    } else if (categoryId == 6) {   //一站式
      columns.push(this.createColum('婚礼风格', 'wedding_style_txt'));
      columns.push(this.createColum('婚礼桌数', 'hotel_tables'));
      columns.push(this.createColum('特定酒店', 'hotel'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('整体预算', 'budget'));
    } else if (categoryId == 7) {   //婚纱礼服
      columns.push(this.createColum('使用方式', 'dress_use_way_txt'));
      columns.push(this.createColum('服饰类型', 'dress_type_txt'));
      columns.push(this.createColum('礼服款式', 'dress_model_txt'));
      columns.push(this.createColum('礼服数量', 'dress_num'));
      columns.push(this.createColum('婚服预算', 'budget'));
    }
    columns.push(this.createColum('跟进标签', 'status_txt'));
    columns.push(this.createColum('备注', 'remark'));
    columns.push(this.createColum('提供人', 'referrer_name'));
    columns.push(this.createColum('创建时间', 'create_time'));

    //显示操作列
    if ((optionable == undefined || optionable == 1)) {
      columns.push(this.createColum('操作', 'options'));
    }
    return columns;
  }

  renderOption = (record: CustomerLeadsData) => {
    let options: any[] = [];
    this.renderButtons(record, options)
    return (
      <Fragment>
        {
          options.map((value, index) => {
            if (index == 0) {
              return value
            } else {
              return (
                <Fragment>
                  <Divider type="vertical" />
                  {
                    value
                  }
                </Fragment>
              )
            }
          })
        }
      </Fragment>
    )
  }

  renderButtons = (record: CustomerLeadsData, options: any[]) => {
    if (record.buttons && record.buttons.length > 0) {
      record.buttons.map((value, index) => {
        value.echo != undefined && value.echo ?
          options.push(<a style={{ color: 'grey' }} onClick={() => this.handleButton(record, value)}>{value.name}</a>)
          :
          options.push(<a onClick={() => this.handleButton(record, value)}>{value.name}</a>)
      })
    }
  }

}
export default Form.create<CustomerLeadsProps>()(CustomerLeads);
