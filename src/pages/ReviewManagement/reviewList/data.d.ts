export interface ReviewData {
    id: string,
    type: string,    //  4拉重单、  8有效单退回死海
    type_txt: string,
    user_id: string,
    user_name: string,
    create_time: string,
    latest_auditor_id: string,
    latest_auditor_name: string,
    latest_audit_time: string,
    latest_audit_status: string,
    latest_audit_status_txt: string,
}
export interface ReviewList {
    total: number,
    page: number,
    page_size: number,
    rows: ReviewData[],
}
export interface ConfigData {
    auditType: ConfigListItem[];
    auditConfigStatus: ConfigListItem[];
    auditPhase: ConfigListItem[];
}
export interface ConfigListItem {
    id: string;
    name: string;
}
export interface Pagination {
    pageSize: number,
    total: number,
    current: number,
    showSizeChanger: boolean,
    showQuickJumper: boolean,
}