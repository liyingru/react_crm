import CrmFilterForm from '@/components/CrmFilterForm';
import CrmStandardTable, { CrmStandardTableColumnProps, getCrmTableColumn } from '@/components/CrmStandardTable';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, DatePicker, Divider, Drawer, Form, Input, Menu, message, Modal, Select, Spin, Popconfirm, Tooltip, Popover } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import Search from 'antd/lib/input/Search';
import { ClickParam } from 'antd/lib/menu';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Action, Dispatch } from 'redux';
import { KeepAlive } from 'umi';
import NewOrEditForm from './components/NewOrEditForm';
import { CategoryItem, ColloquialismListItem } from './data';
import styles from './index.less';
import { StateType } from './model';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ColloquialismListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'colloquialismListModel/fetch'
      | 'colloquialismListModel/fetchCategoryList'
      | 'colloquialismListModel/deleteCategory'
      | 'colloquialismListModel/changeCategoryList'
      | 'colloquialismListModel/addKnowledge'
      | 'colloquialismListModel/editKnowledge'
      | 'colloquialismListModel/delKnowledge'
    >
  >;
  colloquialismListModel: StateType;

  //列表loading
  tableLoading: boolean;
  //分类列表loading
  fetchCategoryListLoading: boolean;
  //删除分类loading
  deleteCategoryLoading: boolean;
  //新增更改分类loading
  changeCategoryListLoading: boolean;
}

interface ColloquialismListState {
  formValues: { [key: string]: string };
  originValues: { [key: string]: string };
  newOrEditDrawerVisible: boolean;
  isEditingColloquialism: boolean;
  editItem: ColloquialismListItem | undefined;
  selectCategoryId: number,
  deleteCategoryModal: boolean;
  changeCategoryModal: boolean;
  optionCategory: CategoryItem | undefined;
}

@connect(
  ({
    colloquialismListModel,
    loading,
  }: {
    colloquialismListModel: StateType;
    loading: { effects: any };
  }) => ({
    colloquialismListModel,
    tableLoading: loading.effects['colloquialismListModel/fetch'],
    fetchCategoryListLoading: loading.effects['colloquialismListModel/fetchCategoryList'],
    deleteCategoryLoading: loading.effects['colloquialismListModel/deleteCategory'],
    changeCategoryListLoading: loading.effects['colloquialismListModel/changeCategoryList'],
  }),
)

class GroupMangement extends Component<ColloquialismListProps, ColloquialismListState> {

  state: ColloquialismListState = {
    formValues: {},
    originValues: {},
    newOrEditDrawerVisible: false,
    isEditingColloquialism: false,
    editItem: undefined,
    selectCategoryId: -1,
    deleteCategoryModal: false,
    changeCategoryModal: false,
    optionCategory: undefined,
  }

  componentDidMount() {
    //拉取话术分类
    this.fetchCategoryList(undefined, () => {
      let params = {
        page: 1,
        pageSize: 10,
      }
      this.fetchList(params)
    });
  }

