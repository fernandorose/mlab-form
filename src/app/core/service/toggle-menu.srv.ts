// src/app/core/services/menu-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();

  toggle() {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

  get currentStatus(): boolean {
    return this.isCollapsedSubject.value;
  }
}
