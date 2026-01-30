
import { BiomeInfo, BiomeType } from './types';

export const GRID_SIZE = 100;

export const BIOMES: BiomeInfo[] = [
  { type: BiomeType.DEEP_OCEAN, color: '#1e3a8a', threshold: 0.30, label: '深海' },
  { type: BiomeType.OCEAN,      color: '#3b82f6', threshold: 0.45, label: '海' },
  { type: BiomeType.BEACH,      color: '#fde047', threshold: 0.50, label: '砂浜' },
  { type: BiomeType.GRASSLAND,  color: '#22c55e', threshold: 0.70, label: '草原' },
  { type: BiomeType.FOREST,     color: '#166534', threshold: 0.82, label: '森林' },
  { type: BiomeType.MOUNTAIN,   color: '#4b5563', threshold: 0.92, label: '山岳' },
  { type: BiomeType.SNOW,       color: '#ffffff', threshold: 1.00, label: '冠雪' },
];

export const DEFAULT_SETTINGS = {
  seed: Math.floor(Math.random() * 100000),
  scale: 30,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  heightMultiplier: 0.9,
  treeDensity: 0.2,
  villageDensity: 0.2,
  showStructures: true
};
