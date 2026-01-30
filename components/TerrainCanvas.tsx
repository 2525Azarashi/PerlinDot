
import React, { useRef, useEffect, useMemo } from 'react';
import { GRID_SIZE, BIOMES } from '../constants';
import { TerrainSettings, BiomeType, StructureType } from '../types';
import { noise } from '../services/noiseService';

interface TerrainCanvasProps {
  settings: TerrainSettings;
}

const TerrainCanvas: React.FC<TerrainCanvasProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const worldData = useMemo(() => {
    noise.reseed(settings.seed);
    const hMap = new Float32Array(GRID_SIZE * GRID_SIZE);
    const sMap = new Int8Array(GRID_SIZE * GRID_SIZE);
    const vMap = new Uint8Array(GRID_SIZE * GRID_SIZE);
    
    const civNoise = new Float32Array(GRID_SIZE * GRID_SIZE);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        civNoise[y * GRID_SIZE + x] = noise.getFractalNoise(x / 40, y / 40, 2, 0.5, 2.0);
      }
    }

    noise.reseed(settings.seed);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const nx = x / settings.scale;
        const ny = y / settings.scale;
        let h = noise.getFractalNoise(
          nx, 
          ny, 
          settings.octaves, 
          settings.persistence, 
          settings.lacunarity
        );
        h = Math.pow(h, settings.heightMultiplier);
        hMap[y * GRID_SIZE + x] = Math.max(0, Math.min(1, h));
        
        const height = hMap[y * GRID_SIZE + x];
        const civValue = civNoise[y * GRID_SIZE + x];
        const biome = BIOMES.find(b => height <= b.threshold) || BIOMES[BIOMES.length - 1];

        if (settings.showStructures) {
          const tileRandom = (Math.sin(x * 12.9898 + y * 78.233 + settings.seed) * 43758.5453) % 1;
          const absRandom = Math.abs(tileRandom);

          const isVillageTerritory = civValue > 0.68 && (biome.type === BiomeType.GRASSLAND || biome.type === BiomeType.BEACH);
          if (isVillageTerritory) {
            vMap[y * GRID_SIZE + x] = 1;
            if (absRandom < settings.villageDensity) {
              sMap[y * GRID_SIZE + x] = absRandom < 0.05 ? StructureType.TOWER : StructureType.BUILDING;
            }
          } else {
            if (biome.type === BiomeType.GRASSLAND) {
              if (absRandom < settings.treeDensity * 0.4) {
                sMap[y * GRID_SIZE + x] = StructureType.TREE;
              }
            }
          }
        }
      }
    }
    return { hMap, sMap, vMap };
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { hMap, sMap, vMap } = worldData;

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const height = hMap[y * GRID_SIZE + x];
        const structure = sMap[y * GRID_SIZE + x];
        const isVillage = vMap[y * GRID_SIZE + x];
        
        const biome = BIOMES.find(b => height <= b.threshold) || BIOMES[BIOMES.length - 1];
        
        const dx = x * cellSize;
        const dy = y * cellSize;
        const dw = cellSize;
        const dh = cellSize;

        // Base Terrain
        ctx.fillStyle = biome.color;
        ctx.fillRect(dx, dy, dw, dh);

        // Village Overlay (Emphasized Gray)
        if (settings.showStructures && isVillage) {
          // Gray settlement tint
          ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'; // Slate-400 tint
          ctx.fillRect(dx, dy, dw, dh);
          
          // Pattern for territory visualization
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
          const pSize = cellSize / 5;
          ctx.fillRect(dx, dy, pSize, pSize); // Top-left corner
          ctx.fillRect(dx + dw - pSize, dy + dh - pSize, pSize, pSize); // Bottom-right corner
        }

        // Structures
        if (settings.showStructures && structure !== StructureType.NONE) {
          const cx = x * cellSize + cellSize / 2;
          const cy = y * cellSize + cellSize / 2;

          if (structure === StructureType.TREE) {
            // Trunk (Rectangle)
            ctx.fillStyle = '#451a03';
            ctx.fillRect(cx - cellSize/10, cy + cellSize/10, cellSize/5, cellSize/4);
            // Foliage (Triangle)
            ctx.fillStyle = '#064e3b';
            ctx.beginPath();
            ctx.moveTo(cx, cy - cellSize/2.2);
            ctx.lineTo(cx - cellSize/2.5, cy + cellSize/6);
            ctx.lineTo(cx + cellSize/2.5, cy + cellSize/6);
            ctx.closePath();
            ctx.fill();
          } else if (structure === StructureType.BUILDING) {
            // Walls
            ctx.fillStyle = '#a8a29e';
            ctx.fillRect(cx - cellSize/3, cy - cellSize/8, cellSize/1.5, cellSize/2.5);
            // Roof (Triangle)
            ctx.fillStyle = '#782e1e';
            ctx.beginPath();
            ctx.moveTo(cx - cellSize/2.5, cy - cellSize/8);
            ctx.lineTo(cx + cellSize/2.5, cy - cellSize/8);
            ctx.lineTo(cx, cy - cellSize/2);
            ctx.closePath();
            ctx.fill();
          } else if (structure === StructureType.TOWER) {
            // Main Body
            ctx.fillStyle = '#475569';
            ctx.fillRect(cx - cellSize/4, cy - cellSize/3, cellSize/2, cellSize/1.5);
            // Roof (Pointy)
            ctx.fillStyle = '#991b1b';
            ctx.beginPath();
            ctx.moveTo(cx - cellSize/3, cy - cellSize/3);
            ctx.lineTo(cx + cellSize/3, cy - cellSize/3);
            ctx.lineTo(cx, cy - cellSize/1.2);
            ctx.closePath();
            ctx.fill();
            // Window
            ctx.fillStyle = '#fde047';
            ctx.fillRect(cx - cellSize/8, cy - cellSize/6, cellSize/4, cellSize/6);
          }
        }
      }
    }
  }, [worldData, settings.showStructures]);

  return (
    <div className="bg-[#020617] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-auto aspect-square cursor-crosshair transition-transform duration-700 hover:scale-[1.01] block"
      />
    </div>
  );
};

export default TerrainCanvas;
