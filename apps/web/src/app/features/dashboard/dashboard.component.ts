import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { DEMO_LISTINGS } from './dashboard.data';
import { filterDashboardListings, getDashboardMetrics } from './dashboard.model';
import type { DashboardFilter } from './dashboard.model';

@Component({
  selector: 'rr-dashboard',
  standalone: true,
  template: `
    <section class="dashboard page-width" aria-labelledby="dashboard-title">
      <div class="page-heading">
        <div>
          <p class="eyebrow">PANORAMICA PERSONALE</p>
          <h1 id="dashboard-title">Tieni d’occhio le occasioni.</h1>
          <p class="intro">Le segnalazioni che scegli di raccogliere, in un unico posto.</p>
        </div>
        <span class="demo-label">
          <span aria-hidden="true">●</span>
          Dati dimostrativi
        </span>
      </div>

      <div class="metrics-grid" aria-label="Riepilogo annunci di esempio">
        <article class="metric-card">
          <span>Nuovi</span>
          <strong>{{ metrics().newCount }}</strong>
          <span class="metric-note">da rivedere</span>
        </article>
        <article class="metric-card metric-card--accent">
          <span>Alta priorità</span>
          <strong>{{ metrics().highPriorityCount }}</strong>
          <span class="metric-note">punteggio ≥ 75</span>
        </article>
        <article class="metric-card">
          <span>Già aperti</span>
          <strong>{{ metrics().openedCount }}</strong>
          <span class="metric-note">esempi visualizzati</span>
        </article>
        <article class="metric-card">
          <span>Ignorati</span>
          <strong>{{ metrics().ignoredCount }}</strong>
          <span class="metric-note">esempi archiviati</span>
        </article>
      </div>

      <section class="inbox-preview" aria-labelledby="inbox-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">RACCOLTA</p>
            <h2 id="inbox-title">Segnalazioni recenti</h2>
          </div>
          <span class="item-count">{{ visibleListings().length }} esempi</span>
        </div>

        <div class="filters" role="group" aria-label="Filtra gli esempi per stato">
          @for (option of filterOptions; track option.value) {
            <button
              type="button"
              [class.is-active]="activeFilter() === option.value"
              [attr.aria-pressed]="activeFilter() === option.value"
              (click)="activeFilter.set(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        <ul class="listing-list">
          @for (listing of visibleListings(); track listing.id) {
            <li class="listing-card">
              <span class="listing-icon" aria-hidden="true">{{
                listing.category.slice(0, 1)
              }}</span>
              <div class="listing-main">
                <div class="listing-title-row">
                  <h3>{{ listing.title }}</h3>
                  <span class="status-badge" [class]="'status-badge status-' + listing.status">
                    {{ statusLabels[listing.status] }}
                  </span>
                </div>
                <p>
                  {{ listing.category }} <span aria-hidden="true">·</span> {{ listing.location }}
                </p>
                <span class="received-time">{{ listing.receivedLabel }}</span>
              </div>
              <div
                class="priority"
                [attr.aria-label]="'Priorità di esempio: ' + listing.priorityScore"
              >
                <strong>{{ listing.priorityScore }}</strong>
                <span>priorità</span>
              </div>
            </li>
          } @empty {
            <li class="empty-state">Nessun esempio corrisponde a questo filtro.</li>
          }
        </ul>

        <p class="privacy-note">
          <span aria-hidden="true">ⓘ</span>
          Demo statica: queste segnalazioni non sono reali e non vengono salvate.
        </p>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly listings = signal(DEMO_LISTINGS);
  readonly activeFilter = signal<DashboardFilter>('ALL');
  readonly metrics = computed(() => getDashboardMetrics(this.listings()));
  readonly visibleListings = computed(() =>
    filterDashboardListings(this.listings(), this.activeFilter()),
  );

  readonly filterOptions: readonly { value: DashboardFilter; label: string }[] = [
    { value: 'ALL', label: 'Tutti' },
    { value: 'NEW', label: 'Nuovi' },
    { value: 'OPENED', label: 'Aperti' },
    { value: 'IGNORED', label: 'Ignorati' },
  ];

  readonly statusLabels = {
    NEW: 'Nuovo',
    NOTIFIED: 'Notificato',
    OPENED: 'Aperto',
    INTERESTED: 'Interessante',
    IGNORED: 'Ignorato',
  } as const;
}
