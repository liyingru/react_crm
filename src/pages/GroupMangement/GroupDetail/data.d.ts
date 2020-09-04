export interface detailParams {
  groupId: int;
}

export interface CityInfo{
  province;         string;
  city:             string;
  district:         string;
  full:             string;
  city_code:        string;
}

export interface MemberDataList {
  name: string;
  id: int;
  job_number: string;
  company_name: string;
  structure_name: string;
}

export interface updateParams {
  groupId: int;
  name: string;
  categoryId: string;
  channelId: string;
  areaCode: string;
  leaderUserIds: string;
  membersUserIds: string;
  remark: string;
  status: int;
}