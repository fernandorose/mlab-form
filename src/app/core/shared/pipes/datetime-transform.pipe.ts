import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform',
})
export class DateTransformPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || value.length !== 8) return '';

    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    const date = new Date(+year, +month - 1, +day);

    const formatter = new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return formatter.format(date).replace(' de ', ' de ').replace(',', '');
  }
}
