# FAQ

## 1. 代码文件结构乱了

比如明明有 `types` 文件夹，却把 `types` 文件放在 `src` 文件夹下的某一个功能中。

**这个事情无所谓，不要管**

## 2. 乱改我的公共组件、配置等

比较改动了 `tsconfig.json` 文件，导致项目报错。其它文件要调用的组件，自动改了不适配。

**Prompt: ……修改、建立功能……请先给出方案，我同意后你再修改……**

修改错误：

**Prompt: ……出现了问题……是什么原因导致的，请先分析原因……**

## 3. 一步一步工作纵深太深

- 一个方案分3个功能，先干第1个功能；
- 第一个功能中分4项子功能，先干第1项子功能；
- 第1项子功能下有5个优化点，先干第1个优化点；
- ……

1. 记录方案到文档中
2. 适时设置检查点，回顾记录的方案完成情况

## 4. 新的上下文

某一时间，你突然想起有哪个功能没有做，与当前正在做的功能不同。

这时，需要创建新的上下文

## 5. 要专门来看

```bash
 GET /api/laboratory/tasks 404 in 401ms
 GET /mockServiceWorker.js 404 in 25ms
 GET /mockServiceWorker.js 404 in 25ms
 GET /api/laboratory/tasks 404 in 28ms
```

**Prompt: 请检查目前请求组件设计，与 @api 目录下的接口统一设计管理，以及 @mocks 数据统一管理是否存在不一致的地方。如存在问题，请先给出最优解决方案，经我同意后修复，并移出不必要的代码**

> 与 @types 不同， @api 是需要专门与后端对接的，不能不管。

## 6. 破坏性修改

**做好 Checkpoint Restore 的准备**

```
让我分析一下当前的设计结构和问题：
API 接口设计 (/src/app/api/)：
目前有 quarantine-organizations 和 enterprises 两个目录
缺少 laboratory 相关的 API 接口定义
Mock 数据管理 (/src/mocks/)：
handlers/ 目录下有 laboratory.ts 和 isolation.ts 的 mock handlers
data/ 目录存在但可能未被充分利用
Mock 数据直接写在 handler 文件中，没有分离
存在的问题：
API 接口和 Mock 数据不对称，缺少统一管理
Mock 数据和业务逻辑混在一起
缺少类型定义的复用
建议的解决方案：
src/
├── app/
│   └── api/
│       ├── laboratory/
│       │   ├── tasks/
│       │   │   ├── route.ts
│       │   │   └── [id]/
│       │   │       ├── assign/
│       │   │       │   └── route.ts
│       │   │       └── results/
│       │   │           └── route.ts
│       │   └── results/
│       │       ├── route.ts
│       │       └── [id]/
│       │           ├── review/
│       │           │   └── route.ts
│       │           └── report/
│       │               └── route.ts
├── mocks/
│   ├── data/
│   │   └── laboratory/
│   │       ├── tasks.ts
│   │       └── results.ts
│   └── handlers/
│       └── laboratory.ts
└── types/
    └── api/
        └── laboratory.ts
主要改进：
1. 规范化 API 路由结构
2. 将 Mock 数据分离到 data 目录
3. 统一类型定义并在 API 和 Mock 之间共享
4. 移除重复的类型定义和模拟数据
您觉得这个方案如何？如果同意，我可以开始进行相应的修改。
```

