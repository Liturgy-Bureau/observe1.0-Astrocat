// ANGULAR CORE ETC
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// APPLICATION
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// COMPONENTS
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewsComponent } from './components/news/news.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { LivechatComponent } from './components/livechat/livechat.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PandoraComponent } from './components/pandora/pandora.component';
import { TermsComponent } from './components/terms/terms.component';
import { ForgotpwdComponent } from './components/forgotpwd/forgotpwd.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { Error404Component } from './components/error404/error404.component';
import { GeneralerrorComponent } from './components/generalerror/generalerror.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ManagerComponent } from './components/manager/manager.component';
import { ModalComponent } from './components/modal/modal.component';


// SERVICES
import { ViewshelperService } from './services/viewshelper.service';
import { ValidatorService } from './services/validator.service';
import { ToastrModule } from 'ngx-toastr';
import { AuthService} from './services/auth.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt'; // common
import { AuthGuard } from './guards/auth.guard';
import { ReentryGuard } from './guards/reentry.guard';
import { ManageGuard } from './guards/manage.guard';
import { SocketioService } from './services/socketio.service';
import { ModalService } from './services/modal.service';
import { LoaderService } from './services/loader.service';

// INTERCEPTORS
import { LoaderInterceptor } from './interceptors/loader.interceptor';

// FOR INTL PHONE INPUT
import {Ng2TelInputModule} from 'ng2-tel-input';

// THE GAUGES MODULE
import { NgxGaugeModule } from 'ngx-gauge';

// THE CHARTS MODULE
import { NgxChartsModule } from '@swimlane/ngx-charts';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'register', component: RegisterComponent, canActivate: [ReentryGuard]},
  { path: 'login', component: LoginComponent, canActivate: [ReentryGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'news', component: NewsComponent},
  { path: 'documentation', component: DocumentationComponent},
  { path: 'livechat', component: LivechatComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'pandora', component: PandoraComponent, canActivate: [AuthGuard]},
  { path: 'terms', component: TermsComponent},
  { path: 'manager', component: ManagerComponent, canActivate: [ManageGuard]},
  { path: 'forgot', component: ForgotpwdComponent},
  { path: 'reset/:usr', component: ResetpasswordComponent},
  { path: 'error', component: GeneralerrorComponent},
  { path: 'error404', component: Error404Component},
  { path: '**', redirectTo: 'error404'},

];

/* -- this f%^^ing JWT ... -- */
export function getJwtToken(): any {
  return localStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    NewsComponent,
    DocumentationComponent,
    LivechatComponent,
    SettingsComponent,
    PandoraComponent,
    TermsComponent,
    ForgotpwdComponent,
    ResetpasswordComponent,
    Error404Component,
    GeneralerrorComponent,
    LoaderComponent,
    ManagerComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
       tokenGetter: getJwtToken
      }
    }),
    Ng2TelInputModule,
    NgxGaugeModule,
    NgxChartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    ViewshelperService,
    AuthService,
    ValidatorService,
    AuthGuard,
    ReentryGuard,
    ManageGuard,
    SocketioService,
    ModalService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
