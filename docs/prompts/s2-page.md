
# s2-page 界面设计阶段

根据功能需求，生成界面设计。

主要成果：
- **初版界面**
- **生成界面Prompt**

通过 `$ npm run dev` 运行项目，可以看到初版界面。

## 1.3 生成界面

### Prompt

```
依据 @index.md 中“### 1. 使用界面来确认需求”的基本流程，目前我们已经完成了 `s1-face` 阶段，现在马上开始 `s2-page` 阶段。在这个阶段，我们将依据功能需求，最终生成全部前端界面。你（AI-Assistant）将负责全部界面的设计、开发、用户体验优化等工作，我（Prompt-Review）将负责评审、优化Prompt来告诉你如何更加准确地达到效果。那么我们开始。
请根据 @index.md 中的所有功能，逐个生成界面。开始之前需要知道的信息和注意事项：
- 请参考 @ui-design.md 中的设计规范进行设计。
- 开发工作相关技术要求请参照 @.cursorrules 中的描述。
- 合理组织 @src 目录下的文件结构，确保代码可读性。
- 代码注释要完整、准确、规范，特别是函数和组件的注释。
- 每个组件要确保可复用地进行设计，同时，在开发之前，检阅组件库中是否包含了复用组件。
- 开发仅关注前端界面设计、交互逻辑实现，不关注后端逻辑，接口数据由统一模拟实现。
- 首先创建首页、顶部导航栏、左侧边栏导航、底部导航栏等全局组件，以及必要的基础组件。再将全部页面生成成包含共有部分的空白页，经我确认后，再逐个生成页面细节。
- 先建立代码功能框架，再逐个实现页面功能。
- 当遇到问题反复尝试无果时，请及时向我求助，不要为了达成目的使用不理想的方案。
- 在生成界面时，解决Linter错误，确保代码规范。无法解决必要使用 `ignore` 注释时，必须先经过我同意。
- 在进行样式设计的调整时，请更新相应组件的样式，确保样式的一致性。
```

### Logs

**AI-Assistant**

```
coding...

现在我们已经创建了所有页面的基本结构。每个页面都遵循相同的布局模式:
页面标题
内容区域使用 Card 组件包裹
统一的间距和样式
接下来我们可以开始逐个实现每个页面的具体功能。我们应该从哪个页面开始?
```

**Prompt-Review**

```
请先暂停，将你创建的这些页面路径，记录到 @functional 目录下相应的功能说明中去，以便可以将功能需求与界面实现相对应。
```

**AI-Assistant**

```
我明白您的需求。我需要将已创建的页面路径添加到功能需求文档中，建立需求和实现的对应关系。让我来更新相应的文档。

docing...

我已经将所有创建的页面路径信息添加到相应的功能需求文档中。现在每个功能模块的文档都包含了对应的页面路径信息，包括：
企业管理模块 (docs/requirements/functional/business/enterprise.md)
企业信息页面 /enterprises
引种记录页面 /enterprises/imports
隔离试种模块 (docs/requirements/functional/business/isolation.md)
样品接收页面 /isolation/samples
试种管理页面 /isolation/plants
检疫处理页面 /isolation/quarantine
实验室检验模块 (docs/requirements/functional/business/laboratory.md)
检验任务页面 /laboratory/tasks
检验结果页面 /laboratory/results
表单管理模块 (docs/requirements/functional/business/forms.md)
表单模板页面 /forms/templates
表单记录页面 /forms/records
数据分析模块 (docs/requirements/functional/analysis/index.md)
统计报表页面 /analysis/statistics
数据导出页面 /analysis/export
系统管理模块 (docs/requirements/functional/system/index.md)
用户管理页面 /settings/users
角色权限页面 /settings/roles
基础数据页面 /settings/base-data
每个页面路径信息都包含了：
路径 URL
对应的源代码文件位置
主要功能说明
这样的文档结构可以帮助我们：
清晰地看到需求和实现的对应关系
方便后续开发和维护
便于团队成员理解系统结构
接下来我们可以开始实现具体的页面功能了。您觉得应该从哪个模块开始？
```

**Prompt-Review**

```
请再检查一遍所有的页面和功能是否都有对应
```


**AI-Assistant**

```
……
```

**Prompt-Review**

```
更新侧边栏导航，确保全部页面路由正常。
```

**AI-Assistant**

```
……
现在所有页面都可以通过侧边栏导航访问。接下来我们可以开始实现具体的页面功能了。建议从核心业务流程开始，按照以下顺序实现：
企业管理 - 因为这是数据源头
检疫机构 - 因为这是业务执行主体
隔离试种 - 核心业务流程
实验室检验 - 配套业务流程
表单管理 - 业务记录支持
数据分析 - 数据统计和导出
系统设置 - 基础支持功能
您觉得这个实现顺序合适吗？或者您有其他的优先级考虑？
```

**Prompt-Review**

```
npm run dev 预览页面效果
```

**AI-Assistant**

```
好的，我来帮您启动开发服务器预览页面效果。
$ npm run dev
```

**Prompt-Review**

```
我发现两个问题：
1. 面包屑导航的位置不对，且名称使用的路径名，并没有使用菜单名。
2. 左侧边栏“首页”链接无效。
```

**AI-Assistant**

```
……
```

**Prompt-Review**

```
请检查全局样式与 @ui-design.md 的一致性
```

