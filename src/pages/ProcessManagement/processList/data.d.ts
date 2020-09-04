export interface ProcessData {
    id: string,
    name: string,
    type: string,
    auditor_ids: string,
    remark: string,
    status: string,
    is_del: string,
    create_time: string,
    update_time: string,
    user_id: string,
    company_id: string,
    status_txt: string,
    type_txt: string,
    structure_ids: string, // 触发部门（多个id拼接的字符串）
}
export interface ProcessList {
    total: number,
    page: number,
    page_size: number,
    rows: ProcessData[],
}
export interface ConfigListItem {
    id: string;
    name: string;
}
export interface ConfigData {
    auditType: ConfigListItem[];
    auditConfigStatus: ConfigListItem[];
}
export interface Pagination {
    pageSize: number,
    total: number,
    current: number,
    showSizeChanger: boolean,
    showQuickJumper: boolean,
}