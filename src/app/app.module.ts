import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* misc */
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

/* components */
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GmapsComponent } from './components/gmaps/gmaps.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { TestingComponent } from './components/testing/testing.component';
import { UserListComponent } from './components/user-list/user-list.component';

/* guards */
import { IsAdminGuard } from './guards/is-admin.guard';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

/* PrimeNG */
import { StyleClassModule } from 'primeng/styleclass';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { GMapModule } from 'primeng/gmap';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  { path: '', redirectTo: 'order-list', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'order-list', component: OrderListComponent, canActivate: [IsLoggedInGuard] },
  { path: 'testing', component: TestingComponent, canActivate: [IsAdminGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [IsAdminGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GmapsComponent,
    OrderListComponent,
    TestingComponent,
    UserListComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /* PrimeNG */
    StyleClassModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    TabMenuModule,
    TableModule,
    GMapModule,
    ToastModule,
    DialogModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputNumberModule,
    RadioButtonModule,
    FileUploadModule,
    RatingModule,
    CheckboxModule,
    CardModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
