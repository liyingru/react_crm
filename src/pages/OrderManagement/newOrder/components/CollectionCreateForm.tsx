


import { Button, Modal, Form, Input, Radio, Checkbox, DatePicker, Select, Icon } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './BusinessCategory.less';
import { FormComponentProps } from 'antd/es/form';
let id = 1;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component<FormComponentProps> {
    constructor(props: FormComponentProps) {
      super(props);
      console.log(this.props)
      console.log(this.props.form.getFieldValue('keys'))
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        label={index === 0 ? 'Passengers' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    // return ( <div>asd</div> );
    return ({formItems})
    }

  },
);
class CollectionsPage extends React.Component {
  render() {
      return (
          <div>
              <CollectionCreateForm/>
              
          </div>
      );
  }
}
export default CollectionsPage;