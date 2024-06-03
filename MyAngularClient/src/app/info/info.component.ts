import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  user: any;
  users:any[]=[]
  constructor(
    private http: HttpClient
  ) {this.loadUserData();}

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
      console.log(this.user);
    }else {
      console.log("không tìm thấy thông tin");
      
    }
  }
  public url = 'http://localhost:3000';
  fetchUsersData(){
    this.http.get(this.url + '/getAllBestSeller').subscribe((data: any) => {
      this.users = data;
    });
  }
}
