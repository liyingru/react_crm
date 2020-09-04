import React, { Component, ReactNode } from 'react';
import Form from 'antd/es/form';
const FormItem = Form.Item;
import { ConfigListItem } from '@/pages/CustomerManagement/commondata';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Select, Popconfirm, Button, Radio, Input, message } from 'antd';
import Distribution from '../Distribution';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ReceiverUserData, ReceiverGroupData } from '../../model';
import { IntoGroupDatum } from '@/pages/SunnyRulesManagement/RuleDetail/data';
const { Option } = Select;

interface NewRecorderProps {
  getThis: (childComponent: NewRecorder) => void;
  channelsData: ConfigListItem[],
  form: WrappedFormUtils<any>,
  receiverUsers: ReceiverUserData[],
  receiverGroups: ReceiverGroupData[],
  editValue?: IntoGroupDatum[]
}

interface NewRecorderState {
  channelsData: ConfigListItem[] | undefined;
  isReadyForEdit: boolean;
  recordersCount: number;
  /** 已经选择的客资来源，二维数组，第一层的index表示第几组提供人，第二层表示指定组提供人的客资来源数组 */
  selelctedChannelsByRecorder: string[][];
  deletePopVisible: boolean;
  isShowTabs: any[];
  choiceGoupId: any[];
  choiceUserId: any[];
  dialogTab: any;
  isInviteTabs: any[];

  initialChannels: any[];
  initialIsShows: any[];
  initialRoutineReceiveTypes: any[];
  initialIsInvites: any[];

}

