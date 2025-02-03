'use client';

import { Search } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

export interface FilterState {
  series: string[];
  markNoRange: {
    min: string;
    max: string;
  };
  name: string; // 新增名称筛选
}

interface PetFiltersProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  uniqueSeries: string[];
}

export function PetFilters({
  filterState,
  onFilterChange,
  uniqueSeries,
}: PetFiltersProps) {
  // 更新系别筛选
  const handleSeriesChange = (series: string, checked: boolean) => {
    onFilterChange({
      ...filterState,
      series: checked
        ? [...filterState.series, series]
        : filterState.series.filter((s) => s !== series),
    });
  };

  // 更新序号范围
  const handleMarkNoChange = (type: 'min' | 'max', value: string) => {
    onFilterChange({
      ...filterState,
      markNoRange: {
        ...filterState.markNoRange,
        [type]: value,
      },
    });
  };

  return (
    <div className='flex items-center space-x-3'>
      {/* 搜索框 */}
      <div className='relative w-44'>
        <Input
          placeholder='搜索宠物名称...'
          value={filterState.name}
          onChange={(e) =>
            onFilterChange({
              ...filterState,
              name: e.target.value,
            })
          }
          className='h-9 pl-8'
        />
        <Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      </div>

      {/* 系别选择 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='h-9 w-36 justify-between px-3 text-left font-normal'
          >
            {filterState.series.length
              ? `${filterState.series.length} 个系别`
              : '选择系别'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-3'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>选择系别</h4>
              <p className='text-xs text-muted-foreground'>可多选宠物系别</p>
            </div>
            <div className='grid max-h-[280px] gap-1.5 overflow-y-auto pr-1'>
              {uniqueSeries.map((series) => (
                <div key={series} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`series-${series}`}
                    checked={filterState.series.includes(series)}
                    onCheckedChange={(checked) =>
                      handleSeriesChange(series, !!checked)
                    }
                  />
                  <label htmlFor={`series-${series}`} className='text-sm'>
                    {series}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 序号范围 */}
      <div className='flex items-center space-x-2 text-sm'>
        <Input
          placeholder='最小'
          className='h-9 w-16'
          value={filterState.markNoRange.min}
          onChange={(e) => handleMarkNoChange('min', e.target.value)}
        />
        <span className='text-muted-foreground'>-</span>
        <Input
          placeholder='最大'
          className='h-9 w-16'
          value={filterState.markNoRange.max}
          onChange={(e) => handleMarkNoChange('max', e.target.value)}
        />
      </div>
    </div>
  );
}
