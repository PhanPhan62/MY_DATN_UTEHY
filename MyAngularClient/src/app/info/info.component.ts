import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  user: any;
  users: any[] = [];
  viewDetail: any[] = [];
  MaKhachHang: any;
  constructor(
    private http: HttpClient, private router: Router
  ) { this.loadUserData(); this.fetchUsersData() }

  loadUserData() {
    // console.log(this.cart);
    const cartDataJSON = localStorage.getItem('userInfo');

    // Kiểm tra nếu dữ liệu tồn tại
    if (cartDataJSON) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript (mảng trong trường hợp này)
      const userData = JSON.parse(cartDataJSON);

      // Gán mảng cartData cho biến của bạn
      this.user = userData;

      // Bây giờ bạn có thể sử dụng biến user để truy cập và thao tác với giỏ hàng
      this.MaKhachHang = this.user.MaKhachHang;
      // console.log(this.MaKhachHang);
    } else {
      console.log("không tìm thấy thông tin");

    }
  }
  public url = 'http://localhost:3000';
  fetchUsersData() {
    this.http.get(this.url + `/ordersCustomer/${this.MaKhachHang}`).subscribe((data: any) => {
      this.users = data;
      console.log(this.MaKhachHang);

    });
  }
  viewDeTail(id: any) {
    // Kiểm tra xem có dữ liệu viewDetail trong localStorage không
    const existingViewDetail = localStorage.getItem('viewDetail');
    if (existingViewDetail) {
      // Nếu có, xoá dữ liệu cũ
      localStorage.removeItem('viewDetail');
    }

    // Lấy dữ liệu mới từ API
    this.http.get(this.url + `/orderDetail/${id}`).subscribe((data: any) => {
      this.viewDetail = data;
      // Lưu dữ liệu mới vào localStorage
      localStorage.setItem('viewDetail', JSON.stringify(this.viewDetail));
      // Chuyển hướng đến trang khác
      this.router.navigate([`/info/orderDetail/${id}`]);
    });
  }

}
