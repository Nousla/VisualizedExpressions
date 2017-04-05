// Needed as it otherwise leads to error
// See: https://github.com/angular/angular-cli/issues/2008
import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
