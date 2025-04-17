import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Breadcrumb {
  id: string;
  name: string;
  path: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="breadcrumb-container">
      <div class="breadcrumb-title">
        <h2>{{ folderName }}</h2>
      </div>
      
      <div class="breadcrumb-path">
        <a routerLink="/" class="breadcrumb-item">
          <span class="material-icons">home</span>
        </a>
        
        <span class="breadcrumb-separator" *ngIf="breadcrumbs.length > 0">
          <span class="material-icons">chevron_right</span>
        </span>
        
        <ng-container *ngFor="let crumb of breadcrumbs; let last = last; let i = index">
          <a 
            [routerLink]="crumb.path" 
            class="breadcrumb-item"
            [class.active]="last"
          >
            {{ crumb.name }}
          </a>
          
          <span class="breadcrumb-separator" *ngIf="!last">
            <span class="material-icons">chevron_right</span>
          </span>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb-container {
      display: flex;
      flex-direction: column;
    }
    
    .breadcrumb-title h2 {
      margin: 0 0 var(--spacing-2) 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .breadcrumb-path {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: var(--spacing-1);
    }
    
    .breadcrumb-item {
      color: var(--neutral-700);
      text-decoration: none;
      transition: color var(--transition-fast);
      display: flex;
      align-items: center;
    }
    
    .breadcrumb-item:hover {
      color: var(--primary-600);
    }
    
    .breadcrumb-item.active {
      color: var(--neutral-900);
      font-weight: 500;
    }
    
    .breadcrumb-separator {
      color: var(--neutral-400);
      display: flex;
      align-items: center;
    }
    
    .breadcrumb-separator .material-icons {
      font-size: 1rem;
    }
  `]
})
export class BreadcrumbComponent implements OnChanges {
  @Input() path: string[] = [];
  @Input() folderName: string = 'Root';
  
  breadcrumbs: Breadcrumb[] = [];
  
  ngOnChanges(): void {
    this.buildBreadcrumbs();
  }
  
  private buildBreadcrumbs(): void {
    this.breadcrumbs = [];
    
    if (!this.path || this.path.length === 0) {
      return;
    }
    
    let currentPath = '';
    
    for (let i = 0; i < this.path.length; i++) {
      const segment = this.path[i];
      currentPath += (i === 0 ? '' : '/') + segment;
      
      this.breadcrumbs.push({
        id: segment,
        name: this.formatName(segment),
        path: `/folder/${segment}`
      });
    }
  }
  
  private formatName(id: string): string {
    // Convert folder ID to display name
    // This is just a simple implementation, in a real app you might fetch the actual folder name
    if (id === 'documents') return 'Documents';
    if (id === 'pictures') return 'Pictures';
    if (id === 'music') return 'Music';
    if (id === 'downloads') return 'Downloads';
    if (id === 'projects') return 'Projects';
    
    return id.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}