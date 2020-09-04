

export interface CustomerFromConfigDataItem {
pid_txt: string;
id: string;
company_id: string;
name: string;
status: number;
pid: string;
domain: string;
status_txt: string;
domain_txt: string;
tier: string;
childlist: CustomerFromConfigDataItem[];
}