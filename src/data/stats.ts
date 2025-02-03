import { StatType } from '~/types/pet-stats';

export const stats = [
  { key: 'jingli', label: '精力' },
  { key: 'gongji', label: '攻击' },
  { key: 'fangyu', label: '防御' },
  { key: 'mougong', label: '魔攻' },
  { key: 'moufang', label: '魔防' },
  { key: 'sudu', label: '速度' },
] as const;

export function getStatLabel(key?: StatType) {
  return stats.find((item) => item.key === key)?.label ?? '';
}
