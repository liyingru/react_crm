export interface UserInfo {
  ac_account: string;
  account: string;
  address: string;
  avatar: string;
  birthday: string;
  city_code: string;
  company_id: string;
  company_name: string;
  company_tag: string;
  correction_date: string;
  create_time: string;
  data_authority: 1|2|3|4;  // '数据权限，1 个人和下属，2所属部门，3所属部门和下属部门，4全公司'
  dxl_auth_id: string;
  entry_date: string;
  id: number;
  is_liheuser: 0|1
  job_number: string;
  last_login_ip: string;
  last_login_time: string;
  last_quit_time: string;
  lihe_user_id: number;
  moor_number: string;
  moor_type: string;
  name: string;
  position_id: string;
  rank: number;
  role_id: string;
  sex: 0|1;
  show_phone: 0|1; // 是否明文显示客户的重要信息
  skin: string;
  source: string;
  status: number;
  structure_id: string;
  update_time: string;
  user_id: number;
}
