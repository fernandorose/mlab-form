import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeTransform',
})
export class TimeTransformPipe implements PipeTransform {
  transform(value: string | null | undefined, showSeconds: boolean = false): string {
    if (!value || value.length !== 6) return '';

    const hh = value.substring(0, 2);
    const mm = value.substring(2, 4);
    const ss = value.substring(4, 6);

    if (showSeconds) {
      return `${hh}:${mm}:${ss}`;
    }

    return `${hh}:${mm}`;
  }
}
