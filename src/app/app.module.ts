import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PostListComponent } from './posts/post-list/post-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  

import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent, 
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: PostCreateComponent }, 
      { path: 'edit/:postId', component: PostCreateComponent }
    ]),
    AppRoutingModule,
    ReactiveFormsModule,  
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
