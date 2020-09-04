import styles from "./index.less";
import { Table, Button, InputNumber, Input, Form } from "antd";
import { contactsInfoItem } from '../../data';
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { ContactsOutlined, UsergroupAddOutlined, PlusOutlined } from "@ant-design/icons";



interface contactsInfoProps extends FormComponentProps {
  contactsInfo: Array<contactsInfoItem>,
  editFunction: (id?: any) => void,
  createFunction: () => void,
}

class ContactsInofo extends Component<contactsInfoProps>{

  columns = [
    {
      title: "姓名",
      dataIndex: "userName",
      key: "userName",

    },
    {
      title: "角色",
      dataIndex: "identityText",
      key: "identityText",

    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",

    },
    {
      title: "微信",
      key: "weChat",
      dataIndex: "weChat",


    }, {
      title: "职业",
      key: "occupation",
      dataIndex: "occupation",


    }, {
      title: "方便联系",
      key: "contactTimeText",
      dataIndex: "contactTimeText",


    },
    {
      title: "备注",
      key: "comment",
      dataIndex: "comment",

    }, {
      title: "操作",
      dataIndex: "contactId",
      key: "contactId",
      render: (contactId: string) => {
        return (
          <a onClick={() => { this.linkTo(contactId) }}>编辑</a>
        )
      },
      width: 70,
    }
  ];


  linkTo(id: any) {
    const { editFunction } = this.props;
    editFunction(id);
  }

  render() {
    const { contactsInfo, createFunction } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.headerStyle}>
          <Button size='small' onClick={createFunction}><PlusOutlined />新建联系人</Button>
        </div>
        <div id="components-table-demo-basic">
          <Table size='small' columns={this.columns} dataSource={contactsInfo} pagination={false}
          // components={components}
          />
        </div>
      </div>
    );
  };
}

export default ContactsInofo;
