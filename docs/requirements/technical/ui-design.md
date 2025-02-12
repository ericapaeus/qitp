## 界面设计要求

### 1. 设计规范

界面采用清爽专业的配色方案。品牌主色为亮丽的青绿色，主要用于图标和关键交互元素。内容区域采用浅灰色/白色背景，营造简洁画布感。正向数据变化使用绿色指示（+5%），负向变化使用红色（-2%）。整体设计通过深色文字配合浅色背景，保持了良好的对比度和可读性。

#### 1.1 间距规范：
- 左侧内边距：24px
- 右侧内边距：24px
- 元素间距：16px
- 垂直居中对齐

#### 1.2 容器布局：
- display: flex
- justify-content: space-between
- align-items: center

#### 1.3 响应式断点适配：
- 大屏（>1280px）：完整显示所有元素
- 中屏（768px-1280px）：搜索框宽度自适应
- 小屏（<768px）：
- 隐藏面包屑
- 搜索框收起为图标
- 保持基础布局结构

#### 1.4 交互规范
- 悬浮状态：
    - 按钮和可点击元素有轻微透明度变化
    - 添加 transition: all 0.2s ease-in-out
- 搜索框焦点状态：
    - 边框颜色加深
    - 轻微的外发光效果
    - outline: none
    - box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15)

#### 1.5 细节处理
- 视觉优化：
    - 使用系统字体栈确保最佳显示
    - 文字抗锯齿优化
    - 考虑深色模式适配
    - 确保足够的点击热区
- 性能考虑：
    - 使用 transform 进行动画
    - 合理的 will-change 使用
    - 避免重排重绘

### 2. 页面结构

