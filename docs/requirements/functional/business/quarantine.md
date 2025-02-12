# 检疫机构管理

## 1. 功能概述

检疫机构管理模块负责同步和管理检疫机构及其人员的基本信息，并提供相关业务数据的查询功能。

## 2. 数据模型

```typescript
// 检疫机构（从第三方系统同步）
interface QuarantineOrganization {
  id: string;
  code: string;
  name: string;
  level: 'PROVINCE' | 'CITY';
  region: {
    province: string;
    city?: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  syncTime: string;
}

// 检疫人员（从第三方系统同步）
interface QuarantineStaff {
  id: string;
  organizationId: string;
  name: string;
  title: string;
  specialties: string[];
  certifications: Array<{
    type: string;
    no: string;
    issueDate: string;
    expiryDate: string;
  }>;
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  syncTime: string;
}

// 机构业务统计
interface OrganizationStatistics {
  organizationId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  taskCount: {
    total: number;
    preliminary: number;
    isolation: number;
    laboratory: number;
  };
  resultCount: {
    total: number;
    pass: number;
    fail: number;
    needProcess: number;
  };
  staffCount: {
    total: number;
    active: number;
  };
}
```

## 3. 功能设计

### 3.1 机构信息同步

1. 数据同步
   - 定时同步机构信息
   - 按需同步单个机构
   - 同步状态记录
   - 同步异常处理

2. 数据展示
   - 机构基本信息查看
   - 同步历史查询
   - 同步状态监控

### 3.2 人员信息同步

1. 数据同步
   - 定时同步人员信息
   - 按需同步指定机构人员
   - 同步状态记录
   - 同步异常处理

2. 数据展示
   - 人员基本信息查看
   - 资质证书查看
   - 同步历史查询

### 3.3 业务数据查询

1. 任务统计
   - 按任务类型统计
   - 按时间段统计
   - 按处理状态统计
   - 趋势分析

2. 结果统计
   - 按结论类型统计
   - 按时间段统计
   - 问题发现统计
   - 处理效率分析

## 4. 接口定义

### 4.1 机构信息接口

```typescript
// 机构列表
GET /api/quarantine-organizations
Query: {
  keyword?: string;
  level?: QuarantineOrganization['level'];
  province?: string;
  city?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: QuarantineOrganization[];
}

// 同步机构信息
POST /api/quarantine-organizations/sync
Request: {
  organizationId?: string; // 不传则同步所有
}
Response: {
  success: boolean;
  syncCount?: number;
  failedCount?: number;
}

// 获取机构同步历史
GET /api/quarantine-organizations/:id/sync-history
Query: {
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: Array<{
    id: string;
    type: 'ORGANIZATION' | 'STAFF';
    status: 'SUCCESS' | 'FAILED';
    errorMessage?: string;
    createdAt: string;
  }>;
}
```

### 4.2 人员信息接口

```typescript
// 人员列表
GET /api/quarantine-organizations/:id/staff
Query: {
  keyword?: string;
  status?: QuarantineStaff['status'];
  specialty?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: QuarantineStaff[];
}

// 同步人员信息
POST /api/quarantine-organizations/:id/staff/sync
Response: {
  success: boolean;
  syncCount?: number;
  failedCount?: number;
}
```

### 4.3 业务统计接口

```typescript
// 获取机构业务统计
GET /api/quarantine-organizations/:id/statistics
Query: {
  startDate: string;
  endDate: string;
}
Response: OrganizationStatistics

// 获取机构任务列表
GET /api/quarantine-organizations/:id/tasks
Query: {
  type?: 'PRELIMINARY' | 'ISOLATION' | 'LABORATORY';
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: Array<{
    id: string;
    type: string;
    status: string;
    assignee: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

// 获取机构检疫结果列表
GET /api/quarantine-organizations/:id/results
Query: {
  conclusion?: 'PASS' | 'FAIL' | 'NEED_PROCESS';
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: Array<{
    id: string;
    taskId: string;
    conclusion: string;
    inspector: {
      id: string;
      name: string;
    };
    inspectionDate: string;
    createdAt: string;
  }>;
}
```

## 5. 数据库设计

```sql
-- 检疫机构表（同步自第三方系统）
CREATE TABLE quarantine_organizations (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  sync_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 检疫人员表（同步自第三方系统）
CREATE TABLE quarantine_staff (
  id VARCHAR(36) PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  title VARCHAR(50),
  specialties JSON,
  certifications JSON,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  sync_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 同步记录表
CREATE TABLE sync_logs (
  id VARCHAR(36) PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 6. 注意事项

1. 数据同步
   - 定时同步策略配置
   - 同步失败重试机制
   - 数据一致性保证

2. 数据展示
   - 机构层级关系展示
   - 人员资质有效期提醒
   - 数据更新及时性

3. 性能考虑
   - 同步任务性能优化
   - 大量数据查询优化
   - 统计查询性能优化

## 9. 页面路径

1. 检疫机构页面
   - 路径: `/quarantine/organizations`
   - 文件: `src/app/quarantine/organizations/page.tsx`
   - 功能: 检疫机构信息管理、同步等操作

2. 检疫人员页面
   - 路径: `/quarantine/staff`
   - 文件: `src/app/quarantine/staff/page.tsx`
   - 功能: 检疫人员管理、资质管理等操作 