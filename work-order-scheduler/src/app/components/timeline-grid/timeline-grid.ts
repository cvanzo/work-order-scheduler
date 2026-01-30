/* Below is a list of things that need to completed or fixed in the code.
  @upgrade - Create/Edit slide-out panel with form validation
  @upgrade - Overlap detection with error feedback when creating/editing orders
  @upgrade - Complete three-dot actions menu with Edit/Delete options
  @upgrade - Implement icons used in Sketch designs
  @upgrade - Improve date/time handling (timezones, partial days, etc.)
*/


import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import {
  format,
  eachMonthOfInterval,
  differenceInDays,
  endOfMonth,
  startOfMonth,
  parseISO,
  eachWeekOfInterval,
  eachDayOfInterval,
} from 'date-fns';
import { DataService } from '../../services/data.service';
import { WorkCenterDocument, WorkOrderDocument } from '../../models/work-order.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

export type Timescale = 'day' | 'week' | 'month';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule,
    NgSelectModule,
    FormsModule],
  templateUrl: './timeline-grid.html',
  styleUrls: ['./timeline-grid.scss']
})

export class TimelineGrid implements OnInit, AfterViewInit {
  @ViewChild('timelineViewport') timelineViewport!: ElementRef;

  private dataService = inject(DataService);
  workCenters$: Observable<WorkCenterDocument[]> = this.dataService.getWorkCenters();
  workOrders$: Observable<WorkOrderDocument[]> = this.dataService.getWorkOrders();

  // Header and grid units
  increments: { label: string, width: number, isCurrent: boolean }[] = [];

  // Configuration Constants
  readonly SCALES = {
    day: 90,   // High detail (1 day = 100px)
    week: 16,   // Balanced (1 day = 25px)
    month: 3    // Macro (1 day = 3px)
  };

  readonly TIMELINE_START = new Date(2025, 0, 1);
  readonly TIMELINE_END = new Date(2027, 11, 31);

  pxPerDay = this.SCALES.month;
  currentTimescale: Timescale = 'month';
  todayOffset = 0;

  timescaleOptions = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' }
  ];

  ngOnInit(): void {
    this.currentTimescale = 'month';
    this.refreshTimeline();
  }

  ngAfterViewInit(): void {
    this.scrollToToday();
  }

  /**
   * Refreshes all coordinate calculations
   */
  private refreshTimeline() {
    this.generateTimelineHeader();
    this.calculateTodayIndicator();
  }

  /**
   * Handles the ng-select change event
   */
  onTimescaleChange(id: Timescale) {
    console.log('Timescale selection changed:', id);
    // id will be 'day', 'week', or 'month' (not the full object)
    if (!id) return;
    this.setTimescale(id);
  }

  /**
   * Sets the timescale and triggers recalculation/centering
   */
  setTimescale(scale: Timescale) {
    console.log('Timescale changed to:', scale);
    this.currentTimescale = scale;
    this.pxPerDay = this.SCALES[scale];

    this.refreshTimeline();

    // Center on today after the DOM has updated with new widths
    setTimeout(() => this.scrollToToday(), 50);
  }

  /**
   * Generates the labels and widths for the timeline header
   */
  generateTimelineHeader() {
    const start = this.TIMELINE_START;
    const end = this.TIMELINE_END;
    const today = new Date();

    if (this.currentTimescale === 'month') {
      const months = eachMonthOfInterval({ start, end });
      const currentMonthLabel = format(today, 'MMM yyyy');

      this.increments = months.map(m => {
        const label = format(m, 'MMM yyyy');
        const daysInMonth = differenceInDays(endOfMonth(m), startOfMonth(m)) + 1;
        return {
          label,
          width: daysInMonth * this.pxPerDay,
          isCurrent: label === currentMonthLabel // Boolean flag
        };
      });
    } else if (this.currentTimescale === 'week') {
      const weeks = eachWeekOfInterval({ start, end });
      const currentWeekLabel = `Week ${format(today, 'w')} (${format(today, 'MMM')})`;

      this.increments = weeks.map(w => {
        const label = `Week ${format(w, 'w')} (${format(w, 'MMM')})`;
        return {
          label,
          width: 7 * this.pxPerDay,
          isCurrent: label === currentWeekLabel
        };
      });
    } else {
      const days = eachDayOfInterval({ start, end });
      const currentDayLabel = format(today, 'EEE, dd MMM');

      this.increments = days.map(d => {
        const label = format(d, 'EEE, dd MMM');
        return {
          label,
          width: 1 * this.pxPerDay,
          isCurrent: label === currentDayLabel
        };
      });
    }
  }

  /**
   * Calculates the pixel position of the vertical "Today" line
   */
  calculateTodayIndicator() {
    const daysFromStart = differenceInDays(new Date(), this.TIMELINE_START);
    this.todayOffset = daysFromStart * this.pxPerDay;
  }

  /**
   * Scrolls the viewport so that the Today line is centered
   */
  scrollToToday() {
    if (this.timelineViewport) {
      const container = this.timelineViewport.nativeElement;
      const viewportWidth = container.clientWidth;
      const scrollPosition = this.todayOffset - (viewportWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }



  // --- Helper Methods for Template Positioning ---

  calculatePosition(startDate: string): number {
    const daysFromStart = differenceInDays(parseISO(startDate), this.TIMELINE_START);
    return daysFromStart * this.pxPerDay;
  }

  calculateWidth(startDate: string, endDate: string): number {
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    return days * this.pxPerDay;
  }

  trackByDocId(index: number, item: WorkOrderDocument) {
    return item.docId;

  }
}
