import type { StatsConfig, CalcResult, StatType } from '~/types/pet-stats';

// 计算能力值
export function calculateStats(
  baseStats: number,
  config: StatsConfig,
  type: StatType,
): CalcResult {
  // 计算努力加成
  const effortBonus = Math.floor(config.effort / 4);

  // 基础计算
  const calcBase = (level: number) => {
    let base = Math.floor(
      type === 'jingli'
        ? ((baseStats * 2 + config.iv[type] + effortBonus) * level) / 100 + 10
        : ((baseStats * 2 + config.iv[type] + effortBonus) * level) / 100 + 5,
    );

    // 应用性格修正
    if (type !== 'jingli') {
      if (config.nature.boost === type) base *= 1.1;
      if (config.nature.reduce === type) base *= 0.9;
    }

    base = Math.floor(base);

    // 添加守护兽加成（在性格修正之后，强化值计算之前）
    if (config.guardian && type !== 'sudu') {
      base += 50;
    }

    return base;
  };

  // 计算强化值
  const calcEnhanced = (base: number, level: number) => {
    return level > 0
      ? Math.floor(base * (level / 2 + 1))
      : Math.floor(base / (Math.abs(level / 2) + 1));
  };

  const baseValue = calcBase(config.level);

  return {
    base: baseValue,
    enhanced: {
      [-6]: calcEnhanced(baseValue, -6),
      [-5]: calcEnhanced(baseValue, -5),
      [-4]: calcEnhanced(baseValue, -4),
      [-3]: calcEnhanced(baseValue, -3),
      [-2]: calcEnhanced(baseValue, -2),
      [-1]: calcEnhanced(baseValue, -1),
      [0]: baseValue,
      [1]: calcEnhanced(baseValue, 1),
      [2]: calcEnhanced(baseValue, 2),
      [3]: calcEnhanced(baseValue, 3),
      [4]: calcEnhanced(baseValue, 4),
      [5]: calcEnhanced(baseValue, 5),
      [6]: calcEnhanced(baseValue, 6),
    },
  };
}
