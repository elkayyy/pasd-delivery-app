import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Order } from 'src/app/model/interfaces/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrderList = () =>
    this.http.get(environment.firebase.url + 'order-list.json').pipe(
      map((res) =>
        Object.entries(res).map((entry) => ({ ...entry[1], id: entry[0] }))
      ),
      tap((orders) => {
        console.log('orderS > getOrderList > order:\n', orders);
      })
    );

  updateOrder = (order: Order) =>
    this.http
      .put(environment.firebase.url + 'order-list/' + order.id + '.json', order)
      .pipe(
        tap((res) => {
          console.log('orderS > updateOrder > res:\n', res);
        })
      );

  createOrder = (order: Order) =>
    this.http.post(environment.firebase.url + 'order-list.json', order).pipe(
      tap((res) => {
        console.log('orderS > createOrder > res:\n', res);
      })
    );

  deleteOrder = (id: string) =>
    this.http.delete(environment.firebase.url + 'order-list/' + id + '.json').pipe(
      tap((res) => {
        console.log('orderS > deleteOrder > res:\n', res);
      })
    );
}
