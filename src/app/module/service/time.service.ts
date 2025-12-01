import { Injectable, signal } from '@angular/core';
import { getRoundedHour, getTimeString } from '../../core/shared/helper/time-date.hlp';

@Injectable({ providedIn: 'root' })
export class TimeService {
  roundedTime = signal(getRoundedHour());

  constructor() {
    this.scheduleNextUpdate();
  }

  getCurrentTime(): string {
    return getTimeString();
  }

  private scheduleNextUpdate() {
    const now = new Date();
    const mins = now.getMinutes();
    const secs = now.getSeconds();

    const minutesToNext = mins < 30 ? 30 - mins : 60 - mins;
    const msToNext = minutesToNext * 60_000 - secs * 1000;

    const delay = Math.max(msToNext, 100);

    setTimeout(() => {
      this.roundedTime.set(getRoundedHour());
      this.scheduleNextUpdate();
    }, delay);
  }
}
