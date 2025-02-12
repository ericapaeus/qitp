# 检疫隔离试种信息管理系统

## 项目简介

本系统是一个基于 Next.js 14+ 开发的现代化 Web 应用，用于管理检疫隔离试种的全流程信息。系统采用最新的技术栈和最佳实践，提供了一个高效、安全、易用的信息管理平台。

## 主要功能

- 引种企业管理
- 检疫机构管理
- 隔离试种管理
- 实验室检验管理
- 表单管理
- 数据分析

## 技术栈

- **框架**: Next.js 14+
- **语言**: TypeScript 5+
- **UI 框架**: React 18+
- **样式解决方案**: 
  - Tailwind CSS
  - shadcn/ui 组件库
- **状态管理**:
  - React Context (轻量级状态)
  - Zustand (复杂状态)
- **开发工具**:
  - ESLint
  - Prettier
  - TypeScript

## 项目结构

```
qitp/
├── docs/                # 项目文档
│   ├── requirements/    # 需求文档
│   └── specs/          # 详细规格说明
├── src/
│   ├── app/            # Next.js 13+ App Router
│   ├── components/     # 组件目录
│   │   ├── ui/        # shadcn/ui 基础组件
│   │   └── common/    # 通用业务组件
│   ├── lib/           # 工具函数和配置
│   ├── hooks/         # 自定义 Hooks
│   ├── types/         # TypeScript 类型定义
│   ├── styles/        # 全局样式
│   └── mocks/         # Mock 数据
└── public/            # 静态资源
```

## 开发指南

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

## 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数组件和 Hooks
- 样式优先使用 Tailwind CSS

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: 添加一些功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[ISC License](LICENSE)

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目负责人：[Your Name]
- 邮箱：[your.email@example.com]
