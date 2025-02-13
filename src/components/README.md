# 组件目录结构说明

```
src/components/
├── layout/           # 布局相关组件
│   ├── TopNavbar/   # 顶部导航栏
│   ├── Sidebar/     # 侧边栏导航
│   ├── Footer/      # 底部导航栏
│   └── Breadcrumb/  # 面包屑导航
├── ui/              # 基础 UI 组件 (radix-ui)
│   ├── button/      # 按钮组件
│   ├── card/        # 卡片组件
│   ├── table/       # 表格组件
│   └── form/        # 表单组件
├── common/          # 通用业务组件
│   ├── DataTable/   # 数据表格
│   ├── SearchForm/  # 搜索表单
│   ├── StatusBadge/ # 状态标签
│   └── Charts/      # 图表组件
├── business/        # 业务相关组件
│   ├── enterprise/  # 企业管理相关组件
│   ├── quarantine/  # 检疫机构相关组件
│   ├── isolation/   # 隔离试种相关组件
│   ├── laboratory/  # 实验室检验相关组件
│   └── forms/       # 表单管理相关组件
└── shared/          # 共享功能组件
    ├── ErrorBoundary/  # 错误边界
    ├── LoadingSpinner/ # 加载动画
    └── EmptyState/     # 空状态展示
```

## 组件开发规范

1. 每个组件都应该有自己的目录
2. 组件目录结构：
   ```
   ComponentName/
   ├── index.tsx      # 组件主文件
   ├── styles.css     # 组件样式（如果需要）
   ├── types.ts       # 类型定义
   └── README.md      # 组件文档
   ```

3. 组件文档应包含：
   - 组件描述
   - Props 说明
   - 使用示例
   - 注意事项

4. 组件开发原则：
   - 单一职责
   - 可复用性
   - 可测试性
   - 可维护性

5. 命名规范：
   - 组件文件夹和组件名使用 PascalCase
   - Props 接口名称为 `组件名Props`
   - 样式类名使用 kebab-case

6. 代码规范：
   - 使用 TypeScript
   - 使用函数组件和 Hooks
   - 使用 Tailwind CSS
   - 遵循 ESLint 和 Prettier 配置
``` 