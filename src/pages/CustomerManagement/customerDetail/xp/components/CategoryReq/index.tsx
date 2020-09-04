import URL from '@/api/serverAPI.config';
import AreaSelect from '@/components/AreaSelect';
import { CategoryConfigItem, ConfigData, CustomerInfoData, RequirementData, RequirementDataDetails, RequirementDataGroupDetails, Button, ReqButton } from '@/pages/LeadsManagement/leadsDetails/data';
import { Checkbox, DatePicker, Divider, Form, Icon, Input, message, Modal, Radio, Select, Table, Spin, Switch, Tabs, Menu, List } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { ColumnProps } from 'antd/lib/table/interface';
import Axios from 'axios';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import styles from '../../index.less';
import NumberRangeInput from '@/components/NumberRangeInput';
import CrmUtil from '@/utils/UserInfoStorage';
import PageLoadingSelect, { PaginationFake } from '@/components/PageLoadingSelect';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import OperationLogModalPage from '@/components/OperationLogModal';
import { RadioChangeEvent } from 'antd/lib/radio';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

interface CategoryReqProps extends FormComponentProps {
  onCategoryReqRef: (ref: any) => void;
  reqGroupDetails: RequirementDataGroupDetails,
  customerId: string;
  ownerId: string;
  config: ConfigData;
  leadsId: string;
  //0不可操作（不显示） 1可操作（显示） undefined可操作（默认显示）
  optionable?: number;
  //刷新有效单列表
  fun_refreshCategoryAll: Function;
  //有效单初始化
  fun_refreshCategoryReqList: Function;
  //推荐商家
  fun_recommend: Function;
  //审批流审核
  fun_review: Function;

  reqId?: string;  //需求单Id ,需求单详情用
  fun_reqNumRender?: Function  //渲染需求单号
  defaultCategoryId: string; //默认切换到的tab

  category_num?: any;
}

interface CategoryReqState {
  alertLoading: boolean;
  optionLoading: boolean;
  closeModalVisible: boolean,
  closeModalTitle: string,
  closeModalReason: string,
  closeModalType: number, //0为跟进失败， 1为关闭有效单， 2为无效有效单

  optionModalVisible: boolean,
  optionCategoryTitle: string,
  optionCategoryValue: number,
  optionCategoryType: number, //0为创建， 1为更新
  editReq: RequirementData | undefined, //编辑的有效单

  carBrandType: string[],
  carBrandNum: string[],

  buttonModalVisible: boolean,
  buttonTitle: string,
  buttonType: number,
  buttonCompanyIds: string[],
  merchantsList: Merchant[],
  merchantsNotFoundTips: string;
  setNoMoreMerchantsData: boolean;

  categoryId: string | undefined;

  logModalVisible: boolean,
  logModalLeadId: string,
}

class CategoryReq extends Component<CategoryReqProps, CategoryReqState> {

  constructor(props: Readonly<CategoryReqProps>) {
    super(props)
    this.props.onCategoryReqRef(this)

    this.state = {
      alertLoading: false,
      optionLoading: false,
      closeModalVisible: false,
      closeModalTitle: "",
      closeModalReason: "",
      closeModalType: 0,

      optionModalVisible: false,
      optionCategoryTitle: "",
      optionCategoryValue: 1,
      optionCategoryType: 0,
      editReq: undefined,
      carBrandType: ['null'],
      carBrandNum: ['null'],

      buttonModalVisible: false,
      buttonTitle: '',
      buttonType: 0,
      buttonCompanyIds: [],
      merchantsList: [],
      merchantsNotFoundTips: '请输入关键字搜索商家',
      setNoMoreMerchantsData: false,

      categoryId: undefined,

      logModalVisible: false,
      logModalLeadId: '',
    }
  }

  //刷新当前品类列表
  refreshCurrentCategoryReqList = () => {
    this.props.fun_refreshCategoryReqList(this.state.categoryId)
  }