class NewRecorder extends Component<NewRecorderProps, NewRecorderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelsData: undefined,
      isReadyForEdit: false,
      recordersCount: 1,
      selelctedChannelsByRecorder: new Array(),
      deletePopVisible: false,
      isShowTabs: [1],
      choiceGoupId: [],
      choiceUserId: [],
      dialogTab: [0],
      isInviteTabs: [0],

      initialChannels: [],
      initialIsShows: [],
      initialRoutineReceiveTypes: [],
      initialIsInvites: [],
    };
  }

  componentDidMount() {
    this.props.getThis(this);
  }

  // componentWillReceiveProps(nextProps: NewRecorderProps) {
  //   console.log(" --->  componentWillReceiveProps");
  //   const editValue = nextProps.editValue;
  //   if(editValue) {
  //     console.log("props channels pre  = " + JSON.stringify(nextProps.channelsData));
  //     // 把正在编辑的渠道信息，加入到待选渠道列表中去。
  //     editValue.map(item => {
  //       const channelIds:string[] = item.channel_id.split(',');
  //       const channelNames:string[] = item.channel_name_txt.split(';');
  //       channelIds.map((id, index) => {
  //         const valueLabelPair = {
  //           value: parseInt(id),
  //           label: channelNames[index],
  //         }
  //         nextProps.channelsData.push(valueLabelPair);
  //       })
  //     })
  //   }
  // }

  // componentWillUpdate() {
  //   console.log(" --->  componentWillUpdate");
  // }

  componentWillMount() {
    // console.log(" --->  componentWillMount");
    const { channelsData } = this.props;
    console.log("props channels pre  = " + JSON.stringify(channelsData));
    const editValue = this.props.editValue;
    if (editValue) {
      // 把正在编辑的渠道信息，加入到待选渠道列表中去。
      editValue.map(item => {
        const channelIds: string[] = item.channel_id.split(',');
        const channelNames: string[] = item.channel_name_txt.split(';');
        channelIds.map((id, index) => {
          const valueLabelPair = {
            value: parseInt(id),
            label: channelNames[index],
          }
          channelsData.push(valueLabelPair);
        })
      })
      // console.log("props channels after = " + JSON.stringify(channelsData));

      // 编辑-初始值回显-客资来源
      const initialChannels = new Array();
      const selelctedChannelsByRecorder = new Array(editValue.length);
      for (let i = 0; i < editValue.length; i++) {
        const channelIdsPerRecordStr: string[] = editValue[i].channel_id.split(',');
        const channelIdsPerRecord: number[] = new Array(channelIdsPerRecordStr.length);
        channelIdsPerRecordStr.map((item, index) => {
          channelIdsPerRecord[index] = parseInt(item);
        })
        selelctedChannelsByRecorder[i] = channelIdsPerRecord;
        initialChannels[i] = new Array(0);
        for (let k = 0; k < channelIdsPerRecord.length; k++) {
          const targetChannel = channelsData.filter(channelConfig => channelConfig.value + "" == channelIdsPerRecord[k] + "");
          initialChannels[i].push({
            key: channelIdsPerRecord[k],
            label: targetChannel[0] ? targetChannel[0].label : "没有相应渠道"
          })
        }
      }

      // 编辑-初始值回显-录入可见
      const initialIsShows = new Array();
      for (let i = 0; i < editValue.length; i++) {
        initialIsShows[i] = editValue[i].is_show;
      }

      // console.log("initialIsShows = " + JSON.stringify(initialIsShows));

      // 编辑-初始值回显-常规接收人类型 组/人
      const initialRoutineReceiveTypes = new Array();
      const dialogTab = new Array();
      for (let i = 0; i < editValue.length; i++) {
        const currentRecorderType = editValue[i].routine_receive_user && editValue[i].routine_receive_user.length > 0 ? 1 : 0;
        initialRoutineReceiveTypes[i] = currentRecorderType;
        dialogTab[i] = currentRecorderType;
      }

      // 编辑-初始值回显-常规接收组+常规接收人
      const choiceGoupId: string[] = new Array();
      const choiceUserId: string[] = new Array();
      for (let i = 0; i < editValue.length; i++) {
        choiceGoupId[i] = editValue[i].routine_receive_group;
        choiceUserId[i] = editValue[i].routine_receive_user;
      }

      // 编辑-初始值回显-指定邀约
      const initialIsInvites = new Array();
      for (let i = 0; i < editValue.length; i++) {
        initialIsInvites[i] = editValue[i].is_invite;
      }
      // console.log("initialIsInvites = " + JSON.stringify(initialIsInvites));

      this.setState({
        recordersCount: selelctedChannelsByRecorder.length,
        selelctedChannelsByRecorder,
        initialChannels,
        initialIsShows,
        initialRoutineReceiveTypes,
        dialogTab,
        choiceGoupId,
        choiceUserId,
        initialIsInvites,
      }, () => {
        this.setState({
          isReadyForEdit: true,
        })
      })
    } else {
      this.setState({
        isReadyForEdit: true,
      })
    }

    this.setState({
      channelsData
    })

  }

  clearForms = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      recordersCount: 1,
      selelctedChannelsByRecorder: new Array(),
      deletePopVisible: false,
      isShowTabs: [1],
      choiceGoupId: [],
      choiceUserId: [],
      dialogTab: [0],
      isInviteTabs: [0],
    })
  }

  handleAddRecorder = () => {
    // console.log("new count = " + (this.state.recordersCount+1))
    const { dialogTab } = this.state;
    dialogTab.push(0);
    this.setState({
      recordersCount: this.state.recordersCount + 1,
    })

  }

  handleDeleteRecorder = (index: number) => {
    const recordersCount = this.state.recordersCount - 1;
    this.setState({
      recordersCount,
    })

    //客资来源
    const { selelctedChannelsByRecorder } = this.state;  //把已选中的渠道拿到，从中删除对应的提供人组
    console.log("删除前 selelctedChannelsByRecorder = " + JSON.stringify(selelctedChannelsByRecorder));
    // const deletedSelectedChannels = selelctedChannelsByRecorder[index];
    selelctedChannelsByRecorder.splice(index, 1);
    console.log("删除后 selelctedChannelsByRecorder = " + JSON.stringify(selelctedChannelsByRecorder));
    this.setState({ selelctedChannelsByRecorder });
    // 如果删除的模块中之前已经选择过某些客资来源，需要把这些客资来源释放出来，以供其他组的提供人使用。
    // 这里只需要把state中的selectedIds更新一下，去掉这些客资来源就可以了

    const { channelsData } = this.state;
    selelctedChannelsByRecorder.map((channels, index) => {
      const channelObj = {};
      channelObj['channelId' + index] = [];
      channels.map(channelId => {
        const targetChannelData = channelsData?.filter(channelData => channelData.value == channelId)[0];
        channelObj['channelId' + index].push({
          key: channelId,
          label: targetChannelData ? targetChannelData.label : "没有相应渠道"
        });
      })
      // 刷新删除后剩余的提供人块的数据
      this.props.form.setFieldsValue(channelObj);
    })
    if (recordersCount > selelctedChannelsByRecorder.length) {
      for (let i = selelctedChannelsByRecorder.length; i < recordersCount; i++) {
        const channelObj = {};
        channelObj['channelId' + i] = undefined;
        this.props.form.setFieldsValue(channelObj);
      }
    }

    // this.props.form.resetFields(["channelId"+index, "isShow"+index,  "isInvite"+index ]);

    const { isShowTabs } = this.state;
    isShowTabs.splice(index, 1);
    this.setState({ isShowTabs });
    isShowTabs.map(isShowTab => {
      const isShowTabObj = {};
      isShowTabObj["isShow" + index] = isShowTab;
      // console.log("设置isShowTabs值 = " + JSON.stringify(isShowTabObj));
      this.props.form.setFieldsValue(isShowTabObj);
    })

    const { dialogTab } = this.state;
    dialogTab.splice(index, 1);
    this.setState({ dialogTab })
    dialogTab.map(dialogType => {
      const dialogTabObj = {};
      dialogTabObj["receiverTypeForRecorder" + index] = dialogType;
      this.props.form.setFieldsValue(dialogTabObj);
    })


    const { choiceGoupId, choiceUserId } = this.state;
    choiceGoupId.splice(index, 1);
    this.setState({
      choiceGoupId,
    });
    choiceUserId.splice(index, 1);
    this.setState({
      choiceUserId,
    });

    const { isInviteTabs } = this.state;
    isInviteTabs.splice(index, 1);
    this.setState({ isInviteTabs })
    isInviteTabs.map(isInvite => {
      const isInviteObj = {};
      isInviteObj["isInvite" + index] = isInvite;
      this.props.form.setFieldsValue(isInviteObj);
    })

    // 删除时，如果是”编辑状态&&删除的是原本有回显初始值“的，需要把初始值也删除掉。防止再加回来时，显示原来的初始值。
    if (this.props.editValue && this.props.editValue.length > index) {
      if (this.state.initialChannels && this.state.initialChannels[index]) {
        const initialChannels = this.state.initialChannels;
        initialChannels.splice(index, 1);
        this.setState({
          initialChannels
        })
      }
      if (this.state.initialIsShows && this.state.initialIsShows[index]) {
        const initialIsShows = this.state.initialIsShows;
        initialIsShows.splice(index, 1);
        this.setState({
          initialIsShows
        })
      }
      if (this.state.initialRoutineReceiveTypes && this.state.initialRoutineReceiveTypes[index]) {
        const initialRoutineReceiveTypes = this.state.initialRoutineReceiveTypes;
        initialRoutineReceiveTypes.splice(index, 1);
        this.setState({
          initialRoutineReceiveTypes
        })
      }
      if (this.state.choiceGoupId && this.state.choiceGoupId[index]) {
        const { choiceGoupId } = this.state;
        choiceGoupId.splice(index, 1);
        this.setState({
          choiceGoupId
        })
      }
      if (this.state.choiceUserId && this.state.choiceUserId[index]) {
        const { choiceUserId } = this.state;
        choiceUserId.splice(index, 1);
        this.setState({
          choiceUserId
        })
      }
      if (this.state.initialIsInvites && this.state.initialIsInvites[index]) {
        const initialIsInvites = this.state.initialIsInvites;
        initialIsInvites.splice(index, 1);
        this.setState({
          initialIsInvites
        })
      }
    }
  }

  handleChangeChannels = (values: { key: string, label: ReactNode }[], index: number) => {
    let { selelctedChannelsByRecorder } = this.state;
    // console.log("ChangeChannels " + index + "pre = " + JSON.stringify(selelctedChannelsByRecorder[index]));
    selelctedChannelsByRecorder[index] = values.flatMap((item) => item.key);
    this.setState({
      selelctedChannelsByRecorder,
    })
    // console.log("ChangeChannels " + index + "after = " + JSON.stringify(selelctedChannelsByRecorder[index]));
  }

  handledeletePopVisibleChange = (deletePopVisible: boolean, index: number) => {
    if (!deletePopVisible) {
      this.setState({ deletePopVisible });
      return;
    }
    // 是否能直接删除
    if (false) { // 直接删除
      this.setState({ deletePopVisible: false });
      this.handleDeleteRecorder(index);
    } else {
      this.setState({ deletePopVisible }); // show the popconfirm
    }
  };

  handleChangeIsShow = (e: any, index: any) => {
    let value = e.target.value;
    const { isShowTabs } = this.state;
    isShowTabs[index] = value;
    this.setState({
      isShowTabs
    })
  }

  // 切换是否制定邀约人
  handleChangeIsInvite = (e: any, index: any) => {
    let value = e.target.value;
    const { isInviteTabs } = this.state;
    isInviteTabs[index] = value;
    this.setState({
      isInviteTabs
    })
  }

  // 切换组和人
  choicePerson = (e: any, index: any) => {
    let value = e.target.value;
    const dialogTab = this.state.dialogTab;
    dialogTab[index] = value;
    this.setState({
      dialogTab
    })
  }

  // 选择组和人
  dataChoiceCtrl = (data: any, tab: any, index: number) => {
    // console.log('tab', tab)
    // console.log('data', data)
    if (tab == 0) {
      const choiceGoupId = this.state.choiceGoupId;
      choiceGoupId[index] = data.join(',');
      this.setState({
        choiceGoupId: choiceGoupId,
      });
    }
    if (tab == 1) {
      const choiceUserId = this.state.choiceUserId;
      choiceUserId[index] = data.join(',');
      this.setState({
        choiceUserId: choiceUserId,
      });
    }

    const routineUserOrGroupValue = {};
    routineUserOrGroupValue['routineUserOrGroup' + index] = data ? data : undefined;
    this.props.form.setFieldsValue(routineUserOrGroupValue)
  }

  renderDeleteRecorder = (index: number) => {
    if (index > 0) {
      return (
        <Popconfirm
          title="确定删除?"
          visible={this.state.deletePopVisible}
          onVisibleChange={(visible: boolean) => this.handledeletePopVisibleChange(visible, index)}
          onConfirm={() => this.handleDeleteRecorder(index)}
          onCancel={() => this.setState({ deletePopVisible: false })}
          okText="是"
          cancelText="否"
        >
          <a >
            <DeleteOutlined style={{ fontSize: 15 }} />
          </a>
        </Popconfirm>
      )
    } else {
      return null;
    }
  }

  radioStyle = {
    width: 60,
    textAlign: 'center',
  };

  render() {
    const { isReadyForEdit } = this.state;
    if (!isReadyForEdit) {
      return null;
    }
    const { form: { getFieldDecorator }, receiverUsers, receiverGroups, editValue } = this.props;
    const { channelsData } = this.state;
    console.log("render中的 channelsData = " + JSON.stringify(channelsData));
    const { selelctedChannelsByRecorder } = this.state;
    // console.log("render中的 selelctedChannelsByRecorder = " + JSON.stringify(selelctedChannelsByRecorder));
    let selectedContainer = new Array();
    selelctedChannelsByRecorder.map(selectedArr => {
      selectedContainer.push(...selectedArr);
    })

    // console.log("render中过滤前的总选项 channelsData = " + JSON.stringify(channelsData));
    const filteredChannels = channelsData?.filter((channel, index) => {
      return selectedContainer.indexOf(channel.value) < 0;
    }) || [];

    console.log("render中过滤后的选项：filteredChannels = " + JSON.stringify(filteredChannels));

    const arr = new Array(this.state.recordersCount);
    for (let i = 0; i < this.state.recordersCount; i++) {
      arr[i] = "recorder";
    }

    let selectedChannelCount = 0;

    selelctedChannelsByRecorder.map(channels => selectedChannelCount += channels.length);

    const realSelectedChannelsByRecorder = selelctedChannelsByRecorder.filter(item => item.length > 0);
    const addRecorderButtonVisible = filteredChannels.length > (this.state.recordersCount - realSelectedChannelsByRecorder.length);
    return (
      <div>
        {
          arr.map((item, index) => {
            return (
              <Card size="small" bordered={true} title={"提供人" + (index + 1) + "组"} style={{ marginTop: index == 0 ? 0 : 10 }}
                extra={
                  index > 0 && (
                    <a onClick={() => this.handleDeleteRecorder(index)}>
                      <DeleteOutlined style={{ fontSize: 15 }} />
                    </a>
                  )
                }>
                <FormItem label="客资来源">
                  {getFieldDecorator("channelId" + index, {
                    rules: [{ required: true, message: '请选择客资来源' }],
                    initialValue: editValue ? this.state.initialChannels[index] : undefined,
                  })(
                    <Select
                      mode="multiple"
                      allowClear={true}
                      optionFilterProp="children"
                      style={{ width: '100%', maxHeight: 200, overflow: "scroll" }}
                      placeholder="请选择客资来源"
                      labelInValue={true}
                      onChange={(values: { key: string, label: ReactNode }[]) => this.handleChangeChannels(values, index)}
                    >
                      {
                        filteredChannels.map(channel => (
                          <Option key={channel.value} value={channel.value}>{channel.label}</Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>

                <FormItem label="录入可见">
                  {getFieldDecorator('isShow' + index, {
                    rules: [{ required: true, message: "录入可见必选" }],
                    initialValue: editValue && this.state.initialIsShows.length > index ? this.state.initialIsShows[index] : 1
                  })(
                    <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }}
                      onChange={(e) => { this.handleChangeIsShow(e, index) }}
                    >
                      <Radio.Button style={this.radioStyle} value={1} key={1}>开 启</Radio.Button>
                      <Radio.Button style={this.radioStyle} value={0} key={0}>关 闭</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem label="提供人">
                  {getFieldDecorator('receiverTypeForRecorder' + index,
                    {
                      rules: [{ required: true, message: "请选择提供人" }],
                      initialValue: (editValue && this.state.initialRoutineReceiveTypes.length > index) ? this.state.initialRoutineReceiveTypes[index] : 0
                    })(
                      <Radio.Group
                        buttonStyle="solid" size="small" style={{ width: '100%' }}
                        onChange={(e) => { this.choicePerson(e, index) }}
                      >
                        <Radio.Button style={this.radioStyle} value={0} key={0}>按组名</Radio.Button>
                        <Radio.Button style={this.radioStyle} value={1} key={1}>按人名</Radio.Button>
                      </Radio.Group>
                    )}
                </FormItem>
                {getFieldDecorator('routineUserOrGroup' + index,
                  { rules: [{ required: true, message: "请选择常规接收人" }], initialValue: this.state.dialogTab[index] == 0 ? (this.state.choiceGoupId[index] && this.state.choiceGoupId[index].length > 0 ? this.state.choiceGoupId[index] : undefined) : (this.state.choiceUserId[index] && this.state.choiceUserId[index].length > 0 ? this.state.choiceUserId[index] : undefined) })(
                    <Distribution
                      tab={this.state.dialogTab[index] ? this.state.dialogTab[index] : 0}
                      dataCtrl={(data, tab) => this.dataChoiceCtrl(data, tab, index)}
                      receiverUsers={receiverUsers}
                      receiverGroups={receiverGroups}
                      valueUsers={this.state.choiceUserId[index] ? this.state.choiceUserId[index].split(',') as string[] : []}
                      valueGroups={this.state.choiceGoupId[index] ? this.state.choiceGoupId[index].split(',') as string[] : []}
                    />
                  )}

                <div hidden={true}>
                  <FormItem label="接收人">
                    {getFieldDecorator('routineReceiveUserD',
                      { rules: [{ required: false, message: "接收人" }], initialValue: this.state.choiceUserId })(
                        <Input />
                      )}
                  </FormItem>
                  <FormItem label="接收组">
                    {getFieldDecorator('routineReceiveGroupD',
                      { rules: [{ required: false, message: "接收组" }], initialValue: this.state.choiceGoupId })(
                        <Input />
                      )}
                  </FormItem>
                </div>

                <FormItem label="指定邀约">
                  {getFieldDecorator('isInvite' + index, {
                    rules: [{ required: true, message: "指定邀约必选" }],
                    initialValue: editValue && this.state.initialIsInvites.length > index ? this.state.initialIsInvites[index] : 0
                  })(
                    <Radio.Group buttonStyle="solid" size="small" style={{ width: '100%' }}
                      onChange={(e) => { this.handleChangeIsInvite(e, index) }}
                    >
                      <Radio.Button style={this.radioStyle} value={1} key={1}>指 定</Radio.Button>
                      <Radio.Button style={this.radioStyle} value={0} key={0}>不指定</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Card>
            )
          })
        }
        {
          addRecorderButtonVisible && (
            <Button type="dashed" onClick={this.handleAddRecorder} style={{ width: '100%', marginTop: 10 }} > <PlusOutlined />添加提供人</Button>
          )
        }
      </div>
    )
  }

}
export default NewRecorder;