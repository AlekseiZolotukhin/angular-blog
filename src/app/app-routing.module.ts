import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {PostPageComponent} from './post-page/post-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {AdminModule} from './admin/admin.module';

const routes: Routes = [{
    path: '',
    component: MainLayoutComponent,
    children: [
      // route for redirect to main page if path is empty
      {path: '', redirectTo: '/', pathMatch: 'full'}, // full - if path match fully
      {path: '', component: HomePageComponent},
      // route for post with dynamic id
      {path: 'post/:id', component: PostPageComponent}
    ]
  },
  {
    path: 'admin', loadChildren: () => AdminModule // load children for lazy loading
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules  // for lazy loading all modules after main module loading
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
