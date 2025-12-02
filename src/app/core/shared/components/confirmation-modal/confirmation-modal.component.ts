import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';

import { MlabFormItf } from '@core/coverage/interface/mlab.itf';
import { CapitalizeTransformPipe } from '@core/shared/pipes';
import { ColorEnum } from '@modMlab/coverage/enums';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CapitalizeTransformPipe, NgStyle, FeatherModule],
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModal {
  @Input() data!: MlabFormItf;
  public colors = ColorEnum;
  public activeModal = inject(NgbActiveModal);

  dataKeys(): string[] {
    return Object.keys(this.data);
  }

  formatKey(key: string): string {
    const formatted = key.replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  shouldDisplay(key: string, value: any): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }

  confirm() {
    this.activeModal.close('confirm');
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
