import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';

export const routes: Routes = [
    {path:'',loadComponent: () => import('../app/layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),canActivate:[loggedGuard],children:[

        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', loadComponent: () => import('../app/components/login/login.component').then(m => m.LoginComponent) },
        { path: 'register', loadComponent: () => import('../app/components/register/register.component').then(m => m.RegisterComponent) },
    ]},

    {path: '',loadComponent: () => import('../app/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),canActivate:[authGuard],children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component:HomeComponent},
        { path: 'userDetails', loadComponent: () => import('../app/components/user-details/user-details.component').then(m => m.UserDetailsComponent) },
        { path: 'changePassword', loadComponent: () => import('../app/components/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
        { path: 'myPosts', loadComponent: () => import('../app/components/my-posts/my-posts.component').then(m => m.MyPostsComponent) },
        { path: '**', loadComponent: () => import('../app/components/notfound/notfound.component').then(m => m.NotfoundComponent) },
    
    ]}
    
];
