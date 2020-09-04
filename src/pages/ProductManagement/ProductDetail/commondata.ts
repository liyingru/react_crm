import { ColumnProps } from "antd/lib/table";

function getCategoryColumn<T>(type: string) {
  let columns: ColumnProps<T>[] = [];
  let categoryName = '';
  if (type == '1') {
    categoryName = '婚宴';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('意向商家', 'merchant'));
    columns.push(genprop<T>('星级', 'hotel_star'));
    columns.push(genprop<T>('桌数', 'hotel_tables'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
  } else if (type == '2') {
    categoryName = '婚庆';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('意向商家', 'merchant'));
    columns.push(genprop<T>('婚礼风格', 'wedding_style_txt'));
    columns.push(genprop<T>('酒店名称', 'hotel'));
    columns.push(genprop<T>('厅名', 'hotel_hall'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
  } else if (type == '3') {
    categoryName = '婚纱摄影';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('意向商家', 'merchant'));
    columns.push(genprop<T>('婚照风格', 'photo_style_txt'));
    columns.push(genprop<T>('拍摄时间', 'photo_time'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
  } else if (type == '4') {
    categoryName = React.$celebrationOrWeddingBanquet();
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('意向商家', 'merchant'));
    columns.push(genprop<T>('婚礼风格', 'wedding_style_txt'));
    columns.push(genprop<T>('酒店名称', 'hotel'));
    columns.push(genprop<T>('厅名', 'hotel_hall'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
  } else if (type == '6') {
    categoryName = '一站式';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('意向商家', 'merchant'));
    columns.push(genprop<T>('婚礼风格', 'wedding_style_txt'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
  } else if (type == '5') {
    categoryName = '婚车';
    columns.push(genprop<T>('有效单编号', 'req_num'));
    columns.push(genprop<T>('业务城市', 'city'));
    columns.push(genprop<T>('每桌预算', 'budget'));
    columns.push(genprop<T>('用车品牌', 'car_brand'));
    columns.push(genprop<T>('用车型号', 'car_series'));
    columns.push(genprop<T>('用车数量', 'car_num'));
    columns.push(genprop<T>('用车时间', 'car_time'));
    columns.push(genprop<T>('预计到店时间', 'est_arrival_time'));
    columns.push(genprop<T>('状态', 'status_txt'));
    columns.push(genprop<T>('创建时间', 'create_time'));
    columns.push(genprop<T>('创建人', 'user_name'));
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


export interface ConfigListItem {
  id: string;
  name: string;
}

/**
 * 通用配置项
 */
export interface ConfigList {
  channel: ConfigListItem[]; //渠道
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
  leadsFollowStatus: ConfigListItem[]; //客资跟进状态
  customerFollowStatus: ConfigListItem[]; //客户跟进状态
  orderFollowStatus: ConfigListItem[]; //订单跟进状态
  leadsStatus: ConfigListItem[]; //客资状态
  banquetType: ConfigListItem[]; //婚宴类型
  carBrand: ConfigListItem[]; //车辆品牌
  photoStyle: ConfigListItem[]; //婚照风格
  hotelStar: ConfigListItem[]; //酒店星级
}
