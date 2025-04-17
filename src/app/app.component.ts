import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="app-content">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    
    .app-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    
    .main-content {
      flex: 1;
      overflow: auto;
      padding: var(--spacing-4);
      background-color: var(--neutral-50);
      transition: var(--transition-normal);
    }
    
    @media (max-width: 768px) {
      .app-content {
        flex-direction: column;
      }
      
      .main-content {
        padding: var(--spacing-2);
      }
    }
  `]
})
export class AppComponent {
  title = 'Angular File Manager';
}