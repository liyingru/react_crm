import React from 'react';
import Form, { FormComponentProps } from 'antd/es/form';
import { Input, Switch, Button, DatePicker, Radio } from 'antd';
import moment from 'moment';
import CityMultipleSelect from '@/components/CityMultipleSelect';
import { ActivityListItem } from '../../data';
import Model from '@/pages/SunnyRulesManagement/SunnyRulesList/model';
import CrmUtil from '@/utils/UserInfoStorage';


const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CollectionsProps extends FormComponentProps {
  model: ActivityListItem;
  saveFunction: Function;
  onCancel: Function;
  createFunction: Function;
  isCreate: boolean;
}

interface CollectionState {
  cityCodes: string[];
  resetArea: boolean;
}

function disabledDate(current: any) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}


class ActivityEditPageForm extends React.Component<CollectionsProps, CollectionState> {

  state: CollectionState = {
    cityCodes: [],
    resetArea: false,
  };

  constructor(props: CollectionsProps) {
    super(props);
    this.state = {
      cityCodes: props.model?.city_code?.split(',') ?? [],
      resetArea: false,
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { model } = nextProps;
    if (model?.city_code) {
      this.setState({
        cityCodes: model?.city_code?.split(',') ?? [],
        resetArea: false,
      })
    } else if (this.props.model?.city_code) {
      this.setState({
        cityCodes: this.props.model?.city_code?.split(',') ?? [],
        resetArea: false,
      })
    }
  }

  onSaveClick = () => {
    const { saveFunction } = this.props;
    const { form, model } = this.props;

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      console.log(values)
      values.activityId = model.id
      saveFunction(values)
    });
  }

  onCreateClick = () => {
    const { createFunction } = this.props;
    const { form } = this.props;

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      // console.log('values', values)
      createFunction(values)
    });
  }

  onCancelClick = () => {
    const { onCancel } = this.props;
    const { form } = this.props;
    form.resetFields();
    onCancel();
  }

  citySelectChange = (codes: string[]) => {
    const { form } = this.props;
    form.setFieldsValue({
      'cityCode': codes.join(',')
    });
  }

  render() {
    const { form, model, isCreate } = this.props;
    const { getFieldDecorator } = form;
    const { cityCodes } = this.state;
    // console.log('model.order_from', model.order_from)

    return (
      <div style={{ width: '100%' }}>
        <div style={{ color: 'red' }} >提示：如果本次活动对应多个下单位，请用英文逗号隔开</div>
        <Form layout='horizontal'>

          <Form.Item label="活动名称："  >
            {getFieldDecorator('name', {
              initialValue: model.name,
              rules: [{ required: true, message: '请填写活动名称' }]
            })(
              <Input placeholder={'请填写活动名称'} />
            )}
          </Form.Item>

          <Form.Item label="活动描述："  >
            {getFieldDecorator('remark', {
              initialValue: model.remark,
              rules: [{ required: true, message: '请填写活动描述' }]
            })(
              <TextArea placeholder={'请填写活动描述'} />
            )}
          </Form.Item>

          <Form.Item label="活动时间"  >
            {getFieldDecorator('activityTime', {
              initialValue: model.start_time && model.end_time ? [moment(model.start_time, 'YYYY-MM-DD'), moment(model.end_time, 'YYYY-MM-DD')] : undefined,
              rules: [{ required: true, message: '请选择活动时间' }]
            })(
              <RangePicker
                disabledDate={disabledDate}
              />
            )}
          </Form.Item>

          <Form.Item label="活动城市："  >
            {getFieldDecorator('cityCode')(
              <CityMultipleSelect
                reset={this.state?.resetArea}
                citySelectChange={this.citySelectChange}
                selectedCodes={cityCodes}
              />
            )}
          </Form.Item>

          <Form.Item label="绑定下单位："  >
            {getFieldDecorator('orderfrom', {
              initialValue: model.order_from,
              rules: [{ required: false, message: '请填写绑定下单位' }]
            })(
              <TextArea placeholder={'请填写绑定下单位'} />
            )}
          </Form.Item>

          {CrmUtil.getCompanyType() === 1 ?
            <Form.Item label="类型："  >
              {getFieldDecorator('type', {
                initialValue: model.type?.toString() ?? '0',
                rules: [{ required: true, message: '请填选择类型' }]
              })(
                <Radio.Group>
                  <Radio value="0">进leads</Radio>
                  <Radio value="1">直推单</Radio>
                </Radio.Group>
              )}
            </Form.Item> : ''}


          <Form.Item label="活动状态："  >
            {getFieldDecorator('status', {
              initialValue: model?.status == '0' ? false : true,
              rules: [{ required: true, message: '请填选择活动状态' }]
            })(

              model?.status == undefined ? <Switch checkedChildren='开' unCheckedChildren='关' defaultChecked />
                :
                model?.status == '1' ? <Switch checkedChildren='开' unCheckedChildren='关' defaultChecked /> : <Switch checkedChildren='开' unCheckedChildren='关' />
            )}
          </Form.Item>
        </Form>
        <div style={{ justifyContent: 'space-around', display: 'flex' }}>
          <Button type='default' onClick={this.onCancelClick}>取消</Button>
          <Button type='primary' onClick={isCreate === true ? this.onCreateClick : this.onSaveClick}  >确定</Button>
        </div>
      </div>
    );
  }
}

export default Form.create<CollectionsProps>()(ActivityEditPageForm);
