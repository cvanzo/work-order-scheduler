import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimelineGrid } from './components/timeline-grid/timeline-grid';

@Component({
  selector: 'app-root',
  imports: [TimelineGrid, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('work-order-scheduler');
}
