import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { slideIn } from '../layouts/app.animations';
import { HeaderComponent } from '../layouts/header/header.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideIn],
})
export class HomeComponent implements OnInit {
  newProduct: any[] = [];
  newProduct3: any[] = [];
  getAllBestSeller: any[] = [];
  getAllBestSeller3: any[] = [];
  getAllSell: any[] = [];
  getAllSell3: any[] = [];
  getByIdProduct: any[] = [];
  listImg: any[] = [];
  cart: any[] = [];
  public sharedValue: any = ''; // Modify the type if needed
  public cartItems: any[] = [];
  public arrayCart: any[] = [];
  menu: any[] = [];
  loaiSanPhams: any[] = [];
  showAlert: boolean = false;
  alertMessage: any;
  arrayCartHeader: any[] = [];
  isLogIn: boolean = false;
  public url = 'http://localhost:3000';
  showCategory: string = 'block';
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  constructor(
    private http: HttpClient,
    private cartService: CartService,
    // private loginComponent: LoginComponent,
    private router: Router
  ) {}
  ngOnInit() {
    this.fetchNewProducts();
    this.fetchNewProducts3();
    this.fetchgetAllBestSeller();
    this.fetchgetAllBestSeller3();
    this.fetchgetAllSell();
    this.fetchgetAllSell3();
    this.fetchMenu();
    this.fetchLoaiSanPhams();
    this.cartService.cart$.subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
    this.callCart();
    // this.getCartItem()
  }
  // getCartItem(){

  // }
  fetchNewProducts3() {
    this.http.get(this.url + '/newProducts3').subscribe((data: any) => {
      this.newProduct3 = data;
    });
  }
  fetchNewProducts() {
    this.http.get(this.url + '/newProducts').subscribe((data: any) => {
      this.newProduct = data;
    });
  }
  fetchgetAllBestSeller() {
    this.http.get(this.url + '/getAllBestSeller').subscribe((data: any) => {
      this.getAllBestSeller = data;
    });
  }
  fetchgetAllBestSeller3() {
    this.http.get(this.url + '/getAllBestSeller3').subscribe((data: any) => {
      this.getAllBestSeller3 = data;
    });
  }
  fetchgetAllSell() {
    this.http.get(this.url + '/getAllSell').subscribe((data: any) => {
      this.getAllSell = data;
    });
  }
  fetchgetAllSell3() {
    this.http.get(this.url + '/getAllSell3').subscribe((data: any) => {
      this.getAllSell3 = data;
    });
  }
  detailProduct(id: number) {
    this.http.get(this.url + '/getByIdProduct/' + id).subscribe((data: any) => {
      this.getByIdProduct = data;
    });

    this.http.get(`${this.url}/listImg/${id}`).subscribe((data: any) => {
      this.listImg = data;
    });
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
  callCart() {
    // console.log(this.cart);
    const cartDataJSON = localStorage.getItem('Cart');

    // Kiểm tra nếu dữ liệu tồn tại
    if (cartDataJSON) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript (mảng trong trường hợp này)
      const cartData = JSON.parse(cartDataJSON);

      // Gán mảng cartData cho biến của bạn
      this.cart = cartData;

      // Bây giờ bạn có thể sử dụng biến cart để truy cập và thao tác với giỏ hàng
      console.log(this.cart);
    } else {
      // Nếu không có dữ liệu trong localStorage, bạn có thể thực hiện một hành động khác tùy thuộc vào logic của ứng dụng của bạn
      console.log('Không có dữ liệu giỏ hàng trong localStorage');
    }
  }
  addToCart(
    productId: number,
    TenSanPham: any,
    Anh: any,
    Gia: any,
    quantity: number
  ) {
    const storedUserJSON = localStorage.getItem('userInfo');

    if (storedUserJSON !== null) {
      // Khóa 'userInfo' tồn tại trong localStorage
      // console.log('Dữ liệu tồn tại trong localStorage');
      const storedUser = JSON.parse(storedUserJSON);

      this.isLogIn = storedUser.isLoggedIn;
      // this.nameAcc = storedUser.TaiKhoan;
      // console.log(this.isLogIn);
    } else {
      // Khóa 'userInfo' không tồn tại trong localStorage
      console.log('Không có dữ liệu trong localStorage');
    }
    if (this.isLogIn) {
      const existingItem = this.cart.find(
        (cartItem) =>
          cartItem.productId === productId &&
          cartItem.TenSanPham === TenSanPham &&
          cartItem.Anh === Anh &&
          cartItem.Gia === Gia
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cart.push({ productId, TenSanPham, Anh, Gia, quantity });
      }

      // const storage = window.localStorage;
      this.cartService.updateCart([...this.cart]);

      const storage = window.localStorage;
      const jsonString = JSON.stringify(this.cart);
      storage.setItem('Cart', jsonString);

      console.log(this.cart);

      alert(`Sản phẩm đã được thêm vào giỏ`);
      this.callCartMiniFromHeader();
    } else {
      alert("Bạn cần đăng nhập để thực hiện thêm giỏ hàng")
      this.router.navigate(['/login']);
    }
  }
  createOrder() {
    // Kiểm tra xem giỏ hàng có dữ liệu hay không
    this.cart = this.headerComponent.productList;
    // console.log(a);
    if (!this.cart || this.cart.length === 0) {
      alert('Giỏ hàng rỗng!');
      return;
    }

    // Tạo một mảng mới chỉ chứa các thuộc tính cần thiết từ giỏ hàng
    const orderDetails = this.cart.map((item) => ({
      productId: item.productId,
      Gia: item.Gia,
      quantity: item.quantity,
      // ThanhTien: item.Gia * item.quantity,
    }));

    // Tạo đối tượng dữ liệu đơn hàng
    const orderData = {
      MaKhachHang: 1, // Thay thế bằng ID của khách hàng thực tế
      chiTietDonHang: orderDetails,
    };

    // Gửi đơn hàng đến server
    this.http.post('http://localhost:3000/orders', orderData).subscribe(
      (response: any) => {
        alert('Thanh toán thành công');
        console.log('Đã thêm đơn hàng:', response);
        // orderData=[];
        this.headerComponent.resetHeaderCart();
        // Xử lý thành công
      },
      (error) => {
        console.error('Lỗi khi thêm đơn hàng:', error);
        // Xử lý lỗi
      }
    );
  }

  callCartMiniFromHeader() {
    this.headerComponent.cartMini();
  }
  redirectToProductDetail(productId: string): void {
    this.router.navigate(['/productDetail', productId]);
  }
}
