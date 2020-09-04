import RequestEntity from "../../DemandManagement/demandCommonSea/data";

export interface ReviewData {
    auditContent: AuditContent,
    auditInfo: AuditData,
    auditRecord: AuditHistoryItem[],
}

export interface AuditData {
    id: string,
    auditor_id: string,
    type: string,
    create_time: string,
    update_time: string,
    user_id: string,  // 发起审批流者的user_id
    user_name: string,
    type_txt: string,
    company_id: string,
    related_id: string,
    latest_audit_status: string,
    latest_audit_id: string,
    latest_audit_time: string,
    latest_audit_status_txt: string,
    finish_audit: string,
    status: number,   // 审批流当前的状态  1：待审核phase1  2：驳回 phase4  3：审核中phase2   3：审核通过phase3
    status_txt: string,
    seq: number,
    total_seq: number,
    remark: string,
    other_info: string,
    is_owner: 0 | 1,  // 1代表当前审核人是当前阶段的操作者。
}
export interface AuditHistoryItem {
    time: string,
    remark: string,
    msg: string,
}

export interface ContractItem {
    key: string;
    type: string;
    value: string | Array;
    columns: Array;
}
export interface ReceivablesData {
    order_id: number,
    order_num: string,
    contract_num: string,
    sign_date: string,
    contract_amount: string,
    plan_number: string,
    plan_receivables_money: number,
    already_receivables_money: number,
    no_receivables_money: number,
    number: string,
    receivables_date: string,
    money: string,
    overdue_days: string,
    status: string,
}
export interface LeadsData {
    id: number,
    name: string,
    location_city: string,
    channel: string,
    task_id: string,
    category: string,
    wedding_date: string,
    budget: string,
    status: string,
    timeout: string,
    create_time: string,
    follow_newest: string,
    follow_log: string,
    user_name: string,
    customer_id: number,
}
export interface TransferData {
    org_owner_id: number,
    org_owner_name: string,
    owner_id: number,
    owner_name: string,
}


export interface AuditContent {
    contract: ContractItem[],
    receivables: ReceivablesData,
    leads: LeadsData,
    transfer: TransferData,
    reqDeadSea: RequestEntity,
    reqPublicSea: RequestEntity,
    closeReq: RequestEntity,
}

