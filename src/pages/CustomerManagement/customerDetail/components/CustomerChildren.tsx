import { Card, Descriptions, List } from 'antd';

import React from 'react';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';
import InfiniteScroll from 'react-infinite-scroller';


interface CustomerChildrenProps {
  data: CustomerDataSimple[];
  checkoutCustomerDetail: (customerId: string) => void;
}
const CustomerChildrenModal: React.FC<CustomerChildrenProps> = props => {
  const { data , checkoutCustomerDetail } = props;

  const toDetail = (customerId: string) => {
    checkoutCustomerDetail(customerId);
  };

  /**
     * 查看客户详情
    */
  const checkCustomerDetail = (customerId: string)=> {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("/customer/");
    const targetUrl = currentUrl.substring(0, index)+"/customer/customerManagement/customerDetail";
    window.open(targetUrl+"?customerId="+customerId);
  }



  return (
      <div style={{height:"400px",overflowY:"auto"}} >
                  <List
                    split={false}
                    dataSource={data}
                    renderItem={(customerInfo, index) => (
                      <List.Item>
                        <div style={{width:"100%"}}>
                        <p>亲子客户{index+1}：</p>
                        <Card style={{width:"100%"}} size="small" bordered={true} title={"客户姓名："+customerInfo.customer_name + " " + customerInfo.phone} extra={<a onClick={()=>{checkCustomerDetail(customerInfo.customer_id)}}>查看详情</a>}>
                            <p style={{fontWeight:500}}>关联商机</p>
                            {
                              customerInfo.req_info.map(value => (
                                      <div>
                                        <div style={{display:"flex"}}>
                                          <span style={{fontWeight:500, flex:1}}>|{value.category_name}品类：</span>
                                          <span style={{fontWeight:500, flex:1}}>状态：{value.data[0].status_txt}</span>
                                        </div>
                                          {
                                              value.data.map(req_detail => (
                                                    <Descriptions size="small" bordered={true} column={1} style={{marginLeft:10, marginBottom:10, marginTop:5}}>
                                                        <Descriptions.Item label="商机编号">{req_detail.req_num}</Descriptions.Item>
                                                        {/* <Descriptions.Item label="状态">{req_detail.status_txt}</Descriptions.Item> */}
                                                        <Descriptions.Item label="归属人">{req_detail.full_user_name}</Descriptions.Item>
                                                    </Descriptions>
                                                  )
                                              )
                                          }
                                      </div>
                                  )
                              )
                            }

                            
                          </Card>
                        </div>
                        
                          
                      </List.Item>
                    )}
                  />
              
            </div>

  );
};

export default CustomerChildrenModal;
