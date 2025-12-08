import { NgStyle, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MlabListItf, MlabPdfItf } from '@core/coverage/interface/mlab.itf';
import { CapitalizeTransformPipe, DateTransformPipe } from '@core/shared/pipes';
import { TimeTransformPipe } from '@core/shared/pipes/time-transform.pipe';
import { ColorEnum } from '@modMlab/coverage/enums';
import { MlabService } from '@modMlab/service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-modal',
  imports: [
    NgStyle,
    FeatherModule,
    DateTransformPipe,
    TimeTransformPipe,
    CapitalizeTransformPipe,
    TitleCasePipe,
  ],
  templateUrl: './list-modal.component.html',
  styles: [
    `
      th {
        font-weight: 600;
      }
      .wide-table {
        min-width: 2000px;
        white-space: nowrap;
      }

      .wide-table td,
      .wide-table th {
        padding: 0.6rem 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListModal implements OnInit {
  private _mlabSrv = inject(MlabService);
  public activeModal = inject(NgbActiveModal);
  public list = signal<MlabListItf[] | []>([]);
  public colors = ColorEnum;
  public loading = signal(true);
  private destroyRef = inject(DestroyRef);
  public error = signal(false);

  ngOnInit(): void {
    this._mlabSrv
      .getList({ year: new Date().getFullYear().toString(), page: 1, limit: 10 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.loading.set(false);
          this.list.set(data.data.data);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  getPdf(data: MlabListItf) {
    const pdfData: MlabPdfItf = {
      folio: data.ZQT_RMUEST_ID,
      fecha: data.FECHA_MUESTRA,
      hora: data.HORA_MUESTRA,
      lote: data.NO_FOLIO,
      area: data.AREA,
      material: data.PRODUCTO,
      compartimento: data.COMPARTIMENTO,
      analisisRequerido: data.ANALISIS,
      nombreOperador: data.OPERADOR,
      codigoVehiculo: data.CODIGO_VEHICULO,
      loteInspeccion: data.LOTE_INSP,
      puntoMuestreo: data.TIPO_VEHICULO,
    };
    this._mlabSrv.getPdf(pdfData).subscribe({
      next: (res) => {
        window.open(`${environment.portal_url}/media/lab/sample/ticket/media/${res.data.key}`);
      },
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
