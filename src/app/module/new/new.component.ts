import { DatePipe, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import Swal from 'sweetalert2';

import { BasePaginationItf } from '@core/coverage/interface/http.itf';
import { globalMlabItf, MlabFormItf } from '@core/coverage/interface/mlab.itf';
import { ConfirmationModal } from '@core/shared/components/confirmation-modal/confirmation-modal.component';
import { DynamicSelector } from '@core/shared/components/dynamic-selector/dynamic-selector.component';
import { ListModal } from '@core/shared/components/list-modal/list-modal.component';
import { syncFormControlsHelper, transformDate, transformTime } from '@core/shared/helper';
import { CapitalizeTransformPipe } from '@core/shared/pipes';
import { areaConfig, fields, VALIDATOR_MAX_LENGTH_MAP } from '@modMlab/coverage/data';
import { ColorEnum, FieldNames } from '@modMlab/coverage/enums';
import {
  DynamicSelectorService,
  MlabService,
  TimeService,
  ValidatorHandlerService,
} from '@modMlab/service';

type AreaKey = keyof typeof areaConfig;
type AreaConfigEntry = { BASE_FIELDS: string[]; CONDITIONAL_FIELDS?: Record<string, string[]> };

interface AreaState {
  area: globalMlabItf | null;
  procedencia: string | null;
}

@Component({
  selector: 'app-new',
  imports: [
    ReactiveFormsModule,
    DynamicSelector,
    FeatherModule,
    DatePipe,
    NgStyle,
    CapitalizeTransformPipe,
  ],
  templateUrl: './new.component.html',
  styles: [
    `
      .background {
        position: fixed;
        inset: 0;
        z-index: -1;
        background-color: #eeeeee;
        opacity: 0.8;
        background-image:
          linear-gradient(#ffffff 1px, transparent 1px),
          linear-gradient(to right, #ffffff 1px, #eeeeee 1px);
        background-size: 20px 20px;
        /* background: radial-gradient(147.1% 100% at 50% 0%, #ffffff 0%, #c4c4c4 100%); */
        /* background-repeat: no-repeat;
    background-size: cover;
    pointer-events: none; */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New {
  private _fb = inject(FormBuilder);
  private _mlabSrv = inject(MlabService);
  private modalSrv = inject(NgbModal);
  private selectorService = inject(DynamicSelectorService);
  private useNameInsteadOfId = [FieldNames.HOPPER_COMPARTMENT, FieldNames.FREIGHT_CAR_COMPARTMENT];
  private _paginationSignal = signal<BasePaginationItf>({
    order: 'desc',
    totData: 0,
    prvPage: 1,
    nowPage: 1,
    maxPage: 1,
    limPage: 25,
  });
  public paginationComputed = computed(() => this._paginationSignal());
  public allFields = fields;
  public frmData = this._fb.group({
    analysis: [[] as string[], [Validators.required]],
    obs: [''],
    area: ['', [Validators.required]],
  });
  public fieldNames = FieldNames;
  public dynForm: FormGroup<Record<string, any>> = this._fb.group({});
  public todayDate = signal(new Date());
  public resetSelectors = signal(0);
  public selectedArea = signal<globalMlabItf | null>(null);
  public selectedProcedenciaValue = signal<string | null>(null);
  public submittedData = signal<any | null>(null);
  public validatorResult = signal<Record<string, globalMlabItf | null>>({});
  public validatorSrv = inject(ValidatorHandlerService);
  public time = inject(TimeService);
  public areaState = signal<AreaState>({
    area: null,
    procedencia: null,
  });
  public colors = ColorEnum;
  public VALIDATOR_MAX_LENGTH_MAP = VALIDATOR_MAX_LENGTH_MAP;
  showConfirmModal = false;
  showListModal = false;
  readonly fieldLabelMap: Record<string, string> = {
    area: 'Área',
    remarks: 'Observaciones',
    analysis: 'Análisis',
    compartment: 'Compartimentos',
    line: 'Línea',
    product: 'Producto',
    folio_number: 'Número de lote',
    operator: 'Trabajador',
    origin: 'Procedencia',
    sample_type: 'Tipo de muestra',
    inspection_lot: 'Lote de inspección',
    package_code: 'Paquete',
    vehicle_code: 'Código de vehículo',
    vehicle_type: 'Tipo de vehículo',
    carrier: 'Transportista',
    delivery_date: 'Fecha de entrega',
    sampling_date: 'Fecha de muestreo',
    sampling_time: 'Hora de muestreo',
    delivery_time: 'Hora de entrega',
  };

  validatorDisplay(field: string) {
    return this.validatorSrv.getDisplay(field);
  }

  onValidatorInput(field: string, value: string) {
    this.dynForm.get(field)?.setValue(value, { emitEvent: false });
    this.validatorSrv.handleInput(field, value);
  }

  onSelectorEmpty(field: string, isEmpty: boolean) {
    this.dynForm.get(field)?.setErrors(isEmpty ? { empty: true } : null);
  }

  onSave() {
    this.frmData.markAllAsTouched();
    this.dynForm.markAllAsTouched();
    if (this.frmData.invalid || this.dynForm.invalid) return;
    const validatorStatus = this.validatorSrv.status();
    const invalidFields = Object.keys(validatorStatus).filter((f) => validatorStatus[f] === false);
    if (invalidFields.length > 0) return;
    const formBaseValues = this.frmData.value;
    const formDynamicValues = { ...this.dynForm.value };
    for (const field of Object.keys(formDynamicValues)) {
      if (field === FieldNames.FOLIO_NUMBER) {
        formDynamicValues[field] = this.validatorSrv.inputValue()[field];
      } else {
        const validatedObj = this.validatorSrv.result()[field];
        if (validatedObj) formDynamicValues[field] = validatedObj.NOMBRE ?? validatedObj.ID;
      }
    }
    const { compartimientotolva, compartimientofurgon, ...otherDynamicValues } = formDynamicValues;
    const compartmentsValue = compartimientotolva || compartimientofurgon;
    const requestBody: MlabFormItf = {
      area: formBaseValues.area ?? '',
      remarks: formBaseValues.obs || '',
      analysis: formBaseValues.analysis?.filter((a) => a) ?? [],
      ...otherDynamicValues,
      compartment: compartmentsValue ?? [],
      delivery_date: transformDate(this.todayDate()),
      sampling_date: transformDate(this.todayDate()),
      sampling_time: transformTime(this.time.roundedTime()),
      delivery_time: transformTime(this.time.getCurrentTime()),
    };
    for (const key in requestBody) {
      const value = requestBody[key];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete requestBody[key];
      }
    }
    const HIDDEN_FIELDS = ['delivery_date', 'sampling_date', 'sampling_time', 'delivery_time'];
    const displayData: Record<string, any> = {};
    for (const key of Object.keys(requestBody)) {
      if (HIDDEN_FIELDS.includes(key)) continue;
      const label = this.fieldLabelMap[key] ?? key;
      displayData[label] = requestBody[key];
    }
    this.submittedData.set(requestBody);
    const confirmationModalRef = this.modalSrv.open(ConfirmationModal, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    confirmationModalRef.componentInstance.data = displayData;
    confirmationModalRef.result.then((result) => {
      if (result === 'confirm') {
        this.submitFinal();
        Swal.fire({
          title: 'Datos enviados con exito',
          icon: 'success',
          confirmButtonColor: this.colors.RESOLUTION,
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }

  submitFinal() {
    const body = this.submittedData();
    this._mlabSrv.create(body).subscribe({
      next: () => {
        this.submittedData.set(body);
      },
    });
  }

  public list() {
    this.modalSrv.open(ListModal, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
  }

  public visibleFields = computed<string[]>(() => {
    const area = this.selectedArea();
    const procedencia = this.selectedProcedenciaValue();
    if (!area?.NOMBRE) return [];
    const areaKey = area.NOMBRE.toUpperCase() as AreaKey;
    const config: AreaConfigEntry = areaConfig[areaKey];
    if (!config) return [];
    const conditional = config.CONDITIONAL_FIELDS?.[procedencia ?? ''];
    return conditional ?? config.BASE_FIELDS;
  });

  public getSelectorLoader = (field: string) => {
    return this.selectorService.getLoader(field, this.selectedArea);
  };

  public extractSelectorValue(field: string, item: globalMlabItf) {
    if (this.isFieldMultiple(field)) return item.ID;
    return this.useNameInsteadOfId.includes(field as FieldNames) ? item.NOMBRE : item.ID;
  }

  public handleSelectorSpecialCases(field: string, item: globalMlabItf) {
    if (field === FieldNames.PRODUCT) this.onProductoSelected(item);
    if (field === FieldNames.ORIGIN) this.onProcedenciaSelected(item);
  }

  public onSelectorSelected(field: string, event: globalMlabItf | globalMlabItf[]) {
    const items = Array.isArray(event) ? event : [event];

    if (this.isFieldMultiple(field)) {
      this.dynForm.get(field)?.setValue(items.map((i) => i.ID));
      return;
    }

    const item = items[0];
    const value = this.extractSelectorValue(field, item);
    this.dynForm.get(field)?.setValue(value);

    this.handleSelectorSpecialCases(field, item);
  }

  public onAreaSelected(area: globalMlabItf) {
    Object.keys(this.dynForm.controls).forEach((key) => {
      this.dynForm.removeControl(key);
    });
    this.dynForm.reset();
    this.validatorSrv.reset();
    this.validatorSrv.setArea(area.NOMBRE.toUpperCase());
    this.resetSelectors.update((v) => v + 1);
    this.frmData.controls[FieldNames.AREA].setValue(area.NOMBRE);
    this.selectedArea.set(area);
    this.selectedProcedenciaValue.set(null);
    this.syncFormControls(this.visibleFields());
  }

  public onAnalisisSelected(items: globalMlabItf[]) {
    const ids = items.map((i) => i.NOMBRE);
    this.frmData.get(FieldNames.ANALYSIS)?.setValue(ids);
  }

  public onProductoSelected(item: globalMlabItf) {
    this.dynForm.get(FieldNames.PRODUCT)?.setValue(item.NOMBRE);
  }

  public onProcedenciaSelected(item: globalMlabItf) {
    this.dynForm.get(FieldNames.ORIGIN)?.setValue(item.NOMBRE);
    this.selectedProcedenciaValue.set(item.NOMBRE?.toUpperCase() ?? null);
    this.syncFormControls(this.visibleFields());
  }

  public syncFormControls(visibles: string[]) {
    syncFormControlsHelper(this.dynForm, visibles, this.allFields, this._fb);
  }

  isFieldMultiple(fieldName: string): boolean {
    return this.useNameInsteadOfId.includes(fieldName as FieldNames);
  }

  public shouldShowRequiredError(fieldName: string): boolean {
    let control = this.dynForm.get(fieldName);
    if (!control) control = this.frmData.get(fieldName);
    if (!control) return false;
    const shouldShow = control.touched && control.invalid;
    if (shouldShow) return control.hasError('empty') || control.hasError('required');
    return false;
  }
}
