import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Card, PageHeader, Row, Col, Affix, Tabs, Select,Form,Input,Button,DatePicker} from 'antd';
import { Dispatch , Action } from "redux";
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';
import moment from 'moment';
import AreaSelect from "@/components/AreaSelect";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface CustomerConsultProps extends FormComponentProps {
    dispatch: Dispatch<
      Action<any>
    >;
    liheDetail: StateType;
    visible:boolean;
    changeVisible:any;
    citycode:any
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

class CustomerInfor extends Component<CustomerConsultProps> {
    constructor(props:any) {
        super(props);
        this.state = {
            detailsId: 1,
            menuTab: 0,
            citycode:''
        }
    }
    componentDidMount() {

    }
  

    render() {
      const {visible} = this.props;
      return (
        <Fragment>
          {visible === true ? this.renderEdit() : this.renderDetail()}
        </Fragment>
      )
    }

    renderDetail() {
        return (
          <Fragment>
            <Card style={{ width: '80%',marginBottom:10}} title="销售端信息收集" headStyle={{color:"#1890FF"}}>
              <Form layout="inline" style={{fontWeight:"bold",fontSize:18}}>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="新郎名称：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="联系方式：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="新娘名称：">
                      李女士
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="联系方式：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="委托人姓名：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="联系方式：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="婚礼日期：">
                      爱的阶梯
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="婚礼举办城市：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="宴会场地：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="宴会人数：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="婚礼方面预算考量：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="最佳沟通时间（平时、周末）：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="婚礼筹备进度（场地、婚纱照、婚纱礼服……）：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="准备再看哪几家公司，最在意的点是什么：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="整体统筹服务（推进进度、筹备事项落实）：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="喜欢的婚礼风格、配色：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="想在婚礼中体现的元素：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
              </Form>           
            </Card>
            <Card style={{ width: '80%' }} title="策划端信息补充收集" headStyle={{color:"#1890FF"}}>
              <Form layout="inline" style={{fontWeight:"bold",fontSize:18}}>
                <h6 style={{color:"#1890FF"}}>背景信息</h6>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="新郎出生地：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="出生年月日：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="职业：">
                      李女士
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="毕业学校：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="星座：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="家庭成员：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="新娘出生地：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="出生年月日：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="职业：">
                      李女士
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="毕业学校：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={6}>
                    <FormItem label="星座：">
                      张先生
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="家庭成员：">
                      15910299706
                    </FormItem>
                  </Col>
                </Row>
                <h6 style={{color:"#1890FF"}}>婚礼创意信息</h6>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="1. 初次见面的彼此第一印象：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="2. 发展过程：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="3. 共同喜欢的电影：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="4. 共同喜欢的音乐：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="5. 彼此对对方的昵称：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="6. 一起去过的印象较深国家或者城市：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="7. 令彼此最感动或难忘的事情：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="8. 有纪念意义的礼物：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="9. 最大的愿望：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="10. 期待的婚礼氛围：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="11. 喜欢或反感的婚礼流程：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12}>
                    <FormItem label="12. 其他补充：">
                      张先生
                    </FormItem>
                  </Col>
                </Row>
              </Form>           
            </Card>
          </Fragment>
        );
    }

    renderEdit() {
      const {
        form: { getFieldDecorator},
        // productDetail: { config,storeData}
      } = this.props;
      return (
        <Fragment>
          <Card style={{ width: '80%',marginBottom:10}} title="销售端信息收集" headStyle={{color:"#1890FF"}}>
            <Form layout="inline" style={{fontWeight:"bold",fontSize:18}}>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="新郎名称：">
                    {getFieldDecorator('groomName',{ rules: [{ required: true, message: "请输入新郎名称"}],
                      // initialValue:detailData && detailData.name
                    })(
                    <Input style={{ width: '100%', }} placeholder="请输入新郎名称"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="联系方式：">
                  {
                    getFieldDecorator('phone', {
                        // initialValue: contact == undefined ? '' : contact.phone,
                        rules: [{ required: true, pattern: new RegExp(/^\d{11}$/, "g"), message: '请输入有效手机号码' }], 
                        getValueFromEvent: (event) => {
                            return event.target.value.replace(/\D/g, '')
                          },
                    })(<Input placeholder="请输入" maxLength={11}/>)
                  }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="新娘名称：">
                    {getFieldDecorator('grideName',{ rules: [{ required: true, message: "请输入新娘名称"}],
                      // initialValue:detailData && detailData.name
                    })(
                    <Input style={{ width: '100%', }} placeholder="请输入新娘名称"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="联系方式：">
                    {
                      getFieldDecorator('gridePhone', {
                          // initialValue: contact == undefined ? '' : contact.phone,
                          rules: [{ required: true, pattern: new RegExp(/^\d{11}$/, "g"), message: '请输入有效手机号码' }], 
                          getValueFromEvent: (event) => {
                              return event.target.value.replace(/\D/g, '')
                            },
                      })(<Input placeholder="请输入" maxLength={11}/>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="委托人姓名：">
                    {getFieldDecorator('clientName',{ rules: [{ required: false, message: "请输入新娘名称"}],
                        // initialValue:detailData && detailData.name
                      })(
                    <Input style={{ width: '100%' }} placeholder="请输入新娘名称"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="联系方式：">
                    {
                        getFieldDecorator('clientPhone', {
                            // initialValue: contact == undefined ? '' : contact.phone,
                            rules: [{ required: false, pattern: new RegExp(/^\d{11}$/, "g"), message: '请输入有效手机号码' }], 
                            getValueFromEvent: (event) => {
                                return event.target.value.replace(/\D/g, '')
                              },
                        })(<Input placeholder="请输入" maxLength={11}/>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={12}>
                  <FormItem label="婚礼日期：">
                  {getFieldDecorator('timeArray',{
                  rules: [{ required: true ,message: '请选择婚礼日期：'}]
                  })(
                    <RangePicker
                      ranges={{
                        '本周': [moment().startOf('week'), moment().endOf('week')],
                      }}
                      placeholder={['开始日期', '结束日期']}
                      style={{
                        width: '100%',
                      }}
                    />
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="婚礼举办城市：">
                  {getFieldDecorator('cityCode', { rules: [{ required: true, message: "请选择婚礼举办城市", max: 11 }], 
                  // initialValue: storeInfo?.cityCode 
                  })(
                      <AreaSelect 
                          areaSelectChange={this.areaSelectChange} 
                          level3={true}
                      />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="宴会场地：">
                    {getFieldDecorator('place',{ rules: [{ required: true, message: "请输入宴会场地"}],
                          // initialValue:detailData && detailData.name
                        })(
                    <Input style={{ width: '100%', }} placeholder="请输入宴会场地"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="宴会人数：">
                    {getFieldDecorator('peopleNum',{ rules: [{ required: false, message: "请输入宴会人数"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入宴会人数"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="婚礼方面预算考量：">
                    {getFieldDecorator('budget',{ rules: [{ required: false, message: "请输入婚礼方面预算考量"}],
                            // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="最佳沟通时间（平时、周末）：">
                  {getFieldDecorator('communicationTime',{ rules: [{ required: false, message: "请输入最佳沟通时间"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入最佳沟通时间"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="婚礼筹备进度（场地、婚纱照、婚纱礼服……）：">
                  {getFieldDecorator('progress',{ rules: [{ required: false, message: "请输入婚礼筹备进度"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入婚礼筹备进度"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="准备再看哪几家公司，最在意的点是什么：">
                    {getFieldDecorator('care',{ rules: [{ required: false, message: "请输入准备再看哪几家公司，最在意的点"}],
                              // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="整体统筹服务（推进进度、筹备事项落实）：">
                  {getFieldDecorator('service',{ rules: [{ required: false, message: "请输入整体统筹服务"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="喜欢的婚礼风格、配色：">
                  {getFieldDecorator('style',{ rules: [{ required: false, message: "请输入喜欢的婚礼风格、配色"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="想在婚礼中体现的元素：">
                  {getFieldDecorator('element',{ rules: [{ required: false, message: "请输入想在婚礼中体现的元素"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>           
          </Card>
          <Card style={{ width: '80%' }} title="策划端信息补充收集" headStyle={{color:"#1890FF"}}>
            <Form layout="inline" style={{fontWeight:"bold",fontSize:18}}>
              <h6 style={{color:"#1890FF"}}>背景信息</h6>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={12}>
                  <FormItem label="新郎出生地：">
                  {getFieldDecorator('gradeCity', { rules: [{ required: false, message: "请选择新郎出生地", max: 11 }], 
                  // initialValue: storeInfo?.cityCode 
                  })(
                      <AreaSelect 
                          // areaSelectChange={this.areaSelectChange} 
                          level3={true}
                      />
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="出生年月日：">
                    {getFieldDecorator('birthDate', { rules: [{ required:false, message: "请选择出生年月日" }], 
                    // initialValue: storeInfo?.cityCode 
                    })(<DatePicker />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="职业：">
                    {getFieldDecorator('occupation',{ rules: [{ required: false, message: "请输入职业"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入职业"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="毕业学校：">
                    {getFieldDecorator('school',{ rules: [{ required: false, message: "请输入毕业学校"}],
                              // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入毕业学校"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="星座：">
                  {getFieldDecorator('constellation',{ rules: [{ required: false, message: "请输入星座"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入星座"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="家庭成员：">
                    {getFieldDecorator('familyMember',{ rules: [{ required: false, message: "请输入家庭成员"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入家庭成员"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col span={12}>
                  <FormItem label="新娘出生地：">
                    {getFieldDecorator('brideCity', { rules: [{ required: false, message: "请选择新娘出生地", max: 11 }], 
                    // initialValue: storeInfo?.cityCode 
                    })(
                        <AreaSelect 
                            // areaSelectChange={this.areaSelectChange} 
                            level3={true}
                        />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="出生年月日：">
                  {getFieldDecorator('birthDate', { rules: [{ required:false, message: "请选择出生年月日" }], 
                    // initialValue: storeInfo?.cityCode 
                    })(<DatePicker />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={8}>
                  <FormItem label="职业：">
                  {getFieldDecorator('occupation',{ rules: [{ required: false, message: "请输入职业"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入职业"/>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="毕业学校：">
                  {getFieldDecorator('school',{ rules: [{ required: false, message: "请输入毕业学校"}],
                              // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入毕业学校"/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
                <Col span={6}>
                  <FormItem label="星座：">
                  {getFieldDecorator('constellation',{ rules: [{ required: false, message: "请输入星座"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入星座"/>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="家庭成员：">
                  {getFieldDecorator('familyMember',{ rules: [{ required: false, message: "请输入家庭成员"}],
                            // initialValue:detailData && detailData.name
                          })(
                    <Input style={{ width: '100%', }} placeholder="请输入家庭成员"/>)}
                  </FormItem>
                </Col>
              </Row>
              <h6 style={{color:"#1890FF"}}>婚礼创意信息</h6>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="1. 初次见面的彼此第一印象：">
                  {getFieldDecorator('impression',{ rules: [{ required: false, message: "请输入初次见面的彼此第一印象"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="2. 发展过程：">
                  {getFieldDecorator('process',{ rules: [{ required: false, message: "请输入发展过程"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="3. 共同喜欢的电影：">
                  {getFieldDecorator('movie',{ rules: [{ required: false, message: "请输入共同喜欢的电影"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="4. 共同喜欢的音乐：">
                  {getFieldDecorator('music',{ rules: [{ required: false, message: "请输入共同喜欢的音乐"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="5. 彼此对对方的昵称：">
                  {getFieldDecorator('nickName',{ rules: [{ required: false, message: "请输入彼此对对方的昵称"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="6. 一起去过的印象较深国家或者城市：">
                  {getFieldDecorator('nickName',{ rules: [{ required: false, message: "请输入彼此对对方的昵称"}],
                    // initialValue:detailData && detailData.name
                  })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="7. 令彼此最感动或难忘的事情：">
                    {getFieldDecorator('unforgettable',{ rules: [{ required: false, message: "请输入令彼此最感动或难忘的事情"}],
                      // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="8. 有纪念意义的礼物：">
                    {getFieldDecorator('anniversary',{ rules: [{ required: false, message: "请输入有纪念意义的礼物"}],
                        // initialValue:detailData && detailData.name
                      })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="9. 最大的愿望：">
                    {getFieldDecorator('desire',{ rules: [{ required: false, message: "请输入最大的愿望"}],
                          // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="10. 期待的婚礼氛围：">
                  {getFieldDecorator('atmosphere',{ rules: [{ required: false, message: "请输入期待的婚礼氛围"}],
                          // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="11. 喜欢或反感的婚礼流程：">
                  {getFieldDecorator('weddingProcess',{ rules: [{ required: false, message: "请输入喜欢或反感的婚礼流程"}],
                          // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 16, xl: 48 }}>
                <Col span={16}>
                  <FormItem label="12. 其他补充：">
                  {getFieldDecorator('other',{ rules: [{ required: false, message: "请输入其他补充"}],
                          // initialValue:detailData && detailData.name
                    })(<TextArea rows={2} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row justify="center" gutter={{ md: 6, lg: 12, xl: 48 }}>
                  <Col span={12} offset={6} push={4}>
                    <Form.Item>
                      <Button type="primary" onClick={this.handleSubmit}>
                        保存
                    </Button>
                      <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleFormCancel}>
                        取消
                    </Button>
                    </Form.Item>
                  </Col>
              </Row>
            </Form>           
          </Card>
        </Fragment>
      );
  }

  areaSelectChange = (code: string, province: string, city: string, district: string) => {
    this.props.form.setFieldsValue({
        cityCode: code
    });
    this.setState({
        citycode:code
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
    })
  }

  handleFormCancel = () => {
    this.props.changeVisible(false)
  }
}
export default Form.create<CustomerConsultProps>()(CustomerInfor);