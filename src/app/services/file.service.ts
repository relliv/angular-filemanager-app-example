import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { FileItem, FileType, FolderContent, SortOption, FilterOptions } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private mockData: FileItem[] = [];
  private currentFolderId = new BehaviorSubject<string | null>(null);
  private selectedFiles = new BehaviorSubject<FileItem[]>([]);
  private openTabs = new BehaviorSubject<FileItem[]>([]);
  
  constructor() {
    this.initMockData();
  }

  private initMockData() {
    // Generate root folders
    const documents: FileItem = {
      id: 'documents',
      name: 'Documents',
      type: FileType.FOLDER,
      size: 0,
      parentId: null,
      path: ['documents'],
      modifiedDate: new Date('2023-06-15'),
      createdDate: new Date('2023-01-10'),
      favorite: false
    };

    const pictures: FileItem = {
      id: 'pictures',
      name: 'Pictures',
      type: FileType.FOLDER,
      size: 0,
      parentId: null,
      path: ['pictures'],
      modifiedDate: new Date('2023-07-20'),
      createdDate: new Date('2023-01-15'),
      favorite: true
    };

    const music: FileItem = {
      id: 'music',
      name: 'Music',
      type: FileType.FOLDER,
      size: 0,
      parentId: null,
      path: ['music'],
      modifiedDate: new Date('2023-05-10'),
      createdDate: new Date('2023-01-05'),
      favorite: false
    };

    const downloads: FileItem = {
      id: 'downloads',
      name: 'Downloads',
      type: FileType.FOLDER,
      size: 0,
      parentId: null,
      path: ['downloads'],
      modifiedDate: new Date('2023-08-01'),
      createdDate: new Date('2023-01-20'),
      favorite: false
    };

    // Generate files in documents
    const resume: FileItem = {
      id: 'resume',
      name: 'Resume.docx',
      type: FileType.DOCUMENT,
      extension: 'docx',
      size: 256000,
      parentId: 'documents',
      path: ['documents', 'resume'],
      modifiedDate: new Date('2023-09-10'),
      createdDate: new Date('2023-04-15'),
      favorite: true
    };

    const report: FileItem = {
      id: 'report',
      name: 'Annual Report.pdf',
      type: FileType.PDF,
      extension: 'pdf',
      size: 3400000,
      parentId: 'documents',
      path: ['documents', 'report'],
      modifiedDate: new Date('2023-08-20'),
      createdDate: new Date('2023-08-15'),
      favorite: false
    };

    const budget: FileItem = {
      id: 'budget',
      name: 'Budget 2023.xlsx',
      type: FileType.SPREADSHEET,
      extension: 'xlsx',
      size: 650000,
      parentId: 'documents',
      path: ['documents', 'budget'],
      modifiedDate: new Date('2023-07-05'),
      createdDate: new Date('2023-03-10'),
      favorite: false
    };

    // Add files in pictures
    const vacation: FileItem = {
      id: 'vacation',
      name: 'Vacation.jpg',
      type: FileType.IMAGE,
      extension: 'jpg',
      size: 2800000,
      parentId: 'pictures',
      path: ['pictures', 'vacation'],
      modifiedDate: new Date('2023-08-10'),
      createdDate: new Date('2023-08-05'),
      favorite: true,
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    };

    const profile: FileItem = {
      id: 'profile',
      name: 'Profile.png',
      type: FileType.IMAGE,
      extension: 'png',
      size: 1200000,
      parentId: 'pictures',
      path: ['pictures', 'profile'],
      modifiedDate: new Date('2023-06-15'),
      createdDate: new Date('2023-05-20'),
      favorite: false,
      thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    };

    // Add files in music
    const song1: FileItem = {
      id: 'song1',
      name: 'Favorite Song.mp3',
      type: FileType.AUDIO,
      extension: 'mp3',
      size: 4500000,
      parentId: 'music',
      path: ['music', 'song1'],
      modifiedDate: new Date('2023-04-10'),
      createdDate: new Date('2023-02-15'),
      favorite: true
    };

    const song2: FileItem = {
      id: 'song2',
      name: 'New Album.mp3',
      type: FileType.AUDIO,
      extension: 'mp3',
      size: 5200000,
      parentId: 'music',
      path: ['music', 'song2'],
      modifiedDate: new Date('2023-07-20'),
      createdDate: new Date('2023-07-15'),
      favorite: false
    };

    // Add files in downloads
    const app: FileItem = {
      id: 'app',
      name: 'Application.zip',
      type: FileType.ARCHIVE,
      extension: 'zip',
      size: 156000000,
      parentId: 'downloads',
      path: ['downloads', 'app'],
      modifiedDate: new Date('2023-08-05'),
      createdDate: new Date('2023-08-01'),
      favorite: false
    };

    const movie: FileItem = {
      id: 'movie',
      name: 'Movie.mp4',
      type: FileType.VIDEO,
      extension: 'mp4',
      size: 1250000000,
      parentId: 'downloads',
      path: ['downloads', 'movie'],
      modifiedDate: new Date('2023-08-10'),
      createdDate: new Date('2023-08-10'),
      favorite: false
    };

    // Add nested folder in documents
    const projects: FileItem = {
      id: 'projects',
      name: 'Projects',
      type: FileType.FOLDER,
      size: 0,
      parentId: 'documents',
      path: ['documents', 'projects'],
      modifiedDate: new Date('2023-07-15'),
      createdDate: new Date('2023-03-05'),
      favorite: false
    };

    // Add files in projects folder
    const project1: FileItem = {
      id: 'project1',
      name: 'Project Proposal.docx',
      type: FileType.DOCUMENT,
      extension: 'docx',
      size: 350000,
      parentId: 'projects',
      path: ['documents', 'projects', 'project1'],
      modifiedDate: new Date('2023-07-15'),
      createdDate: new Date('2023-06-10'),
      favorite: false
    };

    const project2: FileItem = {
      id: 'project2',
      name: 'Project Timeline.xlsx',
      type: FileType.SPREADSHEET,
      extension: 'xlsx',
      size: 520000,
      parentId: 'projects',
      path: ['documents', 'projects', 'project2'],
      modifiedDate: new Date('2023-07-15'),
      createdDate: new Date('2023-06-12'),
      favorite: false
    };

    // Put all mock data in the array
    this.mockData = [
      documents, pictures, music, downloads,
      resume, report, budget,
      vacation, profile,
      song1, song2,
      app, movie,
      projects, project1, project2
    ];
  }

  // Get files in a specific folder
  getFilesInFolder(folderId: string | null): Observable<FolderContent> {
    this.currentFolderId.next(folderId);
    
    let parentFolder: FileItem | undefined;
    let parentPath: string[] = [];
    let parentName = 'Root';
    
    if (folderId) {
      parentFolder = this.mockData.find(item => item.id === folderId);
      if (parentFolder) {
        parentPath = [...parentFolder.path];
        parentName = parentFolder.name;
      }
    }
    
    const items = this.mockData.filter(item => item.parentId === folderId);
    
    const folderContent: FolderContent = {
      id: folderId || 'root',
      parentId: parentFolder?.parentId || null,
      name: parentName,
      path: parentPath,
      items: items
    };
    
    // Simulate network delay
    return of(folderContent).pipe(delay(300));
  }

  // Get a file by ID
  getFileById(id: string): Observable<FileItem | undefined> {
    const file = this.mockData.find(item => item.id === id);
    return of(file).pipe(delay(200));
  }

  // Search files
  searchFiles(query: string): Observable<FileItem[]> {
    if (!query.trim()) {
      return of([]);
    }
    
    const results = this.mockData.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return of(results).pipe(delay(300));
  }

  // Get favorite files
  getFavorites(): Observable<FileItem[]> {
    const favorites = this.mockData.filter(item => item.favorite);
    return of(favorites).pipe(delay(300));
  }

  // Get recent files (last 30 days)
  getRecent(): Observable<FileItem[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recent = this.mockData.filter(item => 
      item.modifiedDate >= thirtyDaysAgo
    ).sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime());
    
    return of(recent).pipe(delay(300));
  }

  // Create a new folder
  createFolder(name: string, parentId: string | null): Observable<FileItem> {
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name,
      type: FileType.FOLDER,
      size: 0,
      parentId,
      path: parentId ? 
        [...(this.mockData.find(item => item.id === parentId)?.path || []), `folder_${Date.now()}`] : 
        [`folder_${Date.now()}`],
      modifiedDate: new Date(),
      createdDate: new Date(),
      favorite: false
    };
    
    this.mockData.push(newFolder);
    return of(newFolder).pipe(delay(300));
  }

  // Rename a file or folder
  renameItem(id: string, newName: string): Observable<FileItem> {
    const index = this.mockData.findIndex(item => item.id === id);
    
    if (index !== -1) {
      this.mockData[index] = {
        ...this.mockData[index],
        name: newName,
        modifiedDate: new Date()
      };
      
      return of(this.mockData[index]).pipe(delay(300));
    }
    
    return of(undefined as unknown as FileItem).pipe(delay(300));
  }

  // Delete files or folders
  deleteItems(ids: string[]): Observable<boolean> {
    ids.forEach(id => {
      // Find all child items recursively
      const childIds = this.findAllChildren(id);
      const allIdsToDelete = [id, ...childIds];
      
      // Remove all related items
      this.mockData = this.mockData.filter(item => !allIdsToDelete.includes(item.id));
    });
    
    return of(true).pipe(delay(400));
  }

  // Helper method to find all children of an item
  private findAllChildren(id: string): string[] {
    const directChildren = this.mockData
      .filter(item => item.parentId === id)
      .map(item => item.id);
      
    const nestedChildren = directChildren.flatMap(childId => this.findAllChildren(childId));
    
    return [...directChildren, ...nestedChildren];
  }

  // Move files to a new folder
  moveItems(ids: string[], newParentId: string | null): Observable<boolean> {
    ids.forEach(id => {
      const index = this.mockData.findIndex(item => item.id === id);
      
      if (index !== -1) {
        const targetParent = newParentId ? 
          this.mockData.find(item => item.id === newParentId) : 
          null;
          
        const newPath = targetParent ? 
          [...targetParent.path, this.mockData[index].id] : 
          [this.mockData[index].id];
          
        this.mockData[index] = {
          ...this.mockData[index],
          parentId: newParentId,
          path: newPath,
          modifiedDate: new Date()
        };
      }
    });
    
    return of(true).pipe(delay(500));
  }

  // Copy files to a new folder
  copyItems(ids: string[], newParentId: string | null): Observable<boolean> {
    ids.forEach(id => {
      const originalItem = this.mockData.find(item => item.id === id);
      
      if (originalItem) {
        const targetParent = newParentId ? 
          this.mockData.find(item => item.id === newParentId) : 
          null;
          
        const newId = `${originalItem.id}_copy_${Date.now()}`;
        const newPath = targetParent ? 
          [...targetParent.path, newId] : 
          [newId];
          
        const newItem: FileItem = {
          ...originalItem,
          id: newId,
          name: `${originalItem.name.split('.')[0]}_copy${originalItem.extension ? '.' + originalItem.extension : ''}`,
          parentId: newParentId,
          path: newPath,
          modifiedDate: new Date(),
          createdDate: new Date()
        };
        
        this.mockData.push(newItem);
        
        // If it's a folder, recursively copy its contents
        if (originalItem.type === FileType.FOLDER) {
          this.copyFolderContents(originalItem.id, newId);
        }
      }
    });
    
    return of(true).pipe(delay(600));
  }

  // Helper method to copy folder contents
  private copyFolderContents(originalFolderId: string, newFolderId: string): void {
    const children = this.mockData.filter(item => item.parentId === originalFolderId);
    
    children.forEach(child => {
      const newChildId = `${child.id}_copy_${Date.now()}`;
      const newChild: FileItem = {
        ...child,
        id: newChildId,
        parentId: newFolderId,
        path: [...this.mockData.find(item => item.id === newFolderId)!.path, newChildId],
        modifiedDate: new Date(),
        createdDate: new Date()
      };
      
      this.mockData.push(newChild);
      
      // Recursively copy if it's a folder
      if (child.type === FileType.FOLDER) {
        this.copyFolderContents(child.id, newChildId);
      }
    });
  }

  // Toggle favorite status for a file
  toggleFavorite(id: string): Observable<FileItem> {
    const index = this.mockData.findIndex(item => item.id === id);
    
    if (index !== -1) {
      this.mockData[index] = {
        ...this.mockData[index],
        favorite: !this.mockData[index].favorite
      };
      
      return of(this.mockData[index]).pipe(delay(200));
    }
    
    return of(undefined as unknown as FileItem).pipe(delay(200));
  }

  // Sort files based on the given option
  sortFiles(files: FileItem[], option: SortOption): FileItem[] {
    const sortedFiles = [...files];
    
    switch (option) {
      case SortOption.NAME_ASC:
        return sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
      case SortOption.NAME_DESC:
        return sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
      case SortOption.DATE_ASC:
        return sortedFiles.sort((a, b) => a.modifiedDate.getTime() - b.modifiedDate.getTime());
      case SortOption.DATE_DESC:
        return sortedFiles.sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime());
      case SortOption.SIZE_ASC:
        return sortedFiles.sort((a, b) => a.size - b.size);
      case SortOption.SIZE_DESC:
        return sortedFiles.sort((a, b) => b.size - a.size);
      case SortOption.TYPE_ASC:
        return sortedFiles.sort((a, b) => a.type.localeCompare(b.type));
      case SortOption.TYPE_DESC:
        return sortedFiles.sort((a, b) => b.type.localeCompare(a.type));
      default:
        return sortedFiles;
    }
  }

  // Filter files based on given options
  filterFiles(files: FileItem[], options: FilterOptions): FileItem[] {
    let filtered = [...files];
    
    if (options.query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(options.query!.toLowerCase())
      );
    }
    
    if (options.types && options.types.length) {
      filtered = filtered.filter(item => options.types!.includes(item.type));
    }
    
    if (options.dateRange) {
      if (options.dateRange.from) {
        filtered = filtered.filter(item => item.modifiedDate >= options.dateRange!.from!);
      }
      
      if (options.dateRange.to) {
        filtered = filtered.filter(item => item.modifiedDate <= options.dateRange!.to!);
      }
    }
    
    if (options.tags && options.tags.length) {
      filtered = filtered.filter(item => 
        item.tags && options.tags!.some(tag => item.tags!.includes(tag))
      );
    }
    
    if (options.favorites !== undefined) {
      filtered = filtered.filter(item => item.favorite === options.favorites);
    }
    
    return filtered;
  }

  // Selected files operations
  selectFiles(files: FileItem[]): void {
    this.selectedFiles.next(files);
  }
  
  addToSelection(file: FileItem): void {
    const currentSelection = this.selectedFiles.value;
    if (!currentSelection.some(f => f.id === file.id)) {
      this.selectedFiles.next([...currentSelection, file]);
    }
  }
  
  removeFromSelection(file: FileItem): void {
    const currentSelection = this.selectedFiles.value;
    this.selectedFiles.next(currentSelection.filter(f => f.id !== file.id));
  }
  
  clearSelection(): void {
    this.selectedFiles.next([]);
  }
  
  getSelectedFiles(): Observable<FileItem[]> {
    return this.selectedFiles.asObservable();
  }
  
  getCurrentFolderId(): Observable<string | null> {
    return this.currentFolderId.asObservable();
  }

  // Add new methods for tab management
  getOpenTabs(): Observable<FileItem[]> {
    return this.openTabs.asObservable();
  }
  
  addTab(folder: FileItem): void {
    const currentTabs = this.openTabs.value;
    if (!currentTabs.some(tab => tab.id === folder.id)) {
      this.openTabs.next([...currentTabs, folder]);
    }
  }
  
  removeTab(folder: FileItem): void {
    const currentTabs = this.openTabs.value;
    this.openTabs.next(currentTabs.filter(tab => tab.id !== folder.id));
  }
  
  clearTabs(): void {
    this.openTabs.next([]);
  }
}