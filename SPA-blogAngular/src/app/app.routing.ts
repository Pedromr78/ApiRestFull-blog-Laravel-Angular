import { ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import{ inject } from '@angular/core';

//Añadimos los compoonentes creados 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { ErrorComponent } from './components/error/error.component';


import { IdentityGuard } from './services/identity.guard';


//definir rutas
const appRoutes : Routes=[
    {path: '', component: HomeComponent},
    {path: 'inicio', component:HomeComponent},
    {path: 'user/login', component:LoginComponent},
    {path: 'user/logout/:sure', component:LoginComponent},
    {path: 'user/registro', component:RegisterComponent},
    {path: 'user/ajustes', component:UserEditComponent,  canActivate: [() => inject(IdentityGuard).canActivate()]},
    {path: 'categorias/crear-categoria', component:CategoryNewComponent, canActivate: [() => inject(IdentityGuard).canActivate()]},
    {path: 'post/crear-entrada', component:PostNewComponent,  canActivate: [() => inject(IdentityGuard).canActivate()]},
    {path: 'post/detail/:id', component:PostDetailComponent},
    {path: 'post/edit/:id', component:PostEditComponent,  canActivate: [() => inject(IdentityGuard).canActivate()]},  
    {path: 'category/detail/:id', component:CategoryDetailComponent}, 
    {path: 'user/profile/:id', component:ProfileComponent}, 
    {path: 'error', component:ErrorComponent},
    {path: '**', component:ErrorComponent},
];

export const appRoutingProviders: any[]= [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);