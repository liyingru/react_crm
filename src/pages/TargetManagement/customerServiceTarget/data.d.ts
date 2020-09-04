// 客服目标
export interface CustomerServiceTargetModel {
  is_show: boolean;
  name: string;
  type: string;
}

export interface CurrentUser {
  account: string;
  avatar: string;
  company_id: string;
  correction_date: Date;
  create_time: Date;
  entry_date: Date;
  id: string;
  job_number: string;
  last_login_ip: string;
  last_login_time: string;
  name: string;
  position_id: string;
  rank: string;
  role_id: string;
  sex: string;
  skin: string;
  source: string;
  status: string;
  structure_id: string;
  update_time: Date;
}

export interface SystemUser {
  id: string;
  company_id: string;
  structure_id: string;
  position_id: string;
  job_number: string;
  account: string;
  name: string;
  sex: string;
  role_id: string;
  rank: string;
  entry_date: string;
  correction_date: string;
  status: string;
  last_login_ip: string;
  last_login_time: string;
  create_time: string;
  update_time: string;
  avatar: string;
  skin: string;
  source: string;
}
