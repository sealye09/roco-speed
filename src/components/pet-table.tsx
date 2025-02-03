'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  type Row,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Settings2,
  Heart,
  Shield,
  Swords,
  Zap,
  SendHorizonal,
  ShieldPlus,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

import type { Pet } from '~/types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { stats } from '~/data/stats';
import { cn } from '~/lib/utils';
import { NATURES, StatType, type StatsConfig } from '~/types/pet-stats';
import { calculateStats } from '~/utils/pet-stats';

import { PetFilters, type FilterState } from './pet-filters';
import { PetStatsConfig } from './pet-stats-config';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const optionalColumns = [
  { key: 'markno', label: '序号' },
  { key: 'name', label: '宠物名' },
  ...stats,
  { key: 'all', label: '总和' },
  { key: 'series', label: '系别' },
  { key: 'enhanced', label: '强化' }, // 添加新的强化列
] as const;

type TableColumnFilter = Record<
  (typeof optionalColumns)[number]['key'],
  boolean
>;

export function PetTable({ pets }: { pets: Pet[] }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<TableColumnFilter>({
    markno: true,
    name: true,
    jingli: false,
    gongji: false,
    fangyu: false,
    mougong: false,
    moufang: false,
    sudu: true,
    all: false,
    series: true,
    enhanced: true,
  });

  // 将筛选状态合并为一个对象
  const [filterState, setFilterState] = useState<FilterState>({
    series: [],
    markNoRange: { min: '', max: '' },
    name: '', // 添加名称筛选初始值
  });

  // 添加状态
  const [statsConfig, setStatsConfig] = useState<StatsConfig>({
    level: 100,
    guardian: true,
    effort: 255,
    nature: NATURES[0],
    iv: {
      jingli: 31,
      gongji: 31,
      fangyu: 31,
      mougong: 31,
      moufang: 31,
      sudu: 31,
    },
    enhanceRange: [-1, 0, 1, 2], // 添加默认范围
  });

  // 缓存系别列表计算
  const uniqueSeries = useMemo(
    () =>
      Array.from(new Set(pets.flatMap((pet) => pet.series.split('|'))))
        .filter(Boolean)
        .sort(),
    [pets],
  );

  // 添加属性图标映射
  const statIcons = useMemo(
    () => ({
      jingli: <Heart className='size-4' />,
      gongji: <Swords className='size-4' />,
      fangyu: <Shield className='size-4' />,
      mougong: <Zap className='size-4' />,
      moufang: <ShieldPlus className='size-4' />,
      sudu: <SendHorizonal className='size-4' />,
    }),
    [],
  );

  // 缓存列定义
  const columns = useMemo<ColumnDef<Pet>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
      },
      {
        accessorKey: 'img',
        header: '图片',
        cell: ({ row }) => (
          <img
            src={row.original.img}
            alt={row.original.name}
            className='size-16 object-contain'
          />
        ),
      },
      ...optionalColumns
        .filter((col) => {
          if (col.key === 'enhanced') {
            return (
              columnVisibility.enhanced &&
              (columnVisibility.jingli ||
                columnVisibility.gongji ||
                columnVisibility.fangyu ||
                columnVisibility.mougong ||
                columnVisibility.moufang ||
                columnVisibility.sudu)
            );
          }
          return columnVisibility[col.key];
        })
        .map((col) => {
          if (col.key === 'enhanced') {
            return {
              id: 'enhanced',
              header: col.label,
              cell: ({ row }: { row: Row<Pet> }) => {
                // 筛选出当前可见的属性列
                const visibleStats = stats.filter(
                  ({ key }) => columnVisibility[key],
                );

                return (
                  <Accordion type='multiple' className='w-full space-y-1'>
                    {visibleStats.map(({ key, label }) => {
                      const value = row.original[key];
                      const result = calculateStats(value, statsConfig, key);

                      return (
                        <AccordionItem
                          key={key}
                          value={`${row.id}-${key}`}
                          className='border-0 bg-transparent'
                        >
                          <AccordionTrigger className='flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted/50 hover:no-underline'>
                            <div className='flex min-w-[120px] flex-1 items-center gap-2'>
                              <span className='text-muted-foreground'>
                                {statIcons[key]}
                              </span>
                              <span className='font-medium'>{label}</span>
                              <div className='flex items-center gap-1'>
                                <span>{value}</span>
                                <span className='text-sm text-muted-foreground'>
                                  →
                                </span>
                                <span className='font-medium'>
                                  {result.base}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='px-3 pb-2 pt-1'>
                            <div className='grid-cols-13 grid gap-1 rounded-md bg-muted/50 p-2'>
                              {statsConfig.enhanceRange.map((level) => (
                                <div
                                  key={level}
                                  className={cn(
                                    'flex items-center justify-center rounded px-1 py-0.5',
                                    level === 0
                                      ? 'bg-primary/10 font-medium'
                                      : 'bg-background',
                                    level > 0
                                      ? 'text-green-600'
                                      : level < 0
                                        ? 'text-red-600'
                                        : '',
                                  )}
                                  title={`${level}级`}
                                >
                                  {result.enhanced[level]}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                );
              },
            };
          }

          // 修改普通属性列的显示
          if (stats.map((item) => item.key).includes(col.key as StatType)) {
            return {
              accessorKey: col.key,
              header: col.label,
              cell: ({ row }: { row: Row<Pet> }) => {
                const value = row.getValue<number>(col.key);
                const key = col.key as StatType;
                const result = calculateStats(value, statsConfig, key);

                return (
                  <div className='flex items-center gap-2'>
                    <span>{value}</span>
                    <span className='text-sm text-muted-foreground'>→</span>
                    <span className='font-medium'>{result.base}</span>
                  </div>
                );
              },
            };
          }

          return {
            accessorKey: col.key,
            header: col.label,
          };
        }),
    ],
    [columnVisibility, statsConfig, statIcons], // 移除 expandedStats，因为使用了 Accordion 的内置状态
  );

  // 在 useReactTable 之前添加过滤函数
  const filterFn = useCallback(
    (row: Row<Pet>): boolean => {
      // 名称筛选
      if (filterState.name) {
        const petName = row.original.name.toLowerCase();
        const searchName = filterState.name.toLowerCase();
        if (!petName.includes(searchName)) {
          return false;
        }
      }

      // 系别筛选
      if (filterState.series.length > 0) {
        const petSeries = row.original.series.split('|');
        if (!petSeries.some((series) => filterState.series.includes(series))) {
          return false;
        }
      }

      // 序号范围筛选
      const { min, max } = filterState.markNoRange;
      const markNo = parseInt(row.original.markno);

      if (min && !isNaN(parseInt(min)) && markNo < parseInt(min)) {
        return false;
      }
      if (max && !isNaN(parseInt(max)) && markNo > parseInt(max)) {
        return false;
      }

      return true;
    },
    [filterState],
  );

  // 修改 useReactTable 配置，添加过滤相关设置
  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10, // 每页显示10条数据
      },
    },
    state: {
      rowSelection,
      columnVisibility,
      globalFilter: filterState, // 添加过滤状态
    },
    globalFilterFn: filterFn, // 添加过滤函数
  });

  // 修正页码计算的依赖
  const pageRange = useMemo(() => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const delta = 2; // 当前页码前后显示的页数

    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    // 计算需要显示的页码范围
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 || // 第一页
        i === totalPages - 1 || // 最后一页
        (i >= currentPage - delta && i <= currentPage + delta) // 当前页码前后的页
      ) {
        range.push(i);
      }
    }

    // 添加页码和省略号
    let prev: number | null = null;
    for (const i of range) {
      if (prev !== null) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().pagination.pageIndex, table.getPageCount()]);

  // 优化回调函数
  const handleColumnVisibilityChange = useCallback(
    (key: string, checked: boolean) => {
      setColumnVisibility((prev) => ({
        ...prev,
        [key]: checked,
      }));
    },
    [],
  );

  // 添加页码大小选项
  const pageSizeOptions = [10, 20, 30, 50, 100];

  // 处理页码大小变化
  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      table.setPageSize(Number(newSize));
    },
    [table],
  );

  const hasNoData = table.getRowModel().rows.length === 0;

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='icon'>
              <Settings2 className='size-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='grid gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium leading-none'>显示列</h4>
                <p className='text-sm text-muted-foreground'>
                  选择要显示的属性列
                </p>
              </div>
              <div className='grid gap-2'>
                {optionalColumns.map(({ key, label }) => (
                  <div key={key} className='flex items-center space-x-2'>
                    <Checkbox
                      id={key}
                      checked={columnVisibility[key]}
                      onCheckedChange={(checked) =>
                        handleColumnVisibilityChange(key, !!checked)
                      }
                    />
                    <Label
                      htmlFor={key}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <PetFilters
          filterState={filterState}
          onFilterChange={setFilterState}
          uniqueSeries={uniqueSeries}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              <Settings className='mr-2 size-4' />
              能力值配置
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <PetStatsConfig config={statsConfig} onChange={setStatsConfig} />
          </PopoverContent>
        </Popover>

        <div className='ml-auto'>
          已选择: {Object.keys(rowSelection).length} 个
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasNoData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!hasNoData && (
        <div className='flex min-h-[36px] items-center justify-between gap-2 px-2'>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>每页</span>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className='h-8 w-[62px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>条</span>
              <span className='mx-1'>·</span>
              <span>共 {table.getFilteredRowModel().rows.length} 条</span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <span className='whitespace-nowrap text-sm text-muted-foreground'>
              {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()} 页
            </span>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => table.previousPage()}
                    size='default'
                    className={cn(
                      'gap-1 pr-2.5 cursor-pointer flex items-center justify-center',
                      !table.getCanPreviousPage() &&
                        'pointer-events-none opacity-50',
                      'h-8 min-w-8 px-2',
                    )}
                    aria-label='上一页'
                  >
                    <ChevronLeft className='size-4' />
                    <span>上一页</span>
                  </PaginationLink>
                </PaginationItem>

                {pageRange.map((pageIndex, i) => (
                  <PaginationItem key={i}>
                    {pageIndex === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => table.setPageIndex(Number(pageIndex))}
                        isActive={
                          table.getState().pagination.pageIndex === pageIndex
                        }
                        className='h-8 min-w-8 cursor-pointer px-3'
                      >
                        {Number(pageIndex) + 1}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationLink
                    onClick={() => table.nextPage()}
                    size='default'
                    className={cn(
                      'gap-1 pr-2.5 cursor-pointer flex items-center justify-center',
                      !table.getCanNextPage() &&
                        'pointer-events-none opacity-50',
                      'h-8 min-w-8 px-2',
                    )}
                    aria-label='下一页'
                  >
                    <ChevronRight className='size-4' />
                    <span>下一页</span>
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
