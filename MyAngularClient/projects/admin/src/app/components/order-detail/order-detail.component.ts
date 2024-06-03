import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersComponent } from '../../orders/orders.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit{
  title="Chi tiết đơn hàng";
  orderDetail:any []=[]

  constructor(private orders: OrdersComponent, private route: ActivatedRoute) {}

  ngOnInit() {
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation.extras.state) {
    //   const orderDetail = navigation.extras.state.orderDetail;
    //   console.log(orderDetail);
    // }
    console.log(this.orders.orderDetail);
    
  }
}
