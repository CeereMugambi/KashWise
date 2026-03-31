import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubnavbarComponent } from './subnavbar/subnavbar.component';
import { HomeNavbarComponent } from './home-navbar/home-navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
   
        {path: 'subnavbar', component: SubnavbarComponent},
        {path:'home-navbar',component:HomeNavbarComponent},
       
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentsRoutingModule { }