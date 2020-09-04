import { RequirementData, RequirementBean, RequirementUser } from "../../dxl/data";
import { Component, ChangeEventHandler } from "react";
import React from "react";
import getCategoryColumn, { ConfigListItem, ConfigList } from "@/pages/CustomerManagement/commondata";
import Table, { ColumnProps } from "antd/lib/table";
import Divider from "antd/lib/divider";
import styles from "./index.less";
import { Dropdown, Button, Menu, Form, Modal, Input, Select, message, DatePicker } from "antd";
import { FormComponentProps, ValidationRule } from "antd/es/form";
import AreaSelect from "@/components/AreaSelect";
import moment from "moment";
import CrmUtil from "@/utils/UserInfoStorage";
import CrmUtil from "@/utils/UserInfoStorage";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

export interface RequirementPros extends FormComponentProps {
  showStyle: number;
  config: ConfigList;
  requirementData: RequirementUser;
  onRecommClick: (data: RequirementBean) => void;
  onChanged: (bean: RequirementBean, callback: () => void) => void;
  onRef: (ref: any) => void;
  currentUserInfo: any
}

export interface RequirementState {
  modelVisible: boolean;
  closeModeVisible: boolean;
  requirment: RequirementBean | undefined;
  category: string;
  remark: any;
}


class RequirementInfo extends Component<RequirementPros, RequirementState>{

  constructor(props: Readonly<RequirementPros>) {
    super(props)
    this.props.onRef(this)
  }

  state: RequirementState = {
    modelVisible: false,
    closeModeVisible: false,
    requirment: undefined,
    category: '1',
    remark: '',
  }

  findCategoryBean = (catId: string) => {
    const { category2 } = this.props.config
    category2.forEach(item => {
      if (item.value == catId) {
        return item
      }
      if (item.children) {
        item.children.forEach(child => {
          if (child.pid = catId) {
            return item
          }
        })
      }
    })
    return { value: '1', label: '婚宴' }
  }

  categoryClick = (item: ConfigListItem) => {
    this.state.category = item.id;
    this.state.requirment = undefined;
    this.setModalVisible(true)
  }

