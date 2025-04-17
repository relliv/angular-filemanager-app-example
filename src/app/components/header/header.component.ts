import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FileService } from '../../services/file.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-title">
        <h1>File Manager</h1>
      </div>
      
      <div class="search-container">
        <div class="search-form">
          <span class="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Search files..." 
            class="search-input"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
          >
          <button class="clear-btn" *ngIf="searchQuery" (click)="clearSearch()">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      
      <div class="header-actions">
        <button class="action-btn upload-btn">
          <span class="material-icons">cloud_upload</span>
          <span class="btn-text">Upload</span>
        </button>
        <button class="action-btn new-folder-btn" (click)="createNewFolder()">
          <span class="material-icons">create_new_folder</span>
          <span class="btn-text">New Folder</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--neutral-50);
      border-bottom: 1px solid var(--neutral-200);
      gap: var(--spacing-4);
      z-index: 10;
    }
    
    .header-title h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .search-container {
      flex: 1;
      max-width: 500px;
    }
    
    .search-form {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-icon {
      position: absolute;
      left: var(--spacing-3);
      color: var(--neutral-600);
      font-size: 1.25rem;
    }
    
    .search-input {
      width: 100%;
      padding: var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--neutral-200);
      background-color: var(--neutral-100);
      font-size: 0.875rem;
      transition: all var(--transition-fast);
    }
    
    .search-input:focus {
      background-color: white;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.3);
    }
    
    .clear-btn {
      position: absolute;
      right: var(--spacing-2);
      background: transparent;
      border: none;
      color: var(--neutral-600);
      cursor: pointer;
      transition: color var(--transition-fast);
    }
    
    .clear-btn:hover {
      color: var(--neutral-900);
    }
    
    .header-actions {
      display: flex;
      gap: var(--spacing-3);
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    
    .upload-btn {
      background-color: var(--primary-500);
      color: white;
    }
    
    .upload-btn:hover {
      background-color: var(--primary-600);
    }
    
    .new-folder-btn {
      background-color: var(--neutral-100);
      color: var(--neutral-900);
    }
    
    .new-folder-btn:hover {
      background-color: var(--neutral-200);
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        padding: var(--spacing-3) var(--spacing-3);
      }
      
      .search-container {
        width: 100%;
        max-width: none;
        margin: var(--spacing-2) 0;
      }
      
      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
      
      .btn-text {
        display: none;
      }
      
      .action-btn {
        padding: var(--spacing-2);
      }
    }
  `]
})
export class HeaderComponent {
  searchQuery: string = '';
  
  constructor(
    private router: Router,
    private fileService: FileService
  ) {}
  
  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery }
      });
    }
  }
  
  clearSearch(): void {
    this.searchQuery = '';
  }
  
  createNewFolder(): void {
    this.fileService.getCurrentFolderId().subscribe(currentId => {
      this.fileService.createFolder('New Folder', currentId).subscribe(() => {
        // Refresh current view - the file service will handle updating the display
      });
    });
  }
}