
/**
认领订单

*/
export interface ClaimOrderParams {
  orderId: string;
}


/**
 *  "id": 1,
   "category": 1,
   "customer_id": 65861,
    "customer_name": "胡来龙",
    "customer_phone": "139****0039",
    "category_txt": "婚宴"
 */
export interface OrderLisItem {
  id: string;
  category: string;
  customer_id: string;
  customer_name: string;
  customer_phone:string;
  category_txt: string;
}

