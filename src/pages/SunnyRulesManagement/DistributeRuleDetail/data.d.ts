
export interface RulesDetail {
    id: number,
    channel_id: number,
    name: string,
    percentage_xp: number,
    percentage_lan: number,
    percentage_nk: number,
    channel_xp: number,
    channel_lan: number,
    channel_nk: number,
    status: 0|1,
    remark: string,
    create_time: string,
    /** 创建人 */
    create_by: string, 
    channel_name: string,
    channel_xp_name: string,
    channel_lan_name: string,
    channel_nk_name: string,
    is_copy: 0|1,

}
