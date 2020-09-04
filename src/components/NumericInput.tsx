import { Input, Tooltip } from 'antd';
import React from 'react';


function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

class NumericInput extends React.Component {

  onChange = (e) => {
    const { onChange } = this.props;
    const { value } = e.target;
    // const reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
    const reg = /^([0-9]|\d[0-9])$|^[0-9]\d{0,8}\.\d{0,2}$|^[0-9]\d{0,8}$/
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {

      this.props.onChange(e);
    }
  }

  // '.' at the end or only '-' in the input box.
  onBlur = (e) => {
    const { value, onBlur, onChange } = this.props;
    // if (value!=undefined && value.length > 0) {
    //   if (value.charAt(value.length - 1) === '.' || value === '-') {
    //    var val = value.slice(0, -1)
    //    e.target.value = val
    //     onChange(e);
    //   }
    // }
    if (onBlur) {
      onBlur();
    }
  }

  render() {
    const { value } = this.props;

    return (

      <Input
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
        maxLength={25}
      />

    );
  }
}


export default NumericInput;
// export default Form.create<FormComponentProps>()(SellerCategory);
