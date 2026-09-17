import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  /** Global footer renders on public marketing pages (home, about, contact). */
  readonly showFooter = signal(false);

  /** Routes that show the shared footer below the page content. */
  private readonly footerRoutes = ['/', '/about', '/contact'];

  constructor() {
    this.showFooter.set(this.footerRoutes.includes(this.router.url));
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.showFooter.set(this.footerRoutes.includes(e.urlAfterRedirects)));
  }
}
