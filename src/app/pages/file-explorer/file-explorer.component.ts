import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { FileItem, FileType, FolderContent, SortOption, ViewMode } from '../../models/file.model';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FileListComponent } from '../../components/file-list/file-list.component';
import { FileGridComponent } from '../../components/file-grid/file-grid.component';
import { FileActionsComponent } from '../../components/file-actions/file-actions.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    FileListComponent,
    FileGridComponent,
    FileActionsComponent
  ],
  template: `
    <div class="file-explorer">
      <div class="explorer-header">
        <app-breadcrumb [path]="currentFolder?.path || []" [folderName]="currentFolder?.name || 'Root'"></app-breadcrumb>
        
        <div class="explorer-actions">
          <div class="view-toggle">
            <button 
              class="view-toggle-btn" 
              [class.active]="viewMode === ViewMode.LIST"
              (click)="setViewMode(ViewMode.LIST)"
            >
              <span class="material-icons">view_list</span>
            </button>
            <button 
              class="view-toggle-btn" 
              [class.active]="viewMode === ViewMode.GRID"
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
      
      <div class="explorer-content" *ngIf="!loading; else loadingTpl">
        <div *ngIf="currentFolder?.items?.length; else emptyFolderTpl">
          <app-file-list 
            *ngIf="viewMode === ViewMode.LIST"
            [files]="sortedFiles"
            [selectedFiles]="selectedFiles"
            (fileClick)="onFileClick($event)"
            (fileDoubleClick)="onFileDoubleClick($event)"
            (fileSelect)="onFileSelect($event)"
            (copyFiles)="onCopyFile($event)"
            (moveFiles)="onMoveFile($event)"
            (renameFile)="onRenameFile($event)"
            (deleteFiles)="onDeleteFiles()"
            (toggleFavorite)="onToggleFavorite($event)"
          ></app-file-list>
          
          <app-file-grid
            *ngIf="viewMode === ViewMode.GRID"
            [files]="sortedFiles"
            [selectedFiles]="selectedFiles"
            (fileClick)="onFileClick($event)"
            (fileDoubleClick)="onFileDoubleClick($event)"
            (fileSelect)="onFileSelect($event)"
            (copyFiles)="onCopyFile($event)"
            (moveFiles)="onMoveFile($event)"
            (renameFile)="onRenameFile($event)"
            (deleteFiles)="onDeleteFiles()"
            (toggleFavorite)="onToggleFavorite($event)"
          ></app-file-grid>
        </div>
        
        <ng-template #emptyFolderTpl>
          <div class="empty-folder">
            <div class="empty-folder-content">
              <span class="material-icons empty-icon">folder_open</span>
              <h3>This folder is empty</h3>
              <p>Drag and drop files here or use the upload button</p>
              <button class="empty-upload-btn">
                <span class="material-icons">cloud_upload</span>
                Upload Files
              </button>
            </div>
          </div>
        </ng-template>
      </div>
      
      <ng-template #loadingTpl>
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading files...</p>
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
    .file-explorer {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .explorer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 var(--spacing-3) 0;
      border-bottom: 1px solid var(--neutral-200);
      margin-bottom: var(--spacing-4);
    }
    
    .explorer-actions {
      display: flex;
      align-items: center;
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
    
    .explorer-content {
      flex: 1;
      overflow: auto;
      padding-bottom: var(--spacing-8);
    }
    
    .empty-folder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
      text-align: center;
    }
    
    .empty-folder-content {
      max-width: 400px;
      animation: fadeIn 0.5s ease-out;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-3);
      color: var(--neutral-400);
    }
    
    .empty-folder h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-2);
      color: var(--neutral-800);
    }
    
    .empty-folder p {
      margin-bottom: var(--spacing-4);
      color: var(--neutral-600);
    }
    
    .empty-upload-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background-color: var(--primary-500);
      color: white;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    
    .empty-upload-btn:hover {
      background-color: var(--primary-600);
      transform: translateY(-1px);
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
      .explorer-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-3);
      }
      
      .explorer-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class FileExplorerComponent implements OnInit {
  currentFolder: FolderContent | null = null;
  loading: boolean = true;
  viewMode: ViewMode = ViewMode.GRID;
  ViewMode = ViewMode; // Make enum available in template
  sortOption: SortOption = SortOption.NAME_ASC;
  selectedFiles: FileItem[] = [];
  
  get sortedFiles(): FileItem[] {
    if (!this.currentFolder) return [];
    return this.fileService.sortFiles(this.currentFolder.items, this.sortOption);
  }
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        const folderId = params.get('id');
        return this.fileService.getFilesInFolder(folderId);
      })
    ).subscribe(folderContent => {
      this.currentFolder = folderContent;
      this.loading = false;
      this.clearSelection();
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
        // Refresh the folder
        this.refreshCurrentFolder();
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
        this.refreshCurrentFolder();
      });
    }
  }
  
  onMoveFiles(targetFolderId: string|null): void {
    const ids = this.selectedFiles.map(file => file.id);
    this.fileService.moveItems(ids, targetFolderId).subscribe(() => {
      this.clearSelection();
      this.refreshCurrentFolder();
    });
  }
  
  onCopyFiles(targetFolderId: string|null): void {
    const ids = this.selectedFiles.map(file => file.id);
    this.fileService.copyItems(ids, targetFolderId).subscribe(() => {
      this.clearSelection();
      this.refreshCurrentFolder();
    });
  }
  
  onToggleFavorite(file: FileItem): void {
    this.fileService.toggleFavorite(file.id).subscribe(() => {
      this.refreshCurrentFolder();
    });
  }

  onCopyFile(file: FileItem): void {
    const ids = [file.id];
    this.fileService.copyItems(ids, null).subscribe(() => {
      this.refreshCurrentFolder();
    });
  }

  onMoveFile(file: FileItem): void {
    const ids = [file.id];
    this.fileService.moveItems(ids, null).subscribe(() => {
      this.refreshCurrentFolder();
    });
  }
  
  private refreshCurrentFolder(): void {
    this.route.paramMap.subscribe(params => {
      const folderId = params.get('id');
      this.fileService.getFilesInFolder(folderId).subscribe(folderContent => {
        this.currentFolder = folderContent;
      });
    });
  }
}