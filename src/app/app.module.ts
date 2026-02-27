import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './helpers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CommonModule } from '@angular/common';
import { AccountModule } from './account/account.module';
import { ComponentsModule } from './components/components.module';
import { WelcomeRoutingModule } from './welcome/welcome-routing.component';
import { HomeModule } from './home/home.module';
import { AccountService } from './services';
import { fakeBackendProvider } from './helpers';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { profileRoutingModule } from './profile/profile-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { CatalogueComponent } from './catalogue/catalogue/catalogue.component';
import { CatalogueModule } from './catalogue/catalogue.module';
import { CatalogueRoutingModule } from './catalogue/catalogue-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    WelcomeRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AccountModule,
    ComponentsModule,
    HomeModule,
    AdminModule,
    ProfileModule,
    profileRoutingModule,
    MatTooltipModule,
    MatTableModule,
    CatalogueModule,
    CatalogueRoutingModule
  
  ],
  
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

     // provider to create fake backend
     fakeBackendProvider,
    

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
