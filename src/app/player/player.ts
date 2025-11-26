import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  
  audio = new Audio();
  isPlaying = false;

  playSong(src: string) {
    if (this.audio.src !== src) {
      this.audio.src = src;
    }

    this.audio.play();
    this.isPlaying = true;
  }

  pauseSong() {
    this.audio.pause();
    this.isPlaying = false;
  }

}
