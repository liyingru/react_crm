import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import LOCAL from './LocalStorageKeys';

export interface CustomerConfigDataState {
  channel: CustomerConfigItem[];
  category: CustomerConfigItem[];
  followRes: CustomerConfigItem[];
  weddingStyle: CustomerConfigItem[];
  source: CustomerConfigItem[];
  orderFollowStatus: CustomerConfigItem[];
  followTag: CustomerConfigItem[];
}


export interface CustomerConfigItem {
  id: string;
  name: string;
}



// 获取客户的配置信息
export function getCustomerConfigData(onGetConfigData: (customerConfig: CustomerConfigDataState) => void): void {
  const configStr = localStorage ? localStorage.getItem(LOCAL.CUSTOMER_CONFIG) : null;
  if(configStr && configStr != null) {
    if(onGetConfigData) {
      onGetConfigData(JSON.parse(configStr))
    }
  } else {
    Axios.post(URL.customerConfig)
      .then(
        res => {
          if (res.code == 200) {
            const configData: CustomerConfigDataState = res.data.result;
            localStorage.setItem(LOCAL.CUSTOMER_CONFIG, JSON.stringify(configData));
            if(onGetConfigData) {
              onGetConfigData(configData)
            }
          }
        }
      );
  }
  
}
