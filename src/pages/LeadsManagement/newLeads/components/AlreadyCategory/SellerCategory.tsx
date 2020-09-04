
import { Button, Modal, Form, Input, Radio, Checkbox, DatePicker, Select, Radio, Card, Col, Row, Collapse } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from '../category.less';
import { FormComponentProps } from 'antd/es/form';
import { isBlock } from '@babel/types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import NumericInput from '@/components/NumericInput';
const { Option } = Select;
const { Panel } = Collapse;

interface categoryProps extends FormComponentProps {
  visible: boolean
}



class SellerCategory extends React.Component<categoryProps> {


  render() {
    const { checkCategorys, submitting, bizContent, visible, getFieldDecorator } = this.props;


    if (visible && checkCategorys && checkCategorys.length > 0) {
      return (
        <Collapse defaultActiveKey={['1']} style={{ marginLeft: 20, marginRight: 20 }}>
          <Panel header="竞品信息" key="1">
            <div className={styles.tableListForm}>
              <Fragment>
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(1) != -1 ? (//婚宴
                  <Card style={{ width: '100%', marginBottom: 10 }} title="婚宴" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚宴商家">
                          {getFieldDecorator('competition_banquet_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.banquet.brand,
                          })(
                            <Input autoComplete="off" style={{ width: '100%', }} placeholder="请输入婚宴商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚宴花销">
                          {getFieldDecorator('competition_banquet_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.banquet.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入婚宴花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(2) != -1 ? (//婚庆
                  <Card style={{ width: '100%', marginBottom: 10 }} title="婚庆" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚庆商家">
                          {getFieldDecorator('competition_wedding_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.wedding.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', }} placeholder="请输入婚庆商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚庆花销">
                          {getFieldDecorator('competition_wedding_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.wedding.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入婚庆花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(3) != -1 ? (//婚纱摄影
                  <Card style={{ width: '100%', marginBottom: 10 }} title="婚纱摄影" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚纱摄影商家">
                          {getFieldDecorator('competition_photography_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.photography.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', marginLeft: 10 }} placeholder="请输入婚纱摄影商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚纱摄影花销">
                          {getFieldDecorator('competition_photography_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.photography.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', marginLeft: 10 }} prefix="￥" placeholder="请输入婚纱摄影花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(4) != -1 ? (//庆典or喜宴
                  <Card style={{ width: '100%', marginBottom: 10 }} title={React.$celebrationOrWeddingBanquet()} bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label={`${React.$celebrationOrWeddingBanquet()}商家`}>
                          {getFieldDecorator('competition_celebration_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.celebration.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', }} placeholder={`请输入${React.$celebrationOrWeddingBanquet()}商家`} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label={`${React.$celebrationOrWeddingBanquet()}花销`}>
                          {getFieldDecorator('competition_celebration_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.celebration.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder={`请输入${React.$celebrationOrWeddingBanquet()}花销`} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(5) != -1 ? (//婚车
                  <Card style={{ width: '100%', marginBottom: 10 }} title="婚车" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚车商家">
                          {getFieldDecorator('competition_car_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.car.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', }} placeholder="请输入婚车商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚车花销">
                          {getFieldDecorator('competition_car_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.car.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入婚车花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(6) != -1 ? (//一站式
                  <Card style={{ width: '100%', marginBottom: 10 }} title="一站式" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="一站式商家">
                          {getFieldDecorator('competition_oneStop_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.oneStop.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', }} placeholder="请输入一站式商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="一站式花销">
                          {getFieldDecorator('competition_oneStop_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.oneStop.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', }} prefix="￥" placeholder="请输入一站式花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
                {checkCategorys && checkCategorys.length > 0 && checkCategorys.indexOf(7) != -1 ? (//婚纱礼服
                  <Card style={{ width: '100%', marginBottom: 10 }} title="婚纱礼服" bordered={false}>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚纱礼服商家">
                          {getFieldDecorator('competition_wedding_dress_brand', {
                            rules: [{ required: true, message: "请填写具体品牌", }],
                            initialValue: bizContent.dress.brand
                          })(
                            <Input autoComplete="off" style={{ width: '100%', marginLeft: 10 }} placeholder="请输入婚纱礼服商家" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                      <Col span={12}>
                        <FormItem label="婚纱礼服花销">
                          {getFieldDecorator('competition_wedding_dress_budget', {
                            rules: [{ required: true, message: "请填写具体花销", }],
                            initialValue: bizContent.dress.price

                          })(
                            <NumericInput autoComplete="off" style={{ width: '100%', marginLeft: 10 }} prefix="￥" placeholder="请输入婚纱礼服花销" />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                ) : null
                }
              </Fragment >
            </div>
          </Panel>
        </Collapse>
      );
    } else {
      return (
        <Fragment />)
    }
  }

}
// export default SellerCategory;
export default Form.create<FormComponentProps>()(SellerCategory);