  /**
   * 拉取话术列表
   * @param params 
   */
  fetchList = (params: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'colloquialismListModel/fetch',
      payload: {
        category_id: this.state.selectCategoryId,
        ...params
      },
    });
  }

  /** 拉取话术分类列表 */
  fetchCategoryList = (name: string | undefined, callback?: Function,) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'colloquialismListModel/fetchCategoryList',
      payload: {
        name,
      },
      callback: callback,
    });
  }

  componentWillReceiveProps(nextProps: ColloquialismListProps) {
    const isRefresh = localStorage ? localStorage.getItem('isRefresh')?.toString() : '';
    if (isRefresh && isRefresh.length > 0) {
      localStorage?.setItem('isRefresh', '')
      this.handleFormReset()
    }
  }

  generateStandardTableColumnProps = (): CrmStandardTableColumnProps<ColloquialismListItem>[] => {
    const columns: CrmStandardTableColumnProps<ColloquialismListItem>[] = [];
    const get = getCrmTableColumn;
    columns.push(get('title', '话术标题'));
    columns.push(get('equals', '相似语', {
      // width: 150,
      // ellipsis: true,
      render: text => text ? (
        <Tooltip title={text[0]} placement="bottomLeft" arrowPointAtCenter>
          <span className={styles.ellipsisText} style={{ maxWidth: 100 }}>{text[0]}</span>
        </Tooltip>
      ) : "未填写"
    }));
    columns.push(get('answer', '标准答案', {
      // width: 100,
      // ellipsis: true,
      render: text => text ? (
        <Tooltip title={text[0]} placement="bottomLeft" arrowPointAtCenter>
          <span className={styles.ellipsisText}>{text[0]}</span>
        </Tooltip>
      ) : "未填写"
    }));
    columns.push(get('update_time', '更新时间', { width: 120 }));
    columns.push(get('status', '话术状态', {
      render: status => status == 1 ? '使用中' : status == 2 ? '已关闭' : '未知'
    }));
    columns.push(get('null', '操作', {
      fixed: 'right',
      render: (text, record) => (
        <>
          <a onClick={() => this.handleEditColloquialism(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm placement='topRight' title={
            <>删除当前话术后，该话术信息将无法关联提示给客服人员。< br />您是否确认删除？</>
          } okText="确定" cancelText="取消" onConfirm={() => this.handleDeleteColloquialism(record)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    }));
    return columns;
  }

  // 列表表头
  columns: CrmStandardTableColumnProps<ColloquialismListItem>[] = this.generateStandardTableColumnProps();

  /**
   * 筛选，并且回到首页
   */
  handleSearch = () => {
    const { form: { validateFields } } = this.props;
    validateFields(['title', 'update_time', 'status'], (error, values) => {
      if (!error) {
        this.setState({
          originValues: values
        })

        const params = {
          ...values
        }
        // 处理时间范围
        let updateTime = params['update_time']
        if (updateTime && updateTime != '') {
          delete params['update_time']
          params['update_time_start'] = moment(updateTime[0]).format('YYYY-MM-DD');
          params['update_time_end'] = moment(updateTime[1]).format('YYYY-MM-DD');
        }
        const { colloquialismListModel: { data: { pagination: { pageSize } } } } = this.props;
        this.fetchList({
          ...params,
          page: 1,
          pageSize
        });
        this.setState({
          formValues: params
        })
      }
    });
  }

  /**
   * 重置筛选。 回到首页。
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      originValues: {},
      formValues: {}
    })
    const { colloquialismListModel: { data: { pagination } } } = this.props;
    this.fetchList({
      page: 1,
      pageSize: pagination.pageSize
    })
  };

  /**
   * 切换页，或者切换每页的数量
   * @param page 
   * @param pageSize 
   */
  handleStandardTableChange = (page: number, pageSize: number) => {
    const { formValues } = this.state;
    this.fetchList({
      ...formValues,
      page,
      pageSize
    })
  }

  /**
   * 新建话术，弹出抽屉组件
   */
  handleNewColloquialism = () => {
    this.setState({
      newOrEditDrawerVisible: true,
      isEditingColloquialism: false,
      editItem: undefined,
    })
  }

  /**
   * 编辑话术，弹出抽屉组件
   * @param item 
   */
  handleEditColloquialism = (item: ColloquialismListItem) => {
    this.setState({
      newOrEditDrawerVisible: true,
      isEditingColloquialism: true,
      editItem: item,
    })
  }

  /**
   * 删除话术，成功后刷新当前页
   * @param item 
   */
  handleDeleteColloquialism = (item: ColloquialismListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'colloquialismListModel/delKnowledge',
      payload: {
        id: item.id
      },
      callback: (success: boolean) => {
        if (success) {
          message.success("删除成功");
          const { colloquialismListModel: { data } } = this.props;
          this.fetchList({
            ...this.state.formValues,
            page: data.pagination.current,
            pageSize: data.pagination.pageSize
          });
          //拉取话术分类
          this.fetchCategoryList(undefined);
        }
      }
    })
  }

  /**
   * 编辑/新建 话术，  成功后刷新当前页/首页，并重新获取话术分类
   * @param params 
   */
  onSubmitNewOrEditColloquialism = (params: { [key: string]: string }) => {
    console.log("params = " + JSON.stringify(params));
    const { dispatch } = this.props;
    const { isEditingColloquialism } = this.state;
    dispatch({
      type: isEditingColloquialism ? "colloquialismListModel/editKnowledge" : "colloquialismListModel/addKnowledge",
      payload: params,
      callback: (success: boolean) => {
        if (success) {
          this.handleCloseNewOrEditDrawer();
          const { colloquialismListModel: { data: { pagination: { current, pageSize } } } } = this.props;
          this.fetchList({
            ...this.state.formValues,
            page: isEditingColloquialism ? current : 1,
            pageSize
          });
          //拉取话术分类
          this.fetchCategoryList(undefined);
        }
      }
    })
  }

  /**
   * 关闭抽屉组件
   */
  handleCloseNewOrEditDrawer = () => {
    this.setState({
      newOrEditDrawerVisible: false,
    })
  }

  renderFilterFormList = () => {
    let list = [];
    list.push(this.renderFormInput('title', '话术标题', this.state.originValues['title']))
    list.push(this.renderFormRange('update_time', '更新时间', this.state.originValues['update_time']))
    list.push(this.renderFormSelect('status', '话术状态', this.state.originValues['status'], [{ id: 1, name: '使用中' }, { id: 2, name: '已关闭' }]))
    return list;
  }

  renderFormInput = (id: string, label: string, initialValue?: any, placeholder?: string) => {
    const { form: { getFieldDecorator } } = this.props;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue })(
        <Input placeholder={placeholder ? placeholder : '请输入' + label} />)}
    </FormItem>
  }

  renderFormRange = (id: string, label: string, initialValue?: any) => {
    const { form: { getFieldDecorator } } = this.props;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue })(
        <RangePicker style={{ width: '100%' }} />)}
    </FormItem>
  }

  renderFormSelect = (id: string, label: string, initialValue?: any, options?: ConfigItem[]) => {
    const { form: { getFieldDecorator } } = this.props;
    return <FormItem label={label}>
      {getFieldDecorator(id, { initialValue })(
        <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
          {
            options && options.map(option => (
              <Option value={option.id}>{option.name}</Option>))
          }
        </Select>,
      )}
    </FormItem>
  }

  /** 切换话术分类 */
  handleChangeCategory = (param: ClickParam) => {
    const selectCategoryId = Number(param.key);
    this.setState({
      selectCategoryId,
    }, () => {
      const { form } = this.props
      form.resetFields()
      this.fetchList({
        page: 1,
        pageSize: 10,
      })
    });
  }

  /** 按关键词搜索话术分类 */
  handleSearchCategory = (value: any) => {
    this.fetchCategoryList(value)
  }

  /** 添加话术分类 */
  handleAddCategory = () => {
    this.setState({
      changeCategoryModal: true,
      optionCategory: undefined,
    })
  }

  /** 新增或修改话术分类 */
  handleChangeCategoryOk = () => {
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { optionCategory } = this.state;
      const categoryId = optionCategory?.id
      const { dispatch } = this.props
      dispatch({
        type: 'colloquialismListModel/changeCategoryList',
        payload: {
          ...values,
          categoryId,
        },
        callback: () => {
          this.setState({
            changeCategoryModal: false,
            optionCategory: undefined,
          })
          this.fetchCategoryList(undefined);
        }
      });
    })
  }

  handleChangeCategoryCancel = () => {
    this.setState({
      changeCategoryModal: false,
      optionCategory: undefined,
    })
  }

  handleDeleteCategoryOk = () => {
    const { optionCategory } = this.state;
    if (!optionCategory) {
      message.warn("出现未知异常")
      return
    }
    const categoryId = optionCategory?.id
    const { dispatch } = this.props
    dispatch({
      type: 'colloquialismListModel/deleteCategory',
      payload: {
        id: categoryId
      },
      callback: () => {
        if (categoryId == this.state.selectCategoryId) {
          this.setState({
            deleteCategoryModal: false,
            optionCategory: undefined,
            selectCategoryId: -1,
          }, () => {
            const { form } = this.props
            form.resetFields()
            //拉取话术分类
            this.fetchCategoryList(undefined, () => {
              let params = {
                page: 1,
                pageSize: 10,
              }
              this.fetchList(params)
            });
          })
        } else {
          this.setState({
            deleteCategoryModal: false,
            optionCategory: undefined,
          })
          this.fetchCategoryList(undefined);
        }
      }
    });
  }

  handleDeleteCategoryCancel = () => {
    this.setState({
      deleteCategoryModal: false,
      optionCategory: undefined,
    })
  }

  renderCategoryList = (categoryList: CategoryItem[]) => {
    return (
      <Menu
        style={{ border: 'none', marginTop: 10 }}
        selectedKeys={['' + this.state.selectCategoryId]}
        onClick={this.handleChangeCategory}
        mode="inline">
        {
          categoryList.map(value =>
            this.renderCategoryItem(value)
          )
        }
      </Menu>
    )
  }

  renderCategoryItem = (categoryItem: CategoryItem) => {
    return (
      <Menu.Item key={categoryItem.id} style={{ display: 'flex' }}>
        <Tooltip title={categoryItem.name} placement="bottomLeft" arrowPointAtCenter>
          <span style={{ display: "inline-block", width: 150, overflow: "scroll", whiteSpace: "nowrap" }} >{categoryItem.name}</span>
        </Tooltip>
        {/* <span style={{ display: "inline-block", width: 150, wordBreak: "break-all", wordWrap: "break-word", whiteSpace: "pre-wrap", overflow: "hidden" }} >{categoryItem.name}</span> */}
        <span>({categoryItem.count})</span>
        {
          categoryItem.id > 0 && <span><EditOutlined style={{ marginLeft: '10px' }} onClick={(e) => {
            e.preventDefault();
            this.setState({
              changeCategoryModal: true,
              optionCategory: categoryItem,
            })
          }} /></span>
        }
        {
          categoryItem.id > 0 && <span><DeleteOutlined onClick={() => {
            this.setState({
              deleteCategoryModal: true,
              optionCategory: categoryItem,
            })
          }} /></span>
        }
      </Menu.Item>
    )
  }

  renderDeleteCategoryModal = () => {
    const { deleteCategoryLoading } = this.props;
    return (
      <Modal
        title="系统提示"
        okText='确定'
        cancelText='取消'
        okButtonProps={{ disabled: deleteCategoryLoading }}
        cancelButtonProps={{ disabled: deleteCategoryLoading }}
        visible={this.state.deleteCategoryModal}
        onOk={this.handleDeleteCategoryOk}
        onCancel={this.handleDeleteCategoryCancel}
        destroyOnClose={true}>
        <span>删除当前分类，该话术分类下将不再显示之前绑定的话术信息，你可在全部话术下查看原话术内容，确定是否删除？</span>
      </Modal>
    )
  }

  renderChangeCategoryModal = () => {
    const { form, changeCategoryListLoading } = this.props;
    const { getFieldDecorator } = form;
    const title = this.state.optionCategory ? '修改分类' : '新增分类'
    return (
      <Modal
        title={title}
        okText='确定'
        cancelText='取消'
        okButtonProps={{ disabled: changeCategoryListLoading }}
        cancelButtonProps={{ disabled: changeCategoryListLoading }}
        visible={this.state.changeCategoryModal}
        onOk={this.handleChangeCategoryOk}
        onCancel={this.handleChangeCategoryCancel}
        destroyOnClose={true}>
        <Spin spinning={changeCategoryListLoading == undefined ? false : changeCategoryListLoading}>
          <Form >
            <FormItem label="分类名称" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
              <div style={{ marginLeft: 5 }} >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: "请填写分类名称", }],
                  initialValue: this.state.optionCategory?.name
                })(
                  <Input placeholder="请输入分类名称（最多20个字）" maxLength={20} />
                )}
              </div>
            </FormItem>
            <FormItem label="分类场景" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
              <div style={{ marginLeft: 5 }} >
                {getFieldDecorator('scene', {
                  initialValue: this.state.optionCategory?.scene
                })(
                  <Input placeholder="请输入分类场景（最多50个字 ）" maxLength={50} />
                )}
              </div>
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  }

  render() {
    const {
      colloquialismListModel: { data, categoryList },
      tableLoading,
      fetchCategoryListLoading,
    } = this.props;
    return (
      <PageHeaderWrapper className={styles.innerHeader} >
        <Card bordered={false}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>

            <div style={{ display: 'flex', height: '820px', overflow: 'scroll-y' }}>
              <Spin spinning={fetchCategoryListLoading}>
                <div style={{ flex: 1 }} >
                  <div style={{ display: 'flex', textAlign: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ fontWeight: 'bolder', fontSize: '14px' }}>话术分类（{categoryList?.length}）</span>
                    </div>
                    <PlusOutlined style={{ fontSize: '16px', paddingTop: '3px' }} onClick={this.handleAddCategory} />
                  </div>
                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                  <Search
                    size="small"
                    placeholder={'搜索关键词'}
                    allowClear={true}
                    style={{ maxLines: 1, height: 32 }}
                    onSearch={this.handleSearchCategory}
                  />
                  {categoryList.length > 0 && this.renderCategoryList(categoryList)}
                </div>
              </Spin>
              <Divider type={'vertical'} style={{ height: '100%', marginLeft: '20px', marginRight: '15px' }} />
            </div>

            <div style={{ flex: 1 }}>
              <CrmFilterForm
                formItemList={this.renderFilterFormList()}
                onFilterReset={this.handleFormReset}
                onFilterSearch={this.handleSearch}
              />
              <Divider style={{ marginBottom: 15 }} />
              <MyTable
                loading={tableLoading}
                rowKey='id'
                data={data}
                columns={this.columns}
                onPaginationChanged={this.handleStandardTableChange}
                columnsEditable={false}
                renderTopButtons={
                  () => (
                    <Button type="primary" onClick={this.handleNewColloquialism}><PlusOutlined />新建话术</Button>
                  )
                }
              />
            </div>
          </div>
        </Card>
        {this.renderDeleteCategoryModal()}
        {this.renderChangeCategoryModal()}
        <Drawer
          title={this.state.isEditingColloquialism ? '编辑话术' : "新建话术"}
          width={500}
          visible={this.state.newOrEditDrawerVisible}
          closable={true}
          onClose={this.handleCloseNewOrEditDrawer}>
          <div>
            {
              this.state.newOrEditDrawerVisible && (
                <NewOrEditForm
                  editItem={this.state.editItem}
                  categoryList={categoryList.filter((_item, index) => index > 1)}
                  onSubmitForm={this.onSubmitNewOrEditColloquialism}
                />
              )
            }

          </div>
        </Drawer>
      </PageHeaderWrapper>
    )
  }
}

class GroupMangement1 extends Component<ColloquialismListProps, ColloquialismListState> {
  render() {
    return (
      <PageHeaderWrapper className={styles.outerHeader}>
        <KeepAlive>
          <GroupMangement {...this.props} />
        </KeepAlive>
      </PageHeaderWrapper>
    )
  }
}
class MyTable extends CrmStandardTable<ColloquialismListItem>{ }
export default Form.create<ColloquialismListProps>()(GroupMangement1);
