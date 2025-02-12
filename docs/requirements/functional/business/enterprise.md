# 引种企业管理

## 1. 功能概述

引种企业管理模块负责同步企业基本信息并管理引种记录。

## 2. 用户故事

### 2.1 企业用户视角
作为企业用户，我希望：
1. 能够查看企业基本信息
2. 能够查看引种记录
3. 能够及时了解引种进度

### 2.2 管理人员视角
作为管理人员，我希望：
1. 能够同步企业信息
2. 能够查看企业引种历史
3. 能够统计引种数据

## 3. 数据模型

```typescript
// 引种企业
interface Enterprise {
  id: string;
  code: string;
  name: string;
  contact: {
    address: string;
    person: string;
    phone: string;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  syncTime: string;
}

// 引种记录
interface ImportRecord {
  id: string;
  enterpriseId: string;
  approvalNo: string;
  quarantineCertNo?: string;
  plant: {
    name: string;
    scientificName: string;
    variety: string;
    sourceCountry: string;
    quantity: number;
    unit: string;
    purpose: string;
  };
  importInfo: {
    entryPort: string;
    plannedDate: string;
    actualDate?: string;
  };
  isolationInfo?: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  };
  status: 'PENDING' | 'IMPORTING' | 'ISOLATING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}
```

## 4. 功能设计

### 4.1 企业信息同步
1. 自动同步
   - 每日自动同步
   - 同步出错通知

2. 手动同步
   - 手动触发同步
   - 显示同步结果

### 4.2 引种记录管理
1. 记录查询
   - 按状态查询
   - 按时间查询

2. 进度跟踪
   - 查看当前状态
   - 接收状态通知

## 5. 接口定义

```typescript
// 企业列表
GET /api/enterprises
Query: {
  keyword?: string;
  status?: Enterprise['status'];
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: Enterprise[];
}

// 同步企业信息
POST /api/enterprises/sync
Response: {
  success: boolean;
  syncCount: number;
}

// 引种记录列表
GET /api/enterprises/:id/import-records
Query: {
  status?: ImportRecord['status'];
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: ImportRecord[];
}

// 创建引种记录
POST /api/enterprises/:id/import-records
Request: Omit<ImportRecord, 'id' | 'enterpriseId' | 'status' | 'createdAt' | 'updatedAt'>
Response: ImportRecord

// 更新引种记录
PATCH /api/enterprises/:id/import-records/:recordId
Request: Partial<{
  quarantineCertNo: string;
  actualDate: string;
  isolationInfo: ImportRecord['isolationInfo'];
  status: ImportRecord['status'];
}>
Response: ImportRecord

// 获取引种记录详情
GET /api/enterprises/:id/import-records/:recordId
Response: ImportRecord
```

## 6. 数据库设计

```sql
-- 企业信息表
CREATE TABLE enterprises (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  address TEXT,
  contact_person VARCHAR(50),
  contact_phone VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 引种记录表
CREATE TABLE import_records (
  id VARCHAR(36) PRIMARY KEY,
  enterprise_id VARCHAR(36) NOT NULL,
  quarantine_cert_no VARCHAR(50),
  scientific_name VARCHAR(100) NOT NULL,
  purpose TEXT NOT NULL,
  entry_port VARCHAR(100) NOT NULL,
  planned_date DATE NOT NULL,
  actual_date DATE,
  facility_id VARCHAR(36),
  isolation_start_date DATE,
  isolation_end_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
  FOREIGN KEY (facility_id) REFERENCES isolation_facilities(id)
);

-- 企业同步记录表
CREATE TABLE enterprise_sync_logs (
  id VARCHAR(36) PRIMARY KEY,
  sync_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sync_count INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT
);
```