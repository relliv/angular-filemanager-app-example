import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileService } from '../../services/file.service';
import { FileItem, FileType, SortOption, ViewMode } from '../../models/file.model';
import { FileListComponent } from '../../components/file-list/file-list.component';
import { FileGridComponent } from '../../components/file-grid/file-grid.component';
import { FileActionsComponent } from '../../components/file-actions/file-actions.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FileListComponent,
    FileGridComponent,
    FileActionsComponent
  ],
  template: `
    <div class="favorites-page">
      <div class="favorites-header">
        <h2>Favorites</h2>
        
        <div class="favorites-controls">
          <div class="view-toggle">
            <button 
              class="view-toggle-btn" 
              [class.active]="viewMode === 'list'"
              (click)="setViewMode(ViewMode.LIST)"
            >
              <span class="material-icons">view_list</span>
            </button>
            <button 
              class="view-toggle-btn" 
              [class.active]="viewMode === 'grid'"
              (click)="setViewMode(ViewMode.GRID)"
            >
              <span class="material-icons">grid_view</span>
            </button>
          </div>
          
          <div class="sort-options">
            <select class="sort-select" (change)="onSortChange($event)">
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="date_desc">Date (Newest)</option>
              <option value="date_asc">Date (Oldest)</option>
              <option value="size_desc">Size (Largest)</option>
              <option value="size_asc">Size (Smallest)</option>
              <option value="type_asc">Type (A-Z)</option>
              <option value="type_desc">Type (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="favorites-content" *ngIf="!loading; else loadingTpl">
        <div *ngIf="favoriteFiles.length; else noFavoritesTpl">
          <app-file-list 
            *ngIf="viewMode === 'list'"
            [files]="sortedFiles"
            [selectedFiles]="selectedFiles"
            (fileClick)="onFileClick($event)"
            (fileDoubleClick)="onFileDoubleClick($event)"
            (fileSelect)="onFileSelect($event)"
          ></app-file-list>
          
          <app-file-grid
            *ngIf="viewMode === 'grid'"
            [files]="sortedFiles"
            [selectedFiles]="selectedFiles"
            (fileClick)="onFileClick($event)"
            (fileDoubleClick)="onFileDoubleClick($event)"
            (fileSelect)="onFileSelect($event)"
          ></app-file-grid>
        </div>
        
        <ng-template #noFavoritesTpl>
          <div class="no-favorites">
            <div class="no-favorites-content">
              <span class="material-icons no-favorites-icon">star_outline</span>
              <h3>No favorites</h3>
              <p>Add files to your favorites for quick access</p>
            </div>
          </div>
        </ng-template>
      </div>
      
      <ng-template #loadingTpl>
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading favorites...</p>
        </div>
      </ng-template>
      
      <app-file-actions 
        *ngIf="selectedFiles.length > 0"
        [selectedFiles]="selectedFiles"
        (clearSelection)="clearSelection()"
        (openFile)="onFileDoubleClick($event)"
        (renameFile)="onRenameFile($event)"
        (deleteFiles)="onDeleteFiles()"
        (moveFiles)="onMoveFiles($event)"
        (copyFiles)="onCopyFiles($event)"
        (toggleFavorite)="onToggleFavorite($event)"
      ></app-file-actions>
    </div>
  `,
  styles: [`
    .favorites-page {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .favorites-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }
    
    .favorites-header h2 {
      margin: 0;
    }
    
    .favorites-controls {
      display: flex;
      gap: var(--spacing-3);
    }
    
    .view-toggle {
      display: flex;
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    
    .view-toggle-btn {
      padding: var(--spacing-1) var(--spacing-2);
      color: var(--neutral-600);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .view-toggle-btn.active {
      background-color: var(--primary-500);
      color: white;
    }
    
    .sort-select {
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-md);
      border: 1px solid var(--neutral-200);
      background-color: white;
      font-size: 0.875rem;
      color: var(--neutral-800);
      cursor: pointer;
    }
    
    .favorites-content {
      flex: 1;
      overflow: auto;
    }
    
    .no-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
    }
    
    .no-favorites-content {
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }
    
    .no-favorites-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-3);
      color: var(--neutral-400);
    }
    
    .no-favorites h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-2);
      color: var(--neutral-800);
    }
    
    .no-favorites p {
      color: var(--neutral-600);
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 200px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--primary-500);
      animation: spin 1s ease-in-out infinite;
      margin-bottom: var(--spacing-3);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .favorites-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-3);
      }
      
      .favorites-controls {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favoriteFiles: FileItem[] = [];
  loading: boolean = true;
  public ViewMode: typeof ViewMode = ViewMode;
  viewMode: ViewMode = ViewMode.GRID;
  sortOption: SortOption = SortOption.NAME_ASC;
  selectedFiles: FileItem[] = [];
  
  get sortedFiles(): FileItem[] {
    return this.fileService.sortFiles(this.favoriteFiles, this.sortOption);
  }
  
  constructor(
    private router: Router,
    private fileService: FileService
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.fileService.getFavorites().subscribe(files => {
      this.favoriteFiles = files;
      this.loading = false;
    });
  }
  
  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }
  
  onSortChange(event: any): void {
    this.sortOption = event.target.value as SortOption;
  }
  
  onFileClick(file: FileItem): void {
    // Single selection
    this.selectedFiles = [file];
    this.fileService.selectFiles(this.selectedFiles);
  }
  
  onFileDoubleClick(file: FileItem): void {
    if (file.type === FileType.FOLDER) {
      this.router.navigate(['/folder', file.id]);
    } else {
      // Preview the file
      console.log('Opening file preview for:', file.name);
    }
  }
  
  onFileSelect(file: FileItem): void {
    const index = this.selectedFiles.findIndex(f => f.id === file.id);
    
    if (index === -1) {
      // Add to selection
      this.selectedFiles.push(file);
    } else {
      // Remove from selection
      this.selectedFiles.splice(index, 1);
    }
    
    this.fileService.selectFiles(this.selectedFiles);
  }
  
  clearSelection(): void {
    this.selectedFiles = [];
    this.fileService.clearSelection();
  }
  
  onRenameFile(file: FileItem): void {
    const newName = prompt('Enter new name:', file.name);
    
    if (newName && newName !== file.name) {
      this.fileService.renameItem(file.id, newName).subscribe(() => {
        // Refresh the favorites
        this.refreshFavorites();
      });
    }
  }
  
  onDeleteFiles(): void {
    const fileCount = this.selectedFiles.length;
    const confirmation = confirm(`Are you sure you want to delete ${fileCount} ${fileCount === 1 ? 'item' : 'items'}?`);
    
    if (confirmation) {
      const ids = this.selectedFiles.map(file => file.id);
      this.fileService.deleteItems(ids).subscribe(() => {
        this.clearSelection();
        this.refreshFavorites();
      });
    }
  }
  
  onMoveFiles(targetFolderId: string | null): void {
    const ids = this.selectedFiles.map(file => file.id);
    this.fileService.moveItems(ids, targetFolderId).subscribe(() => {
      this.clearSelection();
      this.refreshFavorites();
    });
  }
  
  onCopyFiles(targetFolderId: string | null): void {
    const ids = this.selectedFiles.map(file => file.id);
    this.fileService.copyItems(ids, targetFolderId).subscribe(() => {
      this.clearSelection();
      this.refreshFavorites();
    });
  }
  
  onToggleFavorite(file: FileItem): void {
    this.fileService.toggleFavorite(file.id).subscribe(() => {
      this.refreshFavorites();
    });
  }
  
  private refreshFavorites(): void {
    this.fileService.getFavorites().subscribe(files => {
      this.favoriteFiles = files;
    });
  }
}