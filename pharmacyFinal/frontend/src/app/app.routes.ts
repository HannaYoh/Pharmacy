import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { Admin } from './components/admin/admin';
import { PharmacyOwner } from './components/pharmacy-owner/pharmacy-owner';
import { Customer } from './components/customer/customer';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: Admin },
  { path: 'pharmacy-owner', component: PharmacyOwner },
  { path: 'customer', component: Customer },
];
