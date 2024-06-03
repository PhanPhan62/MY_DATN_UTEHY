import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  orderDetail: any[] = []
  orderProductDetail: any

  constructor(
    private http: HttpClient, private route: ActivatedRoute
  ) {
    this.loadorderDetailData();

    this.route.params.subscribe(params => {
      const orderId = params['id'];
      // console.log(orderId); 
      this.orderProductDetail = orderId;
    });
    this.fetchOrderProductDetailData();
  }

  loadorderDetailData() {
    // console.log(this.cart);
    const cartDataJSON = localStorage.getItem('viewDetail');

    // Kiểm tra nếu dữ liệu tồn tại
    if (cartDataJSON) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript (mảng trong trường hợp này)
      const orderDetailData = JSON.parse(cartDataJSON);

      // Gán mảng cartData cho biến của bạn
      this.orderDetail = orderDetailData;
      // console.log(orderDetailData);

      // this.fetchOrderProductDetailData()
      // Bây giờ bạn có thể sử dụng biến orderDetail để truy cập và thao tác với giỏ hàng

    } else {
      console.log("không tìm thấy thông tin");

    }
  }

  public url = 'http://localhost:3000';
  fetchOrderProductDetailData() {
    this.http.get(this.url + `/ordersProductDetail/${this.orderProductDetail}`).subscribe((data: any) => {
      this.orderDetail = data;
      console.log(this.url + `/ordersProductDetail/${this.orderProductDetail}`);
    });
  }
}
