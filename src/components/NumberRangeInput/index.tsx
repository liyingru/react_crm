import React, { Component } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import styles from './index.less';

interface NumberRangeInputState {
  minimumValue?: number | undefined,
  maximumValue?: number | undefined,
  disabled?: false,
  reset?: false,
  error: boolean,
}

interface NumberRangeInputProps extends FormComponentProps {
  myForm?: Form | undefined,
  minimumField?: string | undefined,
  maximumField?: string | undefined,
  required?: boolean,
  minimumValue?: number | undefined,
  maximumValue?: number | undefined,
  disabled?: boolean;
  reset?: boolean;
  minimumValueChange?: (value: number) => void;
  maximumValueChange?: (value: number) => void;
  style?: React.CSSProperties;
}

class NumberRangeInput extends Component<NumberRangeInputProps, NumberRangeInputState> {
  static defaultProps = {
    required: false,
    disabled: false,
    reset: false,
  };

  constructor(props: NumberRangeInputProps) {
    super(props);

    this.state = {
      minimumValue: this.props.minimumValue,
      maximumValue: this.props.maximumValue,
      disabled: false,
      reset: false,
      error: false,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps: any) {
    const that = this;

    if (this.props.minimumField !== nextProps.minimumField ||
      this.props.maximumField !== nextProps.maximumField ||
      this.props.minimumValue !== nextProps.minimumValue ||
      this.props.maximumValue !== nextProps.maximumValue ||
      this.props.disabled !== nextProps.disabled ||
      this.props.reset !== nextProps.reset) {
      this.setState({
        // minimumField: nextProps.minimumField,
        // maximumField: nextProps.maximumField,
        minimumValue: nextProps.minimumValue,
        maximumValue: nextProps.maximumValue,
        disabled: nextProps.disabled ? nextProps.disabled : false,
        reset: this.props.reset !== nextProps.reset ? nextProps.reset : false,
      }, () => {
        if (that.state.reset) {
          console.log("我要重置了");
          that.setState({
            minimumValue: -1,
            maximumValue: -1,
          });
        }
      });
    }
  }

  vv = (minEvent?: React.FocusEvent<HTMLInputElement>, maxEvent?: React.FocusEvent<HTMLInputElement>) => {
    try {
      const { myForm, minimumField, maximumField } = this.props;
      let min = minEvent?.target.value;
      let max = maxEvent?.target.value;
      if ((this.state.maximumValue && min) && (min > this.state.maximumValue)) {
        var field = {};
        field[minimumField] = myForm?.getFieldValue(maximumField);
        myForm?.setFieldsValue(field);

        // this.setState({
        //   error: true
        // });
      } else if ((this.state.minimumValue && max) && (max < this.state.minimumValue)) {
        var field = {};
        field[maximumField] = myForm?.getFieldValue(minimumField);
        myForm?.setFieldsValue(field);
        // this.setState({
        //   error: true
        // });
      }
      else {
        // this.setState({
        //   error: false
        // });
      }
    } catch (err) {
      console.log('出错了 ' + err.message);
    }
  }

  onMinChange = (value: number | undefined) => {
    console.log(`最小值 ${value}`);
    if (value) {
      this.setState({
        minimumValue: value
      });
      const { minimumValueChange } = this.props;
      minimumValueChange && minimumValueChange(value);
    }
  }

  onMinBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    this.vv(e, undefined);
  }

  onMaxChange = (value: number | undefined) => {
    console.log(`最大值 ${value}`);
    if (value) {
      this.setState({
        maximumValue: value
      });
      const { maximumValueChange } = this.props;
      maximumValueChange && maximumValueChange(value);
    }
  }

  onMaxBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    this.vv(undefined, e);
  }

  render() {
    const { minimumValue, maximumValue, error } = this.state;
    const { minimumField, maximumField, required, myForm, isMoney } = this.props;
    return (
      <div style={this.props.style}>
        <Input.Group compact >
          {
            minimumField && myForm ? myForm.getFieldDecorator(minimumField, { initialValue: minimumValue, rules: [{ required: required, message: '请输入最小值' }], })(
              <InputNumber
                style={{ width: '40%' }}
                placeholder='最小值'
                min={0}
                // formatter={isMoney ? value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                // parser={isMoney ? value => value.replace(/\￥\s?|(,*)/g, '') : undefined}
                onChange={this.onMinChange}
                onBlur={this.onMinBlur} />
            ) : <InputNumber
                style={{ width: '40%' }}
                placeholder='最小值'
                min={0}
                // formatter={isMoney ? value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                // parser={isMoney ? value => value.replace(/\￥\s?|(,*)/g, '') : undefined}
                defaultValue={minimumValue}
                onChange={this.onMinChange}
                onBlur={this.onMinBlur} />
          }
          <Input
            style={{
              width: '20%',
              borderLeft: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              color: '#4a4a4a',
              textAlign: 'center'
            }}
            placeholder="~"
            disabled
          />
          {
            maximumField && myForm ? myForm.getFieldDecorator(maximumField, { initialValue: maximumValue, rules: [{ required: required, message: '请输入最大值' }], })(
              <InputNumber
                style={{ width: '40%', borderLeft: 0 }}
                placeholder='最大值'
                min={0}
                // formatter={isMoney ? value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                // parser={isMoney ? value => value.replace(/\￥\s?|(,*)/g, '') : undefined}
                onChange={this.onMaxChange}
                onBlur={this.onMaxBlur} />
            ) : <InputNumber
                style={{ width: '40%', borderLeft: 0 }}
                placeholder='最大值'
                min={0}
                // formatter={isMoney ? value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                // parser={isMoney ? value => value.replace(/\￥\s?|(,*)/g, '') : undefined}
                defaultValue={maximumValue}
                onChange={this.onMaxChange}
                onBlur={this.onMaxBlur} />
          }
        </Input.Group>
        <span className={error ? styles.error : styles.ok}>最小值大于最大值</span>
      </div>
    );
  }
}

export default Form.create<NumberRangeInputProps>()(NumberRangeInput);
