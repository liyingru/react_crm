export interface ParamsDetail{
    customerId:string
}

export interface CustomerData {
    customerId:        string;
    customerLevel:     string;
    customerLevelText: string;
    channel:           string;
    customerName:      string;
    gender:            string;
    genderText:        string;
    identity:          string;
    identityText:      string;
    weddingDate:       string;
    phone:             string;
    weChat:            string;
    liveCityInfo:      CityInfo;
    liveAddress:       string;
    workCityInfo:      CityInfo;
    workAddress:       string;
    contactTime:       string;
    referrerName:      string;
    likeCityInfo:      CityInfo;
    budget:            string;
    category:          string;
    weddingStyle:      string;
    weddingStyleText:  string;
    deskNum:           string;
    hotel:             string;
    encryptPhone:      string;
    nextContactTime:   string;
    allotTime:         string;
}

export interface ParamsMember{
    keywords:string
}

export interface MemberDataList {
    name: string;
    id: int;
    job_number: string;
    company_name: string;
    structure_name: string;
}

export interface ParamsAdd {
    name: string;
    categoryId: string;
    channelId: string;
    areaCode: string;
    leaderUserIds: string;
    membersUserIds: string;
    remark: string;
    status: int;
}

export interface AddGroupDataList {
    result: string;
}