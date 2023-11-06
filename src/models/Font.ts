export type FontSettings = {
  fontSize: number;
  letterSpacing: number;
};

export interface Font {
  id: string;
  hash: string;
  name: string;
  required: boolean;
  fontSize: number;
  letterSpacing: number;
}

export interface NewFontData {
  file: File;
  name: string;
  fontSize: number;
  letterSpacing: number;
}

export interface UpdateFontData {
  name?: string;
  fontSize?: number;
  letterSpacing?: number;
}
