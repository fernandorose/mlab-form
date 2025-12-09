import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { menu } from '@core/coverage/data/sidebar-menu';
import { MenuStateService } from '@core/service/toggle-menu.srv';
import { FeatherModule } from 'angular-feather';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-menu',
  imports: [FeatherModule],
  templateUrl: './sidebar-menu.html',
  styleUrl: './sidebar-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenu implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private menuStateService = inject(MenuStateService);
  public menu = menu;
  public openStates: boolean[] = new Array(menu.length).fill(false);
  private renderer = inject(Renderer2);
  public isMenuCollapsed: boolean = false;
  public currentUrl = '';

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.autoOpenParents();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.autoOpenParents();
        this.cdr.detectChanges();
      });
    this.menuStateService.isCollapsed$.subscribe((collapsed) => {
      this.isMenuCollapsed = collapsed;
      const mainElement = document.querySelector('main');
      if (mainElement) {
        if (this.isMenuCollapsed) {
          this.renderer.addClass(mainElement, 'sidebar-collapsed');
        } else {
          this.renderer.removeClass(mainElement, 'sidebar-collapsed');
        }
      }
      this.cdr.detectChanges();
    });
  }

  toggleMenuCollapse() {
    this.menuStateService.toggle();
  }

  toggle(i: number) {
    this.openStates[i] = !this.openStates[i];
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentUrl === route;
  }

  isParentActive(menuItem: any): boolean {
    return menuItem.items?.some((item: any) => this.currentUrl === item.route);
  }

  private autoOpenParents() {
    this.menu.forEach((m: any, index: number) => {
      if (this.isParentActive(m)) this.openStates[index] = true;
    });
  }
}
