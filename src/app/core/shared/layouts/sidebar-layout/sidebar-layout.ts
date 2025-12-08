import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenu } from '@core/shared/components/sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-sidebar-layout',
  imports: [SidebarMenu, RouterOutlet],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayout {}
