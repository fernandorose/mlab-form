import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetimeTransform',
})
export class DatetimeTransformPipe implements PipeTransform {
  transform(fecha?: string, hora?: string): string {
    if (!fecha) return '';

    // Validar formato YYYYMMDD
    if (fecha.length !== 8) return fecha;

    const year = fecha.substring(0, 4);
    const month = fecha.substring(4, 6);
    const day = fecha.substring(6, 8);
    let result = `${year}-${month}-${day}`;

    // Si viene hora en formato HHmmss → formatear
    if (hora && hora.length === 6) {
      const hh = hora.substring(0, 2);
      const mm = hora.substring(2, 4);
      const ss = hora.substring(4, 6);
      result += ` ${hh}:${mm}:${ss}`;
    }

    return result;
  }
}
