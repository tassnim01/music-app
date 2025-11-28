import { Component } from '@angular/core';

@Component({
  selector: 'app-artistes',
  imports: [],
  standalone:true,
  templateUrl: './artistes.html',
  styleUrl: './artistes.css',
})
export class Artistes {
  artistes = [
    { id: 1, name: 'The Weeknd', genre: 'Pop/R&B', followers: '15M', icon: '🎤' },
    { id: 2, name: 'Daft Punk', genre: 'Electronic', followers: '12M', icon: '🤖' },
    { id: 3, name: 'Billie Eilish', genre: 'Alternative', followers: '18M', icon: '🎵' },
    { id: 4, name: 'Ed Sheeran', genre: 'Pop', followers: '20M', icon: '🎸' },
    { id: 5, name: 'Ariana Grande', genre: 'Pop', followers: '22M', icon: '⭐' },
    { id: 6, name: 'Drake', genre: 'Hip-Hop', followers: '25M', icon: '🎧' }
  ];

}
