import { Pipe } from '@angular/core';

@Pipe({
  name: 'capitalizeTransform',
})
export class CapitalizeTransformPipe {
  transform(value: any): string {
    if (value == null) return '';

    if (Array.isArray(value)) {
      return value.map((v) => this.capitalize(String(v))).join(', ');
    }

    return this.capitalize(String(value));
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
