import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'destination-list',
    loadComponent: () => import('./components/destination-list/destination-list.component').then((m) => m.DestinationListComponent),
  },
  {
    path: 'search-bar',
    loadComponent: () => import('./components/search-bar/search-bar.component').then((m) => m.SearchBarComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