#### 2.1 顶部导航栏结构与布局
- 左侧显示系统名称，请见需求文档
- 面包屑导航显示当前页面位置
- 右侧配置搜索栏和登录/用户按钮
- 左侧边栏导航采用清晰的层级结构和图标
- 当前活动菜单项使用紫红色高亮显示
- 高度：64px
- 背景色：纯白色 (#FFFFFF)
- 阴影：微弱的底部阴影 (box-shadow: 0 2px 4px rgba(0,0,0,0.04))
- 定位：fixed 固定定位
- z-index: 较高层级确保始终显示在顶部
- Logo区：
    - display: flex
    - align-items: center
    - gap: 12px
- 面包屑导航：
    - 字体大小：14px
    - 字体颜色：次要文字色 (#718096)
    - 分隔符：浅灰色斜杠 (/)
    - 分隔符间距：8px
    - 当前页面：稍深色 (#2D3748)
    
#### 2.2 左侧边栏导航结构与布局
- 容器基础规范
    - 宽度：280px
    - 背景色：#FFFFFF
    - 高度：100vh (视口高度)
    - 定位：fixed
    - 左侧定位：0
    - 顶部定位：0
    - z-index: 40
    - 边框右侧：1px solid #E2E8F0
    - 阴影：4px 0 6px -1px rgba(0, 0, 0, 0.05)
- 内容区：
    - 内边距顶部：24px
    - 内边距底部：24px
    - overflow-y: auto
    - height: calc(100vh - 64px) // 减去顶部导航高度
- Logo区域
    - 容器：
        - 高度：48px
        - 内边距：0 24px
        - margin-bottom: 24px
        - display: flex
        - align-items: center
    - 文字：
        - 字体大小：16px
        - 字重：600
        - 颜色：#2D3748
    - 菜单分组
        - 分组标题：
            - 内边距：8px 24px
            - 字体大小：12px
            - 字重：600
            - 文字颜色：#94A3B8
            - 文字转大写
            - letter-spacing: 0.05em
            - margin-top: 24px
            - margin-bottom: 8px
- 菜单项规范
    - 基础样式：
        - 高度：44px
        - 内边距：0 24px
        - 文字大小：14px
        - 文字颜色：#64748B
        - display: flex
        - align-items: center
        - gap: 12px
        - cursor: pointer
        - position: relative
    - 图标：
        - 尺寸：20px
        - 颜色：继承
    - 激活状态：
        - 背景色：#F8FAFC
        - 文字颜色：#2D3748
        - 左侧指示条：3px solid #5E72E4
        - 字重：500
    - Hover状态：
        - 背景色：#F1F5F9
        - 过渡：all 0.2s ease-in-out
    - 展开/折叠指示器：
        - 位置：absolute
        - 右侧：16px
        - 尺寸：16px
    - 颜色：#94A3B8
    - 过渡：transform 0.2s
- 子菜单规范
    - 容器：
        - padding-left: 44px
        - overflow: hidden
        - transition: height 0.3s ease-in-out
    - 子菜单项：
        - 高度：40px
        - 字体大小：13px
        - 透明度：0.9
        - 内边距：0 24px

    - hover状态：
        - 背景色：#F1F5F9

    - 激活状态：
        - 文字颜色：#2D3748
        - 字重：500
- 折叠功能
    - 折叠按钮：
        - 位置：fixed
        - 底部：24px
        - 左侧：244px
        - 尺寸：32px
    - 圆形
    - 背景色：白色
    - 阴影：0 2px 4px rgba(0, 0, 0, 0.1)
    - z-index: 50
    - 折叠状态：
        - 宽度：72px
        - 过渡：width 0.3s ease-in-out
        - 文字隐藏
        - 只显示图标
- 滚动条样式
```css
.sidebar::-webkit-scrollbar {
width: 4px;
}

.sidebar::-webkit-scrollbar-track {
background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
background: #E2E8F0;
border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
background: #CBD5E1;
}
```
- 响应式处理
    - 断点适配：
        - md (768px):
            - 默认隐藏
            - 添加遮罩层
            - 滑入动画

        - lg (1024px):
            - 始终显示
            - 移除遮罩层
    - 遮罩层样式：
        - 背景色：rgba(0, 0, 0, 0.5)
        - position: fixed
        - z-index: 30
        - 动画：opacity 0.3s
- CSS变量定义
```css
:root {
/* 侧边栏专用变量 */
--sidebar-width: 280px;
--sidebar-width-collapsed: 72px;
--sidebar-bg: #FFFFFF;
--sidebar-border: #E2E8F0;
--sidebar-item-height: 44px;
--sidebar-item-color: #64748B;
--sidebar-item-active-color: #2D3748;
--sidebar-item-active-bg: #F8FAFC;
--sidebar-item-hover-bg: #F1F5F9;
--sidebar-icon-size: 20px;
--sidebar-padding: 24px;
}
```

### 3. UI组件设计

#### 3.1 卡片组件（Card）
- 基础样式：
    - 背景色：#FFFFFF
    - 圆角：16px
    - 内边距：24px
- 阴影：0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- 边框：1px solid rgba(0, 0, 0, 0.05)

hover状态：
- 轻微上浮效果：transform: translateY(-2px)
- 阴影加深：0 10px 15px -3px rgba(0, 0, 0, 0.1)
- 过渡：transition: all 0.2s ease-in-out
- 内部间距规范：
    - 标题与内容间距：16px
    - 多个内容块间距：20px
    - 底部操作区上方间距：24px

#### 3.2 数据展示卡片（Stat Card）
- 布局：
    - 尺寸：最小宽度 240px
    - 高度：120px
- 内部使用 flex 布局
- justify-content: space-between
- 文字规范：
    - 标题：14px, 文字颜色 #718096
    - 数值：24px, 粗体, 文字颜色 #2D3748
    - 增长率：14px, 半粗体
- 图标容器：
    - 尺寸：48px x 48px
    - 圆角：12px
    - 背景：linear-gradient(渐变)
    - 图标颜色：白色
    - 图标尺寸：24px
- 状态颜色：
    - 正向增长：#10B981
    - 负向增长：#EF4444

#### 3.3 表格组件（Table）
- 容器：
    - 背景色：白色
    - 圆角：12px
    - 溢出处理：overflow: auto
- 表头：
    - 背景色：#F8FAFC
    - 字体大小：14px
    - 字重：600
    - 文字颜色：#64748B
    - 高度：48px
- 内边距：12px 24px
- 单元格：
    - 高度：52px
    - 内边距：12px 24px
    - 边框底线：1px solid #E2E8F0
    - 文字颜色：#334155
    - 字体大小：14px
- hover效果：
    - 行背景色：#F8FAFC
    - 过渡：transition: background-color 0.2s
- 分页器：
    - 高度：48px
    - 背景色：#F8FAFC
    - 边框顶线：1px solid #E2E8F0

#### 3.4 按钮系统（Button）
- 基础规范：
    - 高度：40px (默认), 36px (小), 44px (大)
    - 内边距：16px 24px (默认), 12px 16px (小), 20px 32px (大)
    - 圆角：8px
- 字体大小：14px
- 字重：500
- 过渡：all 0.2s ease-in-out
- 主要按钮：
    - 背景色：#5E72E4
    - 文字颜色：白色
    - hover: 背景色加深 10%
    - active: 背景色加深 15%
- 次要按钮：
    - 背景色：#F1F5F9
    - 文字颜色：#64748B
    - 边框：1px solid #E2E8F0
    - hover: 背景色 #E2E8F0
- 禁用状态：
    - 透明度：0.6
    - cursor: not-allowed

#### 3.5 输入框（Input）
- 基础样式：
    - 高度：40px
    - 内边距：12px 16px
    - 圆角：8px
    - 边框：1px solid #E2E8F0
    - 背景色：#FFFFFF
    - 字体大小：14px
    - 过渡：all 0.2s
- 状态样式：
    - focus：
        - 边框颜色：#5E72E4
        - 阴影：0 0 0 3px rgba(94, 114, 228, 0.1)
    - error：
        - 边框颜色：#EF4444
        - 背景色：#FEF2F2
    - placeholder：
        - 文字颜色：#A0AEC0

#### 3.6 下拉菜单（Dropdown）
- 容器：
    - 背景色：白色
    - 圆角：8px
    - 阴影：0 10px 15px -3px rgba(0, 0, 0, 0.1)
    - 边框：1px solid rgba(0, 0, 0, 0.05)
    - 最小宽度：180px
- 选项：
    - 高度：40px
    - 内边距：12px 16px
    - 文字大小：14px
    - hover背景色：#F8FAFC
- 分割线：
    - 颜色：#E2E8F0
    - 上下间距：8px

#### 3.7 标签（Badge/Tag）
- 基础样式：
    - 内边距：4px 8px
    - 圆角：6px
    - 字体大小：12px
    - 字重：500
- 颜色变体：
    - 成功：背景 #D1FAE5, 文字 #059669
    - 警告：背景 #FEF3C7, 文字 #D97706
    - 错误：背景 #FEE2E2, 文字 #DC2626
    - 信息：背景 #E0E7FF, 文字 #4F46E5

#### 3.8 主题变量系统
```css
:root {
  /* 颜色系统 */
  --primary: #5E72E4;
  --primary-dark: #4C5EC2;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* 文字颜色 */
  --text-primary: #2D3748;
  --text-secondary: #718096;
  --text-disabled: #A0AEC0;
  
  /* 背景色 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-disabled: #E2E8F0;
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```
