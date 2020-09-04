
export interface RulesDetail {
    rulesInfo:     Partial<RulesInfo>;
    intoGroupData: IntoGroupDatum[];
    verifierData:  Partial<Data>;
    inviteData:    Partial<Data>;
    orderData:     Partial<Data>;
    logRules:      LogRule[];
}

export interface IntoGroupDatum {
    id:                       string;
    rules_id:                 string;
    channel_id:               string;
    is_show:                  0 | 1;
    is_invite:                0 | 1;
    routine_receive_user:     string;
    routine_receive_group:    string;
    create_time:              string;
    update_time:              string;
    channel_name_txt:         string;
    routine_receive_user_txt: string;
}

export interface Data {
    id:                       string;
    rules_id:                 string;
    type:                     string;
    is_skip:                  0 | 1;
    routine_receive_user:     string;
    routine_receive_group:    string;
    is_invite:                0 | 1;
    is_distribute:            0 | 1;
    distribute_company_id:    string;
    distribute_channel_list:  {
        channel_id: number,
        channel_name: string,
        company_name: string,
        distribute_channel_id: number,
        distribute_company_id: number,
        rules_id: number
    }[]
    is_customer_grade:        0 | 1;
    grade_a:                  string;
    grade_b:                  string;
    grade_c:                  string;
    grade_d:                  string;
    create_time:              string;
    update_time:              string;
    routine_receive_user_txt: string;
    distribute_company_txt?:  string;
    distribute_channel_txt?:  string;
    grade_a_txt:             string;
    grade_b_txt:             string;
    grade_c_txt:             string;
    grade_d_txt:             string;
}

export interface LogRule {
    id:          string;
    rules_id:    string;
    user_id:     string;
    content:     string;
    create_time: string;
    name:        string;
}

export interface RulesInfo {
    id:            string;
    name:          string;
    company_name:  string;
    company_id:    number;
    activity_id:   string;
    activity_name: string;
    user_id:       string;
    status:        string;
    create_time:   string;
    update_time:   string;
}
