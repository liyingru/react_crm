
import React, { Component } from 'react';
import {
  Card,
  Form,
  Modal,
  Tree,
  Button,
  message,
  Icon,
} from 'antd';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { StateType } from './model';
import CustomerFromPages from './components/newAndEditCustomerFrom';
import { CustomerFromConfigDataItem } from './data';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

interface CustomerFromConfigProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'customerFromConfig/channelGetList'
      | 'customerFromConfig/getEditChannelList'
    >
  >;
  loading: boolean;
}


interface CustomerFromConfigState {
  // 展示新增或者编辑客资来源
  isShowNewAndEditCustomerFrom: boolean,
  // 编辑客资来源对象
  showNewAndEditCustomerFromModel: CustomerFromConfigDataItem,
  // 1 是添加 2是修改 
  showNewAndEditType: number,
  // 展示编辑按钮id
  showEditButtonId: number,

  data: CustomerFromConfigDataItem[],
}

@connect(
  ({
    customerFromConfig,
    loading,
  }: {
    customerFromConfig: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerFromConfig,
    loading: loading.models.userManagementModel,
  }),
)

class custoemrFromConfig extends Component<CustomerFromConfigProps, CustomerFromConfigState> {
  state: CustomerFromConfigState = {
    // 展示新增或者编辑客资来源
    isShowNewAndEditCustomerFrom: false,
    // 编辑客资来源对象
    showNewAndEditCustomerFromModel: {},
    // 1 是添加 2是修改 
    showNewAndEditType: 1,

    // 展示编辑按钮id
    showEditButtonId: -1,

    data: []
  };

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFromConfig/channelGetList',
      payload: {},
    });

    // 一并获取对应全部渠道选择项
    dispatch({
      type: 'customerFromConfig/getEditChannelList',
      payload: {},
    })
  }

  /// ------------编辑客资来源 ------------ 

  // 新增一个客资来源
  showAddNewCustomerFromFunction = (model: CustomerFromConfigDataItem) => {
    if (model) {
      this.setState({
        isShowNewAndEditCustomerFrom: true,
        showNewAndEditCustomerFromModel: model,
        showNewAndEditType: 1
      })
    } else {
      this.setState({
        isShowNewAndEditCustomerFrom: true,
        showNewAndEditType: 1
      })
    }
  }

  // 展示编辑客资来源方法
  showEditCustomerFromFunction = (model: CustomerFromConfigDataItem) => {
    if (model) {
      this.setState({
        isShowNewAndEditCustomerFrom: true,
        showNewAndEditCustomerFromModel: model,
        showNewAndEditType: 2
      })
    } else {
      this.setState({
        isShowNewAndEditCustomerFrom: true,
        showNewAndEditType: 2
      })
    }
  }

  // 取消编辑客资来源方法
  hiddenEditCustomerFromFunction = () => {
    this.setState({
      isShowNewAndEditCustomerFrom: false,
      showNewAndEditCustomerFromModel: undefined,
      showNewAndEditType: 1
    })
  }
  // 请求编辑客资来源方法
  editAndNewCustomerFromRequetsFuntion = (values: any, objc: any, type: number) => {

    console.log(values);

    // 1 是添加 2是修改 

    if (type == 1) {
      console.log('请求了');

      Axios.post(URL.addNewChannelData, values).then(
        res => {
          if (res.code == 200) {
            message.success('添加成功');
            objc.resetFields()
            this.hiddenEditCustomerFromFunction()
            this.getData()
          }
        }
      );

    } else {
      Axios.post(URL.editChannelData, values).then(
        res => {
          if (res.code == 200) {
            message.success('修改成功');
            objc.resetFields()
            this.hiddenEditCustomerFromFunction()
            this.getData()
          }
        }
      );
    }
  }

  // 点击对应渠道展开
  treeNodeRightSelectAction = () => {

  }

  // 删除对应的渠道
  onDeleteClick = (model: CustomerFromConfigDataItem) => {
    let values = {}
    values['channelId'] = model.id
    this.showConfirm(values)
  }

  showConfirm = (values: any) => {
    const { confirm } = Modal;
    const that = this;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除该渠道？该操作成功之后将无法恢复',
      onOk() {
        Axios.post(URL.delChannelData, values).then(
          res => {
            if (res.code == 200) {
              message.success('删除操作成功');
              that.hiddenEditCustomerFromFunction()
              that.getData()
            }
          }
        );
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }

  onHoverMenuItem = (id: string) => {
    this.setState({
      showEditButtonId: id
    })
  }

  onLeaveMenuItem = (id: string) => {
    this.setState({
      showEditButtonId: -1
    })
  }


  // UI返回数据
  recursiveUIData = (item: CustomerFromConfigDataItem, level: number) => {
    const { TreeNode } = Tree;

    if (item?.childlist && item?.childlist.length > 0) {
      return (
        <TreeNode title={
          <div style={{ width: '100%', display: 'flex' }} onMouseEnter={() => (
            this.onHoverMenuItem(item.id)
          )} onMouseLeave={() => (
            this.onLeaveMenuItem(item.id)
          )}>
            {item?.status == 1 ? <div>({level}级) {item.name}</div> : <div style={{ color: '#B6BCC1' }}>({level}级) {item.name}</div>}
            <div style={{ visibility: (this.state.showEditButtonId && this.state.showEditButtonId == item?.id) ? 'visible' : 'hidden' }} >
              <a style={{ marginLeft: 20 }} onClick={() => (
                this.showEditCustomerFromFunction(item)
              )}> <EditOutlined /></a>
              <a style={{ marginLeft: 5 }} onClick={() => (
                this.onDeleteClick(item)
              )}> <DeleteOutlined /></a>
              {(item?.status && item?.status === 1) ?
                <a style={{ marginLeft: 5 }} hidden={!(level < 3)} onClick={() => (
                  this.showAddNewCustomerFromFunction(item)
                )} > <PlusOutlined /></a>
                : ''}
            </div>

          </div>

        }
          key={item.id} onRightClick={this.treeNodeRightSelectAction}
          selectable={false}

        >
          {item?.childlist.map(subItem => this.recursiveUIData(subItem, (level + 1)))}
        </TreeNode>
      )
    }
    return (
      <TreeNode title={
        <div style={{ width: '100%', display: 'flex' }} onMouseEnter={() => (
          this.onHoverMenuItem(item?.id)
        )} onMouseLeave={() => (
          this.onLeaveMenuItem(item?.id)
        )} >
          {item?.status == 1 ? <div>({level}级) {item.name}</div> : <div style={{ color: '#B6BCC1' }}>({level}级) {item.name}</div>}
          <div style={{ visibility: (this.state.showEditButtonId && this.state.showEditButtonId == item?.id) ? 'visible' : 'hidden' }}>

            <a style={{ marginLeft: 20 }} onClick={() => (
              this.showEditCustomerFromFunction(item)
            )}> <EditOutlined /></a>

            <a style={{ marginLeft: 5 }} onClick={() => (
              this.onDeleteClick(item)
            )}> <DeleteOutlined /></a>
            {(item?.status && item?.status === 1) ?
              <a style={{ marginLeft: 5 }} hidden={!(level < 3)} onClick={() => (
                this.showAddNewCustomerFromFunction(item)
              )} > <PlusOutlined /></a>
              : ''}
          </div>

        </div>

      }
        key={item.id} onRightClick={this.treeNodeRightSelectAction}
        selectable={false}
      />
    )
  }

  render() {

    const { customerFromConfig: { data, allSelectChannelList } } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ fontSize: 18, fontWeight: 'bolder' }}>
            客资来源
        <Button style={{ marginLeft: 20 }} type='default' onClick={() => (
              this.showAddNewCustomerFromFunction(undefined)
            )}>添加1级渠道</Button>
          </div>
          <Tree >
            {data && data?.map(item => this.recursiveUIData(item, 1))}
          </Tree>
        </Card>

        {this.state?.isShowNewAndEditCustomerFrom ? <Modal
          visible={this.state?.isShowNewAndEditCustomerFrom}
          onCancel={this.hiddenEditCustomerFromFunction}
          footer={false}
          title={this.state?.showNewAndEditType == 1 ? '新增客资来源' : '编辑客资来源'}
        >
          <CustomerFromPages
            type={this.state?.showNewAndEditType}
            data={this.state?.showNewAndEditCustomerFromModel}
            saveFunction={this.editAndNewCustomerFromRequetsFuntion}
            onCancel={this.hiddenEditCustomerFromFunction}
            allChannelList={allSelectChannelList}
          />
        </Modal> : <div />}


      </PageHeaderWrapper>
    );
  }

}

export default Form.create<CustomerFromConfigProps>()(custoemrFromConfig);
