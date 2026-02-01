export type YarnCategory = 
  | 'LACE' 
  | 'FINGERING' 
  | 'SPORT' 
  | 'DK' 
  | 'WORSTED' 
  | 'ARAN' 
  | 'BULKY' 
  | 'SUPER_BULKY';

export interface YarnResponse {
  id: number;
  name: string;
  brand: string | null;
  color: string | null;
  category: YarnCategory;
  weightInGrams: number | null;
  lengthInMeters: number | null;
  fiberContent: string | null;
  quantity: number;
  folderId: number | null;
  folderName: string | null;
  pricePerUnit: number | null;
  currencyCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface YarnRequest {
  name: string;
  brand?: string;
  color?: string;
  category: YarnCategory;
  weightInGrams?: number;
  lengthInMeters?: number;
  fiberContent?: string;
  quantity: number;
  folderId?: number;
  pricePerUnit?: number;
  currencyCode?: string;
}
