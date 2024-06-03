import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../layouts/header/header.component';
import { HttpClient } from '@angular/common/http';
// import { CartService } from '../cart.service';
// import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  title = 'Giỏ hàng';
  showCategory: string = 'none';
  cartItems: any[] = [];
  quantity: any = 1;
  arrQuantity: any[] = [];
  total: any = 0;

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  constructor(
    private http: HttpClient // private headerComponent1: HeaderComponent,
  ) {
    // this.loginComponent.isLoggedIn = true;
  }

  ngOnInit() {
    this.callCart();
    // this.callQuantytiCart()
  }

  callCart() {
    this.callCartMiniFromHeader();
  }
  // callQuantytiCart(){

  // }
  public callCartMiniFromHeader() {
    const cartDataJSON = localStorage.getItem('Cart');

    // Kiểm tra nếu dữ liệu tồn tại
    if (cartDataJSON) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript (mảng trong trường hợp này)
      const cartData = JSON.parse(cartDataJSON);

      // Gán mảng cartData cho biến của bạn
      this.cartItems = cartData;

      // Bây giờ bạn có thể sử dụng biến cart để truy cập và thao tác với giỏ hàng
      console.log(this.cartItems);
      let totalCart = 0;
      for (let i = 0; i < this.cartItems.length; i++) {
        totalCart += this.cartItems[i].quantity * this.cartItems[i].Gia;
      }
      this.total = totalCart;
    } else {
      // Nếu không có dữ liệu trong localStorage, bạn có thể thực hiện một hành động khác tùy thuộc vào logic của ứng dụng của bạn
      console.log('Không có dữ liệu giỏ hàng trong localStorage');
    }

    // const cartItemsString = localStorage.getItem('Cart');
    // // const cartItemsString = window.localStorage.getItem('Cart');
    // console.log(this.cartItems);

    // if (cartItemsString !== null) {
    //   this.cartItems = JSON.parse(cartItemsString);

    //   // if (this.headerComponent) {
    //   //   this.headerComponent.cartMini();
    //   // } else {
    //   //   console.log('Header component is not available');
    //   // }
    // } else {
    //   console.log('No data found in local storage');
    // }
    // // this.headerComponent.cartMini();
  }
  deleteCartFull(id: any) {
    this.headerComponent.deleteCart(id);
  }

  plusQuantity(id: any, quantity: number) {
    // Tăng số lượng sản phẩm có id tương ứng
    const index = this.cartItems.findIndex((item) => item.productId === id);
    if (index !== -1) {
      this.cartItems[index].quantity += 1; // Tăng số lượng lên 1
    }

    // Cập nhật giỏ hàng trên localStorage
    this.updateLocalStorage();
    this.headerComponent.cartMini();
    this.callCartMiniFromHeader();
  }

  updateLocalStorage() {
    // Chuyển đổi mảng giỏ hàng thành chuỗi JSON
    const jsonString = JSON.stringify(this.cartItems);

    // Lưu mảng giỏ hàng mới vào localStorage
    localStorage.setItem('Cart', jsonString);
  }

  minusQuantity(id: any, quantity: number) {
    // Tìm index của sản phẩm trong mảng cartItems
    const index = this.cartItems.findIndex((item) => item.productId === id);

    // Nếu sản phẩm có tồn tại trong giỏ hàng
    if (index !== -1) {
      // Kiểm tra nếu số lượng sản phẩm là 1, nếu là 1 thì loại bỏ sản phẩm khỏi giỏ hàng
      if (this.cartItems[index].quantity === 1) {
        this.cartItems.splice(index, 1); // Xóa sản phẩm khỏi mảng
      } else {
        this.cartItems[index].quantity -= 1; // Giảm số lượng sản phẩm đi 1
      }
    }

    // Cập nhật giỏ hàng trên localStorage
    this.updateLocalStorage();
    // Cập nhật lại giao diện giỏ hàng mini
    this.headerComponent.cartMini();
    this.callCartMiniFromHeader();
  }
}
