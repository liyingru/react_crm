import { Pagination } from "@/commondata";

export interface DayOffListData {
  list: DayOffListItem[];
  pagination: Partial<Pagination>;
}

export interface DayOffListItem {
    id: number;
    date_time: string;
    user_id_list: string;
    create_time:string;
    update_time: string;
    user_id: number;
    company_id: number;
    user_id_list_txt:string;
    is_edit: 0 | 1;
}