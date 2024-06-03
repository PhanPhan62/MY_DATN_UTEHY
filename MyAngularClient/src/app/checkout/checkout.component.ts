import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../layouts/header/header.component';
import { HttpClient } from '@angular/common/http';
import { CartComponent } from '../cart/cart.component';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  totalCheckout: number = 0;

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  constructor(private cartComponent: CartComponent, private http: HttpClient) {}

  ngOnInit(): void {
    this.callCartFromCart();
    this.getDatainLocalstorage();
    this.getInfo();
  }

  getDatainLocalstorage() {
    const storedUserJSON = localStorage.getItem('userInfo');

    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);
    }
  }
  callCartFromCart() {
    this.cartComponent.callCartMiniFromHeader();
    this.totalCheckout = this.cartComponent.total;

    // console.log(this.totalCheckout);
  }
  cart: any;
  clientInfo: any;

  customerName: any = 'Nhập Tên Bạn';
  customerAddress: any = 'Nhập Địa chỉ của bạn';
  customerEmail: any = 'Nhập Email của bạn';
  customerPhone: number = 0;
  getInfo() {
    const storedUserJSON = localStorage.getItem('userInfo');
    if (storedUserJSON) {
      this.clientInfo = JSON.parse(storedUserJSON);
      this.customerName = this.clientInfo.TenKhachHang
        ? this.clientInfo.TenKhachHang
        : this.customerName;
      this.customerAddress = this.clientInfo.customerAddress
        ? this.clientInfo.customerAddress
        : this.customerAddress;
      // this.customerEmail = this.clientInfo.customerEmail
      //   ? this.clientInfo.customerEmail
      //   : this.customerEmail;
      // this.customerPhone = this.clientInfo.customerPhone
      //   ? this.clientInfo.customerPhone
      //   : this.customerPhone;
    }
  }
  createOrder() {
    const storedUserJSON = localStorage.getItem('userInfo');
    const storedCartJSON = localStorage.getItem('Cart');

    if (storedUserJSON) {
      this.clientInfo = JSON.parse(storedUserJSON);
      this.customerName = this.clientInfo.TenKhachHang;
      this.customerAddress = this.clientInfo.customerAddress;
      this.customerEmail = this.clientInfo.customerEmail;
      this.customerPhone = this.clientInfo.customerPhone;
    }
    if (storedCartJSON) {
      this.cart = JSON.parse(storedCartJSON);
    }

    if (!this.cart || this.cart.length === 0) {
      alert('Giỏ hàng rỗng!');
      return;
    }

    // Tạo một mảng mới chỉ chứa các thuộc tính cần thiết từ giỏ hàng
    const orderDetails = this.cart.map((item: any) => ({
      productId: item.productId,
      Gia: item.Gia,
      quantity: item.quantity,
      // ThanhTien: item.Gia * item.quantity,
    }));

    // Tạo đối tượng dữ liệu đơn hàng
    const orderData = {
      MaKhachHang: this.clientInfo.id, // Thay thế bằng ID của khách hàng thực tế
      chiTietDonHang: orderDetails,
      customerName: this.customerName,
      customerAddress: this.customerAddress,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
    };
    // console.log(orderData);

    // Gửi đơn hàng đến server
    this.http.post('http://localhost:3000/orders', orderData).subscribe(
      (response: any) => {
        alert(response.message);
      },
      (error) => {
        console.error('Lỗi khi thêm đơn hàng:', error);
        // Xử lý lỗi
      }
    );
  }
}
