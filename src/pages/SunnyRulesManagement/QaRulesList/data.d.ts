import { Pagination } from "@/commondata";

export interface RulesListData {
  list: RulesListItem[];
  pagination: Partial<Pagination>;
}

export interface RulesListItem {
  rules_id: string;
  rules_name: string;
  status: 1 | 2;
  status_text: string;
  desc: string;
  create_time: string;  
  create_user: string;
  channel: string;
  category: string;
}

