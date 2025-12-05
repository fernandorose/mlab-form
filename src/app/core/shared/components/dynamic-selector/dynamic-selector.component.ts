import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { debounceTime, delay, distinctUntilChanged, Observable, Subject } from 'rxjs';

import { NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CapitalizeTransformPipe } from '@core/shared/pipes';
import { ColorEnum } from '@modMlab/coverage/enums';

@Component({
  selector: 'app-dynamic-selector',
  standalone: true,
  imports: [FeatherModule, FormsModule, ReactiveFormsModule, CapitalizeTransformPipe, NgStyle],
  templateUrl: './dynamic-selector.component.html',
  styleUrl: './dynamic-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSelector<T extends object> implements OnInit {
  loadData = input.required<(page: number, filter: string) => Observable<T[]>>();
  displayField = input.required<keyof T>();
  multiple = input(false);
  idField = input.required<keyof T>();
  searchable = input(false);
  resetTrigger = input<any>(undefined, { alias: 'resetTrigger' });
  emptyChange = output<boolean>();
  selected = output<T>();
  selectedMultiple = output<T[]>();
  cleared = output<void>();

  private lastOpen = false;
  private filterSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  public selectedItem = signal<T | null>(null);
  public selectedItems = signal<T[]>([]);
  public items = signal<T[]>([]);
  public page = signal(1);
  public hasMore = signal(true);
  public loading = signal(false);
  public isOpen = signal(false);
  public filterTextInternal = '';
  public filterText = signal('');
  public colors = ColorEnum;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open && !this.lastOpen) {
        this.reset(this.filterText());
        this.loadMore();
      }
      this.lastOpen = open;
    });

    effect(() => {
      const triggerValue = this.resetTrigger();
      if (triggerValue !== undefined) {
        this.fullReset();
      }
    });
  }

  ngOnInit(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((filter) => {
        this.filterText.set(filter);
        this.reset(filter);
        this.loadMore();
      });
  }

  isLong(item: T): boolean {
    const value = item[this.displayField()];
    const text = Array.isArray(value) ? (value[0] ?? '') : String(value ?? '');
    return text.length > 30;
  }

  clearSelection() {
    this.selectedItem.set(null);
    this.selectedItems.set([]);
    this.items.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.filterText.set('');
    this.filterTextInternal = '';
    this.emptyChange.emit(true);
    this.isOpen.set(false);
  }

  onClear() {
    this.selectedItems.set([]);
    this.selectedItem.set(null);
    this.filterText.set('');
    this.items.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.cleared.emit();
    this.isOpen.set(false);
  }

  fullReset() {
    this.reset('');
    this.selectedItem.set(null);
    this.selectedItems.set([]);
  }

  onFilterInput(filter: string) {
    this.filterSubject.next(filter);
  }

  reset(currentFilter: string) {
    this.items.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.loading.set(false);
    this.filterText.set(currentFilter);
  }

  loadMore() {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);
    const filter = this.filterText();

    this.loadData()(this.page(), filter)
      .pipe(delay(400))
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            this.hasMore.set(false);
          } else {
            this.items.update((prev) => [...prev, ...data]);
            this.page.update((p) => p + 1);
          }
        },
        error: (err) => {
          this.hasMore.set(false);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const listItemsElement = el.closest('.list-items');
    if (
      listItemsElement === el &&
      !this.loading() &&
      this.hasMore() &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 7
    )
      this.loadMore();
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }

  isSelected(item: T): boolean {
    const currentId = item[this.idField()];
    if (currentId === null || currentId === undefined) return false;

    if (!this.multiple()) {
      const selectedId = this.selectedItem()?.[this.idField()];
      return selectedId !== null && selectedId !== undefined && selectedId === currentId;
    }

    return this.selectedItems().some((selected) => {
      const selectedItemId = selected[this.idField()];
      return (
        selectedItemId !== null && selectedItemId !== undefined && selectedItemId === currentId
      );
    });
  }

  select(item: T) {
    if (this.multiple()) {
      this.toggleItem(item);
      return;
    }
    this.selectedItem.set(item);
    this.selected.emit(item);
    this.emptyChange.emit(false);
    this.isOpen.set(false);
  }

  toggleItem(item: T) {
    const arr = this.selectedItems();
    const exists = this.isSelected(item);
    const currentId = item[this.idField()];
    const updated = exists ? arr.filter((x) => x[this.idField()] !== currentId) : [...arr, item];
    this.selectedItems.set(updated);
    this.selectedMultiple.emit(updated);
    this.emptyChange.emit(updated.length === 0);
  }
}
