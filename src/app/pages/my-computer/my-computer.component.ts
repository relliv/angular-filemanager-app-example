import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileItem, FileType, ViewMode } from '../../models/file.model';
import { FileGridComponent } from '../../components/file-grid/file-grid.component';
import { FileListComponent } from '../../components/file-list/file-list.component';

interface DriveInfo {
  id: string;
  name: string;
  type: 'system' | 'local' | 'network' | 'removable';
  totalSpace: number;
  usedSpace: number;
  icon: string;
}

@Component({
  selector: 'app-my-computer',
  standalone: true,
  imports: [CommonModule, FileGridComponent, FileListComponent],
  template: `
    <div class="my-computer">
      <div class="page-header">
        <h2>
          <span class="material-icons header-icon">computer</span>
          My Computer
        </h2>
        
        <div class="view-controls">
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
        </div>
      </div>

      <div class="drives-section">
        <h3>Devices and Drives</h3>
        
        <app-file-grid
          *ngIf="viewMode === ViewMode.GRID"
          [files]="driveItems"
          [selectedFiles]="selectedItems"
          (fileClick)="onItemClick($event)"
          (fileDoubleClick)="onItemDoubleClick($event)"
          (fileSelect)="onItemSelect($event)"
        ></app-file-grid>
        
        <app-file-list
          *ngIf="viewMode === ViewMode.LIST"
          [files]="driveItems"
          [selectedFiles]="selectedItems"
          (fileClick)="onItemClick($event)"
          (fileDoubleClick)="onItemDoubleClick($event)"
          (fileSelect)="onItemSelect($event)"
        ></app-file-list>
      </div>

      <div class="folders-section">
        <h3>System Folders</h3>
        
        <app-file-grid
          *ngIf="viewMode === ViewMode.GRID"
          [files]="systemFolders"
          [selectedFiles]="selectedItems"
          (fileClick)="onItemClick($event)"
          (fileDoubleClick)="onItemDoubleClick($event)"
          (fileSelect)="onItemSelect($event)"
        ></app-file-grid>
        
        <app-file-list
          *ngIf="viewMode === ViewMode.LIST"
          [files]="systemFolders"
          [selectedFiles]="selectedItems"
          (fileClick)="onItemClick($event)"
          (fileDoubleClick)="onItemDoubleClick($event)"
          (fileSelect)="onItemSelect($event)"
        ></app-file-list>
      </div>
    </div>
  `,
  styles: [`
    .my-computer {
      padding: var(--spacing-4);
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-6);
    }
    
    .page-header h2 {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin: 0;
    }
    
    .header-icon {
      font-size: 2rem;
      color: var(--primary-500);
    }
    
    .view-controls {
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
    
    .drives-section,
    .folders-section {
      margin-bottom: var(--spacing-6);
    }
    
    .drives-section h3,
    .folders-section h3 {
      font-size: 1.125rem;
      color: var(--neutral-700);
      margin-bottom: var(--spacing-4);
    }
    
    @media (max-width: 768px) {
      .my-computer {
        padding: var(--spacing-2);
      }
      
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-3);
      }
      
      .view-controls {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class MyComputerComponent implements OnInit {
  viewMode: ViewMode = ViewMode.GRID;
  ViewMode = ViewMode; // Make enum available in template
  selectedItems: FileItem[] = [];
  driveItems: FileItem[] = [];
  systemFolders: FileItem[] = [];

  private drives: DriveInfo[] = [
    {
      id: 'c',
      name: 'Local Disk (C:)',
      type: 'system',
      totalSpace: 512000000000, // 512 GB
      usedSpace: 256000000000,  // 256 GB
      icon: 'drive_file_move'
    },
    {
      id: 'd',
      name: 'Data (D:)',
      type: 'local',
      totalSpace: 1000000000000, // 1 TB
      usedSpace: 750000000000,   // 750 GB
      icon: 'storage'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Convert drives to FileItems
    this.driveItems = this.drives.map(drive => ({
      id: drive.id,
      name: drive.name,
      type: FileType.FOLDER,
      size: drive.totalSpace,
      parentId: null,
      path: [drive.id],
      modifiedDate: new Date(),
      createdDate: new Date(),
      favorite: false,
      metadata: {
        isDrive: true,
        driveType: drive.type,
        totalSpace: drive.totalSpace,
        usedSpace: drive.usedSpace,
        icon: drive.icon
      }
    }));

    // Create system folders
    this.systemFolders = [
      {
        id: 'desktop',
        name: 'Desktop',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['desktop'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'desktop_windows'
        }
      },
      {
        id: 'documents',
        name: 'Documents',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['documents'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'description'
        }
      },
      {
        id: 'downloads',
        name: 'Downloads',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['downloads'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'download'
        }
      },
      {
        id: 'pictures',
        name: 'Pictures',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['pictures'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'photo_library'
        }
      },
      {
        id: 'music',
        name: 'Music',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['music'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'library_music'
        }
      },
      {
        id: 'videos',
        name: 'Videos',
        type: FileType.FOLDER,
        size: 0,
        parentId: null,
        path: ['videos'],
        modifiedDate: new Date(),
        createdDate: new Date(),
        favorite: false,
        metadata: {
          isSystemFolder: true,
          icon: 'video_library'
        }
      }
    ];
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  onItemClick(item: FileItem): void {
    this.selectedItems = [item];
  }

  onItemDoubleClick(item: FileItem): void {
    this.router.navigate(['/folder', item.id]);
  }

  onItemSelect(item: FileItem): void {
    const index = this.selectedItems.findIndex(i => i.id === item.id);
    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }
}