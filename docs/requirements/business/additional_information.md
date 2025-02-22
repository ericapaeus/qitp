# 关于项目需求的补充信息

创建日期：2025-02-12

## 1. 用户角色与权限

### 1.1 系统角色
系统包含以下角色：
1. 引种企业
2. 检疫机构
3. 隔离监管人员
4. 领导角色（查看全局总体数据）
5. 系统管理员（独立角色，管理用户和基础数据）

### 1.2 权限范围
各角色的具体权限范围按照主流程图中的职责划分。系统管理员负责管理隔离试种场所等基础数据。

## 2. 系统集成

### 2.1 与审批系统的集成
- 国外引种审批流程在第三方系统中已实现
- 需要同步审批单数据
- 暂无现成API
- 实现策略：
  1. 先模拟实现
  2. 列出需要的接口及格式清单
  3. 由对方开发对应接口

### 2.2 其他系统集成
- 不需要与其他外部系统进行集成

## 3. 技术实现相关

### 3.1 表单处理
1. 二维码内容：
   - 包含表单ID
   - 审批单号
   - 其他主要信息

2. 打印功能：
   - 使用浏览器原生打印功能
   - 不依赖特定型号的打印机

3. 签名支持：
   - 支持电子签名
   - 支持打印后手写签名