  //创建有效单
  createCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.createReq, params).then(
      res => {
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
        this.setState({
          alertLoading: false,
        })
      }
    );
  }

  //更新有效单
  updateCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.updateReq, params).then(
      res => {
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
        this.setState({
          alertLoading: false,
        })
      }
    );
  }

  //进店
  reserveReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.reserveReq, params).then(
      res => {
        this.setState({
          alertLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //有效（暂时不用，改成调用待定接口）
  validCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.validReq, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //待定（有效暂时也调用）
  tobeCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.updateReqLite, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //无效(退回公海)
  invalidCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.backToPubSea, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //打开有效单
  openCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      optionLoading: true,
    })
    Axios.post(URL.openReq, params).then(
      res => {
        this.setState({
          optionLoading: false,
        })
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
      }
    );
  }

  //关闭有效单
  closeCategoryReq(params: any, callback: (code: number, msg: string) => void) {
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.closeReq, params).then(
      res => {
        if (res.code == 200) {
          callback(res.code, res.msg);
        }
        this.setState({
          alertLoading: false,
        })
      }
    );
  }

  //创建有效单对话框确认
  handleCreateReqOk = () => {
    const { form, leadsId, customerId, ownerId, config } = this.props;
    if (this.state.optionCategoryValue == 0) {
      message.error("品类出错");
      return;
    }
    let formFeilds: string[] = [];
    if (this.state.optionCategoryValue == 1) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'siteType', 'scheduleType', 'hotel','perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 2) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 3) {
      formFeilds = ['photoStyle', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 4) {
      formFeilds = ['hotelTablesFrom', 'hotelTablesEnd', 'hotel', 'hotelHall', 'perBudgetFrom', 'perBudgetEnd', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 5) {
      formFeilds = ['carTime', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 6) {
      formFeilds = ['weddingStyle', 'hotelTablesFrom', 'hotelTablesEnd', 'perBudgetFrom', 'perBudgetEnd', 'hotel', 'hotelHall', 'budgetFrom', 'budgetEnd'];
    } else if (this.state.optionCategoryValue == 7) {
      formFeilds = ['dressUseWay', 'dressType', 'dressModel', 'dressNum', 'budgetFrom', 'budgetEnd'];
    }
    const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    if (categorys && categorys.length == 1 && categorys[0].children) {
      formFeilds.push('finalCategory');
    }
    formFeilds.push('cityCode');
    formFeilds.push('remark');
    if ((CrmUtil.getCompanyType() == 1)) {
      formFeilds.push('needAutoDistribute');
    }
    form.validateFieldsAndScroll(formFeilds, (err, values) => {
      if (err) {
        return;
      }
      if ((CrmUtil.getCompanyType() == 1)) {
        //组装数据
        values['needAutoDistribute'] = !!values['needAutoDistribute'] ? 1 : 0;
      }
      const carTimeForUtc = values['carTime']
      if (carTimeForUtc != undefined) {
        values['carTime'] = moment(carTimeForUtc).format('YYYY-MM-DD HH:mm')
      }
      const dressType: string[] = values['dressType']
      if (dressType != undefined) {
        let types: string = "";
        dressType.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressType.length) {
            types = types + ",";
          }
        })
        values['dressType'] = types;
      }
      const dressModel: string[] = values['dressModel']
      if (dressModel != undefined) {
        let types: string = "";
        dressModel.map((value, index) => {
          if (value != 'null') {
            types = types + value;
          }
          if (index + 1 < dressModel.length) {
            types = types + ",";
          }
        })
        values['dressModel'] = types;
      }
      const categoryChild = {
        ...values,
      }
      if (this.state.optionCategoryValue == 5) {
        const carJson: any = [];
        this.state.carBrandType.map((type, index) => {
          const num = this.state.carBrandNum[index];
          if (type != 'null' && num != 'null') {
            const child = {
              carBrand: type,
              carBrandName: config.carBrand.filter(item => item.id + "" == type)[0]?.name,
              carNum: num,
            }
            carJson.push(child)
          }
        })
        categoryChild['carJson'] = carJson;
      }
      const categoryReq = {

      }
      const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
      if (!categorys || categorys.length != 1 || !categorys[0].children) {
        categoryChild['finalCategory'] = this.state.optionCategoryValue
      }
      if (this.state.optionCategoryValue == 1) {
        categoryReq['banquet'] = categoryChild;
      } else if (this.state.optionCategoryValue == 2) {
        categoryReq['wedding'] = categoryChild;
      } else if (this.state.optionCategoryValue == 3) {
        categoryReq['photography'] = categoryChild;
      } else if (this.state.optionCategoryValue == 4) {
        categoryReq['celebration'] = categoryChild;
      } else if (this.state.optionCategoryValue == 5) {
        categoryReq['car'] = categoryChild;
      } else if (this.state.optionCategoryValue == 6) {
        categoryReq['oneStop'] = categoryChild;
      } else if (this.state.optionCategoryValue == 7) {
        categoryReq['dress'] = categoryChild;
      }

      if (this.state.optionCategoryType == 0) { //创建
        const params = {
          categoryReq: categoryReq,
          customerId: customerId,
          leadsId: leadsId,
          category: this.state.optionCategoryValue,
          ownerId: ownerId
        };
        this.createCategoryReq(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }

          //关闭弹窗和重制
          this.setState({
            optionModalVisible: false,
            optionCategoryTitle: "",
            optionCategoryValue: 1,
            optionCategoryType: 0,
            editReq: undefined,
            carBrandType: ['null'],
            carBrandNum: ['null'],
          })

          message.success('创建成功');
          this.refreshTagList()
          this.props.fun_refreshCategoryAll(this.state.categoryId);
        });
      } else if (this.state.optionCategoryType == 1) { //更新
        if (!this.state.editReq) {
          message.error("出现未知错误");
          return;
        }
        const params = {
          categoryReq: categoryReq,
          reqId: this.state.editReq.id,
        };
        this.updateCategoryReq(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }

          //关闭弹窗和重制
          this.setState({
            optionModalVisible: false,
            optionCategoryTitle: "",
            optionCategoryValue: 1,
            optionCategoryType: 0,
            editReq: undefined,
            carBrandType: ['null'],
            carBrandNum: ['null'],
          })

          message.success('更新成功');
          this.refreshTagList()
          this.props.fun_refreshCategoryAll(this.state.categoryId);
        });
      }
    });
  }

  refreshTagReset = () => {
    localStorage?.setItem('demandListRefreshTag', 'reset')
    localStorage?.setItem('leadsListRefreshTag', 'reset')
  }

  refreshTagList = () => {
    localStorage?.setItem('demandListRefreshTag', 'list')
    localStorage?.setItem('leadsListRefreshTag', 'list')
  }

  //创建有效单对话框取消
  handleCreateReqCancel = () => {
    this.setState({
      optionModalVisible: false,
      optionCategoryTitle: "",
      optionCategoryValue: 1,
      optionCategoryType: 0,
      editReq: undefined,
    })
  }

  //增加品牌邀请
  handleAddCarBrand = () => {
    let carBrandType = this.state.carBrandType;
    let carBrandNum = this.state.carBrandNum;
    carBrandType.push('null');
    carBrandNum.push('null');
    this.setState({
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //创建选择有效单品类
  handleSelectCategory = (name: string, value: number) => {
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 0,
      editReq: undefined,
      carBrandType: ['null'],
      carBrandNum: ['null'],
    })

  }

  //编辑有效单
  handleEidtReq = (name: string, value: number, data: RequirementData) => {
    let carBrandType: string[] = [];
    let carBrandNum: string[] = [];
    console.log(JSON.stringify(data.car_info))
    if (data.car_info && data.car_info.length > 0) {
      data.car_info.map(info => {
        carBrandType.push(info.carBrand);
        carBrandNum.push(info.carNum);
      })
    }
    this.setState({
      optionModalVisible: true,
      optionCategoryTitle: name,
      optionCategoryValue: value,
      optionCategoryType: 1,
      editReq: data,
      carBrandType: carBrandType,
      carBrandNum: carBrandNum,
    })
  }

  //预约进店
  handleReserveReq = (data: RequirementData) => {
    this.setState({
      buttonModalVisible: true,
      buttonTitle: '填写预约单',
      buttonType: 32,
      editReq: data,
    })
  }

  //有效有效单
  handleValidReq = (data: RequirementData) => {
    const params = {
      reqId: data.id,
      phase: 230,
    };
    this.tobeCategoryReq(params, (code: number, msg: string) => {
      if (code != 200) {
        return;
      }
      this.refreshTagList()
      this.props.fun_refreshCategoryAll(this.state.categoryId);
    });
  }

  //待定有效单
  handleTobeReq = (data: RequirementData) => {
    const params = {
      reqId: data.id,
      phase: 220,
    };
    this.tobeCategoryReq(params, (code: number, msg: string) => {
      if (code != 200) {
        return;
      }
      message.success('待定成功')
      this.refreshTagList()
      this.props.fun_refreshCategoryAll(this.state.categoryId);
    });
  }

  //无效有效单
  handleInvalidReq = (data: RequirementData) => {
    this.setState({
      closeModalVisible: true,
      closeModalTitle: '无效原因',
      closeModalReason: '',
      closeModalType: 2,
      editReq: data,
    })
  }

  //开启有效单
  handleOpenReq = (data: RequirementData) => {
    const params = {
      reqId: data.id,
    };
    this.openCategoryReq(params, (code: number, msg: string) => {
      if (code != 200) {
        return;
      }
      this.refreshTagList()
      this.props.fun_refreshCategoryAll(this.state.categoryId);
    });
  }

  //关闭有效单
  handleCloseReq = (data: RequirementData, closeModalType: number) => {
    let title = closeModalType == 0 ? '跟进失败原因' : '关闭有效单'
    this.setState({
      closeModalVisible: true,
      closeModalTitle: title,
      closeModalReason: '',
      closeModalType: closeModalType,
      editReq: data,
    })
  }

  //日志打开
  handleOpenLogModal = (data: RequirementData) => {
    this.setState({
      logModalVisible: true,
      logModalLeadId: data.id?.toString(),
    })
  }

  //日志关闭
  handleCloseLogModal = () => {
    this.setState({
      logModalVisible: false,
      logModalLeadId: '',
    })
  }

  //按钮操作
  /**
   * 10编辑
   * 15开启
   * 20有效
   * 25待定
   * 30无效
   * 35关单(跟进失败)
   * 40推荐
   * 45关闭原因(客户合并)
   * 50北京数据中心-派发公司
   * 55日志
   * 
   */
  handleButton = (record: RequirementData, button: ReqButton) => {
    if (button.type == 10) {  //编辑
      let type = record.top_category
      let name = '编辑婚宴有效单'
      if (type == 1) {
        name = '编辑婚宴有效单'
      } else if (type == 2) {
        name = '编辑婚庆有效单'
      } else if (type == 3) {
        name = '编辑婚纱摄影有效单'
      } else if (type == 4) {
        name = `编辑${React.$celebrationOrWeddingBanquet()}有效单`
      } else if (type == 5) {
        name = '编辑婚车有效单'
      } else if (type == 6) {
        name = '编辑一站式有效单'
      } else if (type == 7) {
        name = '编辑婚纱礼服有效单'
      }
      this.handleEidtReq(name, type, record)
    } else if (button.type == 15) {  //开启
      this.handleOpenReq(record)
    } else if (button.type == 20) {  //有效
      this.handleValidReq(record)
    } else if (button.type == 25) {  //待定
      this.handleTobeReq(record)
    } else if (button.type == 30) {  //无效
      this.handleInvalidReq(record)
    } else if (button.type == 32) {  //进店
      this.handleReserveReq(record)
    } else if (button.type == 34) {  //无效原因
      this.handleVolidReqAlert(button.name, record)
    } else if (button.type == 35) {  //到喜啦跟进失败（关单用新字段）
      this.handleCloseReq(record, 0)
    } else if (button.type == 37) {  //到喜啦跟进失败待审核(跳待审核列表)
      this.handleReview(button.aid)
    } else if (button.type == 40) {  //推荐
      this.handleRecommend(record)
    } else if (button.type == 45) {  //关闭原因(客户合并)
      this.handleCloseReqAlert(button.name, record)
    } else if (button.type == 50) {  //北京数据中心-派发公司
      this.setState({
        buttonModalVisible: true,
        buttonTitle: button.name,
        buttonType: button.type,
        buttonCompanyIds: button.assign_merchant_ids,
        editReq: record,
      })
    } else if (button.type == 55) {  //日志
      this.handleOpenLogModal(record)
    }
  }

  //确定
  handleButtonOk = () => {
    const { form } = this.props;
    if (this.state.buttonType == 32) {  //预约进店
      let formFeilds: string[] = ['reserveTime'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请选择到店时间');
          return;
        }
        const reserveTime = values['reserveTime']
        values['reserveTime'] = moment(reserveTime).format('YYYY-MM-DD HH:mm:ss');
        const params = {
          ...values,
          reqId: this.state.editReq?.id,
        };
        this.reserveReq(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }
          this.setState({
            buttonModalVisible: false,
            buttonTitle: '',
            buttonType: 0,
            editReq: undefined,
          })
          this.refreshTagList()
          this.props.fun_refreshCategoryAll(this.state.categoryId);
        });
      });
    } else if (this.state.buttonType == 50) {  //形象非凡派发公司
      let formFeilds: string[] = ['merchant'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请选择派发公司');
          return;
        }
        let merchantValues: any = []
        values['merchant'].map(value => {
          let datas: string[] = value.split(',|,')
          merchantValues.push({
            merchantId: datas[0],
            merchant: datas[1],
          })
        })
        const params = {
          customerId: this.state.editReq?.customer_id,
          reqId: this.state.editReq?.id,
          category: this.state.editReq?.category,
          merchant: merchantValues,
        };
        this.setState({
          alertLoading: true,
        })
        Axios.post(URL.createOrder, params).then(
          res => {
            if (res.code == 200) {
              //关闭弹窗和重制
              this.setState({
                buttonModalVisible: false,
                buttonTitle: '',
                buttonType: 0,
                buttonCompanyIds: [],
                editReq: undefined,
                merchantsList: [],
              })
              message.success('派发公司成功');
              this.refreshTagList()
              this.props.fun_refreshCategoryAll(this.state.categoryId);
            }
            this.setState({
              alertLoading: false,
            })
          }
        );
      });
    }
  }

  //取消
  handleButtonCancel = () => {
    this.setState({
      buttonModalVisible: false,
      buttonTitle: '',
      buttonType: 0,
      buttonCompanyIds: [],
      editReq: undefined,
      merchantsList: [],
    })
  }

  //关闭有效单确认
  handleCloseReqOk = () => {
    const { form } = this.props;
    if (this.state.closeModalType == 0 || this.state.closeModalType == 1) {
      let formFeilds: string[] = ['closeReason'];
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请填写关闭说明');
          return;
        }
        if (!this.state.editReq) {
          message.error("缺少有效单id");
          return;
        }
        if (this.state.closeModalType == 0) {
          if (this.state.closeModalReason == "") {
            message.error("请选择跟进失败原因");
            return;
          } else {
            values['closeReasonId'] = this.state.closeModalReason;
          }
        }
        const params = {
          ...values,
          reqId: this.state.editReq.id,
        };
        this.closeCategoryReq(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }
          this.setState({
            closeModalVisible: false,
            closeModalTitle: '',
            closeModalReason: '',
            closeModalType: 0,
            editReq: undefined,
          })
          this.refreshTagList()
          this.props.fun_refreshCategoryAll(this.state.categoryId);
        });
      });
    } else if (this.state.closeModalType == 2) {
      let formFeilds: string[] = ['closeRemark']
      form.validateFields(formFeilds, (err, values) => {
        if (err) {
          message.error('请填写无效说明');
          return;
        }
        if (!this.state.editReq) {
          message.error("缺少有效单id");
          return;
        }
        const params = {
          remark: values['closeRemark'],
          reqId: this.state.editReq.id,
          reasonId: '17',
        };
        this.invalidCategoryReq(params, (code: number, msg: string) => {
          if (code != 200) {
            return;
          }
          this.setState({
            closeModalVisible: false,
            closeModalTitle: '',
            closeModalReason: '',
            closeModalType: 0,
            editReq: undefined,
          })
          this.refreshTagList()
          this.props.fun_refreshCategoryAll(this.state.categoryId);
        });
      });
    }
  }

  //关闭有效单取消
  handleCloseReqCancel = () => {
    this.setState({
      closeModalVisible: false,
      closeModalTitle: '',
      closeModalReason: '',
      closeModalType: 0,
      editReq: undefined,
    })
  }

  //有效单无效说明提示
  handleVolidReqAlert = (title: string, data: RequirementData) => {
    Modal.info({
      title: title,
      okText: '知道了',
      content: data.return_reason,
      centered: true,
      onOk() { },
    });
  }

  //有效单关闭说明提示
  handleCloseReqAlert = (title: string, data: RequirementData) => {
    Modal.info({
      title: title,
      okText: '知道了',
      content: data.close_reason,
      centered: true,
      onOk() { },
    });
  }

  //审批流审核
  handleReview = (aid: string) => {
    this.props.fun_review(aid)
  }

  //推荐商家
  handleRecommend = (data: RequirementData) => {
    this.props.fun_recommend(data.customer_id, data.id, data.top_category, data.city_info.city_code);
  }

  merchantsPagination: PaginationFake = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  onMerchantKeywordChanged = (keyword: string | undefined) => {
    this.merchantsPagination = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    this.setState({
      merchantsList: new Array(),
      setNoMoreMerchantsData: false,
    })
    if (!keyword) {
      this.setState({
        merchantsNotFoundTips: "请输入关键字搜索商家"
      })
    };
  }

  searchMerchants = (key: string) => {
    const params = {
      page: this.merchantsPagination.page,
      pageSize: this.merchantsPagination.pageSize,
      keyword: key,
      category: this.state.editReq?.category,
    }
    this.setState({
      alertLoading: true,
    })
    Axios.post(URL.storeList, params).then(
      res => {
        this.setState({
          alertLoading: false,
        })
        if (res.code == 200) {
          const { merchantsList } = this.state;
          const merchantsListSinglePageData: Merchant[] = res.data.result.rows;
          const merchantsTotal: number = res.data.result.total;
          if (merchantsListSinglePageData) {
            if (this.merchantsPagination.page == 1) {
              this.setState({
                merchantsList: merchantsListSinglePageData
              });
            } else {
              merchantsList.push(...merchantsListSinglePageData);
              this.setState({
                merchantsList,
              });
            }

          }
          this.merchantsPagination = {
            page: this.merchantsPagination.page + 1,
            pageSize: this.merchantsPagination.pageSize,
            total: merchantsTotal
          }
          if (merchantsTotal <= merchantsList.length) {
            this.setState({
              setNoMoreMerchantsData: true
            })
          }
        }
        if (this.state.merchantsList.length == 0) {
          this.setState({
            merchantsNotFoundTips: '没有搜索到关键字为“' + key + '”的商家'
          })
        }
      }
    );
  };

  handleCityChange = (code: string, province: string, city: string, district: string) => {
    const { form } = this.props;
    form.setFieldsValue({
      cityCode: code
    });
  }

  handleReturnReason = (e: RadioChangeEvent) => {
    this.setState({
      closeModalReason: e.target.value,
    })
  };

  renderTable = (details: RequirementDataDetails) => {
    /**
     * 当前支持类型1-7
     * 服务器增加类型涉及的改动
     * 1、该处放开到适定范围
     * 2、新建和编辑的标题文案增加
     * 3、table表colums适配
     * 4、编辑弹窗属性适配
     */
    if (details.category_id < 1 || details.category_id > 7) {
      return null
    }
    return (
      // <Table
      //   scroll={{ x: 'max-content' }}
      //   size={"middle"}
      //   pagination={false}
      //   // title={() => details.category_name}
      //   columns={this.createColums(details.category_id)}
      //   dataSource={details.data} />

      <List
        size="small"
        bordered
        dataSource={details.data}
        renderItem={item => <List.Item>
          <div>
            <div className={styles.itemWrapper}>
              {
                item.show_array && item.show_array.map(value =>
                  <div style={{ width: '33.3%', marginBottom: 5 }}>{value}</div>
                )
              }
            </div>
            <div style={{ float: "right" }}>
              {
                this.renderOption(item)
              }
            </div>
          </div>
        </List.Item>}
      />
    );
  }

  renderMyGroup = (reqDataList: RequirementDataDetails[]) => {
    return (
      <div>
        <div className={styles.headerTitle}>我的建单</div>
        {
          reqDataList.map(details => (
            this.renderTable(details)
          ))
        }
      </div>
    );
  }

  renderOtherGroup = (reqDataList: RequirementDataDetails[]) => {
    let maginTop: string = '20px'
    return (
      <div style={{ marginTop: maginTop }}>
        <div className={styles.headerTitle}>同事建单</div>
        {
          reqDataList.map(details => (
            this.renderTable(details)
          ))
        }
      </div>
    );
  }

  render() {
    const { form, config, reqGroupDetails, defaultCategoryId } = this.props;
    const { getFieldDecorator } = form;

    this.state.categoryId = this.state.categoryId ? this.state.categoryId : defaultCategoryId

    return (
      <div>
        <Spin spinning={this.state.optionLoading}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div />
            <OperationLogModalPage
              onCancel={this.handleCloseLogModal}
              visible={this.state.logModalVisible}
              type={'2'}
              id={this.state.logModalLeadId}
            />
            <Modal
              title={this.state.buttonTitle}
              visible={this.state.buttonModalVisible}
              onOk={this.handleButtonOk}
              destroyOnClose={true}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              onCancel={this.handleButtonCancel}>
              <Spin spinning={this.state.alertLoading}>
                <Form>
                  {
                    //形象非凡派发公司
                    this.state.buttonType == 50 ? getFieldDecorator('merchant', {
                      rules: [{ required: true, message: '请添加派发公司' }],
                    })(
                      <PageLoadingSelect
                        mode="multiple"
                        placeholder="请添加派发公司"
                        notFoundContent={this.state.merchantsNotFoundTips}
                        onKeywordChanged={this.onMerchantKeywordChanged}
                        doSearch={this.searchMerchants}
                        noMoreData={this.state.setNoMoreMerchantsData}
                      >
                        {
                          this.state.merchantsList && this.state.merchantsList.map(item => (
                            <Option value={item.id + ",|," + item.name} disabled={this.state.buttonCompanyIds && this.state.buttonCompanyIds.indexOf(item.id) >= 0}>
                              <div>
                                {'商家名称：' + item.name}
                                <br />
                                {'类型：' + item.category_name}
                                <br />
                                {'负责销售：' + item.sale_name}
                              </div>
                            </Option>
                          ))
                        }
                      </PageLoadingSelect>
                    ) :
                      //预约进店
                      this.state.buttonType == 32 ?
                        <FormItem label="预约到店" style={{ width: '100%' }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                          {getFieldDecorator('reserveTime', {
                            rules: [{ required: true, message: '请选择到店时间' }],
                          })(
                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                          )}
                        </FormItem>
                        :
                        null}
                </Form>
              </Spin>
            </Modal>
            <Modal
              title={this.state.closeModalTitle}
              visible={this.state.closeModalVisible}
              onOk={this.handleCloseReqOk}
              destroyOnClose={true}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              onCancel={this.handleCloseReqCancel}>
              <Spin spinning={this.state.alertLoading}>
                {
                  this.state.closeModalType == 0 && config.requirementCloseReason && config.requirementCloseReason.length > 0 ?
                    <Radio.Group buttonStyle="solid" onChange={this.handleReturnReason}>
                      {
                        (config.requirementCloseReason && config.requirementCloseReason.length > 0) ? config.requirementCloseReason.map(reason => (
                          <Radio.Button value={reason.id} style={{ marginBottom: '10px', marginRight: '10px' }}>{reason.name}</Radio.Button>)) : null
                      }
                    </Radio.Group >
                    :
                    null
                }
                {
                  this.state.closeModalType == 0 || this.state.closeModalType == 1 ? <Form>
                    {getFieldDecorator('closeReason', {
                      rules: [{ required: this.state.closeModalType == 0 ? false : true, message: '请输入关闭原因' }],
                    })(
                      <TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder={this.state.closeModalType == 0 ? "补充内容（选填）" : "请输入关闭原因"} />
                    )}
                  </Form>
                    : null
                }
                {
                  this.state.closeModalType == 2 ? <Form>
                    {getFieldDecorator('closeRemark', {
                      rules: [{ required: true, message: '请输入无效原因' }],
                    })(
                      <TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder="请输入无效原因" />
                    )}
                  </Form>
                    : null
                }
              </Spin>
            </Modal>
            <Modal
              title={this.state.optionCategoryTitle}
              visible={this.state.optionModalVisible}
              onOk={this.handleCreateReqOk}
              okButtonProps={{ disabled: this.state.alertLoading }}
              cancelButtonProps={{ disabled: this.state.alertLoading }}
              destroyOnClose={true}
              width={600}
              onCancel={this.handleCreateReqCancel}>
              <Spin spinning={this.state.alertLoading}>
                <Form>
                  {
                    this.renderHaveCategory2()
                  }
                  <FormItem label="意向区域" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    <div style={{ marginLeft: 5 }} >
                      {getFieldDecorator('cityCode', {
                        rules: [{ required: true, message: "请选择意向区域", }],
                        initialValue: ''
                      })(
                        <AreaSelect areaSelectChange={this.handleCityChange} level3={true} selectedCode={this.state.editReq ? this.state.editReq.city_code : undefined} />
                      )}
                    </div>
                  </FormItem>

                  {
                    (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? <FormItem label="婚礼风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('weddingStyle', {
                        initialValue: this.state.editReq ? this.state.editReq.wedding_style : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.weddingStyle) ? config.weddingStyle.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 3) ? <FormItem label="拍照风格" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('photoStyle', {
                        initialValue: this.state.editReq ? this.state.editReq.photo_style : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.photoStyle) ? config.photoStyle.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6 || this.state.optionCategoryValue == 4) ? <FormItem label={(this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 6) ? "婚礼桌数" : "举办桌数"} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'hotelTablesFrom'} maximumField={'hotelTablesEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.hotel_tables_end) : undefined} />
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1) ? <FormItem label="场地类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('siteType', {
                        initialValue: this.state.editReq ? this.state.editReq.site_type : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.siteType) ? config.siteType.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1) ? <FormItem label="档期类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('scheduleType', {
                        initialValue: this.state.editReq ? this.state.editReq.schedule_type : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.scheduleType) ? config.scheduleType.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                      <FormItem label="预定酒店" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('hotel', {
                          initialValue: this.state.editReq ? this.state.editReq.hotel : '',
                        })(
                          <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                        )}
                      </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ?
                      <FormItem label="宴会厅" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('hotelHall', {
                          initialValue: this.state.editReq ? this.state.editReq.hotel_hall : '',
                        })(
                          <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                        )}
                      </FormItem> : null
                  }
                  {
                    this.state.optionCategoryValue == 5 ? <FormItem label="用车时间" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('carTime', {
                        initialValue: (this.state.editReq && this.state.editReq.car_time != '') ? moment(this.state.editReq.car_time, 'YYYY-MM-DD HH:mm') : undefined,
                      })(
                        <DatePicker style={{ marginLeft: 5 }}
                          format="YYYY-MM-DD HH:mm"
                          showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                          placeholder='请选择用车时间' />
                      )}
                    </FormItem> : null
                  }
                  {
                    this.state.optionCategoryValue == 5 ? <FormItem label="品牌要求" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {
                        this.renderCarBrand()
                      }
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="使用方式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressUseWay', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_use_way : undefined,
                      })(
                        <Radio.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressUseWay) ? config.dressUseWay.map(style => (
                              <Radio value={style.id}>{style.name}</Radio>)) : null
                          }
                        </Radio.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="服饰类型" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressType', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_type?.split(',').map(Number) : undefined,
                      })(
                        <Checkbox.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressType) ? config.dressType.map(style => (
                              <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                          }
                        </Checkbox.Group>
                      )}
                    </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 7) ? <FormItem label="礼服款式" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      {getFieldDecorator('dressModel', {
                        initialValue: this.state.editReq ? this.state.editReq.dress_model?.split(',').map(Number) : undefined,
                      })(
                        <Checkbox.Group style={{ marginLeft: 5 }} >
                          {
                            (config && config.dressModel) ? config.dressModel.map(style => (
                              <Checkbox value={style.id}>{style.name}</Checkbox>)) : null
                          }
                        </Checkbox.Group>
                      )}
                    </FormItem> : null
                  }
                  {(this.state.optionCategoryValue == 7) ? <FormItem label="礼服数量" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('dressNum', {
                      initialValue: this.state.editReq ? this.state.editReq.dress_num : '',
                    })(
                      <Input autoComplete="off" maxLength={5} style={{ width: '100%', marginLeft: 5 }} suffix="套" placeholder="请输入" />
                    )}
                  </FormItem> : null
                  }
                  {
                    (this.state.optionCategoryValue == 1 || this.state.optionCategoryValue == 2 || this.state.optionCategoryValue == 4 || this.state.optionCategoryValue == 6) ? <FormItem label="每桌预算" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'perBudgetFrom'} maximumField={'perBudgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.per_budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.per_budget_end) : undefined} />
                    </FormItem> : null
                  }
                  {
                    <FormItem label={this.state.optionCategoryValue == 1 ? "婚宴预算" : this.state.optionCategoryValue == 2 ? "婚庆预算" : this.state.optionCategoryValue == 3 ? "婚纱摄影预算" : this.state.optionCategoryValue == 4 ? `${React.$celebrationOrWeddingBanquet()}预算` : this.state.optionCategoryValue == 5 ? "婚车预算" : this.state.optionCategoryValue == 6 ? "整体预算" : this.state.optionCategoryValue == 7 ? "婚服预算" : ""} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                      <NumberRangeInput style={{ width: '100%', marginLeft: 5 }} myForm={form} minimumField={'budgetFrom'} maximumField={'budgetEnd'} minimumValue={this.state.editReq ? Number(this.state.editReq.budget_from) : undefined} maximumValue={this.state.editReq ? Number(this.state.editReq.budget_end) : undefined} />
                    </FormItem>
                  }
                  <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                    {getFieldDecorator('remark', {
                      initialValue: this.state.editReq ? this.state.editReq.remark : '',
                    })(
                      <Input placeholder="请输入" style={{ marginLeft: 5 }} />
                    )}
                  </FormItem>
                  {
                    CrmUtil.getCompanyType() == 1 ?
                      <FormItem label="是否自动分配" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
                        {getFieldDecorator('needAutoDistribute', {
                          rules: [{ required: false }],
                          valuePropName: "checked",
                          initialValue: this.state.editReq?.need_auto_distribute == 0 ? false : true
                        })(
                          <Switch style={{ marginLeft: 5 }} size="default" />
                        )}
                      </FormItem>
                      :
                      null
                  }
                </Form>
              </Spin>
            </Modal>
          </div>
          {
            this.renderCategoryTab()
          }
          {
            ((!reqGroupDetails) || (!reqGroupDetails.my && !reqGroupDetails.other)) && (
              <List
                size="small"
                bordered
                dataSource={undefined}
              />
            )
          }
          {
            (reqGroupDetails.my && reqGroupDetails.my.length > 0 && reqGroupDetails.my[0].category_id.toString() == this.state.categoryId) &&
            this.renderMyGroup(reqGroupDetails.my)
          }
          {
            (reqGroupDetails.other && reqGroupDetails.other.length > 0) && reqGroupDetails.other[0].category_id.toString() == this.state.categoryId &&
            this.renderOtherGroup(reqGroupDetails.other)
          }
        </Spin>
      </div >
    );
  };

  renderCategoryTab() {
    const { config, category_num, defaultCategoryId } = this.props;
    let realcate: any[] = []
    if (category_num?.req_category_num && config.category && config.category.length > 0) {
      var map = new Map()
      category_num.req_category_num.forEach((element: { id: any; num: any; }) => {
        map.set(element.id, element.num)
      });
      config.category.forEach(element => {
        if (map.has(element.id)) {
          let temp = map.get(element.id)
          // temp = temp > 0 ? 1 : 0
          realcate.push({
            ...element,
            num: temp,
          })
        }
      })
    }
    if (realcate.length == 0) {
      realcate = config.category
    }

    // 喜铺、尼克、蘭、北京数据中心  在详情页中不显示“婚纱礼服”品类  2020-5-25 by杨玉
    if (CrmUtil.getCompanyType() == 2) {
      realcate = realcate.filter(cate => cate.id + "" != "7");
    }

    return (
      realcate && realcate.length > 0 && this.state.categoryId && (
        <Tabs activeKey={this.state.categoryId + ''} onChange={this.changeCategory}>
          {
            realcate.map(categ => (
              <TabPane tab={categ.name + '(' + categ.num + ')'} key={categ.id} />
            ))
          }
        </Tabs >
      )

    )
  }

  changeCategory = (categoryId: string) => {
    this.setState({
      categoryId,
    }, () => {
      setTimeout(() => {
        this.props.fun_refreshCategoryReqList(categoryId);
      }, 300)
    });

  }

  renderHaveCategory2() {
    const { config } = this.props;
    const categorys = config && config.category2.filter(value => (Number(value.value) == this.state.optionCategoryValue));
    return (
      categorys && categorys.length == 1 && categorys[0].children ? this.renderCategory2(categorys[0].children) : null
    );
  }

  renderCategory2(category2: CategoryConfigItem[]) {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(category2);
    return (
      category2 ? <FormItem label="二级品类" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
        {getFieldDecorator('finalCategory', {
          initialValue: this.state.editReq ? this.state.editReq.final_category : undefined,
          rules: [{ required: true, message: '请选择二级品类' }],
        })(
          <Radio.Group style={{ marginLeft: 5 }} disabled={this.state.optionCategoryType == 0 ? false : true}>
            {
              category2.map(style => (<Radio value={style.value}>{style.label}</Radio>))
            }
          </Radio.Group>
        )}
      </FormItem> : null
    );
  }

  renderCarBrand() {
    return (
      <div>
        {
          this.state.carBrandType.map((title, index) =>
            this.renderCarBrandItem(index, this.state.carBrandType.length)
          )
        }
        <a onClick={this.handleAddCarBrand} style={{ marginBottom: '0px', marginTop: '0px' }}> <PlusOutlined />添加</a>
      </div>
    );
  }
  renderCarBrandItem(index: number, length: number) {
    const { config } = this.props;

    let defaultTypeValue: string | undefined;
    let defaultNumValue: string | undefined;
    if (this.state.carBrandType && this.state.carBrandType.length > index && this.state.carBrandType[index] != 'null') {
      defaultTypeValue = this.state.carBrandType[index]
    }
    if (this.state.carBrandNum && this.state.carBrandNum.length > index && this.state.carBrandNum[index] != 'null') {
      defaultNumValue = this.state.carBrandNum[index]
    }
    return (
      <div>
        {
          <FormItem label="用车品牌" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <Select placeholder="请选择" style={{ marginLeft: 5 }} defaultValue={defaultTypeValue} onChange={(value: string) => {
              let carBrandType = this.state.carBrandType;
              carBrandType.splice(index, 1, value)
              this.setState({
                carBrandType: carBrandType,
              })
            }}>
              {
                config && config.carBrand && config.carBrand.map(style => (
                  <Option key={style.id} value={style.id + ""}>{style.name}</Option>))
              }
            </Select>
          </FormItem>
        }
        {
          <FormItem label="用车数量" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ marginBottom: '5px' }}>
            <Input placeholder="请输入" style={{ marginLeft: 5 }} value={defaultNumValue} onChange={(e) => {
              const { value } = e.target;
              let carBrandNum = this.state.carBrandNum;
              carBrandNum.splice(index, 1, value)
              this.setState({
                carBrandNum: carBrandNum,
              })
            }} />
          </FormItem>
        }
        {
          index < length - 1 && <Divider style={{ marginBottom: '15px', marginTop: '15px' }} />
        }
      </div>
    );
  }

  /**
 * @param title 
 * @param dataIndex 
 */
  createColum = (title: string | React.ReactNode, dataIndex: string): ColumnProps<RequirementData> => {
    const { fun_reqNumRender } = this.props
    const colum: ColumnProps<RequirementData> = {
      title,
      dataIndex,
    }
    if (dataIndex == 'city_info') {
      return {
        ...colum,
        render: (text: any, record: RequirementData) => {
          return (<div>{text?.full}</div>)
        },
      }
    } else if (dataIndex == 'options') {
      return {
        ...colum,
        fixed: 'right',
        render: (text: any, record: RequirementData) => {
          return (<div>
            {
              this.renderOption(record)
            }
          </div>)
        },
      }
    } else if (dataIndex == 'req_num') {
      return {
        ...colum,
        render: (text: any, record: RequirementData) => fun_reqNumRender ? fun_reqNumRender(text, record) : <div>{text}</div>
      }
    }
    return colum
  }

  /**
   * @param categoryId 1婚宴 2婚庆 3婚纱摄影 4庆典(喜宴) 5婚车 6一站式 7婚纱礼服
   */
  createColums = (categoryId: number): ColumnProps<RequirementData>[] => {
    const { optionable } = this.props
    const columns: ColumnProps<RequirementData>[] = [];
    columns.push(this.createColum('有效单编号', 'req_num'));
    columns.push(this.createColum('有效单级别', 'level_txt'));
    columns.push(this.createColum('业务品类', 'final_category_txt'));
    columns.push(this.createColum('意向区域', 'city_info'));
    if (categoryId == 1) {    //婚宴
      columns.push(this.createColum('婚礼桌数', 'hotel_tables'));
      columns.push(this.createColum('场地类型', 'site_type_txt'));
      columns.push(this.createColum('档期类型', 'schedule_type_txt'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('婚宴预算', 'budget'));
    } else if (categoryId == 2) {   //婚庆
      columns.push(this.createColum('婚礼风格', 'wedding_style_txt'));
      columns.push(this.createColum('婚礼桌数', 'hotel_tables'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
      columns.push(this.createColum('婚礼预算', 'budget'));
    } else if (categoryId == 3) {   //婚纱摄影
      columns.push(this.createColum('拍照风格', 'photo_style_txt'));
      columns.push(this.createColum('婚摄预算', 'budget'));
    } else if (categoryId == 4) {   //庆典(喜宴)
      columns.push(this.createColum('举办桌数', 'hotel_tables'));
      columns.push(this.createColum('预定酒店', 'hotel'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
      columns.push(this.createColum(`${React.$celebrationOrWeddingBanquet()}预算`, 'budget'));
    } else if (categoryId == 5) {   //婚车
      columns.push(this.createColum('用车时间', 'car_time'));
      columns.push(this.createColum('选择品牌', 'car_brand'));
      columns.push(this.createColum('用车数量', 'car_num'));
      columns.push(this.createColum('婚车预算', 'budget'));
    } else if (categoryId == 6) {   //一站式
      columns.push(this.createColum('婚礼风格', 'wedding_style_txt'));
      columns.push(this.createColum('每桌预算', 'per_budget'));
      columns.push(this.createColum('特定酒店', 'hotel'));
      columns.push(this.createColum('宴会厅', 'hotel_hall'));
    } else if (categoryId == 7) {   //婚纱礼服
      columns.push(this.createColum('使用方式', 'dress_use_way_txt'));
      columns.push(this.createColum('服饰类型', 'dress_type_txt'));
      columns.push(this.createColum('礼服款式', 'dress_model_txt'));
      columns.push(this.createColum('婚服预算', 'budget'));
    }
    columns.push(this.createColum('销售阶段', 'phase_txt'));
    columns.push(this.createColum('意向产品', 'product_txt'));
    columns.push(this.createColum('意向活动', 'activity_txt'));
    columns.push(this.createColum('归属人', 'owner_name'));
    columns.push(this.createColum('协作人', 'co_owner_name'));
    columns.push(this.createColum('创建人', 'user_name'));
    columns.push(this.createColum('负责客服', 'leads_owner_name'));
    columns.push(this.createColum('创建时间', 'create_time'));
    columns.push(this.createColum('备注', 'remark'));

    //显示操作列
    if ((optionable == undefined || optionable == 1)) {
      columns.push(this.createColum('操作', 'options'));
    }
    return columns;
  }

  renderOption = (record: RequirementData) => {
    let options: any[] = [];
    this.renderButtons(record, options)
    return (
      <Fragment>
        {
          options.map((value, index) => {
            if (index == 0) {
              return value
            } else {
              return (
                <Fragment>
                  <Divider type="vertical" />
                  {
                    value
                  }
                </Fragment>
              )
            }
          })
        }
      </Fragment>
    )
  }

  renderButtons = (record: RequirementData, options: any[]) => {
    if (record.buttons && record.buttons.length > 0) {
      record.buttons.map((value, index) => {
        value.echo != undefined && value.echo ?
          options.push(<a style={{ color: 'grey' }} onClick={() => this.handleButton(record, value)}>{value.name}</a>)
          :
          options.push(<a onClick={() => this.handleButton(record, value)}>{value.name}</a>)
      })
    }
  }

}
export default Form.create<CategoryReqProps>()(CategoryReq);
