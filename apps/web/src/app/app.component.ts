import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'rr-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="app-shell">
      <a class="skip-link" href="#main-content">Vai al contenuto principale</a>
      <header class="topbar">
        <a class="brand" routerLink="/" aria-label="Regalo Radar, dashboard">
          <span class="brand-mark" aria-hidden="true">R</span>
          <span>Regalo Radar</span>
        </a>
        <nav aria-label="Navigazione principale">
          <a routerLink="/" aria-current="page">Dashboard</a>
          <span class="coming-soon">Inbox <span>prossimamente</span></span>
        </nav>
        <span class="local-badge">Demo locale</span>
      </header>

      <main id="main-content">
        <router-outlet />
      </main>

      <footer>
        <span>I dati mostrati sono esempi dimostrativi.</span>
        <span>Nessuna interazione automatizzata con siti esterni.</span>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
