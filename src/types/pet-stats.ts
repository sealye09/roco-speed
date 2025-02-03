import { stats } from '~/data/stats';

export const enhancedTuple = [
  -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6,
] as const;
// 能力值类型
export type StatType = (typeof stats)[number]['key'];
export type EnhanceValue = (typeof enhancedTuple)[number];

// 性格类型
export interface NatureType {
  name: string;
  boost?: StatType;
  reduce?: StatType;
}

// 修改天赋接口以匹配游戏属性名
export type IVStats = Record<StatType, number>;

// 修改计算配置接口
export interface StatsConfig {
  level: number; // 等级，默认100
  guardian: boolean; // 是否有守护兽
  effort: number; // 努力果数量 0-255
  nature: NatureType; // 性格
  iv: IVStats; // 天赋值 0-31
  enhanceRange: EnhanceValue[]; // 新增：选中的强化值范围
}

// 计算结果
export interface CalcResult {
  base: number;
  enhanced: Record<EnhanceValue, number>;
}

// 性格列表
export const NATURES: NatureType[] = [
  // 平衡性格（无加成减益）
  { name: '坦率' },
  { name: '害羞' },
  { name: '认真' },
  { name: '实干' },
  { name: '浮躁' },

  // 攻击加成系
  { name: '孤僻', boost: 'gongji', reduce: 'fangyu' },
  { name: '固执', boost: 'gongji', reduce: 'mougong' },
  { name: '调皮', boost: 'gongji', reduce: 'moufang' },
  { name: '勇敢', boost: 'gongji', reduce: 'sudu' },

  // 防御加成系
  { name: '大胆', boost: 'fangyu', reduce: 'gongji' },
  { name: '淘气', boost: 'fangyu', reduce: 'mougong' },
  { name: '无虑', boost: 'fangyu', reduce: 'moufang' },
  { name: '悠闲', boost: 'fangyu', reduce: 'sudu' },

  // 魔攻加成系
  { name: '保守', boost: 'mougong', reduce: 'gongji' },
  { name: '稳重', boost: 'mougong', reduce: 'fangyu' },
  { name: '马虎', boost: 'mougong', reduce: 'moufang' },
  { name: '冷静', boost: 'mougong', reduce: 'sudu' },

  // 魔防加成系
  { name: '沉着', boost: 'moufang', reduce: 'gongji' },
  { name: '温顺', boost: 'moufang', reduce: 'fangyu' },
  { name: '慎重', boost: 'moufang', reduce: 'mougong' },
  { name: '狂妄', boost: 'moufang', reduce: 'sudu' },

  // 速度加成系
  { name: '胆小', boost: 'sudu', reduce: 'gongji' },
  { name: '急躁', boost: 'sudu', reduce: 'fangyu' },
  { name: '开朗', boost: 'sudu', reduce: 'mougong' },
  { name: '天真', boost: 'sudu', reduce: 'moufang' },
];

// 添加性格列表分组显示
export const NATURE_GROUPS = [
  {
    label: '平衡性格',
    natures: NATURES.filter((n) => !n.boost),
  },
  {
    label: '攻击加成',
    natures: NATURES.filter((n) => n.boost === 'gongji'),
  },
  {
    label: '防御加成',
    natures: NATURES.filter((n) => n.boost === 'fangyu'),
  },
  {
    label: '魔攻加成',
    natures: NATURES.filter((n) => n.boost === 'mougong'),
  },
  {
    label: '魔防加成',
    natures: NATURES.filter((n) => n.boost === 'moufang'),
  },
  {
    label: '速度加成',
    natures: NATURES.filter((n) => n.boost === 'sudu'),
  },
];

// 添加一个工具函数来获取性格描述
export function getNatureDescription(nature: NatureType): string {
  if (!nature.boost) return '无特殊影响';
  const statNames: Record<StatType, string> = {
    jingli: '精力',
    gongji: '攻击',
    fangyu: '防御',
    mougong: '魔攻',
    moufang: '魔防',
    sudu: '速度',
  };
  return `${statNames[nature.boost]}+10% ${statNames[nature.reduce!]}-10%`;
}
