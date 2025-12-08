import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.html',
  styleUrl: './config.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Config {}
