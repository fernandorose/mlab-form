import { inject, Injectable, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  VALIDATOR_COMPARE_MAP,
  VALIDATOR_DISPLAY_MAP,
  VALIDATOR_EXACT_MATCH_MAP,
} from '../coverage/data';
import { FieldNames } from '../coverage/enums/fields.enu';
import { MlabService } from './mlab.service';

@Injectable({ providedIn: 'root' })
export class ValidatorHandlerService {
  private input$ = new Subject<{ field: string; value: string }>();
  private mlab = inject(MlabService);
  private currentArea = '';
  public status = signal<Record<string, boolean | null>>({});
  public result = signal<Record<string, any>>({});
  public inputValue = signal<Record<string, string>>({});

  constructor() {
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => prev.field === curr.field && prev.value === curr.value,
        ),
      )
      .subscribe(({ field, value }) => this.runValidator(field, value));
  }

  handleInput(field: string, raw: string | Event) {
    const value = raw instanceof Event ? (raw.target as HTMLInputElement).value.trim() : raw.trim();
    if (!value) {
      this.status.update((x) => ({ ...x, [field]: null }));
      this.result.update((x) => ({ ...x, [field]: null }));
      this.inputValue.update((x) => ({ ...x, [field]: '' }));
      return;
    }

    this.inputValue.update((x) => ({ ...x, [field]: value }));
    this.input$.next({ field, value });
  }

  private runValidator(fieldName: string, value: string) {
    const compareMode = VALIDATOR_COMPARE_MAP[fieldName] || 'NOMBRE';
    const exactMatch = VALIDATOR_EXACT_MATCH_MAP[fieldName] ?? true;

    const validatorFn = this.getValidatorFn(fieldName);
    if (!validatorFn) return;

    validatorFn(value).subscribe({
      next: (data: any[]) => {
        let isValid = false;
        let matchedItem: any = null;

        if (Array.isArray(data) && data.length > 0) {
          if (compareMode === 'NONE') {
            isValid = data.length > 0;
            matchedItem = data[0];
          } else {
            matchedItem = exactMatch
              ? data.find((i) => i[compareMode] === value)
              : data.find((i) => i[compareMode]?.includes(value));

            isValid = !!matchedItem;
          }
        }

        this.status.update((x) => ({ ...x, [fieldName]: isValid }));
        this.result.update((x) => ({ ...x, [fieldName]: matchedItem }));
      },
      error: () => {
        this.status.update((x) => ({ ...x, [fieldName]: false }));
        this.result.update((x) => ({ ...x, [fieldName]: null }));
      },
    });
  }

  getDisplay(field: string) {
    const status = this.status()[field];
    if (status !== true) return { visible: false, text: '' };

    const result = this.result()[field];
    const map = VALIDATOR_DISPLAY_MAP[field];
    const input = this.inputValue()[field];

    if (!map) return { visible: false, text: '' };

    switch (map.type) {
      case 'FIELD':
        return { visible: !!result, text: result?.[map.prop] ?? '' };
      case 'INPUT':
        return { visible: true, text: input ?? '' };
      default:
        return { visible: false, text: '' };
    }
  }

  reset() {
    this.status.set({});
    this.result.set({});
    this.inputValue.set({});
  }

  setArea(area: string) {
    this.currentArea = area;
  }

  private getValidatorFn(field: string) {
    switch (field) {
      case FieldNames.FOLIO_NUMBER:
        return (val: string) => this.mlab.validateFolioNum(this.currentArea, val);
      case 'inspection_lot':
        return (val: string) => this.mlab.validateInspectionLot(val);
      case 'operator':
        return (val: string) => this.mlab.validateOperator(val);
      default:
        return null;
    }
  }
}
