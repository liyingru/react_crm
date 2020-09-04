import { Pagination } from "@/commondata";

export interface MassageItemModel {
    id:number;
    title: string;
    content: string;
    url: string;
    data_id: string;
    type: string;
    status: number;
    customer_id: string;
    user_id: string;
    category_id?: number | string;
    leads_id?: number | string;
    order_id?: number | string;
    audit_id?: number | string;
    req_id?: number | string;
    default_active_key?: number | string;
    show_style?: number | string;
    read_or_write?: number | string;
    is_qa?: boolean | string;
}

export interface statusParams {
  groupId: int;
  status: int;
}

export interface TableListData {
  list: MassageItemModel[];
  pagination: Partial<Pagination>;
}

export interface NoticeJumpParams {
  customerId: string | number; 
  leadsId: string | number; 
  leadId: string | number; 
  ownerId: string | number; 
  categoryId: string | number; 
  orderId: string | number;
  auditId: string | number;
  reqId: string | number;
  defaultActiveKey: string | number;
  showStyle: string | number;
  readOrWrite: string | number;
  isQA: string | boolean;
}
