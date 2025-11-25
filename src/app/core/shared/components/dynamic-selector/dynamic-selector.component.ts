import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dynamic-selector',
  standalone: true,
  imports: [FeatherModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dynamic-selector.component.html',
  styleUrl: './dynamic-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSelector<T extends object> implements OnInit, OnDestroy {
  @Input() loadData!: (page: number, filter: string) => Observable<T[]>;
  @Input() displayField!: keyof T;
  @Input() multiple = false;
  @Input() idField!: keyof T;
  @Input() searchable = false;

  @Output() selected = new EventEmitter<T>();
  @Output() selectedMultiple = new EventEmitter<T[]>();

  private lastOpen = false;

  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  selectedItem = signal<T | null>(null);
  selectedItems = signal<T[]>([]);
  items = signal<T[]>([]);
  page = signal(1);
  hasMore = signal(true);
  loading = signal(false);
  isOpen = signal(false);
  public filterTextInternal = '';
  public filterText = signal('');

  constructor() {
    effect(() => {
      const open = this.isOpen();

      if (open && !this.lastOpen) {
        this.reset(this.filterText());
        this.loadMore();
      }

      this.lastOpen = open;
    });
  }

  ngOnInit(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.filterText.set(filter);
        this.reset(filter);
        this.loadMore();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterInput(filter: string) {
    this.filterSubject.next(filter);
  }

  reset(currentFilter: string) {
    this.items.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.loading.set(false);
    if (this.filterText() !== currentFilter) this.filterText.set(currentFilter);
  }

  loadMore() {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);
    const filter = this.filterText();

    this.loadData(this.page(), filter).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.hasMore.set(false);
        } else {
          this.items.update((prev) => [...prev, ...data]);
          this.page.update((p) => p + 1);
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
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
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    ) {
      this.loadMore();
    }
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }

  isSelected(item: T): boolean {
    const currentId = item[this.idField];
    if (currentId === null || currentId === undefined) return false;
    if (!this.multiple) {
      const selectedId = this.selectedItem()?.[this.idField];
      return selectedId !== null && selectedId !== undefined && selectedId === currentId;
    }
    return this.selectedItems().some((selected) => {
      const selectedItemId = selected[this.idField];
      return (
        selectedItemId !== null && selectedItemId !== undefined && selectedItemId === currentId
      );
    });
  }

  select(item: T) {
    if (this.multiple) {
      this.toggleItem(item);
      return;
    }

    this.selectedItem.set(item);
    this.selected.emit(item);
    this.isOpen.set(false);
  }

  toggleItem(item: T) {
    const arr = this.selectedItems();
    const exists = this.isSelected(item);
    const currentId = item[this.idField];

    const updated = exists ? arr.filter((x) => x[this.idField] !== currentId) : [...arr, item];

    this.selectedItems.set(updated);
    this.selectedMultiple.emit(updated);
  }
}
