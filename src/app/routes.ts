import { Routes } from '@angular/router';
// import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
// import { SidebarComponent } from './game/sidebar/sidebar.component';
// import { FieldComponent } from './game/field/field.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
];
