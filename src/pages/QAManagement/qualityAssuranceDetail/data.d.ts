import { string } from "prop-types";
import { CustomerData,ContactUserData,FollowData } from '@/pages/CustomerManagement/customerDetail/dxl/data';
import { RequirementDataDetails } from '@/pages/LeadsManagement/leadsDetails/data';

export interface ReqQaDetail {
  customerData: Partial<CustomerData>;
  contactUserData: ContactUserData[];
  reqQaLiteData: Partial<ReqQaLiteData>;
  followData: FollowData;
}

export interface ReqQaLiteData {
  req_qa_id:         number;
  customer_id:       number;
  associates:        string;
  sale:              string;
  kefu:              string;
  next_contact_time: string;
  allot_status:      number;
  valid_req_qa_data: ValidReqQaData[];
  allot_company:     AllotCompany[];
  top_category:      string;
}

export interface AllotCompany {
  id:   number;
  name: string;
}

export interface ValidReqQaData {
  id:   number;
  req_num: string;
  category_text: string;
}

export interface RequirementDataGroupDetails {
  req_qa_data: RequirementDataDetails[];
  req_data: RequirementDataDetails[];
}



