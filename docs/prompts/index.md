# 提示工程规划

已知条件是一份简单的 `客户需求概要` 文档（例如 `docs/requirements/business/original_requirement.md`），在已知条件下，通过拆解工作步骤，建立 `提示工程` 的 `prompt` 模板。尝试通过让AI运行，实现项目的自动化构建。

## 工程流程简化

在AI技术加持助力下，将项目构建流程进行简化。例如：

### 1. **需求文档**规格调整

    原本的需求文档将围绕人的阅读习惯进行编写，主要在于让阅读者能够清晰地理解需求，并将业务拆解为功能。

**在AI技术加持下，需求文档将围绕AI的阅读习惯进行编写，主要在于让AI能够在清晰地理解需求的前提下，通过分步骤地将需求转化为界面和可执行的代码。**

### 2. 去除**原型**这一概念，改称为**界面**

    原型的存在原本是由于开发界面的工作量太大，客户的需求又将多变，所以需要先做出原型，根据原型与客户沟通，再根据沟通结果调整原型，再与客户沟通，再调整原型，如此反复，直到客户满意。在客户满意之后才投入开发，极大的缩减前期成本。

**上了AI之后，界面设计可以由AI完成，极大提高效率，本身成本不高，所以不需要再单独设计原型与客户确认，直接由AI生成界面即可。**


## 主要流程

### 1. 使用界面来确认需求

原本使用文字确认需求存在大量二义性，难以准确理解客户需求，所以需要使用界面来确认需求。所以，高效生成界面，是实现项目自动化的关键。

**基本流程**

- `PM` 角色是项目管理，主要是协调
- `AI-Assistant` 角色是AI，自动工作
- `Prompt-Review` 角色是工程师，负责评审

```mermaid
sequenceDiagram
    actor C as Customer
    participant S as PM
    participant A as AI-Assistant
    participant P as Prompt-Review

    S->>C: 前期调研

    Note over S: 初步需求
    
    %% s1-face.md
    rect rgba(28, 32, 44, 0.1)
    S->>+A: 需求拆解Prompt
    A->>-S: 优化需求文档
    end

    Note over S: 功能需求

    %% s2-page.md
    rect rgba(50, 32, 35, 0.1)
    S->>+P: 启动需求评审

    loop 用操作实现评审
    P->>+A: 优化需求
    Note over A: AI界面开发
    A->>-P: 生成界面Prompt
    P->>+A: 优化Prompt
    A->>-P: 生成界面
    end

    P->>S: 评审结束
    end

    rect rgb(0, 0, 0)
    Note right of P: 生成界面Prompt
    end
    Note over S: 初版界面

    %% s3-data.md
    rect rgba(35, 32, 50, 0.1)
    loop 示例数据生成
    P->>+A: 生成数据Prompt
    Note over A: AI数据生成
    A->>-P: 提供mock数据
    end

    P->>S: 示例数据填充
    end
    rect rgb(0, 0, 0)
    Note right of P: 生成数据Prompt
    end
    Note over S: 完整界面

    %% s4-test.md
    rect rgba(32, 50, 35, 0.1)
    loop 界面自动测试
    P->>+A: 测试用例Prompt
    Note over A: 测试用例生成
    A->>-P: 生成测试用例
    Note over A: 测试脚本
    A->>A: 自动测试
    end
    
    P->>S: 交付
    end
    rect rgb(191, 223, 255)
    Note right of P: 测试用例Prompt
    end
    Note over S: 可靠界面
    S->>C: 项目汇报
    
    loop 调整优化
        S->>S: 循环至客户满意
    end
```

**为了高效地生成界面，这里需要重点关注的几个可复用经验：**

- 使用什么样的技术基础（稳定、美观）
  - 稳定：生成的界面是后续项目前端可直接使用的，所以需要考虑稳定性，避免使用过于复杂的技术，避免使用过于复杂的技术，使变更调整容易进行；
  - 美观：生成的界面需要美观，符合现代审美，符合行业标准，符合客户需求。

- 在此技术基础之上，生成界面的需求格式（可控、可复用）
  - 可控：生成的界面需要可控，能够有效避免AI理解的偏差，生成结果不发生偏差；
  - 可复用：生成的界面的Prompt要能够被复用，避免重复劳动，提高效率。

- 为在客户面前不演示失败，需要生成测试用例（覆盖率）
  - 生成测试用例、示例数据的Prompt要能够被复用，尤其是如何判定测试用例的数量、测试边界、测试数据等。

> 在`Prompt-Review`的过程中，补充的需求内容、背景信息等都添加到`docs/requirements/business/additional_requirements.md`中。

详细过程见：

- [需求拆解](./s1-face.md)
- [界面设计](./s2-page.md)
- [示例数据](./s3-data.md)
- [测试用例](./s4-test.md)

