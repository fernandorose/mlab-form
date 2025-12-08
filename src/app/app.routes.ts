import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./module/new/new.component').then((c) => c.New),
  },
  {
    path: 'config',
    loadComponent: () => import('./module/config/config').then((c) => c.Config),
  },
];
