import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp({"projectId":"fir-ionic-project-a4ae0","appId":"1:760986691665:web:5441df79d708e76c043070","storageBucket":"fir-ionic-project-a4ae0.appspot.com","apiKey":"AIzaSyDUMSampT2WZsBpIoGBprl9-ucILk8Iyfo","authDomain":"fir-ionic-project-a4ae0.firebaseapp.com","messagingSenderId":"760986691665"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
