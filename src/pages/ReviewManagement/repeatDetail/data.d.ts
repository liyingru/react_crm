export interface AuditData {
    id: string,
    auditor_id: string,
    company_id: string,
    type: string,
    type_txt: string,
    audit_time: string,
    create_time: string,
    update_time: string,
    is_owner: 0 | 1,
    next_auditor_id: string,
    other_info: string,
    related_id: string,
    remark: string,
    seq: number,
    total_seq: number,
    status: number,  //  1待审核  2驳回  3审核通过
    status_txt: string,
    user_id: string,
    user_name: string,
    related_id: string,
    latest_audit_status: string,
    latest_audit_id: string,
    latest_audit_time: string,
    latest_audit_status_txt: string,
    finish_audit: string,
}
export interface AuditHistoryItem {
    time: string,
    remark: string,
    msg: string,
}
export interface RepeatDetailData {
    auditInfo: AuditData,
    auditRecord: AuditHistoryItem[],
    auditContent: AuditContent,
}

export interface AuditContent {
    customer: CustomerInfos,
}

export interface CustomerInfos {
    customer_data: CustomerDataSimple[],
    req_category_data: RequestInfo[]
}

export interface CustomerDataSimple {
    customer_id: string,
    customer_name: string,
    phone: string,
    wedding_date: string,
    create_time: string, // 创建时间
    req_info: RequestInfo[],
    repeat_status: string,  //  客户重单状态 1:正常,2:客户合并,3:亲子单,
    similar_id: string | 0,
    repeat_audit_status:       0 | 1 | 2 | 3,  //  客户重单审核状态 0:正常无重单提审 1:待审核,2:驳回,3:通过
    status:          string,   // 客户状态
}

export interface RequestInfo {
    category_id: string,
    category_name: string,
    data: RequestSheetDetail[]
}

export interface RequestSheetDetail {
    id: string,
    customer_id: string,
    customer_name: string,
    customer_phone: string,
    req_num: string,
    merchant: string,
    team_name: string,
    follow_user_id: string,
    follow_user_name: string,
    status: number,
    status_txt: string,
    full_user_name: string,
    create_time:string,
}




