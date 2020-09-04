export interface TableListItem {
    budget: string;
    business_content:string;
    category: init;
    channel: string;
    city: string;
    contract_num: string;
    create_time: Date;
    customer_id: init;
    customer_name: string;
    district: string;
    gender: init;
    id: init;
    kefu: string;
    mobile: string;
    order_num: string;
    req_id: init;
    saler:string;
    status: init;
    update_time: string;
    user_id: init;
    wechat: string;
    wedding_day: Date;
    avatarGrant:any;
    receivablesStatusList:any;
    paymentModeList:any;
    numberList:any;
    avatarGrant:any;
    ConfigListItem
  }
  
  export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
  }
  
  export interface TableListData {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
  }
  
  export interface TableListParams {
    sorter: string;
    status: string;
    name: string;
    pageSize: number;
    currentPage: number;
  }
  export interface ConfigListItem {
    id?: string;
    name?: string;
  }