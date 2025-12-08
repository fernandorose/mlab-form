import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { menu } from '@core/coverage/data/sidebar-menu';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-sidebar-menu',
  imports: [FeatherModule, RouterLinkActive, RouterLink],
  templateUrl: './sidebar-menu.html',
  styleUrl: './sidebar-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenu {
  public menu = menu;
  openStates: boolean[] = [];
  // public openStates = signal<boolean[] | []>([]);

  toggle(index: number) {
    this.openStates[index] = !this.openStates[index];
  }
}
