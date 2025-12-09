import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./module/new/new.component').then((c) => c.New),
  },
];
