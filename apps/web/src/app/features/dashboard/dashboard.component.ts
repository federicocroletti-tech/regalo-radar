import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ListingsRepository } from '../../data-access/listings/listings.repository';
import {
  filterDashboardListings,
  getDashboardMetrics,
  isListingStatus,
  searchDashboardListings,
} from './dashboard.model';
import type {
  DashboardFilter,
  DashboardListing,
  ListingSource,
  ListingStatus,
} from './dashboard.model';

@Component({
  selector: 'rr-dashboard',
  standalone: true,
  imports: [DatePipe, FormsModule],
  providers: [{ provide: ListingsRepository, useFactory: () => new ListingsRepository() }],
  template: `
    <section class="dashboard page-width" aria-labelledby="dashboard-title">
      <div class="page-heading">
        <div>
          <p class="eyebrow">LA TUA RACCOLTA, SUL TUO DISPOSITIVO</p>
          <h1 id="dashboard-title">Le occasioni che hai trovato.</h1>
          <p class="intro">
            Salva un annuncio quando lo trovi e tieni traccia di quello che ti interessa.
          </p>
        </div>
        <span class="live-label">
          <span aria-hidden="true"></span>
          Dati locali · aggiornamento immediato
        </span>
      </div>

      <div class="metrics-grid" aria-label="Riepilogo delle tue segnalazioni">
        <article class="metric-card">
          <span>Segnalazioni</span>
          <strong>{{ metrics().totalCount }}</strong>
          <span class="metric-note">salvate su questo dispositivo</span>
        </article>
        <article class="metric-card metric-card--accent">
          <span>Da rivedere</span>
          <strong>{{ metrics().newCount }}</strong>
          <span class="metric-note">non ancora aperte</span>
        </article>
        <article class="metric-card">
          <span>Interessanti</span>
          <strong>{{ metrics().interestedCount }}</strong>
          <span class="metric-note">che vuoi tenere d’occhio</span>
        </article>
        <article class="metric-card">
          <span>Attive</span>
          <strong>{{ metrics().activeCount }}</strong>
          <span class="metric-note">escluse quelle archiviate</span>
        </article>
      </div>

      <section class="inbox-preview" aria-labelledby="inbox-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SEGNALAZIONI</p>
            <h2 id="inbox-title">La tua inbox</h2>
          </div>
          <div class="section-actions">
            <button type="button" class="button button-secondary" (click)="exportListings()">
              Esporta dati
            </button>
            <button
              type="button"
              class="button button-primary"
              (click)="showCapture.update((visible) => !visible)"
              [attr.aria-expanded]="showCapture()"
              aria-controls="capture-form"
            >
              {{ showCapture() ? 'Chiudi' : '＋ Aggiungi annuncio' }}
            </button>
          </div>
        </div>

        @if (showCapture()) {
          <form id="capture-form" class="capture-form" (ngSubmit)="saveListing()">
            <div class="capture-heading">
              <div>
                <h3>Nuova segnalazione</h3>
                <p>
                  Incolla il link e aggiungi solo le informazioni che vuoi conservare. Non
                  recuperiamo contenuti dal sito.
                </p>
              </div>
              @if (captureSource === 'shared') {
                <span class="shared-badge">Condivisione da rivedere</span>
              }
            </div>

            <label>
              Titolo <span aria-hidden="true">*</span>
              <input
                name="title"
                [(ngModel)]="captureTitle"
                maxlength="160"
                required
                autocomplete="off"
                placeholder="Es. Scaffale in legno, ritiro in zona"
              />
            </label>

            <div class="form-grid">
              <label>
                Link originale
                <input
                  name="url"
                  [(ngModel)]="captureUrl"
                  type="url"
                  inputmode="url"
                  autocomplete="url"
                  placeholder="https://…"
                />
              </label>
              <label>
                Categoria
                <input
                  name="category"
                  [(ngModel)]="captureCategory"
                  maxlength="60"
                  placeholder="Casa, libri, abbigliamento…"
                />
              </label>
            </div>

            <div class="form-grid">
              <label>
                Zona
                <input
                  name="location"
                  [(ngModel)]="captureLocation"
                  maxlength="100"
                  placeholder="Comune o quartiere"
                />
              </label>
              <label>
                Nota o estratto
                <input
                  name="excerpt"
                  [(ngModel)]="captureExcerpt"
                  maxlength="500"
                  placeholder="Solo testo che hai scelto di condividere"
                />
              </label>
            </div>

            @if (formError()) {
              <p class="form-message form-message--error" role="alert">{{ formError() }}</p>
            }
            <div class="form-actions">
              <span class="privacy-hint">I dati restano nel browser di questo dispositivo.</span>
              <button type="submit" class="button button-primary" [disabled]="saving()">
                {{ saving() ? 'Salvataggio…' : 'Salva segnalazione' }}
              </button>
            </div>
          </form>
        }

        @if (notice()) {
          <p class="form-message form-message--success" role="status">{{ notice() }}</p>
        }
        @if (repository.error()) {
          <p class="form-message form-message--error" role="alert">{{ repository.error() }}</p>
        }

        <div class="inbox-toolbar">
          <label class="search-field">
            <span class="visually-hidden">Cerca nelle segnalazioni</span>
            <span aria-hidden="true">⌕</span>
            <input
              name="search"
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              placeholder="Cerca titolo, zona, categoria…"
              autocomplete="off"
            />
          </label>
          <span class="updated-time">
            Aggiornato {{ repository.lastUpdatedAt() | date: 'HH:mm:ss' }}
          </span>
        </div>

        <div class="filters" role="group" aria-label="Filtra le segnalazioni per stato">
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
          <span class="item-count">{{ visibleListings().length }} annunci</span>
        </div>

        @if (repository.isLoading() && listings().length === 0) {
          <p class="empty-state" role="status">Caricamento delle segnalazioni salvate…</p>
        } @else {
          <ul class="listing-list">
            @for (listing of visibleListings(); track listing.id) {
              <li class="listing-card">
                <span class="listing-icon" aria-hidden="true">{{
                  listing.category.slice(0, 1).toLocaleUpperCase('it')
                }}</span>
                <div class="listing-main">
                  <div class="listing-title-row">
                    <h3>{{ listing.title }}</h3>
                    <span class="status-badge" [class]="'status-badge status-' + listing.status">
                      {{ statusLabels[listing.status] }}
                    </span>
                  </div>
                  <p class="listing-details">
                    {{ listing.category }}
                    @if (listing.location) {
                      <span aria-hidden="true"> · </span>{{ listing.location }}
                    }
                    @if (listing.sources.length > 1) {
                      <span aria-hidden="true"> · </span>{{ listing.sources.length }} segnalazioni
                    }
                  </p>
                  @if (listing.excerpt) {
                    <p class="listing-excerpt">{{ listing.excerpt }}</p>
                  }
                  <span class="received-time">
                    Ricevuto {{ listing.receivedAt | date: 'dd/MM/yyyy, HH:mm' }}
                  </span>
                  <div class="listing-actions">
                    @if (listing.url) {
                      <a
                        [href]="listing.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        (click)="markOpened(listing)"
                      >
                        Apri originale <span aria-hidden="true">↗</span>
                      </a>
                    }
                    <label class="status-control">
                      <span class="visually-hidden">Stato di {{ listing.title }}</span>
                      <select
                        [ngModel]="listing.status"
                        (ngModelChange)="changeStatus(listing, $event)"
                        [name]="'status-' + listing.id"
                      >
                        @for (status of statusOptions; track status) {
                          <option [value]="status">{{ statusLabels[status] }}</option>
                        }
                      </select>
                    </label>
                    <button
                      type="button"
                      class="text-button delete-button"
                      (click)="removeListing(listing)"
                      [attr.aria-label]="'Elimina ' + listing.title"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </li>
            } @empty {
              <li class="empty-state">
                @if (listings().length === 0) {
                  Non hai ancora salvato segnalazioni. Aggiungi un annuncio che hai trovato o
                  condividilo dal browser.
                } @else {
                  Nessuna segnalazione corrisponde alla ricerca o al filtro.
                }
              </li>
            }
          </ul>
        }

        <p class="privacy-note">
          <span aria-hidden="true">ⓘ</span>
          Gli annunci non vengono aggiornati dal sito d’origine: verifica disponibilità e dettagli
          aprendo il link. Puoi salvare dati recenti condividendoli tu stesso con l’app.
        </p>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly router = inject(Router);
  readonly repository = inject(ListingsRepository);
  readonly listings = this.repository.listings;
  readonly showCapture = signal(false);
  readonly saving = signal(false);
  readonly formError = signal('');
  readonly notice = signal('');
  readonly activeFilter = signal<DashboardFilter>('ALL');
  readonly searchTerm = signal('');
  captureTitle = '';
  captureUrl = '';
  captureCategory = '';
  captureLocation = '';
  captureExcerpt = '';
  captureSource: ListingSource = 'manual';
  readonly metrics = computed(() => getDashboardMetrics(this.listings()));
  readonly visibleListings = computed(() => {
    const filtered = filterDashboardListings(this.listings(), this.activeFilter());
    return searchDashboardListings(filtered, this.searchTerm());
  });

  readonly filterOptions: readonly { value: DashboardFilter; label: string }[] = [
    { value: 'ALL', label: 'Tutti' },
    { value: 'NEW', label: 'Da rivedere' },
    { value: 'OPENED', label: 'Aperti' },
    { value: 'INTERESTED', label: 'Interessanti' },
    { value: 'IGNORED', label: 'Archiviati' },
  ];

  readonly statusOptions: readonly ListingStatus[] = ['NEW', 'OPENED', 'INTERESTED', 'IGNORED'];

  readonly statusLabels: Record<ListingStatus, string> = {
    NEW: 'Da rivedere',
    OPENED: 'Aperto',
    INTERESTED: 'Interessante',
    IGNORED: 'Archiviato',
  };

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const title = params.get('title') ?? '';
        const text = params.get('text') ?? '';
        const url = params.get('url') ?? '';
        if (!title && !text && !url) {
          return;
        }

        this.captureTitle = (title || text.split(/\r?\n/, 1)[0]).slice(0, 160);
        this.captureUrl = url.slice(0, 2048);
        this.captureExcerpt = text.slice(0, 500);
        this.captureSource = 'shared';
        this.showCapture.set(true);
      });
  }

  async saveListing(): Promise<void> {
    this.formError.set('');
    this.notice.set('');
    this.saving.set(true);
    try {
      const result = await this.repository.add({
        title: this.captureTitle,
        url: this.captureUrl,
        category: this.captureCategory,
        location: this.captureLocation,
        excerpt: this.captureExcerpt,
        source: this.captureSource,
      });
      this.notice.set(
        result === 'merged'
          ? 'Link già presente: aggiunta una nuova provenienza alla segnalazione.'
          : 'Segnalazione salvata su questo dispositivo.',
      );
      this.captureTitle = '';
      this.captureUrl = '';
      this.captureCategory = '';
      this.captureLocation = '';
      this.captureExcerpt = '';
      this.captureSource = 'manual';
      this.showCapture.set(false);
      void this.router.navigate([], {
        queryParams: { title: null, text: null, url: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } catch (error) {
      this.formError.set(
        error instanceof Error ? error.message : 'Non è stato possibile salvare la segnalazione.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  async changeStatus(listing: DashboardListing, value: string): Promise<void> {
    if (!isListingStatus(value)) {
      return;
    }
    await this.runAction(() => this.repository.updateStatus(listing.id, value));
  }

  async markOpened(listing: DashboardListing): Promise<void> {
    if (listing.status === 'NEW') {
      await this.runAction(() => this.repository.updateStatus(listing.id, 'OPENED'));
    }
  }

  async removeListing(listing: DashboardListing): Promise<void> {
    if (window.confirm(`Eliminare “${listing.title}” da questo dispositivo?`)) {
      await this.runAction(() => this.repository.remove(listing.id));
    }
  }

  async exportListings(): Promise<void> {
    try {
      const listings = await this.repository.exportAll();
      const blob = new Blob([JSON.stringify(listings, null, 2)], {
        type: 'application/json',
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `regalo-radar-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      this.notice.set('Esportazione JSON completata.');
    } catch (error) {
      console.error('Unable to export saved listings.', error);
      this.formError.set('Non è stato possibile esportare le segnalazioni.');
    }
  }

  private async runAction(action: () => Promise<void>): Promise<void> {
    this.formError.set('');
    this.notice.set('');
    try {
      await action();
    } catch (error) {
      console.error('Unable to update a saved listing.', error);
      this.formError.set(
        error instanceof Error
          ? error.message
          : 'Non è stato possibile aggiornare la segnalazione.',
      );
    }
  }
}
