# DataTable 数据表格组件

## 组件描述

DataTable 是一个功能完整的数据表格组件，支持以下特性：
- 自定义列配置
- 行选择
- 分页
- 排序
- 加载状态
- 空状态
- 固定表头
- 表格大小调整
- 斑马纹
- 边框样式
- 行点击事件

## Props 说明

```typescript
interface DataTableProps<T = any> {
  // 表格列定义
  columns: TableColumn<T>[]
  // 数据源
  dataSource: T[]
  // 加载状态
  loading?: boolean
  // 是否显示序号
  showIndex?: boolean
  // 是否显示选择框
  rowSelection?: {
    selectedRowKeys: string[]
    onChange: (selectedRowKeys: string[]) => void
  }
  // 分页配置
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  // 行点击事件
  onRowClick?: (record: T) => void
  // 空状态配置
  emptyConfig?: {
    title?: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  // 表格大小
  size?: 'default' | 'small' | 'large'
  // 是否显示边框
  bordered?: boolean
  // 是否显示斑马纹
  striped?: boolean
  // 是否可以调整列宽
  resizable?: boolean
  // 表格滚动配置
  scroll?: {
    x?: number | string | true
    y?: number | string
  }
  // 固定表头
  sticky?: boolean
  // 自定义类名
  className?: string
}
```

## 使用示例

### 基础用法

```tsx
import { DataTable } from '@/components/common/DataTable'

// 定义列配置
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
]

// 准备数据
const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
  },
]

// 使用组件
function MyTable() {
  return (
    <DataTable
      columns={columns}
      dataSource={dataSource}
      showIndex
      bordered
    />
  )
}
```

### 带选择和分页

```tsx
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'

function MyTable() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <DataTable
      columns={columns}
      dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: setSelectedKeys,
      }}
      pagination={{
        current: currentPage,
        pageSize: 10,
        total: 100,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  )
}
```

### 自定义渲染

```tsx
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'

const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (value) => (
      <Badge
        variant={value === 'active' ? 'success' : 'error'}
      >
        {value === 'active' ? '正常' : '禁用'}
      </Badge>
    ),
  },
]
```

## 注意事项

1. 表格数据必须包含唯一的 `key` 字段
2. 列的 `dataIndex` 必须与数据源的字段名匹配
3. 使用固定表头时，需要设置表格容器的高度
4. 使用列宽调整功能时，需要设置 `resizable` 为 true
5. 自定义渲染函数应该考虑性能优化，避免不必要的重渲染 