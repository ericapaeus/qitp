# 表单管理

## 1. 功能概述

表单管理模块负责系统中各类表单的模板管理、数据管理和打印管理，确保表单的规范性和可追溯性。

## 2. 表单类型

### 2.1 主要表单

1. 隔离试种场所登记信息表
2. 隔离检疫抽样记录表
3. 隔离检疫接样登记表
4. 隔离检疫实验室检验结果报告
5. 隔离检疫处理决定通知书
6. 隔离检疫处理报告
7. 进境植物繁殖材料入境后疫情监测报告
8. 隔离植物检疫放行证书
9. 隔离试种信息标签
10. 隔离检疫责任书
11. 隔离检疫计划
12. 隔离检疫情况记录表

### 2.2 数据模型

```typescript
// 表单模板
interface FormTemplate {
  id: string;
  code: string;
  name: string;
  type: 'REGISTRATION' | 'REPORT' | 'NOTICE' | 'CERTIFICATE' | 'LABEL';
  version: string;
  content: {
    html: string;
    css?: string;
    fields: Array<{
      key: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'signature';
      required: boolean;
      options?: string[];
      defaultValue?: any;
      validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        message?: string;
      };
    }>;
  };
  printConfig?: {
    pageSize: 'A4' | 'A5' | 'CUSTOM';
    orientation: 'portrait' | 'landscape';
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
  createdAt: string;
  updatedAt: string;
}

// 表单数据
interface FormData {
  id: string;
  templateId: string;
  formNo: string;
  relatedId?: string;
  relatedType?: string;
  data: Record<string, any>;
  signatures?: Array<{
    field: string;
    user: {
      id: string;
      name: string;
    };
    signedAt: string;
    image?: string;
  }>;
  status: 'DRAFT' | 'SIGNED' | 'PRINTED' | 'VOIDED';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 打印记录
interface PrintRecord {
  id: string;
  formId: string;
  printer: {
    id: string;
    name: string;
  };
  printedAt: string;
  copies: number;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
}

// 隔离试种场所登记信息表
interface IsolationFacilityRegistration {
  id: string;
  name: string;
  type: 'NATIONAL' | 'REGIONAL' | 'LOCAL' | 'ENTERPRISE';
  organization: {
    id: string;
    name: string;
    level: 'PROVINCE' | 'CITY';
  };
  address: {
    province: string;
    city: string;
    district: string;
    detail: string;
    longitude?: number;
    latitude?: number;
  };
  contact: {
    name: string;
    phone: string;
  };
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫抽样记录表
interface QuarantineSamplingRecord {
  id: string;
  enterprise: {
    id: string;
    name: string;
  };
  plant: {
    name: string;
    approvalNo: string;
  };
  sampling: {
    organization: string;
    sampler: string;
    date: string;
    quantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫接样登记表
interface QuarantineRegistration {
  id: string;
  registrationNo: string; // 登记号
  enterprise: {
    id: string;
    name: string; // 货主
    address: string;
    postalCode: string; // 邮政编码
    contact: {
      name: string;
      phone: string;
      fax: string; // 传真
      email: string; // 电子信箱
    };
  };
  plant: {
    chineseName: string; // 植物中名
    scientificName: string; // 植物学名
    variety: string; // 品种名称
    part: string; // 植物部位
    sourceCountry: string; // 种苗来源国
    entryPort: string; // 入境口岸
    entryQuantity: number; // 入境数量
    entryDate: string; // 入境日期
    inspectionQuantity: number; // 送检数量
    registrationDate: string; // 接样日期
    value: number; // 货值
    packageMaterial: string; // 包装材料
  };
  approvalInfo: {
    approvalNo: string; // 引进种子、苗木检疫审批编号
    quarantineCertNo: string; // 原产国植物检疫证书号
    releaseNoticeNo: string; // 口岸放行通知单或检疫调离通知单号
    needRiskAnalysis: boolean; // 是否需要作风险分析报告
  };
  attachments: string[]; // 附件列表
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫责任书
interface QuarantineResponsibility {
  id: string;
  isolationId: string;
  parties: Array<{
    type: 'ENTERPRISE' | 'FACILITY' | 'SUPERVISOR';
    id: string;
    name: string;
    responsibilities: string[];
    signature?: {
      name: string;
      date: string;
      image?: string;
    };
  }>;
  content: string;
  status: 'DRAFT' | 'SIGNED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫计划
interface QuarantinePlan {
  id: string;
  isolationId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  tasks: Array<{
    type: 'INSPECTION' | 'OBSERVATION' | 'TESTING';
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    assignee: {
      id: string;
      name: string;
    };
    description: string;
  }>;
  supervisor: {
    id: string;
    name: string;
  };
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫情况记录表
interface QuarantineObservationRecord {
  id: string;
  isolationId: string;
  observer: {
    id: string;
    name: string;
  };
  observationDate: string;
  environmentData: {
    temperature: number;
    humidity: number;
    light: number;
  };
  plantStatus: {
    growthStage: string;
    height: number;
    leafCount: number;
    healthStatus: string;
  };
  abnormalSigns?: Array<{
    type: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    photos?: Array<{
      id: string;
      url: string;
    }>;
  }>;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫处理决定通知书
interface QuarantineProcessingDecision {
  id: string;
  noticeNo: string; // 编号
  enterprise: {
    id: string;
    name: string; // 货主
  };
  plant: {
    sourceCountry: string; // 原产国
    name: string; // 隔离种植物
    quantity: number; // 数量
    unit: string;
  };
  registrationNo: string; // 登记号
  approvalNo: string; // 审批编号
  findings: {
    preliminary: string[]; // 初检发现有害生物
    isolation: string[]; // 隔离检疫期间发现有害生物
  };
  processingMethod: 'DESTROY' | 'STERILIZE' | 'DETOXIFY'; // 处理方式
  signatures: {
    facility?: {
      name: string;
      date: string;
      image?: string;
    };
    enterprise?: {
      name: string;
      date: string;
      image?: string;
    };
    inspector?: {
      id: string;
      name: string;
      date: string;
      image?: string;
    };
  };
  status: 'DRAFT' | 'SIGNED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// 隔离检疫处理报告
interface QuarantineProcessingReport {
  id: string;
  registrationNo: string; // 登记号
  approvalNo: string; // 审批编号
  enterprise: {
    id: string;
    name: string; // 货主
  };
  plant: {
    name: string; // 植物中名
  };
  processing: {
    decisionNo: string; // 处理决定通知书编号
    quantity: number; // 处理数量
    unit: string;
    date: string; // 处理时间
    findings: string[]; // 检验发现有害生物
    method: string; // 处理方法
    result: string; // 处理结果
  };
  signatures: {
    facility?: {
      name: string;
      date: string;
      image?: string;
    };
    inspector?: {
      id: string;
      name: string;
      date: string;
      image?: string;
    };
    enterprise?: {
      name: string;
      date: string;
      image?: string;
    };
  };
  status: 'DRAFT' | 'SIGNED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// 进境植物繁殖材料入境后疫情监测报告
interface PostEntryMonitoringReport {
  id: string;
  registrationNo: string; // 登记号
  enterprise: {
    id: string;
    name: string; // 货主
    contact: {
      name: string; // 联系人
      phone: string; // 联系电话
    };
  };
  approval: {
    organization: string; // 审批单位
    approvalNo: string; // 审批编号
    quantity: number; // 审批数量
    unit: string;
  };
  plant: {
    name: string; // 植物名称
    variety: string; // 品种名称
    sourceCountry: string; // 种苗来源国(地区)
    importQuantity: number; // 引进数量
    unit: string;
  };
  planting: {
    location: string; // 种植地点
    area: number; // 种植面积
    areaUnit: string;
    date: string; // 种植日期
  };
  monitoring: {
    targetPests: Array<{
      chineseName: string;
      scientificName: string;
    }>; // 应检有害生物名单
    methods: string[]; // 监测及检验方法
    results: {
      dangerousPests: string; // 发现危险性有害生物及为害程度
      suspiciousPests: string; // 发现可疑有害生物及为害程度
    };
  };
  conclusion: {
    type: 'QUALIFIED' | 'NEED_MONITOR' | 'DESTROY' | 'OTHER';
    monitoringYears?: number;
    otherSuggestions?: string;
  }; // 处理意见
  signatures: {
    organization?: {
      name: string;
      date: string;
      image?: string;
    };
    inspector?: {
      id: string;
      name: string;
      date: string;
      image?: string;
    };
  };
  status: 'DRAFT' | 'SIGNED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// 隔离植物检疫放行证书
interface QuarantineReleaseCertificate {
  id: string;
  certificateNo: string; // 编号
  enterprise: {
    id: string;
    name: string; // 货主
  };
  plant: {
    sourceCountry: string; // 种苗来源国
    name: string; // 隔离种植物
    quantity: number; // 数量
    unit: string;
  };
  isolation: {
    facilityId: string; // 隔离检疫场
    facilityName: string;
    startDate: string; // 隔离检疫开始日期
    endDate: string; // 隔离检疫结束日期
  };
  result: {
    type: 'NO_PEST' | 'TREATED_NO_PEST' | 'TISSUE_CULTURE' | 'RISK_ANALYSIS';
    pests?: string[]; // 发现有害生物
    treatments?: string[]; // 处理措施
    releaseQuantity: number; // 释放数量
    releaseUnit: string;
  };
  signatures: {
    supervisor?: {
      id: string;
      name: string;
      date: string;
      image?: string;
    };
    facility?: {
      name: string;
      date: string;
      image?: string;
    };
  };
  status: 'DRAFT' | 'SIGNED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}
```

