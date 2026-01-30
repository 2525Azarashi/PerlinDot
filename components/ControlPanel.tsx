
import React from 'react';
import { TerrainSettings } from '../types';
import { BIOMES } from '../constants';

interface ControlPanelProps {
  settings: TerrainSettings;
  onChange: (newSettings: TerrainSettings) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onChange }) => {
  const handleChange = (key: keyof TerrainSettings, value: number | boolean) => {
    onChange({ ...settings, [key]: value });
  };

  const randomizeSeed = () => {
    handleChange('seed', Math.floor(Math.random() * 1000000));
  };

  const Slider = ({ label, icon, value, min, max, step, onChangeKey }: { 
    label: string, icon: string, value: number, min: number, max: number, step: number, onChangeKey: keyof TerrainSettings 
  }) => (
    <div className="group/slider space-y-3">
      <div className="flex justify-between items-end">
        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-400 group-hover/slider:text-teal-400 transition-colors">
          <i className={`fas ${icon} text-teal-500 w-4`}></i>
          {label}
        </span>
        <span className="font-mono text-xs bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md text-teal-300 shadow-inner min-w-[3rem] text-center">
          {value.toFixed(2)}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(onChangeKey, parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-full appearance-none cursor-grab active:cursor-grabbing accent-teal-500 hover:accent-teal-400 transition-all focus:ring-2 focus:ring-teal-500/20 outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-3xl space-y-10 overflow-y-auto max-h-[85vh] scrollbar-hide">
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
            Control <span className="text-white">Matrix</span>
          </h2>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-slate-500 uppercase italic">Structures</span>
             <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.showStructures}
                onChange={(e) => handleChange('showStructures', e.target.checked)}
              />
              <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-white"></div>
            </label>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Seed Protocol</label>
              <input
                type="number"
                value={settings.seed}
                onChange={(e) => handleChange('seed', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-teal-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
              />
            </div>
            <button
              onClick={randomizeSeed}
              className="mt-6 w-12 h-12 flex items-center justify-center bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-xl text-teal-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/5"
              title="ランダムシード"
            >
              <i className="fas fa-dice-d20 text-lg"></i>
            </button>
          </div>

          <Slider label="Terrain Scale" icon="fa-maximize" value={settings.scale} min={5} max={100} step={1} onChangeKey="scale" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <Slider label="Vegetation" icon="fa-leaf" value={settings.treeDensity} min={0} max={1} step={0.01} onChangeKey="treeDensity" />
            <Slider label="Settlements" icon="fa-monument" value={settings.villageDensity} min={0} max={1} step={0.01} onChangeKey="villageDensity" />
          </div>
          
          <div className="pt-2">
             <Slider label="Height Exponent" icon="fa-mountain-sun" value={settings.heightMultiplier} min={0.5} max={3.0} step={0.05} onChangeKey="heightMultiplier" />
          </div>
        </div>
      </section>

      <section className="pt-8 border-t border-white/5">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
          Biome Legend
          <span className="text-[8px] border border-teal-900 px-2 py-0.5 rounded-full text-teal-800">DATA VIZ</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {BIOMES.map((biome) => (
            <div key={biome.type} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-white/5 transition-colors hover:border-teal-500/20 group">
              <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform" style={{ backgroundColor: biome.color }}></div>
              <span className="uppercase">{biome.label}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 bg-slate-900/40 p-3 rounded-xl border border-white/10">
            <div className="w-3 h-3 bg-slate-400/30 border border-slate-400/50 rounded-sm"></div>
            <span className="uppercase tracking-widest text-slate-400">Village Territories</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ControlPanel;
