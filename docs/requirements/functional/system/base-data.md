# 基础数据管理

## 1. 功能概述

基础数据管理模块负责系统的基础配置数据管理，包括隔离试种场所管理、组织机构管理、基础字典管理等功能。这些数据是系统运行的基础支撑。

## 2. 用户故事

### 2.1 系统管理员视角
作为系统管理员，我希望：
1. 能够方便地管理隔离试种场所信息
2. 能够灵活地调整组织机构结构
3. 能够统一维护基础字典数据
4. 能够及时响应数据变更需求

### 2.2 业务人员视角
作为业务人员，我希望：
1. 能够快速查找所需的基础数据
2. 能够了解数据的最新变更
3. 能够方便地使用标准化的数据

## 3. 操作流程

### 3.1 隔离试种场所管理流程
1. 新增场所
   - 填写基本信息
   - 选择所属组织
   - 设置联系方式
   - 确认并保存

2. 场所信息维护
   - 定期信息核实
   - 状态变更管理
   - 关联人员调整
   - 变更记录追踪

3. 场所审核流程
   - 提交审核申请
   - 资质材料审核
   - 现场考察确认
   - 审核结果通知

### 3.2 组织机构管理流程
1. 机构设置
   - 创建组织机构
   - 设置上下级关系
   - 分配管理人员
   - 配置业务范围

2. 机构调整
   - 提交调整申请
   - 评估影响范围
   - 执行结构调整
   - 同步相关数据

### 3.3 字典管理流程
1. 字典维护
   - 新增字典项
   - 编辑字典值
   - 调整使用状态
   - 记录变更历史

2. 字典应用
   - 业务关联配置
   - 数据校验规则
   - 展示顺序设置
   - 使用范围控制

## 2. 功能设计

### 2.1 隔离试种场所管理

```typescript
interface IsolationFacility {
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

interface FacilityManagement {
  // 查询参数
  listParams: {
    keyword?: string;
    type?: IsolationFacility['type'];
    status?: IsolationFacility['status'];
    province?: string;
    city?: string;
    page: number;
    pageSize: number;
  };
  
  // 创建/编辑表单
  facilityForm: Omit<IsolationFacility, 'id' | 'createdAt' | 'updatedAt'>;
}
```

#### 2.1.1 功能列表

1. 场所列表
   - 支持按名称、类型、状态、地区等条件筛选
   - 支持分页查询
   - 显示场所基本信息

2. 场所详情
   - 显示场所详细信息
   - 显示关联的隔离监管人员
   - 显示历史隔离试种记录

3. 场所管理
   - 新增场所
   - 编辑场所信息
   - 启用/禁用场所
   - 关联隔离监管人员

### 2.2 组织机构管理

```typescript
interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'ENTERPRISE' | 'QUARANTINE' | 'GOVERNMENT';
  level: 'PROVINCE' | 'CITY' | 'DISTRICT';
  parent?: {
    id: string;
    name: string;
  };
  region: {
    province: string;
    city?: string;
    district?: string;
  };
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

interface OrganizationManagement {
  // 查询参数
  listParams: {
    keyword?: string;
    type?: Organization['type'];
    level?: Organization['level'];
    status?: Organization['status'];
    province?: string;
    city?: string;
    page: number;
    pageSize: number;
  };
  
  // 创建/编辑表单
  organizationForm: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>;
}
```

#### 2.2.1 功能列表

1. 组织机构树
   - 按类型分类显示
   - 支持展开/收起
   - 显示机构状态

2. 机构管理
   - 新增机构
   - 编辑机构信息
   - 启用/禁用机构
   - 调整机构层级关系

3. 机构详情
   - 显示机构详细信息
   - 显示下属机构
   - 显示关联用户

### 2.3 基础字典管理

```typescript
interface Dictionary {
  id: string;
  code: string;
  name: string;
  type: string;
  value: string;
  sort: number;
  parent?: {
    id: string;
    code: string;
  };
  description?: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

interface DictionaryManagement {
  // 查询参数
  listParams: {
    keyword?: string;
    type?: string;
    status?: Dictionary['status'];
    page: number;
    pageSize: number;
  };
  
  // 创建/编辑表单
  dictionaryForm: Omit<Dictionary, 'id' | 'createdAt' | 'updatedAt'>;
}
```