import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistService, Playlist, Song } from './playlist.service';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlists.html',
  styleUrls: ['./playlists.css']
})
export class Playlists implements OnInit {
  playlists: Playlist[] = [];
  filteredPlaylists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  isLoading = false;
  searchQuery = '';
  
  showCreateModal = false;
  showImportModal = false;
  showEditModal = false;
  
  newPlaylist = {
    name: '',
    description: '',
    coverImage: '',
    isPublic: true,
    userId: 'user1'
  };

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.isLoading = true;
    this.playlistService.getPlaylists().subscribe({
      next: (playlists: Playlist[]) => {
        this.playlists = playlists;
        this.filteredPlaylists = playlists;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des playlists', error);
        this.isLoading = false;
      }
    });
  }

  searchPlaylists(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredPlaylists = this.playlists;
    } else {
      this.filteredPlaylists = this.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  selectPlaylist(playlist: Playlist): void {
    this.selectedPlaylist = playlist;
  }

  createPlaylist(): void {
    if (!this.newPlaylist.name) {
      alert('Le nom de la playlist est obligatoire');
      return;
    }

    this.playlistService.createPlaylist({
      ...this.newPlaylist,
      songs: [],
      userId: this.newPlaylist.userId
    }).subscribe({
      next: (playlist: Playlist) => {
        console.log('Playlist créée avec succès', playlist);
        this.loadPlaylists();
        this.closeCreateModal();
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création de la playlist', error);
        alert('Erreur lors de la création de la playlist');
      }
    });
  }

  updatePlaylist(): void {
    if (!this.selectedPlaylist) return;

    this.playlistService.updatePlaylist(this.selectedPlaylist.id, {
      name: this.selectedPlaylist.name,
      description: this.selectedPlaylist.description,
      coverImage: this.selectedPlaylist.coverImage,
      isPublic: this.selectedPlaylist.isPublic
    }).subscribe({
      next: () => {
        console.log('Playlist mise à jour avec succès');
        this.loadPlaylists();
        this.closeEditModal();
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour', error);
        alert('Erreur lors de la mise à jour de la playlist');
      }
    });
  }

  deletePlaylist(playlistId: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
      this.playlistService.deletePlaylist(playlistId).subscribe({
        next: () => {
          console.log('Playlist supprimée avec succès');
          this.loadPlaylists();
          if (this.selectedPlaylist?.id === playlistId) {
            this.selectedPlaylist = null;
          }
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression de la playlist');
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      this.playlistService.importPlaylistFromFile(file).subscribe({
        next: (playlist: Playlist) => {
          console.log('Playlist importée avec succès', playlist);
          this.loadPlaylists();
          this.closeImportModal();
          alert('Playlist importée avec succès !');
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'importation', error);
          alert('Erreur lors de l\'importation de la playlist. Vérifiez le format du fichier.');
        }
      });
    }
  }

  exportPlaylist(playlistId: string, event: Event): void {
    event.stopPropagation();
    this.playlistService.exportPlaylist(playlistId);
  }

  addSongToPlaylist(song: Song): void {
    if (!this.selectedPlaylist) return;

    this.playlistService.addSongToPlaylist(this.selectedPlaylist.id, song).subscribe({
      next: () => {
        console.log('Chanson ajoutée avec succès');
        this.loadPlaylists();
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout de la chanson', error);
      }
    });
  }

  removeSongFromPlaylist(songId: string): void {
    if (!this.selectedPlaylist) return;

    this.playlistService.removeSongFromPlaylist(this.selectedPlaylist.id, songId).subscribe({
      next: () => {
        console.log('Chanson retirée avec succès');
        this.loadPlaylists();
      },
      error: (error: any) => {
        console.error('Erreur lors du retrait de la chanson', error);
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  openImportModal(): void {
    this.showImportModal = true;
  }

  closeImportModal(): void {
    this.showImportModal = false;
  }

  openEditModal(playlist: Playlist, event: Event): void {
    event.stopPropagation();
    this.selectedPlaylist = { ...playlist };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  resetForm(): void {
    this.newPlaylist = {
      name: '',
      description: '',
      coverImage: '',
      isPublic: true,
      userId: 'user1'
    };
  }

  getTotalDuration(playlist: Playlist): string {
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      return '0min';
    }
    
    let totalMinutes = 0;
    playlist.songs.forEach(song => {
      if (song && song.duration) {
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          const [min, sec] = parts.map(Number);
          if (!isNaN(min) && !isNaN(sec)) {
            totalMinutes += min + (sec / 60);
          }
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }
}

export default Playlists;