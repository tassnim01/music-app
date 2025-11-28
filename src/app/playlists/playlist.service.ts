import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  genre?: string;
  coverUrl: string;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  songs: Song[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = 'http://localhost:3000'; // URL de json-server
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  public playlists$ = this.playlistsSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.loadPlaylists();
  }

  // Charger toutes les playlists
  loadPlaylists(): void {
    this.http.get<Playlist[]>(`${this.apiUrl}/playlists`)
      .subscribe(
        playlists => this.playlistsSubject.next(playlists),
        error => console.error('Erreur lors du chargement des playlists', error)
      );
  }

  // Obtenir toutes les playlists
  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists`);
  }

  // Obtenir une playlist par ID
  getPlaylistById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/playlists/${id}`);
  }

  // Créer une nouvelle playlist
  createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Observable<Playlist> {
    const newPlaylist = {
      ...playlist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Playlist>(`${this.apiUrl}/playlists`, newPlaylist, this.httpOptions)
      .pipe(
        tap(() => this.loadPlaylists())
      );
  }

  // Mettre à jour une playlist
  updatePlaylist(id: string, playlist: Partial<Playlist>): Observable<Playlist> {
    const updatedPlaylist = {
      ...playlist,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Playlist>(`${this.apiUrl}/playlists/${id}`, updatedPlaylist, this.httpOptions)
      .pipe(
        tap(() => this.loadPlaylists())
      );
  }

  // Supprimer une playlist
  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/playlists/${id}`)
      .pipe(
        tap(() => this.loadPlaylists())
      );
  }

  // Ajouter une chanson à une playlist
  addSongToPlaylist(playlistId: string, song: Song): Observable<Playlist> {
    return this.getPlaylistById(playlistId).pipe(
      tap(playlist => {
        const updatedSongs = [...playlist.songs, song];
        this.updatePlaylist(playlistId, { songs: updatedSongs }).subscribe();
      })
    );
  }

  // Retirer une chanson d'une playlist
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<Playlist> {
    return this.getPlaylistById(playlistId).pipe(
      tap(playlist => {
        const updatedSongs = playlist.songs.filter(s => s.id !== songId);
        this.updatePlaylist(playlistId, { songs: updatedSongs }).subscribe();
      })
    );
  }

  // Importer une playlist depuis un fichier JSON
  importPlaylistFromFile(file: File): Observable<Playlist> {
    return new Observable(observer => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const playlistData = JSON.parse(e.target.result);
          
          // Créer la playlist importée
          this.createPlaylist({
            name: playlistData.name || 'Playlist Importée',
            description: playlistData.description || '',
            coverImage: playlistData.coverImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
            songs: playlistData.songs || [],
            isPublic: playlistData.isPublic ?? false,
            userId: playlistData.userId || 'user1'
          }).subscribe(
            playlist => {
              observer.next(playlist);
              observer.complete();
            },
            error => observer.error(error)
          );
        } catch (error) {
          observer.error('Fichier JSON invalide');
        }
      };

      reader.onerror = () => observer.error('Erreur lors de la lecture du fichier');
      reader.readAsText(file);
    });
  }

  // Exporter une playlist vers un fichier JSON
  exportPlaylist(playlistId: string): void {
    this.getPlaylistById(playlistId).subscribe(playlist => {
      const dataStr = JSON.stringify(playlist, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${playlist.name.replace(/\s+/g, '_')}.json`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    });
  }

  // Rechercher des playlists
  searchPlaylists(query: string): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists?q=${query}`);
  }

  // Obtenir les playlists d'un utilisateur
  getUserPlaylists(userId: string): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists?userId=${userId}`);
  }
}