  submitData = () => {
    const { form, onChanged } = this.props;
    const { requirment } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let params = {
        ...fieldsValue,
      }
      let arrivalTime = fieldsValue['estArrivalTime'];
      if (arrivalTime != undefined && arrivalTime != "") {
        params['estArrivalTime'] = arrivalTime.format('YYYY-MM-DD HH:mm:ss');
      }
      let photoTime = fieldsValue['photoTime'];
      if (photoTime != undefined && photoTime != "") {
        params['photoTime'] = photoTime.format('YYYY-MM-DD HH:mm:ss');
      }
      let carTime = fieldsValue['carTime'];
      if (carTime != undefined && carTime != "") {
        params['carTime'] = carTime.format('YYYY-MM-DD');
      }


      if (requirment != undefined) {
        params['reqId'] = requirment.id
        params['category'] = requirment.category
      } else {
        params['category'] = this.state.category
      }

      onChanged(params, () => this.setModalVisible(false))
    });
  }

  setModalVisible = (visible: boolean) => {
    this.setState({
      modelVisible: visible
    })
  }


  onEditClick = (recoder: RequirementBean) => {
    this.state.requirment = recoder
    this.state.category = recoder.category
    this.setModalVisible(true)
  }



  areaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.props.form.setFieldsValue({
      'cityCode': code,
    })
  }


  onCloseClick = (bean: RequirementBean) => {
    this.state.requirment = bean
    this.setCloseVisible(true)
  }

  onOpenClick = (bean: RequirementBean) => {
    const { onChanged } = this.props;
    bean['status'] = '1';
    bean['reqId'] = bean.id;
    onChanged(bean, () => { })

  }

  onColseModeSure = () => {
    const { requirment, remark } = this.state;
    const { onChanged } = this.props;
    if (requirment != undefined) {
      requirment['status'] = '0';
      requirment['remark'] = remark;
      requirment['reqId'] = requirment.id;
      onChanged(requirment, () => this.setCloseVisible(false))
    }
  }

  setCloseVisible = (visible: boolean) => {
    this.setState({ closeModeVisible: visible })
  }

  closeModeTextChange = ({ target: { value } }) => {
    this.setState({ remark: value });
  };

  closeDescribe = (desc: string) => {
    Modal.info({
      title: '关闭说明',
      content: (
        <TextArea
          value={desc}
          disabled={true}
          rows={6}>
        </TextArea>
      ),
      centered: true,
      onOk() { },
    });
  }

  formatDefaultTime = (requirment: RequirementBean | undefined, propName: string, format: string) => {
    if (requirment != undefined) {
      if (requirment[propName]) {
        return moment(requirment[propName], format)
      }
    }
    return null
  }

  formateDefaultSelect = (requirment: RequirementBean | undefined, propName: string) => {
    if (requirment != undefined) {
      if (requirment[propName] != null && requirment[propName] != '0') {
        return requirment[propName]
      }
    }
    return null
  }

  lable = () => {
    const { category } = this.state
    if (category == '1') {
      return '每桌预算'
    } else {
      return '预算'
    }
  }

  generateReqList = (type: number) => {
    const { requirementData, onRecommClick, showStyle, currentUserInfo } = this.props;

    const title = (bean: RequirementBean) => {
      return <div>
        <span className={styles.homeRequTitle}>{bean.category_txt}</span>
        {
          bean.status != '0' ? <span>有效</span> :
            <span style={{ color: '#FF0000', marginRight: '10' }}>失效</span>
        }
        {
          bean.status != '0' ? '' : <a onClick={() => this.closeDescribe(bean.remark)}>查看关闭原因></a>
        }
      </div>
    };

    let list: RequirementData[] = [];
    if (type == 0) {
      list = requirementData.my
    } else {
      list = requirementData.other
    }
    if (list == undefined || list == null || list.length == 0) {
      return ''
    }
    return (
      <div>
        {/* <div style={{fontSize:20,fontWeight:'bold'}}>{type == 0?'我的建单':'同事建单'}</div> */}
        {
          list.map(categorydata => {
            let reqList = categorydata.data
            if (reqList != undefined && reqList != null && reqList.length > 0) {
              return reqList.map(req => {
                let data = getCategoryColumn<RequirementBean>(this.findCategoryBean(req.category).value);
                data.columns.some(element => {
                  if (element.dataIndex == 'city') {
                    element['render'] = (text, recoder) => recoder.city_info.full;
                    return true;
                  }
                  return false;
                })
                if (showStyle != 0 && type == 0) {   //是有效单详情 且 是我的
                  if (req.status != '0') {   //状态正常
                    let operate: ColumnProps<RequirementBean> = {
                      title: '操作',
                      dataIndex: 'action',
                      fixed: 'right',
                      render: (text, recoder) => {
                        return (
                          <span>
                            <a onClick={() => this.onEditClick(recoder)}>编辑</a>
                            {/* <Divider type="vertical" />
                                                        <a onClick={() => this.onCloseClick(recoder)}>关单</a> */}
                            {
                              CrmUtil.getCompanyType() == 1 ? (
                                <span>
                                  <Divider type="vertical" />
                                  <a onClick={() => onRecommClick(recoder)}>推荐</a>
                                </span>) : ''
                            }
                          </span>
                        )
                      }
                    };
                    data.columns.push(operate);
                  } else {
                    let operate: ColumnProps<RequirementBean> = {
                      title: '操作',
                      dataIndex: 'action',
                      fixed: 'right',
                      render: (text, recoder) => {
                        return (
                          <span>
                            <a onClick={() => this.onOpenClick(recoder)}>开启</a>
                          </span>
                        )
                      }
                    };
                    data.columns.push(operate);
                  }
                }
                return <Table
                  style={{ marginTop: 5 }}
                  size="small"
                  title={() => title(req)}
                  columns={data.columns}
                  dataSource={[req]}
                  scroll={{ x: 'max-content' }}
                  pagination={false} />
              })
            } else {
              return '';
            }
          })
        }
      </div>
    )
  }

  render() {
    const { config, showStyle } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { requirment, category } = this.state;
    const menu = (
      <Menu>
        {
          config.category.map(categ => (
            <Menu.Item>
              <a onClick={() => this.categoryClick(categ)}>{categ.name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const carFormat = 'YYYY-MM-DD'

    const categoryLayout = () => {
      if (category == '1') {
        return <div>
          <FormItem label='星级'>
            {
              getFieldDecorator('hotelStar', {
                initialValue: this.formateDefaultSelect(requirment, 'hotel_star'),
                rules: [{
                  required: true,
                  message: "星级不能为空"
                }]
              })(
                <Select style={{ width: '50%' }} placeholder='请选择'>
                  {
                    config.hotelStar.map(state => (
                      <Option value={state.id}>{state.name}</Option>))
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem label='桌数'>
            {
              getFieldDecorator('hotelTables', {
                initialValue: requirment == undefined ? '' : requirment.hotel_tables,
                rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入有效桌数' }], getValueFromEvent: (event) => {
                  return event.target.value.replace(/\D/g, '')
                },
              })(<Input className={styles.formitemwidth} placeholder="请输入" />)
            }
          </FormItem>
        </div>
      } else if (category == '2' || category == '4') {
        return <div>
          <FormItem label='婚礼风格'>
            {
              getFieldDecorator('weddingStyle', {
                initialValue: this.formateDefaultSelect(requirment, 'wedding_style'),
              })(
                <Select style={{ width: '50%' }} placeholder='请选择'>
                  {
                    config.weddingStyle.map(state => (
                      <Option value={state.id}>{state.name}</Option>))
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label='酒店名称'>
            {
              getFieldDecorator('hotel', {
                initialValue: requirment == undefined ? '' : requirment.hotel,
              })(<Input className={styles.formitemwidth} placeholder="请输入" />)
            }
          </FormItem>
          <FormItem label='厅名'>
            {
              getFieldDecorator('hotelHall', {
                initialValue: requirment == undefined ? '' : requirment.hotel_hall,
              })(<Input className={styles.formitemwidth} placeholder="请输入" />)
            }
          </FormItem>
        </div>
      } else if (category == '3') {
        return <div>
          <FormItem label='婚照风格'>
            {
              getFieldDecorator('photoStyle', {
                initialValue: this.formateDefaultSelect(requirment, 'photo_style'),
              })(
                <Select style={{ width: '50%' }} placeholder='请选择'>
                  {
                    config.photoStyle.map(state => (
                      <Option value={state.id}>{state.name}</Option>))
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem label='拍摄时间'>
            {
              getFieldDecorator('photoTime', {
                initialValue: this.formatDefaultTime(requirment, 'photo_time', dateFormat)
              })
                (<DatePicker
                  format={dateFormat}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder='请选择拍摄时间' />)
            }
          </FormItem>
        </div>
      } else if (category == '5') {
        return <div>
          <FormItem label='用车品牌'>
            {
              getFieldDecorator('carBrand', {
                initialValue: this.formateDefaultSelect(requirment, 'car_brand'),
              })(
                <Select style={{ width: '50%' }} placeholder='请选择'>
                  {
                    config.carBrand.map(state => (
                      <Option value={state.id}>{state.name}</Option>))
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem label='用车型号'>
            {
              getFieldDecorator('carSeries', {
                initialValue: requirment == undefined ? '' : requirment.car_series,
              })(<Input className={styles.formitemwidth} placeholder="请输入" />)
            }
          </FormItem>
          <FormItem label='用车数量'>
            {
              getFieldDecorator('carNum', {
                initialValue: requirment == undefined ? '' : requirment.car_num,
                rules: [{
                  required: true,
                  message: '用车数量不能为空'
                }]
              })(<Input className={styles.formitemwidth} placeholder="请输入" />)
            }
          </FormItem>
          <FormItem label='用车时间'>
            {
              getFieldDecorator('carTime', {
                initialValue: this.formatDefaultTime(requirment, 'car_time', carFormat)
              })
                (<DatePicker
                  format={carFormat}
                  placeholder='请选择用车时间' />)
            }
          </FormItem>
        </div>
      } else if (category == '6') {
        return <div>
          <FormItem label='婚礼风格'>
            {
              getFieldDecorator('weddingStyle', {
                initialValue: this.formateDefaultSelect(requirment, 'wedding_style'),
              })(
                <Select style={{ width: '50%' }} placeholder='请选择'>
                  {
                    config.weddingStyle.map(state => (
                      <Option value={state.id}>{state.name}</Option>))
                  }
                </Select>,
              )
            }
          </FormItem>
        </div>
      }
    }

    // const categoryView = () => {
    //     if (category == '1') {//婚宴
    //         return <div>
    //             <FormItem label='意向城市' style={{ width: '100%' }}>
    //                 {getFieldDecorator('cityCode')}
    //                 <AreaSelect areaSelectChange={this.areaSelectChange} level3={true}
    //                     selectedCode={requirment == undefined ? '100000' : (requirment.city_code)} />
    //             </FormItem>
    //             <FormItem label="婚礼桌数">
    //                 {getFieldDecorator('banquet_tables', {
    //                     rules: [{ required: false, message: "请填写有效桌数", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                         return event.target.value.replace(/\D/g, '')
    //                     },
    //                     initialValue: ''

    //                 })(
    //                     <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="桌" placeholder="请填写桌数" />
    //                 )}
    //             </FormItem>
    //             <FormItem label="场地类型">
    //                 {getFieldDecorator('banquet_site_type', {
    //                     rules: [{ required: false, message: "请选择场地类型", }],
    //                     initialValue: ''
    //                 })(
    //                     <Radio.Group >
    //                         {
    //                             configData.siteType.map(siteType => (
    //                                 <Radio value={siteType.id}>{siteType.name}</Radio>))
    //                         }
    //                     </Radio.Group>
    //                 )}
    //             </FormItem>
    //             <FormItem label="档期类型">
    //                 {getFieldDecorator('banquet_schedule_type', {
    //                     rules: [{ required: false, message: "请选择档期类型", }],
    //                     initialValue: ''

    //                 })(
    //                     <Radio.Group style={{ flexGrow: 1 }} >
    //                         {
    //                             configData.scheduleType.map(scheduleType => (
    //                                 <Radio value={scheduleType.id}>{scheduleType.name}</Radio>))
    //                         }
    //                     </Radio.Group>
    //                 )}
    //             </FormItem>
    //             <FormItem label="每桌预算">
    //                 {getFieldDecorator('banquet_single_budget', {
    //                     rules: [{ required: false, message: "请填写具体预算", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                         return event.target.value.replace(/\D/g, '')
    //                     },
    //                     initialValue: ''

    //                 })(
    //                     <Input maxLength={6} autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请填写每桌预算" />
    //                 )}
    //             </FormItem>
    //             <FormItem label="婚宴预算">
    //                 {getFieldDecorator('banquet_all_budget', {
    //                     rules: [{ required: false, message: "请填写具体预算", }],
    //                     initialValue: ''

    //                 })(
    //                     <NumericInput maxLength={10} autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请填写婚宴预算" />
    //                 )}
    //             </FormItem>
    //         </div>
    //     } else if (category == '2') { //婚庆
    //         <FormItem label='意向城市' style={{ width: '100%' }}>
    //             {getFieldDecorator('cityCode')}
    //             <AreaSelect areaSelectChange={this.areaSelectChange} level3={true}
    //                 selectedCode={requirment == undefined ? '100000' : (requirment.city_code)} />
    //         </FormItem>
    //     }
    //     {
    //         checkCategorys.indexOf(2) != -1 ? (//婚庆
    //             <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚庆" bordered={false}>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.weddingCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={24}>
    //                         <FormItem label="二级品类">
    //                             {getFieldDecorator('wedding_category_type', {
    //                                 rules: [{ required: false, message: "请选择二级品类", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Radio.Group >
    //                                     {
    //                                         configData.category2[1].children.map((wedding_category_type) => (
    //                                             <Radio value={wedding_category_type.value} >{wedding_category_type.label}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
    //                     <Col span={24}>
    //                         <FormItem label="婚礼风格">
    //                             {getFieldDecorator('wedding_style', {
    //                                 rules: [{ required: false, message: "请选择婚礼风格", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Radio.Group >
    //                                     {
    //                                         configData.weddingStyle.map(weddingStyle => (
    //                                             <Radio value={weddingStyle.id}>{weddingStyle.name}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚礼桌数">
    //                             {getFieldDecorator('wedding_tables', {
    //                                 rules: [{ required: false, message: "请填写有效桌数", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                                     return event.target.value.replace(/\D/g, '')
    //                                 },
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="桌" placeholder="请填写婚礼桌数" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="每桌预算">
    //                             {getFieldDecorator('wedding_single_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请填写每桌预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="预定酒店">
    //                             {getFieldDecorator('wedding_hotel', {
    //                                 rules: [{ required: false, message: "请输入酒店名称", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="宴会厅">
    //                             {getFieldDecorator('wedding_banquet_hall', {
    //                                 rules: [{ required: false, message: "请输入宴会厅", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚庆预算">
    //                             {getFieldDecorator('wedding_all_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请填写婚庆预算" />
    //                             )}
    //                         </FormItem>

    //                     </Col>
    //                 </Row>
    //             </Card>
    //         ) : null
    //     }

    //     {
    //         checkCategorys.indexOf(3) != -1 ? (//婚纱摄影
    //             <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚纱摄影" bordered={false}>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.photographyCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={24}>
    //                         <FormItem label="拍照风格">
    //                             {getFieldDecorator('photography_style', {
    //                                 rules: [{ required: false, message: "请选择拍照风格", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Radio.Group >
    //                                     {
    //                                         configData.photoStyle.map(photoStyle => (
    //                                             <Radio value={photoStyle.id}>{photoStyle.name}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚纱摄影预算">
    //                             {getFieldDecorator('photography_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                                     return event.target.value.replace(/\D/g, '')
    //                                 },
    //                                 initialValue: ''
    //                             })(
    //                                 <Input maxLength={6} autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请填写婚纱摄影预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //             </Card>
    //         ) : null
    //     }
    //     {
    //         checkCategorys.indexOf(4) != -1 ? (//庆典or喜宴
    //             <Card style={{ width: '75%', marginBottom: 10, marginLeft: 20 }} title={React.$celebrationOrWeddingBanquet()} bordered={false}>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.celebrationCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={24}>
    //                         <FormItem label="二级品类">
    //                             {getFieldDecorator('celebration_banquet_type', {
    //                                 rules: [{ required: false, message: "请选择宴会类型", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Radio.Group >
    //                                     {
    //                                         configData.banquetType.map((banquetType) => (
    //                                             <Radio value={banquetType.id} >{banquetType.name}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="举办桌数">
    //                             {getFieldDecorator('celebration_tables', {
    //                                 rules: [{ required: false, message: "请填写有效需求桌数", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                                     return event.target.value.replace(/\D/g, '')
    //                                 },
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="桌" placeholder="请填写举办桌数" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="预定酒店">
    //                             {getFieldDecorator('celebration_hotel', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="宴会厅">
    //                             {getFieldDecorator('celebration_banquet_hall', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="每桌预算">
    //                             {getFieldDecorator('celebration_single_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请填写每桌预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="喜宴预算">
    //                             {getFieldDecorator('celebration_all_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请填写喜宴预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //             </Card>
    //         ) : null
    //     }
    //     {
    //         checkCategorys.indexOf(5) != -1 ? (//婚车
    //             <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚车" bordered={false}>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.carCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="用车时间">
    //                             {getFieldDecorator('car_time', {
    //                                 rules: [{ required: false, message: "请选择用车时间", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <DatePicker style={{ width: '100%', }} format="YYYY-MM-DD"
    //                                     disabledDate={disabledDate}
    //                                 />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>

    //                         <FormItem label="品牌要求">
    //                             <Button style={{ width: 120, marginBottom: 10 }} type="primary" onClick={(e) => { this.showCarBrandView(e) }} loading={submitting}>添加 </Button>
    //                             <br />

    //                             {/* <div > . 奔驰8辆|宝马1辆|法拉利1辆</div> */}
    //                             <div >
    //                                 {
    //                                     this.state.carBrandList.map((item) => (
    //                                         item.carBrandName != '' && item.carNum != '' ?
    //                                             <span>{item.carBrandName}{item.carNum}辆|</span>
    //                                             : ''
    //                                     ))
    //                                 }
    //                             </div>

    //                         </FormItem>


    //                     </Col>

    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚车预算">
    //                             {getFieldDecorator('car_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请填写婚车预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>


    //                 <Modal
    //                     title="用车品牌"
    //                     visible={this.state.visible}
    //                     onOk={this.handleOk}
    //                     onCancel={this.handleCancel}
    //                 >
    //                     <div className={styles.tableListForm}>
    //                         <FormItem label="填写品牌要求">
    //                             <Button style={{ width: 100, marginBottom: 10 }} type="primary" onClick={(e) => { this.addCarBrand(e) }} loading={submitting}>+添加 </Button>
    //                         </FormItem>
    //                         <div style={{ marginTop: -2, height: 400, overflowY: 'auto' }}>
    //                             {this.getTodoItem(this.state.carBrandList)}
    //                         </div>
    //                     </div>
    //                 </Modal>
    //             </Card>
    //         ) : null
    //     }
    //     {
    //         checkCategorys.indexOf(6) != -1 ? (//一站式
    //             <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="一站式" bordered={false}>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.oneStopCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
    //                     <Col span={24}>
    //                         <FormItem label="婚礼风格">
    //                             {getFieldDecorator('oneStop_wedding_style', {
    //                                 rules: [{ required: false, message: "请选择婚礼风格", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Radio.Group >
    //                                     {
    //                                         configData.weddingStyle.map(weddingStyle => (
    //                                             <Radio value={weddingStyle.id}>{weddingStyle.name}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚礼桌数">
    //                             {getFieldDecorator('oneStop_tables', {
    //                                 rules: [{ required: false, message: "请填写有效桌数", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                                     return event.target.value.replace(/\D/g, '')
    //                                 },
    //                                 initialValue: ''

    //                             })(
    //                                 <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="桌" placeholder="请填写婚礼桌数" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="每桌预算">
    //                             {getFieldDecorator('oneStop_single_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={8} style={{ width: '100%', }} prefix="￥" placeholder="请填写每桌预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>

    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="预定酒店">
    //                             {getFieldDecorator('oneStop_hotel', {
    //                                 rules: [{ required: false, message: "请输入酒店名称", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={30} style={{ width: '100%', }} placeholder="请输入酒店名称" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="宴会厅">
    //                             {getFieldDecorator('oneStop_banquet_hall', {
    //                                 rules: [{ required: false, message: "请输入宴会厅", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <Input autoComplete="off" maxLength={15} style={{ width: '100%', }} placeholder="请输入宴会厅" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="整体预算">
    //                             {getFieldDecorator('oneStop_all_budget', {
    //                                 rules: [{ required: false, message: "请填写整体预算", }],
    //                                 initialValue: ''
    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={10} style={{ width: '100%', }} prefix="￥" placeholder="请填写整体预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //             </Card>
    //         ) : null
    //     }
    //     {
    //         checkCategorys.indexOf(7) != -1 ? (//婚纱礼服
    //             <Card style={{ width: '100%', marginLeft: 20, marginBottom: 10 }} title="婚纱礼服" bordered={false}>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="意向区域" >
    //                             <AreaSelect areaSelectChange={this.dressCityAreaSelectChange} level3={true} />
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
    //                     <Col span={12}>
    //                         <FormItem label="使用方式">
    //                             {getFieldDecorator('dress_use_way', {
    //                                 rules: [{ required: false, message: "请选择使用方式", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Radio.Group style={{ width: '100%' }}>
    //                                     {
    //                                         configData.dressUseWay.map(dressUseWay => (
    //                                             <Radio value={dressUseWay.id}>{dressUseWay.name}</Radio>))
    //                                     }
    //                                 </Radio.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
    //                     <Col span={12}>
    //                         <FormItem label="服饰类型">
    //                             {getFieldDecorator('dress_type', {
    //                                 rules: [{ required: false, message: "请选择服饰类型", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Checkbox.Group style={{ width: '100%' }}>
    //                                     {
    //                                         configData.dressType.map(dressType => (
    //                                             <Checkbox value={dressType.id}>{dressType.name}</Checkbox>))
    //                                     }
    //                                 </Checkbox.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
    //                     <Col span={24}>
    //                         <FormItem label="礼服款式">
    //                             {getFieldDecorator('dress_model', {
    //                                 rules: [{ required: false, message: "请选择礼服款式", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <Checkbox.Group  >
    //                                     {
    //                                         configData.dressModel.map(dressModel => (
    //                                             <Checkbox value={dressModel.id}>{dressModel.name}</Checkbox>))
    //                                     }
    //                                 </Checkbox.Group>
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="礼服数量">
    //                             {getFieldDecorator('dress_num', {
    //                                 rules: [{ required: false, message: "请填写有效数量", pattern: new RegExp(/^[1-9]\d*$/, "g"), }], getValueFromEvent: (event) => {
    //                                     return event.target.value.replace(/\D/g, '')
    //                                 },
    //                                 initialValue: ''

    //                             })(
    //                                 <Input autoComplete="off" maxLength={6} style={{ width: '100%', }} suffix="套" placeholder="请填写礼服数量" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //                 <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
    //                     <Col span={12}>
    //                         <FormItem label="婚服预算">
    //                             {getFieldDecorator('dress_budget', {
    //                                 rules: [{ required: false, message: "请填写具体预算", }],
    //                                 initialValue: ''

    //                             })(
    //                                 <NumericInput autoComplete="off" maxLength={8} style={{ width: '100%', }} prefix="￥" suffix="元" placeholder="请填写婚服预算" />
    //                             )}
    //                         </FormItem>
    //                     </Col>
    //                 </Row>
    //             </Card>
    //         ) : null
    //     }
    // }

    // const viewArea = (
    //     <FormItem label='意向区域' style={{ width: '100%' }}>
    //         {getFieldDecorator('cityCode')}
    //         <AreaSelect areaSelectChange={this.areaSelectChange} level3={true}
    //             selectedCode={requirment == undefined ? '100000' : (requirment.city_code)} />
    //     </FormItem>
    // )

    // const viewSelect = (label:string,formField:string,defaultField:string,configs:ConfigListItem[],style:rules?:ValidationRule[]) => {
    //     return <FormItem label='星级'>
    //         {
    //             getFieldDecorator('hotelStar', {
    //                 initialValue: this.formateDefaultSelect(requirment, 'hotel_star'),
    //                 rules: [{
    //                     required: true,
    //                     message: "星级不能为空"
    //                 }]
    //             })(
    //                 <Select style={{ width: '50%' }} placeholder='请选择'>
    //                     {
    //                         config.hotelStar.map(state => (
    //                             <Option value={state.id}>{state.name}</Option>))
    //                     }
    //                 </Select>,
    //             )
    //         }
    //     </FormItem>
    // }

    return (
      <div>
        <div className={styles.newcontact}>
          {
            showStyle == 0 ? '' :
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button type="primary">+有效单</Button>
              </Dropdown>
          }
        </div>
        {
          this.generateReqList(0)
        }
        {/* {
                    this.generateReqList(1)
                } */}
        {
          !this.state.modelVisible ? '' :
            <Modal
              title={requirment == undefined ? "新建" + this.findCategoryBean(category).value + "有效单" :
                "编辑" + requirment.category_txt + "有效单"}
              centered
              visible={true}
              onOk={this.submitData}
              onCancel={() => this.setModalVisible(false)}>
              <Form {...formItemLayout} layout='horizontal'>
                <FormItem label='意向区域' style={{ width: '100%' }}>
                  {getFieldDecorator('cityCode')}
                  <AreaSelect areaSelectChange={this.areaSelectChange} level3={true}
                    selectedCode={requirment == undefined ? '100000' : (requirment.city_code)} />
                </FormItem>
                <FormItem label={this.lable()}>
                  {
                    getFieldDecorator('budget', {
                      initialValue: requirment == undefined ? '' : requirment.budget,
                      rules: [{
                        required: true,
                        message: "预算不能为空"
                      }]
                    })(<Input className={styles.formitemwidth} placeholder="请输入" />)
                  }
                </FormItem>
                {
                  categoryLayout()
                }
                <FormItem label='预计到店时间'>
                  {
                    getFieldDecorator('estArrivalTime', {
                      initialValue: this.formatDefaultTime(requirment, 'est_arrival_time', dateFormat)
                    })
                      (<DatePicker
                        format={dateFormat}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        placeholder='请选择预计到店时间' />)
                  }
                </FormItem>
              </Form>
            </Modal>
        }
        <Modal
          title='关闭有效单'
          visible={this.state.closeModeVisible}
          centered
          destroyOnClose={true}
          onOk={this.onColseModeSure}
          onCancel={() => this.setCloseVisible(false)}>
          <TextArea
            onChange={this.closeModeTextChange}
            placeholder='请说明有效单关闭原因'
            rows={6}>
          </TextArea>
        </Modal>
      </div>
    )
  }
}

export default Form.create<RequirementPros>()(RequirementInfo)
