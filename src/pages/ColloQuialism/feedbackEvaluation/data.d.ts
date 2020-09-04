export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface statusParams {
groupId: int;
status: int;
}

export interface TableListData {

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