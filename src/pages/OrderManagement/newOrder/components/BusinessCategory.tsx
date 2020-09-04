
import { Button, Modal, Form, Input, Radio, Checkbox, DatePicker, Select, Icon, InputNumber } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './BusinessCategory.less';
import { FormComponentProps } from 'antd/es/form';
import { isBlock } from '@babel/types';
// import  CollectionsPage  from './CollectionCreateForm';
import moment from 'moment';
import NumericInput from '@/components/NumericInput';

const { Option } = Select;
let id = 1;

const CollectionsPage = Form.create({ name: 'form_in_modal' })(
  class extends React.Component<FormComponentProps> {
    constructor(props: FormComponentProps) {
      super(props);
    }
    remove = k => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    };

    add = () => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      getFieldDecorator('keys', { initialValue: [1] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => (
        <Form.Item
          label={index === 0 ? '' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
              },
            ],
          })(<Input placeholder="passenger name" style={{ width: 200 }} />)}
          {keys.length > 1 ? (
            <Icon
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ));
      return (
        <div>
          {formItems}
        </div>
      )
    }

  },
);
function disabledDate(current) {
  // Can not select days before today and today
  return current < moment(new Date(moment().format('YYYY-MM-DD')));
}

//构建state类型
interface pageState {
  banquet: Object;//婚宴
  wedding: Object;// 婚庆
  photography: Object;//婚纱摄影
  car: Object;//婚车
  celebration: Object;// 到喜啦叫喜宴 其它叫喜宴
  oneStop: Object;//一站式

