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
    category: int;
    priceMin: float;
    priceMax: float;
    merchantId: int;
    unit: int;
    accessory: string;
    status: int;  // 1 上架 0下架
}

export interface AddProductDataList {
    result: string;
}

export interface StoreDataList {
    
}

export interface detailParams {
    id: int
}