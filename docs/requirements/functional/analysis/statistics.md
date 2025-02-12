# 数据统计分析

## 1. 功能概述

数据统计分析模块负责对系统中的隔离试种相关数据进行基础统计，为管理工作提供数据支持。

## 2. 用户故事

### 2.1 管理人员视角
作为管理人员，我希望：
1. 能够了解隔离试种的整体情况
2. 能够查看检疫结果的统计数据
3. 能够导出统计报表

### 2.2 业务人员视角
作为业务人员，我希望：
1. 能够查看本单位的业务统计
2. 能够了解检疫问题的发现情况

## 3. 统计维度

### 3.1 时间维度
1. 统计周期
   - 月度统计：每月更新
   - 年度统计：每年更新

2. 数据范围
   - 当前周期数据
   - 历史累计数据

### 3.2 业务维度
1. 隔离试种统计
   - 按批次统计
   - 按检疫结果统计

2. 检疫结果统计
   - 按问题类型统计
   - 按处理方式统计

## 4. 统计指标

### 4.1 隔离试种统计
```typescript
interface IsolationStatistics {
  period: {
    startDate: string;
    endDate: string;
  };
  totalCount: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byResult: Array<{
    result: string;
    count: number;
  }>;
}
```

### 4.2 检疫结果统计
```typescript
interface QuarantineStatistics {
  period: {
    startDate: string;
    endDate: string;
  };
  totalCount: number;
  byProblemType: Array<{
    type: string;
    count: number;
  }>;
  byProcessMethod: Array<{
    method: string;
    count: number;
  }>;
}
```

## 5. 功能设计

### 5.1 数据统计
1. 基础统计
   - 总量统计
   - 状态分布
   - 结果分布

2. 导出功能
   - 导出PDF报表
   - 导出Excel数据

## 6. 接口定义

```typescript
// 获取隔离试种统计
GET /api/statistics/isolation
Query: {
  startDate: string;
  endDate: string;
}
Response: IsolationStatistics

// 获取检疫结果统计
GET /api/statistics/quarantine
Query: {
  startDate: string;
  endDate: string;
}
Response: QuarantineStatistics
```

## 7. 数据库设计

```sql
-- 统计结果缓存表
CREATE TABLE statistics_cache (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_type_period (type, period_start, period_end)
);
```

## 8. 注意事项

1. 数据准确性
   - 统计口径明确
   - 数据一致性保证

2. 性能优化
   - 统计结果缓存
   - 定时更新机制

3. 数据展示
   - 简洁清晰的图表
   - 支持导出功能 