import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RegisterComponent } from './register/register.component';
import { InfoComponent } from './info/info.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';


const routes: Routes = [
  {
    title: 'Trang chủ',
    path: '',
    component: HomeComponent,
  },
  {
    title: 'Chi tiết sản phẩm',
    path: 'productDetail/:id',
    component: ProductDetailComponent,
  },
  {
    title: 'Sản phẩm',
    path: 'product',
    component: ProductComponent,
  },
  {
    title: 'Giỏ hàng',
    path: 'cart',
    component: CartComponent,
  },
  {
    title: 'Thanh Toán',
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    title: 'Đăng nhâp',
    path: 'login',
    component: LoginComponent,
  },
  {
    title: 'Tài khoản',
    path: 'info',
    component: InfoComponent,
  },
  {
    title: 'Chi tiết đơn hàng',
    path: 'info/orderDetail/:id',
    component: OrderDetailComponent,
  },
  {
    title: 'Đăng ký',
    path: 'register',
    component: RegisterComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgxPaginationModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
