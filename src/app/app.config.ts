import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { DatePipe } from '@angular/common';

// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideToastr, ToastrConfig} from 'ngx-toastr';

// const toastrOptions: Partial<ToastrConfig> = {
//   timeOut: 3000, // 3 seconds before auto-hide
//   positionClass: 'toast-top-right', // ✅ Move toastr to top-right
//   // preventDuplicates: true, // Prevent showing same notification twice
//   closeButton: true, // Enable close button
//   progressBar: true, // Show progress bar
// };

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers:
   [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),

    provideAnimationsAsync(),
    // provideToastr(),
    // provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),

     DatePipe,
     provideEchartsCore({echarts}),

  ]
};
