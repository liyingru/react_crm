export interface PaginationListData {
    list: CustomerComplaintDetail[];
    pagination: Partial<TableListPagination>;
}

export interface PaginationFollowListData {
    list: CustomerComplaintFollowData[];
    pagination: Partial<TableListPagination>;
}

export interface CustomerComplaintListResponseResult {
    count: int;
    list: CustomerComplaintDetail[];
    header: {name: string; num: number;}[];
}

export interface CustomerComplaintDetail {
    id:string;
    content: string;
    create_time: string;
    customer_id: string;
    customer_name: string;
    file: string[];
    new_content: string;
    status_txt: string;
    type_txt: string;
    update_time: string;
    id_num: string;
    from: 1|2;  // 客诉来源： 1线索  2有效单
}

export interface TableListPagination {
    total: number;  // 总共有多少条数据
    pageSize: number;  // 每一页展示多少条数据
    current: number;  // 当前正在展示第几页
}


export interface CustomerComplaintFollowListResponseResult {
    count: int;
    list: CustomerComplaintFollowData[];
}

export interface CustomerComplaintFollowData{
    follow_time:	string;//	跟进时间
    type:	string;//	类型
    content:	string;//	内容
    file:	string;//	文件
    follow_next:	string;//	下次更进时间
    user_name:	string;//	跟进人
}

/**
 * 请求列表的参数
 */
export interface CustomerComplaintListParams {
    headerType?: number;
    channel?: number;
    actionTime?: string;
    endTime?: string;
    type?: number;
    customerId?: number;
    customerName?: string;
    phone?: string;
    wechat?: string;
    ownerName?: string;
    pageSize?: number;
    page?: number;
}

/**
 * 拉取客诉单详情参数
 */
export interface QueryCustomerComplaintDetailParams {
    id: string;
}

/**
 * 处理客诉单参数
 */
export interface HandleCustomerComplaintParams {
    id: string;
    type: 1|2;  // 1电话 2微信
    status: 1|2|3;
    content: string;
    file: string[];
    followNext: string;
}


