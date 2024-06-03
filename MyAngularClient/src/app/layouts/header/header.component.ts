import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeComponent } from 'src/app/home/home.component';
import { ProductComponent } from 'src/app/product/product.component';
import { LoginComponent } from 'src/app/login/login.component';
import { CartService } from 'src/app/cart.service';
import { CartComponent } from 'src/app/cart/cart.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public url = 'http://localhost:3000';
  showCategory: any;
  arrayCartHeader: any[] = [];
  numberOfItems: number = 0;
  total: number = 0;
  menu: any[] = [];
  loaiSanPhams: any[] = [];
  isLoginHeader: boolean = false;
  nameAcc: any = '';
  isLogIn: boolean = false;
  constructor(
    private http: HttpClient,
    private homeComponent: HomeComponent,
    private loginComponent: LoginComponent,
    // private cartService: CartService,
    private productComponent: ProductComponent,
    private cartComponent: CartComponent
  ) {}
  // this.appComponent.updateSharedValue('New Value from Component 1');
  ngOnInit() {
    this.fetchMenu();
    this.fetchLoaiSanPhams();
    this.cartMini();
    this.home();
    this.product();
    this.headerLogin();
  }
  home() {
    this.showCategory = this.homeComponent.showCategory;
    // console.log(this.showCategory);
  }
  product() {
    this.showCategory = this.productComponent.showCategory;
  }

  productList: any[] = [];
  localStorageCart: any[] = [];
  runWeb() {
    const storedUserJSON = localStorage.getItem('userInfo');

    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      this.isLogIn = storedUser.isLoggedIn;
      const productListString = localStorage.getItem('Cart');
      if (productListString) {
        this.localStorageCart = JSON.parse(productListString);
      }
    } else {
      // Khóa 'userInfo' không tồn tại trong localStorage
      // alert()
      return;
      // console.log('Không có dữ liệu trong localStorage');
    }
  }
  public cartMini() {
    const productListString = localStorage.getItem('Cart');

    if (productListString) {
      // Phân tích cú pháp chuỗi JSON thành một mảng JavaScript từ chuỗi lấy từ Local Storage
      let parsedProductList = JSON.parse(productListString);

      // Gán bản sao của mảng từ Local Storage cho biến productList
      this.productList = [...this.localStorageCart, ...parsedProductList];
    }

    // this.arrayCartHeader = this.homeComponent.cartItems;
    this.numberOfItems = this.productList.length;
    // console.log(this.arrayCartHeader);

    this.total = this.productList.reduce((total, item) => {
      return total + item.Gia * item.quantity;
    }, 0);
    // const cartData = {
    //   arrayCartHeader: this.productList,
    //   numberOfItems: this.numberOfItems,
    //   total: this.total,
    // };
  }
  resetHeaderCart() {
    this.arrayCartHeader = [];
    this.numberOfItems = 0;
    this.total = 0;
  }
  public deleteCart(id: any) {
    const cartItemsJson = localStorage.getItem('Cart');
    if (!cartItemsJson) {
      return; // Nếu không có mảng trong Local Storage, không có gì để xóa
    }

    // Chuyển đổi chuỗi JSON thành mảng JavaScript
    let cartItems: any[] = JSON.parse(cartItemsJson);

    // Tìm và xóa phần tử có productId = id
    cartItems = cartItems.filter((item) => item.productId !== id);

    // Lưu lại mảng mới vào Local Storage
    localStorage.setItem('Cart', JSON.stringify(cartItems));

    this.cartMini();

    this.cartComponent.callCartMiniFromHeader();
  }

  hearderCreateOrder() {
    this.homeComponent.createOrder();
  }

  headerLogout() {
    this.loginComponent.logout();
  }
  fetchMenu() {
    this.http.get(this.url + '/menu').subscribe((data: any) => {
      this.menu = data;
    });
  }
  fetchLoaiSanPhams() {
    this.http.get(this.url + '/admin/category').subscribe((data: any) => {
      this.loaiSanPhams = data;
    });
  }
  logout() {
    const storedUserJSON = localStorage.getItem('userInfo');
    if (storedUserJSON !== null) {
      const storedUser = JSON.parse(storedUserJSON);
      const isConfirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');
      if (isConfirmed) {
        storedUser.isLoggedIn = false;
        localStorage.setItem('userInfo', JSON.stringify(storedUser));
      }
    }
    this.headerLogin();
  }

  headerLogin() {
    const storedUserJSON = localStorage.getItem('userInfo');

    if (storedUserJSON !== null) {
      // Khóa 'userInfo' tồn tại trong localStorage
      // console.log('Dữ liệu tồn tại trong localStorage');
      const storedUser = JSON.parse(storedUserJSON);

      this.isLoginHeader = storedUser.isLoggedIn;
      this.nameAcc = storedUser.TaiKhoan;
      console.log(this.isLoginHeader);
    } else {
      // Khóa 'userInfo' không tồn tại trong localStorage
      console.log('Không có dữ liệu trong localStorage');
    }
  }
}
