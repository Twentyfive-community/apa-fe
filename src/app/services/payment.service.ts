import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Utils} from "../shared/utils/utils";
import {PaymentReq} from "../models/PaymentReq";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  kafkaTopic=`${environment.kafkaTopic}`;
  paymentUrl=`${environment.paymentUrl}`;
  constructor(private httpClient: HttpClient) { }

  request = {
    "currency": "EUR",
    "value": "200.00",
    "brandName": "Twentyfive",
    "cancelUrl": "https://www.google.it",
    "returnUrl": "http://localhost:4200/afterComplete",
    "items": [
      {
        "name": "plus1",
        "description" : "description plus1",
        "quantity" : "1",
        "unit_amount": {
          "currency_code": "EUR",
          "value": "200.00"
        },
        "orderData": {
          "field1" : "verde",
          "field2": "XXL"
        }
      }
    ]
  };

  createOrder(toPay:PaymentReq){
    let h=Utils.createHttpHeaders({'Payment-App-Id':this.kafkaTopic});
    return this.httpClient.post(`${this.paymentUrl}/payments`, toPay, {headers: h});
  }

  authorize(id: string){
    return this.httpClient.get(`${this.paymentUrl}/payments/authorize/` + id);
  }

  capture(id: string){
    let h=Utils.createHttpHeaders({'Payment-App-Id':this.kafkaTopic});
    return this.httpClient.get(`${this.paymentUrl}/payments/capture/` + id, {headers: h});
  }}
