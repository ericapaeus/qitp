# 用户认证与权限管理

## 1. 功能概述

用户认证与权限管理模块负责系统的用户管理、角色管理、权限控制等功能，是系统安全和访问控制的基础。

## 2. 用户故事

### 2.1 普通用户视角
作为系统用户，我希望：
1. 能够安全便捷地登录系统
2. 能够及时修改个人密码，保证账号安全
3. 能够清晰了解自己的权限范围
4. 在权限不足时能够及时得到提示

### 2.2 管理员视角
作为系统管理员，我希望：
1. 能够高效管理用户账号和权限
2. 能够及时响应用户的权限申请
3. 能够监控异常的登录行为
4. 能够定期审查用户权限

## 3. 操作流程

### 3.1 账号管理流程
1. 创建账号
   - 填写用户基本信息
   - 选择用户角色
   - 分配初始权限
   - 发送账号信息

2. 密码管理
   - 首次登录强制修改密码
   - 定期提醒修改密码
   - 忘记密码找回流程

3. 权限变更
   - 提交权限变更申请
   - 审核变更理由
   - 变更权限配置
   - 通知相关用户

### 3.2 安全管理流程
1. 登录安全
   - 限制登录失败次数
   - 异地登录提醒
   - 会话超时处理

2. 权限审计
   - 定期权限审查
   - 异常行为监控
   - 操作日志记录

## 4. 用户角色

### 4.1 角色定义

1. 引种企业用户
   ```typescript
   interface EnterpriseUser {
     id: string;
     username: string;
     enterprise: {
       id: string;
       name: string;
       address: string;
       contact: string;
       phone: string;
     };
     role: 'ENTERPRISE';
     permissions: string[];
   }
   ```

2. 检疫机构用户
   ```typescript
   interface QuarantineUser {
     id: string;
     username: string;
     organization: {
       id: string;
       name: string;
       level: 'PROVINCE' | 'CITY';
       region: string;
     };
     role: 'QUARANTINE';
     permissions: string[];
   }
   ```

3. 隔离监管人员
   ```typescript
   interface SupervisorUser {
     id: string;
     username: string;
     facility: {
       id: string;
       name: string;
       type: 'NATIONAL' | 'REGIONAL' | 'LOCAL' | 'ENTERPRISE';
     };
     role: 'SUPERVISOR';
     permissions: string[];
   }
   ```

4. 领导用户
   ```typescript
   interface LeaderUser {
     id: string;
     username: string;
     organization: {
       id: string;
       name: string;
       level: string;
     };
     role: 'LEADER';
     permissions: string[];
   }
   ```

5. 系统管理员
   ```typescript
   interface AdminUser {
     id: string;
     username: string;
     role: 'ADMIN';
     permissions: string[];
   }
   ```

### 4.2 权限定义

```typescript
enum Permission {
  // 企业权限
  ENTERPRISE_VIEW = 'enterprise:view',
  ENTERPRISE_EDIT = 'enterprise:edit',
  
  // 检疫机构权限
  QUARANTINE_VIEW = 'quarantine:view',
  QUARANTINE_EDIT = 'quarantine:edit',
  QUARANTINE_APPROVE = 'quarantine:approve',
  
  // 隔离监管权限
  ISOLATION_VIEW = 'isolation:view',
  ISOLATION_EDIT = 'isolation:edit',
  ISOLATION_APPROVE = 'isolation:approve',
  
  // 系统管理权限
  SYSTEM_USER_MANAGE = 'system:user:manage',
  SYSTEM_ROLE_MANAGE = 'system:role:manage',
  SYSTEM_FACILITY_MANAGE = 'system:facility:manage',
  
  // 数据查看权限
  DATA_VIEW_ALL = 'data:view:all',
  DATA_VIEW_REGION = 'data:view:region',
  DATA_EXPORT = 'data:export'
}
```

## 5. 功能设计

### 5.1 登录界面

```typescript
interface LoginForm {
  username: string;
  password: string;
  captcha?: string;
}

interface LoginResponse {
  token: string;
  user: EnterpriseUser | QuarantineUser | SupervisorUser | LeaderUser | AdminUser;
}
```

界面要求：
1. 简洁的登录表单
2. 支持记住用户名
3. 登录失败时显示错误信息
4. 可配置是否启用验证码

### 5.2 用户管理

系统管理员功能：
1. 用户列表
2. 创建用户
3. 编辑用户信息
4. 重置密码
5. 启用/禁用用户
6. 分配角色

```typescript
interface UserManagement {
  // 用户列表查询参数
  listParams: {
    keyword?: string;
    role?: string;
    status?: 'ACTIVE' | 'DISABLED';
    page: number;
    pageSize: number;
  };
  
  // 用户创建/编辑表单
  userForm: {
    username: string;
    password?: string;
    role: string;
    organization?: {
      id: string;
      type: string;
    };
    status: 'ACTIVE' | 'DISABLED';
  };
}
```

### 5.3 权限控制

1. 路由级别权限控制
2. 组件级别权限控制
3. 接口级别权限控制

```typescript
// 路由配置示例
interface RouteConfig {
  path: string;
  component: Component;
  meta: {
    title: string;
    permissions?: Permission[];
    roles?: string[];
  };
}

// 权限指令示例
interface DirectiveBinding {
  value: Permission | Permission[];
}
```

## 6. 接口定义

### 6.1 认证接口

```typescript
// 登录
POST /api/auth/login
Request: LoginForm
Response: LoginResponse

// 登出
POST /api/auth/logout
Response: { success: boolean }

// 获取当前用户信息
GET /api/auth/current-user
Response: UserInfo
```

### 6.2 用户管理接口

```typescript
// 用户列表
GET /api/users
Query: UserManagement['listParams']
Response: {
  total: number;
  items: UserInfo[];
}

// 创建用户
POST /api/users
Request: UserManagement['userForm']
Response: UserInfo

// 更新用户
PUT /api/users/:id
Request: UserManagement['userForm']
Response: UserInfo

// 删除用户
DELETE /api/users/:id
Response: { success: boolean }

// 重置密码
POST /api/users/:id/reset-password
Response: { success: boolean }
```

## 7. 数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  organization_id VARCHAR(36),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 组织机构表
CREATE TABLE organizations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  parent_id VARCHAR(36),
  level VARCHAR(20),
  region_code VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户权限关联表
CREATE TABLE user_permissions (
  user_id VARCHAR(36) NOT NULL,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, permission)
);
```

## 8. 注意事项

1. 安全性要求
   - 密码必须加密存储
   - 登录失败次数限制
   - 会话超时自动登出
   - 关键操作需要日志记录

2. 性能要求
   - 用户信息缓存
   - 权限信息缓存
   - 批量操作优化

3. 可维护性
   - 权限配置化
   - 角色配置化
   - 支持权限的动态调整 