## 3. 功能设计

### 3.1 表单模板管理

1. 模板设计
   - 可视化设计界面
   - 字段配置
   - 样式设置
   - 打印配置

2. 模板管理
   - 版本控制
   - 状态管理
   - 模板预览
   - 模板导出/导入

3. 字段管理
   - 字段类型定义
   - 字段验证规则
   - 字段默认值
   - 字段关联关系

### 3.2 表单数据管理

1. 数据录入
   - 表单填写
   - 数据验证
   - 自动计算
   - 草稿保存

2. 电子签名
   - 签名采集
   - 签名验证
   - 多人会签
   - 签名记录

3. 数据管理
   - 数据查询
   - 数据导出
   - 数据归档
   - 数据恢复

### 3.3 打印管理

1. 打印配置
   - 打印模板
   - 打印参数
   - 批量打印
   - 打印预览

2. 打印记录
   - 打印历史
   - 重新打印
   - 打印统计
   - 错误处理

## 4. 接口定义

### 4.1 模板管理接口

```typescript
// 模板列表
GET /api/form-templates
Query: {
  keyword?: string;
  type?: FormTemplate['type'];
  status?: FormTemplate['status'];
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: FormTemplate[];
}

// 创建模板
POST /api/form-templates
Request: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>
Response: FormTemplate

// 更新模板
PUT /api/form-templates/:id
Request: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>
Response: FormTemplate

// 发布模板
POST /api/form-templates/:id/publish
Response: { success: boolean }

// 废弃模板
POST /api/form-templates/:id/deprecate
Response: { success: boolean }
```

