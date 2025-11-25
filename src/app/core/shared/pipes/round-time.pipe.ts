import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundTime',
})
export class RoundTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [h, m] = value.split(':').map(Number);

    if (isNaN(h) || isNaN(m)) return value;

    // Si minutos >= 30, sumar 1 a la hora
    const roundedHour = m >= 30 ? h + 1 : h;

    // Ajustar si pasa de 23
    const finalHour = (roundedHour + 24) % 24;

    // Retornar como HH:00
    return `${finalHour.toString().padStart(2, '0')}:00`;
  }
}