  banquetTj: Array;
  // weddingTj:Array;
  // photographyTj:Array;
  // carTj:Array;
  // xiyanTj:Array;
  // oneStopTj:Array;
}
const options = [
  { label: '1-5W', value: '1-5W' },
  { label: '5-10W', value: '5-10W' },
  { label: '10W以上', value: '10W以上' },
  { label: '其他', value: '其他' },
];
const optionsDesk = [
  { label: '1-10桌', value: '1-10桌' },
  { label: '10-20桌', value: '10-20桌' },
  { label: '20-40桌', value: '20-40桌' },
  { label: '其他', value: '其他' },
];
const optionsLeixing = [
  { label: '宝宝宴', value: '1' },
  { label: '寿宴', value: '2' },
  { label: '满月宴', value: '3' },
  { label: '百日宴', value: '4' },
  { label: '生日宴', value: '5' },
  { label: '乔迁宴', value: '6' },
  { label: '其他', value: '7' },
]
class BusinessCategory extends Component<pageState> {
  constructor(props: pageState) {
    super(props);
    console.log(this.props)
    //const { bizContent } = this.props;
    this.state = {
      banquet: { "budget": "", "tables": "", "merchant": "", "estArrivalTime": "", "remark": "" },
      wedding: { "budget": "", "merchant": "", "estArrivalTime": "", "remark": "" },
      photography: { "budget": "", "photographyStyle": "", "merchant": "", "estArrivalTime": "", "remark": "" },
      car: { "budget": "", "carTime": "", "carNum": "", "carBrand": "", "estArrivalTime": "", "remark": "" },
      celebration: { "budget": "", "tables": "", "hotelType": "", "hotelTime": "", "merchant": "", "estArrivalTime": "", "remark": "" },
      oneStop: { "budget": "", "tables": "", "merchant": "", "estArrivalTime": "", "remark": "" },
      banquetTj: [''],
      weddingTj: [''],
      photographyTj: [''],
      xiyanTj: [''],
      oneStopTj: ['']
    }
  }
  //预算
  budgetChange = (e) => {
    const value = e.target.value;
    if (e.target.name == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, budget: value },
      }));
    }
    if (e.target.name == 'wedding') {
      this.setState((prevState) => ({
        wedding: { ...prevState.wedding, budget: value },
      }));
    }
    if (e.target.name == 'photography') {
      this.setState((prevState) => ({
        photography: { ...prevState.photography, budget: value },
      }));
    }
    if (e.target.name == 'car') {
      this.setState((prevState) => ({
        car: { ...prevState.car, budget: value },
      }));
    }
    if (e.target.name == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, budget: value },
      }));
    }
    if (e.target.name == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, budget: value },
      }));
    }

  }
  // 预算选择其他
  budgetOther = (e: any) => {
    const nameValue = e.target.name;
    const value = e.target.value;
    if (nameValue == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, budget: value },
      }));
    }
    if (nameValue == 'wedding') {
      this.setState((prevState) => ({
        wedding: { ...prevState.wedding, budget: value },
      }));
    }
    if (nameValue == 'photography') {
      this.setState((prevState) => ({
        photography: { ...prevState.photography, budget: value },
      }));
    }
    if (nameValue == 'car') {
      this.setState((prevState) => ({
        car: { ...prevState.car, budget: value },
      }));
    }
    if (nameValue == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, budget: value },
      }));
    }
    if (nameValue == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, budget: value },
      }));
    }
  }
  // 桌数选择
  tableChange = (e) => {
    const value = e.target.value;
    if (e.target.name == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, tables: value },
      }));
    }
    if (e.target.name == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, tables: value },
      }));
    }
    if (e.target.name == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, tables: value },
      }));
    }
  }
  // 桌数其他
  tableOther = (e) => {
    const value = e.target.value;
    if (e.target.name == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, tables: value },
      }));
    }
    if (e.target.name == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, tables: value },
      }));
    }
    if (e.target.name == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, tables: value },
      }));
    }
  }
  // // 推荐商户
  // merchantChange = (e) => {
  //   const value = e.target.value;
  //   if (e.target.name == 'banquet') {
  //     this.setState((prevState) => ({
  //       banquet: { ...prevState.banquet, merchant: value },
  //     }));
  //   }
  //   if (e.target.name == 'wedding') {
  //     this.setState((prevState) => ({
  //       wedding: { ...prevState.wedding, merchant: value },
  //     }));
  //   }
  //   if (e.target.name == 'photography') {
  //     this.setState((prevState) => ({
  //       photography: { ...prevState.photography, merchant: value },
  //     }));
  //   }

  //   if (e.target.name == 'celebration') {
  //     this.setState((prevState) => ({
  //       celebration: { ...prevState.celebration, merchant: value },
  //     }));
  //   }
  //   if (e.target.name == 'oneStop') {
  //     this.setState((prevState) => ({
  //       oneStop: { ...prevState.oneStop, merchant: value },
  //     }));
  //   }
  // }
  //预约到店时间
  estArrivalTimeChange = (e, name: string) => {
    let times = e.format('YYYY-MM-DD');
    if (name == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, estArrivalTime: times },
      }));
    }
    if (name == 'wedding') {
      this.setState((prevState) => ({
        wedding: { ...prevState.wedding, estArrivalTime: times },
      }));
    }
    if (name == 'photography') {
      this.setState((prevState) => ({
        photography: { ...prevState.photography, estArrivalTime: times },
      }));
    }
    if (name == 'car') {
      this.setState((prevState) => ({
        car: { ...prevState.car, estArrivalTime: times },
      }));
    }
    if (name == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, estArrivalTime: times },
      }));
    }
    if (name == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, estArrivalTime: times },
      }));
    }
    if (name == 'celebrationTime') {
      this.setState((prevState) => ({
        celebration: { ...prevState.banquet, hotelTime: times },
      }));
    }
    if (name == 'carTime') {
      this.setState((prevState) => ({
        car: { ...prevState.car, carTime: times },
      }));
    }
  }
  // 补充备注
  remarkChange = (e) => {
    const value = e.target.value;
    if (e.target.name == 'banquet') {
      this.setState((prevState) => ({
        banquet: { ...prevState.banquet, remark: value },
      }));
    }
    if (e.target.name == 'wedding') {
      this.setState((prevState) => ({
        wedding: { ...prevState.wedding, remark: value },
      }));
    }
    if (e.target.name == 'photography') {
      this.setState((prevState) => ({
        photography: { ...prevState.photography, remark: value },
      }));
    }
    if (e.target.name == 'car') {
      this.setState((prevState) => ({
        car: { ...prevState.car, remark: value },
      }));
    }
    if (e.target.name == 'celebration') {
      this.setState((prevState) => ({
        celebration: { ...prevState.celebration, remark: value },
      }));
    }
    if (e.target.name == 'oneStop') {
      this.setState((prevState) => ({
        oneStop: { ...prevState.oneStop, remark: value },
      }));
    }
  }
  //photographyStyle 婚纱摄影--婚照风格
  photographyStyleCtrl = (e) => {
    this.setState((prevState) => ({
      photography: { ...prevState.photography, photographyStyle: e },
    }));
  }


  //* carNum //用车数量

  carNumCtrl = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      car: { ...prevState.car, carNum: value },
    }));
  }
  //* carBrand // 用车品牌
  carBrandCtrl = (e) => {
    console.log(e)
    // const value = e.target.value;
    this.setState((prevState) => ({
      car: { ...prevState.car, carBrand: e },
    }));
  }
  //* type ---庆典or喜宴类型
  weddingTypeCtrl = (e) => {
    //const value = e.join(',');
    const value = e.target.value;
    console.log(value)
    this.setState((prevState) => ({
      celebration: { ...prevState.celebration, hotelType: value },
    }));
  }
  //---庆典or喜宴其他类型
  otherTypeCtrl = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      celebration: { ...prevState.celebration, hotelType: value },
    }));
  }
  //
  addHotelMerchant = (type) => {
    if (type == 'banquetTj') {
      this.state.banquetTj.push('');
      this.setState((prevState) => ({
        banquetTj: [...prevState.banquetTj],
      }));
    }
    if (type == 'weddingTj') {
      this.state.weddingTj.push('');
      this.setState((prevState) => ({
        weddingTj: [...prevState.weddingTj],
      }));
    }
    if (type == 'photographyTj') {
      this.state.photographyTj.push('');
      this.setState((prevState) => ({
        photographyTj: [...prevState.photographyTj],
      }));
    }
    if (type == 'xiyanTj') {
      this.state.xiyanTj.push('');
      this.setState((prevState) => ({
        xiyanTj: [...prevState.xiyanTj],
      }));
    }
    if (type == 'oneStopTj') {
      this.state.oneStopTj.push('');
      this.setState((prevState) => ({
        oneStopTj: [...prevState.oneStopTj],
      }));
    }

  }
  merchantChange = (index, e, type) => {
    let value = e.target.value;
    if (type == 'banquetTj') {
      this.state.banquetTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.banquetTj];
        return { banquetTj: list }
      })
    }
    if (type == 'weddingTj') {
      this.state.weddingTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.weddingTj];
        return { weddingTj: list }
      })
    }
    if (type == 'photographyTj') {
      this.state.photographyTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.photographyTj];
        return { photographyTj: list }
      })
    }
    if (type == 'xiyanTj') {
      this.state.xiyanTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.xiyanTj];
        return { xiyanTj: list }
      })
    }
    if (type == 'oneStopTj') {
      this.state.oneStopTj[index] = value;
      this.setState((prevState) => {
        const list = [...prevState.oneStopTj];
        return { oneStopTj: list }
      })
    }


  }
  getTodoItem(type, obj) {
    return (
      obj.map((item, index) => {
        return (
          <div key={index} style={{ marginBottom: 10 }}>
            <Input
              onChange={(e) => { this.merchantChange(index, e, type) }}
              name={type} style={{ width: 200 }}
              placeholder="请填写推荐商户" value={item} />
            {obj.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                style={{ marginLeft: 3 }}
                onClick={() => this.handleItemDelete(index, type)}
              />
            ) : null}
          </div>
        )
      })
    )
  }
  handleItemDelete(index, type) {
    if (type == 'banquetTj') {
      this.setState((prevState) => {
        const list = [...prevState.banquetTj];
        list.splice(index, 1);
        return { banquetTj: list }
      })
    }
    if (type == 'weddingTj') {
      this.setState((prevState) => {
        const list = [...prevState.weddingTj];
        list.splice(index, 1);
        return { weddingTj: list }
      })
    }
    if (type == 'photographyTj') {
      this.setState((prevState) => {
        const list = [...prevState.photographyTj];
        list.splice(index, 1);
        return { photographyTj: list }
      })
    }
    if (type == 'xiyanTj') {
      this.setState((prevState) => {
        const list = [...prevState.xiyanTj];
        list.splice(index, 1);
        return { xiyanTj: list }
      })
    }
    if (type == 'oneStopTj') {
      this.setState((prevState) => {
        const list = [...prevState.oneStopTj];
        list.splice(index, 1);
        return { oneStopTj: list }
      })
    }
  }
  //

  // 提交表单
  validateCtrl = (e: React.FormEvent, isTransfer: boolean) => {
    const { validate } = this.props;
    const newState = JSON.parse(JSON.stringify(this.state));

    newState.banquet.merchant = this.state.banquetTj.join(',');
    newState.wedding.merchant = this.state.weddingTj.join(',');
    newState.photography.merchant = this.state.photographyTj.join(',');
    newState.celebration.merchant = this.state.xiyanTj.join(',');
    newState.oneStop.merchant = this.state.oneStopTj.join(',');
    delete newState.banquetTj;
    delete newState.weddingTj;
    delete newState.photographyTj;
    delete newState.xiyanTj;
    delete newState.oneStopTj;

    validate(newState, isTransfer);

  }
  render() {
    const { selfInfo, weddingStyle, submitting, configData: { carBrand, banquetType } } = this.props;
    return (
      <Fragment>
        {selfInfo.indexOf('1') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>婚宴</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>每桌预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'banquet'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={this.budgetOther} name={'banquet'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>需求桌数</p>
                  {/* <div>
                    <Radio.Group onChange={this.tableChange} name={'banquet'}>
                      <Radio value={'1-10桌'}>1-10桌</Radio>
                      <Radio value={'10-20桌'}>10-20桌</Radio>
                      <Radio value={'20-40桌'}>20-40桌</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><InputNumber style={{ width: 200 }} onChange={this.tableOther} name={'banquet'} placeholder="请填写具体桌数" /></div>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>推荐商户1</p>
                    <div style={{ marginTop: -2 }}>
                      {this.getTodoItem('banquetTj', this.state.banquetTj)}
                    </div>
                  </div>
                  <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('banquetTj') }}>添加商户</Button>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'banquet') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'banquet'} style={{ width: 200 }} placeholder="请填写备注" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        {selfInfo.indexOf('2') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>婚庆</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚庆预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'wedding'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={() => { this.budgetOther('wedding') }} name={'wedding'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>推荐商户1</p>
                    <div style={{ marginTop: -2 }}>
                      {this.getTodoItem('weddingTj', this.state.weddingTj)}
                    </div>
                  </div>
                  <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('weddingTj') }}>添加商户</Button>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'wedding') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'wedding'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        {selfInfo.indexOf('3') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>婚纱摄影</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚纱摄影预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'photography'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={() => { this.budgetOther('photography') }} name={'photography'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚照风格</p>
                  <Select placeholder="请选择" onChange={this.photographyStyleCtrl} style={{ width: 300 }}>
                    {
                      weddingStyle != '' ? weddingStyle.map(business => (
                        <Option value={business.name} key={business.name}>{business.name}</Option>)) : ''
                    }
                  </Select>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>推荐商户1</p>
                    <div style={{ marginTop: -2 }}>
                      {this.getTodoItem('photographyTj', this.state.photographyTj)}
                    </div>
                  </div>
                  <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('photographyTj') }}>添加商户</Button>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'photography') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'photography'} style={{ width: 200 }} placeholder="请填写备注" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        {selfInfo.indexOf('4') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>{React.$celebrationOrWeddingBanquet()}</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>每桌预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'celebration'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={() => { this.budgetOther('celebration') }} name={'celebration'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>需求桌数</p>
                  {/* <div>
                    <Radio.Group onChange={this.tableChange} name={'celebration'}>
                      <Radio value={'1-10桌'}>1-10桌</Radio>
                      <Radio value={'10-20桌'}>10-20桌</Radio>
                      <Radio value={'20-40桌'}>20-40桌</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><InputNumber onChange={this.tableOther} name={'celebration'} style={{ width: 200 }} placeholder="请填写桌数" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚宴类型</p>
                  {/* <Checkbox.Group style={{ paddingTop: 4 }} options={optionsLeixing} onChange={this.weddingTypeCtrl} /> */}
                  {/* <Radio.Group style={{ paddingTop: 4 }} options={optionsLeixing} onChange={this.weddingTypeCtrl} /> */}

                  <Radio.Group onChange={this.weddingTypeCtrl}>
                    {/* <Radio value={1}>A</Radio>
                    <Radio value={2}>B</Radio>
                    <Radio value={3}>C</Radio>
                    <Radio value={4}>D</Radio> */}
                    {
                      banquetType != '' ? banquetType.map(item => (
                        <Radio key={item.name} value={item.id}>{item.name}</Radio>)) : ''
                    }
                  </Radio.Group>
                  {/* <div style={{ marginTop: -2 }}><Input onChange={this.otherTypeCtrl} style={{ width: 200 }} placeholder="请填写婚宴类型" /></div> */}
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>宴会日期</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'celebrationTime') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>推荐商户1</p>
                    <div style={{ marginTop: -2 }}>
                      {this.getTodoItem('xiyanTj', this.state.xiyanTj)}
                    </div>
                  </div>
                  <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('xiyanTj') }}>添加商户</Button>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'celebration') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'celebration'} style={{ width: 200 }} placeholder="请填写备注" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        {selfInfo.indexOf('5') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>婚车</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚车预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'car'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={() => { this.budgetOther('car') }} name={'car'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>用车日期</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'carTime') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>车数需求</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.carNumCtrl} style={{ width: 200 }} placeholder="请填车数" /></div>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>品牌要求</p>
                    <div style={{ marginTop: -2 }}>
                      {/* <Input onChange={this.carBrandCtrl} style={{ width: 200 }} placeholder="品牌要求" /> */}

                      <Select placeholder="请选择" onChange={this.carBrandCtrl} style={{ width: 200 }}>
                        {
                          carBrand != '' ? carBrand.map(business => (
                            <Option key={business.name} value={business.name}>{business.name}</Option>)) : ''
                        }
                      </Select>
                    </div>
                  </div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'car') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'car'} style={{ width: 200 }} placeholder="请填写备注" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        {selfInfo.indexOf('6') != -1 ? (
          <div className={styles.bus_container}>
            <div className={styles.box}>
              <div className={styles.list}>
                <p className={styles.title}>一站式</p>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预算</p>
                  {/* <div>
                    <Radio.Group onChange={this.budgetChange} name={'oneStop'}>
                      <Radio value={'1-5W'}>1-5W</Radio>
                      <Radio value={'5-10W'}>5-10W</Radio>
                      <Radio value={'10W以上'}>10W以上</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><NumericInput prefix="￥" onChange={() => { this.budgetOther('oneStop') }} name={'oneStop'} style={{ width: 200 }} placeholder="请填写具体预算" /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>婚宴桌数</p>
                  {/* <div>
                    <Radio.Group onChange={this.tableChange} name={'oneStop'}>
                      <Radio value={'1-10桌'}>1-10桌</Radio>
                      <Radio value={'10-20桌'}>10-20桌</Radio>
                      <Radio value={'20-40桌'}>20-40桌</Radio>
                      <Radio value={'其他'}>其他</Radio>
                    </Radio.Group>
                  </div> */}
                  <div style={{ marginTop: -2 }}><InputNumber onChange={this.tableOther} name={'oneStop'} style={{ width: 200 }} placeholder="请填写桌数" /></div>
                </div>
                <div className={styles.rt_content}>
                  <div className={styles.newStore}>
                    <p className={styles.labelName}>推荐商户1</p>
                    <div style={{ marginTop: -2 }}>
                      {this.getTodoItem('oneStopTj', this.state.oneStopTj)}
                    </div>
                  </div>
                  <Button className={styles.addStoreBt} onClick={() => { this.addHotelMerchant('oneStopTj') }}>添加商户</Button>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>预约到店时间</p>
                  <div style={{ marginTop: -2 }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                      style={{ width: 200 }}
                      onChange={(e) => { this.estArrivalTimeChange(e, 'oneStop') }}
                    /></div>
                </div>
                <div className={styles.rt_content}>
                  <p className={styles.labelName}>补充备注</p>
                  <div style={{ marginTop: -2 }}><Input onChange={this.remarkChange} name={'oneStop'} style={{ width: 200 }} placeholder="请填写备注" /></div>
                </div>
              </div>
            </div>
          </div>) : null
        }
        <Form.Item wrapperCol={{ span: 20, offset: 3 }}>
          <Button style={{ width: 100 }} type="primary" onClick={(e) => { this.validateCtrl(e, false) }} loading={submitting}>提交</Button>
          <Button style={{ marginLeft: 50 }} onClick={(e) => { this.validateCtrl(e, true) }} loading={submitting}>转给同事</Button>
        </Form.Item>
      </Fragment>
    );
  }
}
export default BusinessCategory;
