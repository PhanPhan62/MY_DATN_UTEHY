import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders = [];
  orderDetail = [];
  constructor(private http: HttpClient, private router: Router) {}

  
  public url = 'http://localhost:3000';
  p: number = 1;
  fetchOrders() {
    const pageIndex = this.p;
    const pageSize = 1;

    this.http
      .get(`${this.url}/order?page=${pageIndex}&pageSize=${pageSize}`)
      .subscribe((data: any) => {
        this.orders = data;
        // console.log(this.orders);
      });
  }
  fetchOrdersDetail(id: number) {
    this.http
      .get(`${this.url}/orderDetail/${id}`)
      .subscribe((data: any) => {
        if (data) {
          // Sau khi nhận được dữ liệu, điều hướng đến component khác
          this.router.navigate([`/admin/orders/detail/${id}`], { state: { orderDetail: data } });
        }
      });
  }
  Edit(_t59: any) {
    throw new Error('Method not implemented.');
  }
  Create() {
    throw new Error('Method not implemented.');
  }
  title = 'Đơn hàng';
  ngOnInit(): void {
    this.fetchOrders();
  }
  images: any;
  displayCustom: any;
  activeIndex: any;
  responsiveOptions: any;

  handleValueChange(newValue: any) {
    // handle the changed value here
    console.log(newValue);
  }



}
