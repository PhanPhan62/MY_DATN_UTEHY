import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public url = 'http://localhost:3000';
  textRegister: any = 'Đăng ký';
  TaiKhoan: any = '';
  MatKhau: any = '';
  existsPassword: any = '';
  // registerList: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.registerList.TaiKhoan = "";
    // this.submitRegister();
  }
  submitRegister(): void {
    const data = {
      TaiKhoan: this.TaiKhoan,
      MatKhau: this.MatKhau,
      existsPassword: this.existsPassword,
    };
    // console.log(data);

    if (this.MatKhau != this.existsPassword) {
      alert('Mật khẩu không khớp');
    } else {
      this.http
        .post(this.url + '/register', data)
        .subscribe((response: any) => {
          alert(response.message);
        });
    }
  }
}
