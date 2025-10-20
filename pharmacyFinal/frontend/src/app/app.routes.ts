import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { Admin } from './components/admin/admin';
import { PharmacyOwner } from './components/pharmacy-owner/pharmacy-owner';
import { Customer } from './components/customer/customer';
import { PharmacyRegistrationComponent } from './components/pharmacy-registration/pharmacy-registration';
import { InventoryComponent } from './components/inventory/inventory';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  /*  { path: 'admin', component: Admin },
  { path: 'pharmacy-owner', component: PharmacyOwner },
  { path: 'customer', component: Customer },
  { path: 'pharmacy-owner/register-pharmacy', component: PharmacyRegistrationComponent },
  { path: 'pharmacy-owner/inventory', component: InventoryComponent },
 */
  { path: 'admin', component: Admin, canActivate: [AuthGuard] },
  { path: 'pharmacy-owner', component: PharmacyOwner, canActivate: [AuthGuard] },
  { path: 'customer', component: Customer, canActivate: [AuthGuard] },
  {
    path: 'pharmacy-owner/register-pharmacy',
    component: PharmacyRegistrationComponent,
    // ,canActivate: [AuthGuard],
  },
  { path: 'pharmacy-owner/inventory', component: InventoryComponent }, //, canActivate: [AuthGuard] },
];