### 4.2 表单数据接口

```typescript
// 创建表单数据
POST /api/form-data
Request: {
  templateId: string;
  relatedId?: string;
  relatedType?: string;
  data: Record<string, any>;
}
Response: FormData

// 更新表单数据
PUT /api/form-data/:id
Request: {
  data: Record<string, any>;
}
Response: FormData

// 提交签名
POST /api/form-data/:id/signatures
Request: {
  field: string;
  image?: string;
}
Response: {
  success: boolean;
  signature: FormData['signatures'][0];
}

// 作废表单
POST /api/form-data/:id/void
Request: {
  reason: string;
}
Response: { success: boolean }
```

### 4.3 打印管理接口

```typescript
// 获取打印数据
GET /api/form-data/:id/print
Response: {
  html: string;
  data: Record<string, any>;
  config: FormTemplate['printConfig'];
}

// 批量打印
POST /api/form-data/batch-print
Request: {
  ids: string[];
  copies: number;
}
Response: {
  success: boolean;
  printJobs: Array<{
    id: string;
    status: 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'FAILED';
  }>;
}

// 获取打印记录
GET /api/print-records
Query: {
  formId?: string;
  startDate?: string;
  endDate?: string;
  status?: PrintRecord['status'];
  page: number;
  pageSize: number;
}
Response: {
  total: number;
  items: PrintRecord[];
}
```

## 5. 数据库设计

