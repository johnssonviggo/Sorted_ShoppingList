import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { Login } from './login/login';
import { Register } from './register/register';
import { Show } from './features/show/show';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    {
        path: '',
        component: Show,
        canActivate: [AuthGuard]
    },

    { path: '**', redirectTo: '' }
];
