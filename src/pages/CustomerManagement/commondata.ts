import { ColumnProps } from "antd/lib/table";

function getCategoryColumn<T>(type: string) {
  let columns: ColumnProps<T>[] = [];
  let categoryName = '';
  if (type == '1') {
    categoryName = '婚宴';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('婚礼桌数', 'hotel_tables'));
    columns.push(genprop<T>('场地类型', 'site_type_txt'));
    columns.push(genprop<T>('档期类型', 'schedule_type_txt'));
    columns.push(genprop<T>('每桌预算', 'per_budget'));
    columns.push(genprop<T>('婚宴预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '2') {
    categoryName = '婚庆';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('婚礼风格', 'wedding_style_txt'));
    columns.push(genprop<T>('婚礼桌数', 'hotel_tables'));
    columns.push(genprop<T>('预定酒店', 'hotel'));
    columns.push(genprop<T>('宴会厅', 'hotel_hall'));
    columns.push(genprop<T>('婚庆预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '3') {
    categoryName = '婚纱摄影';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('婚照风格', 'photo_style_txt'));
    columns.push(genprop<T>('婚摄预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '4') {
    categoryName = React.$celebrationOrWeddingBanquet();
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('宴会类型', 'banquet_type'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('举办桌数', 'hotel_tables'));
    columns.push(genprop<T>('预定酒店', 'hotel'));
    columns.push(genprop<T>('宴会厅', 'hotel_hall'));
    columns.push(genprop<T>('每桌预算', 'per_budget'));
    columns.push(genprop<T>(`${React.$celebrationOrWeddingBanquet()}预算`, 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '6') {
    categoryName = '一站式';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('婚礼风格', 'wedding_style_txt'));
    columns.push(genprop<T>('婚礼桌数', 'hotel_tables'));
    columns.push(genprop<T>('每桌预算', 'per_budget'));
    columns.push(genprop<T>('预定酒店', 'hotel'));
    columns.push(genprop<T>('宴会厅', 'hotel_hall'));
    columns.push(genprop<T>('整体预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '5') {
    categoryName = '婚车';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('用车时间', 'car_time'));
    columns.push(genprop<T>('用车品牌', 'car_brand'));
    columns.push(genprop<T>('用车数量', 'car_num'));
    columns.push(genprop<T>('婚车预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  } else if (type == '7') {
    categoryName = '婚纱礼服';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('意向区域', 'city'));
    columns.push(genprop<T>('使用方式', 'lifu_way'));
    columns.push(genprop<T>('服饰类型', 'lifu_type'));
    columns.push(genprop<T>('礼服款式', 'lifu_model'));
    columns.push(genprop<T>('婚服预算', 'budget'));
    columns.push(genprop<T>('创建人', 'user_name'));
    columns.push(genprop<T>('创建时间', 'create_time'));
  }
  return {
    category: categoryName,
    columns: columns
  }
}


function genprop<T>(title: string, dataIndex: string) {
  let column: ColumnProps<T>;
  return column = {
    title: title,
    key: dataIndex,
    dataIndex: dataIndex,
  }
}

export default getCategoryColumn

export interface OperateConfig {
  req_detail_page: ConfigListItem[];
}


export interface ConfigListItem {
  id: string;
  name: string;
  value: string;
  label: string;
  pid: string;
  children: ConfigListItem[];
}

/**
 * 通用配置项
 */
export interface ConfigList {
  channel: ConfigListItem[]; //渠道
  bjRolechannel: ConfigListItem[]; //渠道
  customerLevel: ConfigListItem[]; //客户级别
  identity: ConfigListItem[]; //客户身份
  gender: ConfigListItem[]; //性别
  weddingStyle: ConfigListItem[]; //婚礼风格
  category: ConfigListItem[]; //业务品类
  contactTime: ConfigListItem[]; //方便联系时间
  contactWay: ConfigListItem[]; //跟进方式
  payType: ConfigListItem[]; //付款方式
  requirementStatus: ConfigListItem[]; //有效单状态
  followTag: ConfigListItem[]; //跟进标签
  requirementFollowTag:ConfigListItem[]; //需求单跟进标签
  requirementLevel:ConfigListItem[]; //需求单级别
  /** 客资跟进状态 - [{id: 1, name: "需求客户"}, {id: 10, name: "无人接听"}, {id: 11, name: "客户拒接"}, {id: 17, name: "空号"},…] */
  leadsFollowStatus: ConfigListItem[];
  /** 客资跟进状态 - [{id: 1, name: "重点"}, {id: 2, name: "跟进"}, {id: 3, name: "普通"}, {id: 4, name: "一般"}] */
  leadsFollowTag: ConfigListItem[];
  customerFollowStatus: ConfigListItem[]; //客户跟进状态
  orderFollowStatus: ConfigListItem[]; //订单跟进状态
  leadsStatus: ConfigListItem[]; //客资状态
  requirementPhase: ConfigListItem[]; 
  banquetType: ConfigListItem[]; //婚宴类型
  carBrand: ConfigListItem[]; //车辆品牌
  photoStyle: ConfigListItem[]; //婚照风格
  hotelStar: ConfigListItem[]; //酒店星级
  source: ConfigListItem[]; //活动来源
  category2: ConfigListItem[]; //多级渠道
  customerStatus: ConfigListItem[];
  customerRepeatStatus: ConfigListItem[]; // 合并标识
  complaintType: ConfigListItem[]; // 客诉类型
  requirementReturnReason: ConfigListItem[]; //退回原因
  requirementQtInvalidReason: ConfigListItem[]; // 质检驳回原因
  dressModel: ConfigListItem[];
  dressType: ConfigListItem[];
  siteType: ConfigListItem[];
  scheduleType: ConfigListItem[];
  dressUseWay: ConfigListItem[];
  coupon: ConfigListItem[];
  nbCompany: ConfigListItem[];  // 喜铺集团下的公司列表
  nbChannel: {
    count: number,
    list: {
      title: string,
      optionGroups: [
        {
          label: string,
          value: number,
          domain: number
        }
      ][]
    }[],
  }
}
