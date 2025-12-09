import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuStateService } from '@core/service/toggle-menu.srv';
import { SidebarMenu } from '@core/shared/components/sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-sidebar-layout',
  imports: [SidebarMenu, RouterOutlet],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayout {
  public menuStateService = inject(MenuStateService);
  public isMenuCollapsed = false;

  ngOnInit() {
    this.menuStateService.isCollapsed$.subscribe((collapsed) => {
      this.isMenuCollapsed = collapsed;
    });
  }
}
