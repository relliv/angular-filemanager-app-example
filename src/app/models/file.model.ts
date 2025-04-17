export enum ViewMode {
  LIST = 'list',
  GRID = 'grid'
}

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  CODE = 'code',
  OTHER = 'other'
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  parentId: string | null;
  path: string[];
  extension?: string;
  modifiedDate: Date;
  createdDate: Date;
  favorite: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
  thumbnail?: string;
}

export interface FolderContent {
  id: string;
  parentId: string | null;
  name: string;
  path: string[];
  items: FileItem[];
}

export enum SortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  SIZE_ASC = 'size_asc',
  SIZE_DESC = 'size_desc',
  TYPE_ASC = 'type_asc',
  TYPE_DESC = 'type_desc'
}

export interface FilterOptions {
  query?: string;
  types?: FileType[];
  dateRange?: { from?: Date; to?: Date };
  tags?: string[];
  favorites?: boolean;
}