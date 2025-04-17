import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/file-explorer/file-explorer.component').then(m => m.FileExplorerComponent) 
  },
  { 
    path: 'folder/:id', 
    loadComponent: () => import('./pages/file-explorer/file-explorer.component').then(m => m.FileExplorerComponent) 
  },
  { 
    path: 'search', 
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) 
  },
  { 
    path: 'recent', 
    loadComponent: () => import('./pages/recent/recent.component').then(m => m.RecentComponent) 
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent) 
  },
  { 
    path: 'trash', 
    loadComponent: () => import('./pages/trash/trash.component').then(m => m.TrashComponent) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];