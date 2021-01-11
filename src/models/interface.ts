export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  type: string;
  date_created: string;
  tokenid: string;
  devicetoken: string;
  locationid: string;
}
export interface ILocation {
  id: number;
  name: string;
  fees: string;
  DeliveryAddress: any;
  DiscountPoint:any;
}

export class IRecovery {
  id: number;
  userid: string;
  question: string;
  answer: string;
}
export class IProduct {
  id: number;
  name: string;
  price: any;
  properties: any;
  product_categoryid: any;
  Amount: any;
  Quantity: any;
  PropName:any;
  PropValue:any;
}
export class IProductCategories {
  id: number;
  name: string;
}
export class IMessage {
  id: number;
  date: Date;
  time: any;
  subject: string;
  from_member_id: number;
  to_member_id: number;
  body: string;
  is_read: any;
  sendername: any;
  msgdate: any;
  msgtime: any;
  recievername: any;
}
export class ICart {
  id: number;
  userid: any;
  product_details: any;
  status: string;
  product_count: number;
}
export class IOrder {
  id: number;
  userid: any;
  productdetails: any;
  status: string;
  bookedtime: any;
  bookeddate: any;
  deliverytime: any;
  deliverydate: any;
  ordernumber: any;
  substatus: any;
  amount: any;
  deliveryaddress: any;
  deliveryfee:any;
  CustomerName:any;
  CustomerPhone:any;
  CustomerID:any;
}