```sql
-- 表单模板表
CREATE TABLE form_templates (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  version VARCHAR(20) NOT NULL,
  content JSON NOT NULL,
  print_config JSON,
  status VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 表单数据表
CREATE TABLE form_data (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  form_no VARCHAR(50) UNIQUE NOT NULL,
  related_id VARCHAR(36),
  related_type VARCHAR(50),
  data JSON NOT NULL,
  signatures JSON,
  status VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 隔离试种场所登记表
CREATE TABLE isolation_facility_registrations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  organization_id VARCHAR(36) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50),
  district VARCHAR(50),
  address TEXT,
  longitude DECIMAL(10,6),
  latitude DECIMAL(10,6),
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 隔离检疫抽样记录表
CREATE TABLE quarantine_sampling_records (
  id VARCHAR(36) PRIMARY KEY,
  enterprise_id VARCHAR(36) NOT NULL,
  plant_name VARCHAR(100) NOT NULL,
  approval_no VARCHAR(50) NOT NULL,
  sampling_organization VARCHAR(100) NOT NULL,
  sampler VARCHAR(50) NOT NULL,
  sampling_date DATE NOT NULL,
  sampling_quantity DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 隔离检疫责任书表
CREATE TABLE quarantine_responsibilities (
  id VARCHAR(36) PRIMARY KEY,
  isolation_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 隔离检疫责任方表
CREATE TABLE quarantine_responsibility_parties (
  id VARCHAR(36) PRIMARY KEY,
  responsibility_id VARCHAR(36) NOT NULL,
  party_type VARCHAR(20) NOT NULL,
  party_id VARCHAR(36) NOT NULL,
  party_name VARCHAR(100) NOT NULL,
  responsibilities JSON NOT NULL,
  signature_name VARCHAR(50),
  signature_date DATE,
  signature_image TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 隔离检疫计划表
CREATE TABLE quarantine_plans (
  id VARCHAR(36) PRIMARY KEY,
  isolation_id VARCHAR(36) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  supervisor_id VARCHAR(36) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 隔离检疫计划任务表
CREATE TABLE quarantine_plan_tasks (
  id VARCHAR(36) PRIMARY KEY,
  plan_id VARCHAR(36) NOT NULL,
  task_type VARCHAR(20) NOT NULL,
  frequency VARCHAR(10) NOT NULL,
  assignee_id VARCHAR(36) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 隔离检疫情况记录表
CREATE TABLE quarantine_observation_records (
  id VARCHAR(36) PRIMARY KEY,
  isolation_id VARCHAR(36) NOT NULL,
  observer_id VARCHAR(36) NOT NULL,
  observation_date DATE NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  light DECIMAL(10,2) NOT NULL,
  growth_stage VARCHAR(50) NOT NULL,
  height DECIMAL(10,2) NOT NULL,
  leaf_count INT NOT NULL,
  health_status VARCHAR(50) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 异常症状记录表
CREATE TABLE abnormal_signs (
  id VARCHAR(36) PRIMARY KEY,
  observation_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 异常症状照片表
CREATE TABLE abnormal_sign_photos (
  id VARCHAR(36) PRIMARY KEY,
  sign_id VARCHAR(36) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 打印记录表
CREATE TABLE print_records (
  id VARCHAR(36) PRIMARY KEY,
  form_id VARCHAR(36) NOT NULL,
  printer_id VARCHAR(36) NOT NULL,
  printed_at TIMESTAMP NOT NULL,
  copies INT NOT NULL DEFAULT 1,
  status VARCHAR(10) NOT NULL,
  error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 表单编号规则表
CREATE TABLE form_number_rules (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  prefix VARCHAR(20) NOT NULL,
  sequence_length INT NOT NULL DEFAULT 6,
  current_sequence INT NOT NULL DEFAULT 0,
  reset_period VARCHAR(10),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 6. 注意事项

1. 表单规范
   - 严格遵循表单样式规范
   - 确保打印效果的一致性
   - 支持表单的版本控制

2. 数据安全
   - 签名数据的加密存储
   - 关键字段的脱敏处理
   - 操作日志的完整记录

3. 性能考虑
   - 大量表单数据的存储优化
   - 打印任务的队列处理
   - 模板渲染的缓存优化

## 7. 报表说明

### 7.1 隔离试种场所登记信息表
- 用途：记录隔离试种场所的基本信息
- 主要内容：场所名称、类型、主管机构、地址、负责人等
- 生成时机：新增或更新场所信息时
- 审核要求：系统管理员审核

### 7.2 隔离检疫抽样记录表
- 用途：记录样品抽样的基本信息
- 主要内容：企业名称、植物名称、抽样单位、抽样人、抽样日期、抽样数量等
- 生成时机：检疫机构进行抽样时
- 审核要求：抽样人和企业用户签字确认

### 7.10 隔离检疫责任书
- 用途：明确隔离检疫各方责任
- 主要内容：责任主体、责任内容、履责要求等
- 生成时机：样品接收时
- 审核要求：相关责任方签字确认

### 7.11 隔离检疫计划
- 用途：规划隔离检疫工作安排
- 主要内容：检疫时间、检疫内容、人员安排等
- 生成时机：隔离试种开始前
- 审核要求：隔离试种监管人员确认

### 7.12 隔离检疫情况记录表
- 用途：记录隔离检疫过程中的观察情况
- 主要内容：观察日期、生长状况、异常情况等
- 生成时机：隔离试种过程中
- 审核要求：隔离试种监管人员确认 