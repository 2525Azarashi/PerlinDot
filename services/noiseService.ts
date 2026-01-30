
/**
 * A simple 2D Noise implementation.
 * Uses a permutation-based approach to generate smooth gradients.
 */
class NoiseGenerator {
  private p: number[] = new Array(512);

  constructor(seed: number) {
    this.reseed(seed);
  }

  public reseed(seed: number) {
    const permutation = Array.from({ length: 256 }, (_, i) => i);
    
    // Simple LCG based shuffle with seed
    let s = seed;
    const nextRand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(nextRand() * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }

    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i % 256];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  public perlin2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const p = this.p;
    const A = p[X] + Y, AA = p[A], AB = p[A + 1];
    const B = p[X + 1] + Y, BA = p[B], BB = p[B + 1];

    return this.lerp(v, 
      this.lerp(u, this.grad(p[AA], x, y), this.grad(p[BA], x - 1, y)),
      this.lerp(u, this.grad(p[AB], x, y - 1), this.grad(p[BB], x - 1, y - 1))
    );
  }

  public getFractalNoise(x: number, y: number, octaves: number, persistence: number, lacunarity: number): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.perlin2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    // Normalize to 0-1
    return (total / maxValue + 1) / 2;
  }
}

export const noise = new NoiseGenerator(42);
