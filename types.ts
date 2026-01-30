
export interface TerrainSettings {
  seed: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  heightMultiplier: number;
  treeDensity: number;
  villageDensity: number;
  showStructures: boolean;
}

export enum BiomeType {
  DEEP_OCEAN = 'DEEP_OCEAN',
  OCEAN = 'OCEAN',
  BEACH = 'BEACH',
  GRASSLAND = 'GRASSLAND',
  FOREST = 'FOREST',
  MOUNTAIN = 'MOUNTAIN',
  SNOW = 'SNOW'
}

export interface BiomeInfo {
  type: BiomeType;
  color: string;
  threshold: number;
  label: string;
}

export enum StructureType {
  NONE = 0,
  TREE = 1,
  BUILDING = 2,
  TOWER = 3
}
