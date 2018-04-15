import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }  from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatCardModule} from '@angular/material';
import {enableProdMode} from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BooksComponent } from './components/books/books.component';
import { BasketComponent } from './components/basket/basket.component';
import { OrdersComponent } from './components/orders/orders.component';


import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

import { FlashMessagesModule } from 'angular2-flash-messages';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { CustomersComponent } from './components/customers/customers.component';
import { BookComponent } from './components/book/book.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

enableProdMode();

const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'books', component: BooksComponent, canActivate:[AuthGuard]},
  {path:'order', component: OrdersComponent, canActivate:[AuthGuard]},
  {path:'basket', component: BasketComponent, canActivate:[AuthGuard]},
  {path:'admin/login', component: AdminLoginComponent},
  {path:'admin/add-book', component: AddBookComponent, canActivate:[AuthGuard]}

  // {path:'company/profile', component: CompanyProfileComponent, canActivate:[AuthGuard]},
  // {path:'company/createJob', component: CreateJobComponent, canActivate:[AuthGuard]},
  // {path:'company/jobs', component: ViewCompanyJobsComponent, canActivate:[AuthGuard]},
  // {path:'company', component: CompanyHomeComponent},
  // {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},

]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BooksComponent,
    BasketComponent,
    OrdersComponent,
    AdminLoginComponent,
    AddBookComponent,
    EditBookComponent,
    CustomersComponent,
    BookComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
