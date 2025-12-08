import { Component, signal } from '@angular/core';
import { SidebarLayout } from '@core/shared/layouts/sidebar-layout/sidebar-layout';

@Component({
  selector: 'app-root',
  imports: [SidebarLayout],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('mlab_form');
}
