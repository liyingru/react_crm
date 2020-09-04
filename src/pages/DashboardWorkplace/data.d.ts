export interface TagType {
  key: string;
  label: string;
}

// 海域列表
export interface BossSea {
  id: string;
  name: string;
}

// 自定义工作台列表
export interface WorkPanel {
  is_show: number;
  name: string;
  type: string;
}

/**
 * 新进leads数；
 * 待跟进leads数；
 * 待回访leads数；
 * 建有效单数；
 * 生成确认单数；
 * 已签单数；
 */
export interface WorkNumbersType {
  leads_follow: number;
  leads_new: number;
  leads_visit: number;
  order_confirm: number;
  order_contract: number;
  order_create: number;
}
export interface CurrentUser {
  account: string;
  avatar: string;
  company_id: string;
  correction_date: Date;
  create_time: Date;
  entry_date: Date;
  id: string;
  job_number: string;
  last_login_ip: string;
  last_login_time: string;
  name: string;
  position_id: string;
  rank: string;
  role_id: string;
  sex: string;
  skin: string;
  source: string;
  status: string;
  structure_id: string;
  update_time: Date;
}

export interface SystemUser {
  id: string;
  company_id: string;
  structure_id: string;
  position_id: string;
  job_number: string;
  account: string;
  name: string;
  sex: string;
  role_id: string;
  rank: string;
  entry_date: string;
  correction_date: string;
  status: string;
  last_login_ip: string;
  last_login_time: string;
  create_time: string;
  update_time: string;
  avatar: string;
  skin: string;
  source: string;
}

// 我的业绩
export interface MyPerformance {
  finish_money: number;
  finish_money_txt: string;
  finish_order_num: number;
  finish_percent: string;
  target_money: number;
  target_money_txt: string;
  target_order_num: number;
}

// 销售助手
export interface SalesAssistant {
  r7daysOrders: {
    order_time: string;
    customer_name: string;
    plan_receivables_time: string;
    sale: string;
  },
  r30daysOrders: {
    order_time: string;
    customer_name: string;
    wedding_day: string;
    no_receivables_amount: string;
    sale: string;
  },
  timeoutOrders: {
    order_time: string;
    customer_name: string;
    message: string;
    sale: string;
  },
  timeoutLeads: {
    time: string;
    customer_name: string;
    message: string;
    kefu: string;
  },
  reminder: {
    type: string;
    message: string;
    kefu: string;
    sale: string;
  }
}

// 销售业绩
export interface SalesPerformance {
  orderNum: string;
  orderAmount: string;
  receivablesAmount: string;
  phoneLeadsNum: string;
  wechatLeadsNum: string;
  customerNum: string;
}

// 预测业绩
export interface ForecastPerformance {
  salesTarget: string;
  planReceivablesAmount: string;
  actualReceivablesAmount: string;
  contactCount: string;
  contactDuration: string;
  followCount: string;
}

// 荣誉榜用户
export interface HonorUser {
  top_duration: number;
  user_name: string;
}

// 建单排行榜
export interface ReqrankingUser {
  create_req_percent: string;
  member: string;
  rank: number;
  req_num: number;
}

// 订单排行榜
export interface OrderrankingUser {
  sign_order_percent: string;
  member: string;
  order_num: number;
  rank: number;
}

// 销售漏斗
export interface SalesFunnel {
  leads: {
    count: number;
    items: {
      到喜啦: string;
      SEM: string;
      SEO: string;
      线下导入: string;
      微信: string;
    }[]
  },
  requirement: {
    count: number,
    items: {
      重点客户: string;
      意向客户: string;
      一般客户: string;
      低意向客户: string;
    }[]
  },
  order: {
    count: number,
    items: {
      婚宴: string;
      婚庆: string;
      婚车: string;
      一站式: string;
    }[]
  },
  sign_order: {
    count: number,
    items: {
      婚宴: string;
      婚庆: string;
      婚车: string;
      一站式: string;
    }[]
  }
}

// 审批中心订单
export interface ApprovalCenterOrder {

}

// 呼叫分析
export interface CallAnalysis {
  callOutNum: number; // 外呼量
  connectNum: number; // 接听量
  createNum: number;  // 建单量
  signNum: number;    // 签单量
}

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface ActivitiesType {
  id: string;
  updatedAt: string;
  user: {
    name: string;
    avatar: string;
  };
  group: {
    name: string;
    link: string;
  };
  project: {
    name: string;
    link: string;
  };

  template: string;
}

export interface RadarDataType {
  label: string;
  name: string;
  value: number;
}

export interface DashboardWorkplaceParams {
  id?: string;
  showUserId?: string;
  companyId?: string;
  structureId?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
}
