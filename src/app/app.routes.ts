import { Routes } from '@angular/router';

export const routes: Routes = [
     { 
    path: '', 
    redirectTo: '/accueil', 
    pathMatch: 'full' 
  },
  { 
    path: 'accueil', 
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  { 
    path: 'playlists', 
    loadComponent: () => import('./playlists/playlists').then(m => m.Playlists)
  },
  { 
    path: 'artistes', 
    loadComponent: () => import('./artistes/artistes').then(m => m.Artistes)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./contact/contact').then(m => m.Contact)
  },
  { 
    path: '**', 
    redirectTo: '/accueil' 
  }
];
