import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Playlist {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  features: Feature[] = [
    {
      icon: '🎵',
      title: 'Bibliothèque Illimitée',
      description: 'Accédez à des millions de morceaux de tous les genres musicaux, disponibles à tout moment.'
    },
    {
      icon: '🎧',
      title: 'Qualité Audio HD',
      description: 'Profitez d\'une qualité sonore exceptionnelle pour une expérience d\'écoute immersive.'
    },
    {
      icon: '📱',
      title: 'Écoute Hors Ligne',
      description: 'Téléchargez vos titres préférés et écoutez-les même sans connexion internet.'
    },
    {
      icon: '🎤',
      title: 'Découverte Artiste',
      description: 'Explorez de nouveaux talents et suivez vos artistes favoris en temps réel.'
    },
    {
      icon: '🔥',
      title: 'Recommandations IA',
      description: 'Notre algorithme intelligent vous suggère des morceaux adaptés à vos goûts.'
    },
    {
      icon: '👥',
      title: 'Playlists Partagées',
      description: 'Créez et partagez vos playlists avec vos amis et la communauté.'
    }
  ];

  playlists: Playlist[] = [
    {
      icon: '🔥',
      title: 'Hits du Moment',
      description: 'Les titres les plus écoutés cette semaine'
    },
    {
      icon: '🌙',
      title: 'Chill Vibes',
      description: 'Détendez-vous avec ces morceaux relaxants'
    },
    {
      icon: '💪',
      title: 'Workout Energy',
      description: 'Motivez-vous avec ces beats énergiques'
    },
    {
      icon: '🎸',
      title: 'Rock Classics',
      description: 'Les plus grands tubes rock de tous les temps'
    }
  ];
}
