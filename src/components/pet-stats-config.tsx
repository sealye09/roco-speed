'use client';

import type { EnhanceValue, StatsConfig } from '~/types/pet-stats';

import { getStatLabel } from '~/data/stats';
import { cn } from '~/lib/utils';
import {
  enhancedTuple,
  NATURE_GROUPS,
  NATURES,
  type StatType,
} from '~/types/pet-stats';

import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './ui/select';
import { Switch } from './ui/switch';

interface PetStatsConfigProps {
  config: StatsConfig;
  onChange: (config: StatsConfig) => void;
}

export function PetStatsConfig({ config, onChange }: PetStatsConfigProps) {
  // 添加强化值范围选择
  const handleEnhanceRangeChange = (level: EnhanceValue, checked: boolean) => {
    onChange({
      ...config,
      enhanceRange: checked
        ? [...config.enhanceRange, level].sort((a, b) => a - b)
        : config.enhanceRange.filter((l) => l !== level),
    });
  };

  return (
    <div className='space-y-4'>
      <div className='grid gap-4'>
        <div className='flex items-center gap-4'>
          <Label className='w-16'>等级</Label>
          <Input
            type='number'
            min={1}
            max={100}
            value={config.level}
            onChange={(e) =>
              onChange({ ...config, level: parseInt(e.target.value) || 1 })
            }
            className='w-20'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2'>
            <Label className='w-16'>守护兽</Label>
            <Switch
              checked={config.guardian}
              onCheckedChange={(checked) =>
                onChange({ ...config, guardian: checked })
              }
            />
          </div>
          <div className='flex items-center gap-2'>
            <Label className='w-16'>努力果</Label>
            <Input
              type='number'
              min={0}
              max={255}
              value={config.effort}
              onChange={(e) =>
                onChange({ ...config, effort: parseInt(e.target.value) || 0 })
              }
              className='w-20'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label>性格</Label>
          <Select
            value={config.nature.name}
            onValueChange={(value) =>
              onChange({
                ...config,
                nature: NATURES.find((n) => n.name === value)!,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className='grid gap-1 p-1'>
                {NATURE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className='mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground'>
                      {group.label}
                    </div>
                    {group.natures.map((nature) => (
                      <SelectItem
                        key={nature.name}
                        value={nature.name}
                        className='flex items-center justify-between'
                      >
                        <span>{nature.name}</span>
                        {nature.boost && (
                          <span className='text-xs text-muted-foreground'>
                            {getStatLabel(nature.boost)}+10%{' '}
                            {getStatLabel(nature.reduce)}-10%
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>天赋值</Label>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                onChange({
                  ...config,
                  iv: Object.fromEntries(
                    Object.keys(config.iv).map((k) => [k, 31]),
                  ) as Record<StatType, number>,
                })
              }
            >
              全部最大
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {(Object.entries(config.iv) as [StatType, number][]).map(
              ([key, value]) => (
                <div key={key} className='flex items-center gap-2'>
                  <Label className='w-16'>{getStatLabel(key)}</Label>
                  <Input
                    type='number'
                    min={0}
                    max={31}
                    value={value}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        iv: {
                          ...config.iv,
                          [key]: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-16'
                  />
                </div>
              ),
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label>强化值范围</Label>
          <div className='grid grid-cols-3 gap-3'>
            {enhancedTuple.map((level) => (
              <div
                key={level}
                className='flex items-center justify-center gap-1.5'
              >
                <Checkbox
                  id={`enhance-${level}`}
                  checked={config.enhanceRange.includes(level)}
                  onCheckedChange={(checked) =>
                    handleEnhanceRangeChange(level, !!checked)
                  }
                  className='size-4'
                />
                <Label
                  htmlFor={`enhance-${level}`}
                  className={cn(
                    'text-xs',
                    level > 0
                      ? 'text-green-600'
                      : level < 0
                        ? 'text-red-600'
                        : '',
                  )}
                >
                  {level > 0 ? `+${level}` : level}
                </Label>
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-end gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                onChange({
                  ...config,
                  enhanceRange: [-1, 0, 1, 2],
                })
              }
            >
              常用
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                onChange({
                  ...config,
                  enhanceRange: [],
                })
              }
            >
              清空
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                onChange({
                  ...config,
                  enhanceRange: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
                })
              }
            >
              全选
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
