import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idtransform',
  standalone: true, // Si estás usando Angular Standalone Components
})
export class IdTransformPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const strValue = String(value);
    let result = strValue.replace(/^0+/, '');
    if (result === '') {
      if (strValue.includes('0')) {
        return '0';
      }
      return '';
    }

    if (result.startsWith('.')) {
      return '0' + result;
    }

    return result;
  }
}
