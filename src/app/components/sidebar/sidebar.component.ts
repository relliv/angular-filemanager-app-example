import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FileType } from '../../models/file.model';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <li class="sidebar-menu-item">
            <a 
              routerLink="/" 
              routerLinkActive="active" 
              [routerLinkActiveOptions]="{exact: true}"
              class="sidebar-link"
            >
              <span class="material-icons">folder</span>
              <span class="sidebar-text">All Files</span>
            </a>
          </li>
          <li class="sidebar-menu-item">
            <a 
              routerLink="/recent" 
              routerLinkActive="active" 
              class="sidebar-link"
            >
              <span class="material-icons">history</span>
              <span class="sidebar-text">Recent</span>
            </a>
          </li>
          <li class="sidebar-menu-item">
            <a 
              routerLink="/favorites" 
              routerLinkActive="active" 
              class="sidebar-link"
            >
              <span class="material-icons">star</span>
              <span class="sidebar-text">Favorites</span>
            </a>
          </li>
          <li class="sidebar-menu-item">
            <a 
              routerLink="/trash" 
              routerLinkActive="active" 
              class="sidebar-link"
            >
              <span class="material-icons">delete</span>
              <span class="sidebar-text">Trash</span>
            </a>
          </li>
        </ul>
        
        <div class="sidebar-divider"></div>
        
        <div class="sidebar-section">
          <h3 class="sidebar-heading">Folders</h3>
          <ul class="sidebar-menu folder-menu">
            <li class="sidebar-menu-item" *ngFor="let folder of rootFolders">
              <a 
                [routerLink]="['/folder', folder.id]" 
                routerLinkActive="active" 
                class="sidebar-link"
              >
                <span class="material-icons" [ngClass]="getFolderIconClass(folder.name)">folder</span>
                <span class="sidebar-text">{{ folder.name }}</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-section sidebar-footer">
          <div class="storage-info">
            <div class="storage-usage">
              <div class="storage-progress">
                <div class="storage-progress-bar" [style.width.%]="storagePercentage"></div>
              </div>
              <div class="storage-text">{{ usedStorage }} of {{ totalStorage }} used</div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100%;
      background-color: white;
      border-right: 1px solid var(--neutral-200);
      overflow-y: auto;
      transition: width var(--transition-normal);
    }
    
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--spacing-3);
    }
    
    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-menu-item {
      margin-bottom: var(--spacing-1);
    }
    
    .sidebar-link {
      display: flex;
      align-items: center;
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--radius-md);
      color: var(--neutral-800);
      text-decoration: none;
      transition: all var(--transition-fast);
      gap: var(--spacing-2);
    }
    
    .sidebar-link:hover {
      background-color: var(--neutral-100);
    }
    
    .sidebar-link.active {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }
    
    .sidebar-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .sidebar-divider {
      height: 1px;
      background-color: var(--neutral-200);
      margin: var(--spacing-3) 0;
    }
    
    .sidebar-heading {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--neutral-600);
      padding: var(--spacing-2) var(--spacing-3);
      margin: 0;
    }
    
    .sidebar-section {
      margin-bottom: var(--spacing-4);
    }
    
    .sidebar-footer {
      margin-top: auto;
    }
    
    .storage-info {
      padding: var(--spacing-3);
      background-color: var(--neutral-50);
      border-radius: var(--radius-md);
    }
    
    .storage-usage {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }
    
    .storage-progress {
      height: 4px;
      background-color: var(--neutral-200);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .storage-progress-bar {
      height: 100%;
      background-color: var(--primary-500);
      border-radius: 2px;
      transition: width var(--transition-normal);
    }
    
    .storage-text {
      font-size: 0.75rem;
      color: var(--neutral-600);
    }
    
    .folder-documents {
      color: var(--primary-500);
    }
    
    .folder-pictures {
      color: var(--accent-500);
    }
    
    .folder-music {
      color: var(--warning-500);
    }
    
    .folder-downloads {
      color: var(--success-500);
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--neutral-200);
      }
      
      .sidebar-nav {
        flex-direction: row;
        justify-content: space-between;
        padding: var(--spacing-2);
      }
      
      .sidebar-menu {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: var(--spacing-2);
      }
      
      .sidebar-menu-item {
        margin-bottom: 0;
        margin-right: var(--spacing-2);
      }
      
      .sidebar-link {
        padding: var(--spacing-2);
      }
      
      .sidebar-text {
        display: none;
      }
      
      .sidebar-divider,
      .sidebar-heading,
      .folder-menu,
      .storage-info {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  rootFolders: any[] = [];
  storagePercentage: number = 65;
  usedStorage: string = '6.5 GB';
  totalStorage: string = '10 GB';
  
  constructor(
    private fileService: FileService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadRootFolders();
  }
  
  loadRootFolders(): void {
    this.fileService.getFilesInFolder(null).subscribe(folderContent => {
      this.rootFolders = folderContent.items.filter(item => item.type === FileType.FOLDER);
    });
  }
  
  getFolderIconClass(folderName: string): string {
    const normalizedName = folderName.toLowerCase();
    
    if (normalizedName.includes('document')) return 'folder-documents';
    if (normalizedName.includes('picture') || normalizedName.includes('image') || normalizedName.includes('photo')) return 'folder-pictures';
    if (normalizedName.includes('music') || normalizedName.includes('audio') || normalizedName.includes('sound')) return 'folder-music';
    if (normalizedName.includes('download')) return 'folder-downloads';
    
    return '';
  }
}