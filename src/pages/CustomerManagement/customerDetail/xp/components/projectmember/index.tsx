import { Table, notification, Button, Card, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from "dva";
import React, { Component, Dispatch } from 'react';
import { Action } from "redux";
import { StateType } from "../../model";
import { PlusOutlined } from '@ant-design/icons';
const { confirm } = Modal;


interface ProjectMemberState {
  // 项目成员 --------- 


}

interface ProjectMemberProps extends FormComponentProps {
  customerId: string,
  type: string,
  category: string,
  dispatch: Dispatch<
    Action<
      | 'customerDetailMode/getProjectMemberList'
      | 'customerDetailMode/deleteProjectMember'

    >
  >;
  loading: boolean;
  customerDetailMode: StateType;

  newProjectMembers: Function;
  editProjectMembers: Function;
}

@connect(
  ({
    customerDetailMode,
    loading,
  }: {
    customerDetailMode: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerDetailMode,
    loading: loading.models.customerDetailMode,
  }),
)

class ProjectMember extends Component<ProjectMemberProps, ProjectMemberState>{

  // eslint-disable-next-line react/sort-comp
  constructor(props: ProjectMemberProps) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    const { dispatch, customerId, type, category } = this.props;
    const values = {
      'customerId': customerId,
      'type': type,
      'category': category
    }

    dispatch({
      type: 'customerDetailMode/getProjectMemberList',
      payload: values,
    })

  }

  componentWillReceiveProps(nextProps: any) {

  }



  deleteProjectMember = (item: any) => {

    const { dispatch, customerId, type } = this.props;
    const that = this
    const valuesResult = {
      'action': '3',
      'type': type,
      'category': item.category_id,
      'customerId': customerId,
      'teamUserIds': item.team_ids
    }

    confirm({
      title: '是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        dispatch({
          type: 'customerDetailMode/deleteProjectMember',
          payload: valuesResult,
          callback: that.onDeleteCallback,
        });
      },
      onCancel() {
      },
    });

  }

  //删除回调
  onDeleteCallback = (status: boolean, msg: string) => {
    const { dispatch, customerId, type, category } = this.props;
    if (status) {
      message.success("删除成功");
      const values = {
        'customerId': customerId,
        'type': type,
        'category': category
      }

      dispatch({
        type: 'customerDetailMode/getProjectMemberList',
        payload: values,
      })

    }
  };

  render() {
    const { customerDetailMode: { projectMemberList } } = this.props
    return (
      <div style={{ width: '100%', height: '100%' }}>

        <Button style={{ marginTop: 15 }} size="small" onClick={(e) => { this.props?.newProjectMembers() }} ><PlusOutlined />添加项目成员</Button>


        <div style={{ width: '100%' }}>
          {
            projectMemberList.length > 0 ? projectMemberList.map((item, index) => (

              <div style={{ marginTop: 30 }}>
                <span style={{ width: '100%' }}>
                  {item.category_name}品类   <a style={{ marginLeft: 40 }} onClick={() => this.props?.editProjectMembers(item)}>编辑</a>   <a style={{ marginLeft: 10 }} onClick={() => this.deleteProjectMember(item)}>删除</a><br />

                    成员：{item.team_user}<br />
                </span>
              </div>

            )
            ) : null
          }
        </div>
        <div style={{ marginTop: 20, marginLeft: 15, visibility: projectMemberList.length > 0 ? 'hidden' : 'visible' }}><label >暂无项目成员</label></div>

      </div>
    );
  }
}


export default ProjectMember;
