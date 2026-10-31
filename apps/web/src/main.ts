import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (!isDevMode() && 'serviceWorker' in navigator) {
      void navigator.serviceWorker
        .register(new URL('sw.js', document.baseURI), {
          scope: new URL('.', document.baseURI).pathname,
        })
        .catch((error: unknown) => {
          console.error('Unable to register the Regalo Radar service worker.', error);
        });
    }
  })
  .catch((error: unknown) => {
    console.error('Unable to start Regalo Radar.', error);
  });
