# 报表管理

## 1. 功能概述

报表管理模块负责系统中各类业务报表的生成和管理。主要包括以下固定格式报表：
1. 隔离检疫接样登记表
2. 隔离检疫实验室检验结果报告
3. 隔离检疫处理决定通知书
4. 隔离检疫处理报告
5. 进境植物繁殖材料入境后疫情监测报告
6. 隔离植物检疫放行证书

## 2. 用户故事

### 2.1 业务人员视角
作为业务人员，我希望：
1. 能够生成标准格式的业务报表
2. 能够方便地查看历史报表
3. 能够及时获知报表审核结果

### 2.2 审核人员视角
作为审核人员，我希望：
1. 能够清晰地查看报表内容
2. 能够方便地进行报表审核
3. 能够追踪报表的修改记录

## 3. 报表说明

### 3.1 隔离检疫接样登记表
- 用途：记录样品接收的基本信息
- 主要内容：样品来源、类型、数量、接收时间等
- 生成时机：样品接收完成后自动生成
- 审核要求：业务主管审核

### 3.2 实验室检验结果报告
- 用途：记录实验室检验的过程和结果
- 主要内容：检验方法、发现问题、检验结论等
- 生成时机：检验完成后由检验人员生成
- 审核要求：实验室负责人审核

### 3.3 检疫处理决定通知书
- 用途：通知企业检疫处理决定
- 主要内容：处理依据、处理方式、执行要求等
- 生成时机：检疫结论形成后生成
- 审核要求：业务负责人审核

### 3.4 检疫处理报告
- 用途：记录检疫处理的执行情况
- 主要内容：处理方式、处理结果、执行时间等
- 生成时机：处理完成后生成
- 审核要求：业务主管审核

### 3.5 疫情监测报告
- 用途：记录入境后的疫情监测情况
- 主要内容：监测方法、监测结果、发现问题等
- 生成时机：监测周期结束后生成
- 审核要求：业务负责人审核

### 3.6 检疫放行证书
- 用途：证明检疫合格可以放行
- 主要内容：检疫结论、放行条件、有效期等
- 生成时机：检疫合格后生成
- 审核要求：业务负责人审核

## 4. 数据模型

```typescript
// 报表记录
interface ReportRecord {
  id: string;
  type: 'REGISTRATION' | 'INSPECTION' | 'DECISION' | 'PROCESSING' | 'MONITORING' | 'RELEASE';
  relatedId: string;
  data: Record<string, any>;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  createdBy: {
    id: string;
    name: string;
  };
  reviewer?: {
    id: string;
    name: string;
    comments?: string;
    reviewedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## 5. 功能设计

### 5.1 报表生成
1. 自动生成
   - 根据业务节点自动生成报表
   - 填充已有数据
   - 提示补充必要信息

2. 报表审核
   - 提交审核
   - 审核确认
   - 退回修改

### 5.2 报表管理
1. 报表查询
   - 按类型查询
   - 按状态查询
   - 按时间查询

2. 报表导出
   - 导出PDF格式
   - 支持批量导出

## 6. 接口定义

```typescript
// 获取报表列表
GET /api/reports
Query: {
  type?: ReportRecord['type'];
  status?: ReportRecord['status'];
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: ReportRecord[];
}

// 生成报表
POST /api/reports
Request: {
  type: ReportRecord['type'];
  relatedId: string;
  data: Record<string, any>;
}
Response: ReportRecord

// 提交审核
POST /api/reports/:id/review
Request: {
  approved: boolean;
  comments?: string;
}
Response: ReportRecord

// 导出报表
GET /api/reports/:id/export
Response: Blob
```

## 7. 数据库设计

```sql
-- 报表记录表
CREATE TABLE report_records (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  related_id VARCHAR(36) NOT NULL,
  data JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  created_by VARCHAR(36) NOT NULL,
  reviewer_id VARCHAR(36),
  reviewer_comments TEXT,
  reviewed_at DATETIME,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 8. 注意事项

1. 报表生成
   - 确保数据完整性
   - 保证格式规范统一

2. 数据安全
   - 审核记录完整
   - 修改历史可追溯

3. 性能优化
   - PDF生成优化
   - 批量导出优化

4. 数据展示
   - 格式规范统一
   - 打印布局优化
   - 导出格式支持 