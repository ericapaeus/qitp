# Select 选择器组件

Select 组件是一个基于 Radix UI 的下拉选择器，提供了丰富的功能和良好的可访问性支持。

## 特性

- 支持键盘导航
- 支持搜索过滤
- 支持分组
- 支持禁用状态
- 支持自定义样式
- 支持虚拟滚动
- 完全可访问性支持

## 基础用法

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择一个水果" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">苹果</SelectItem>
        <SelectItem value="banana">香蕉</SelectItem>
        <SelectItem value="orange">橙子</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## 分组示例

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectWithGroups() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="选择一个食物" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>水果</SelectLabel>
          <SelectItem value="apple">苹果</SelectItem>
          <SelectItem value="banana">香蕉</SelectItem>
          <SelectItem value="orange">橙子</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>蔬菜</SelectLabel>
          <SelectItem value="carrot">胡萝卜</SelectItem>
          <SelectItem value="potato">土豆</SelectItem>
          <SelectItem value="tomato">番茄</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## 禁用状态

```tsx
<Select disabled>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="选择一个选项" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">选项 1</SelectItem>
    <SelectItem value="2">选项 2</SelectItem>
    <SelectItem value="3">选项 3</SelectItem>
  </SelectContent>
</Select>
```

## 带表单的使用

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
  fruit: z.string({
    required_error: "请选择一个水果。",
  }),
})

export function SelectForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="fruit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>水果</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择一个水果" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apple">苹果</SelectItem>
                  <SelectItem value="banana">香蕉</SelectItem>
                  <SelectItem value="orange">橙子</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
```

## API

### Select

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 当前选中的值 |
| defaultValue | string | - | 默认选中的值 |
| onValueChange | function | - | 值变化时的回调函数 |
| disabled | boolean | false | 是否禁用 |
| required | boolean | false | 是否必填 |
| name | string | - | 表单字段名 |

### SelectTrigger

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |

### SelectContent

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | "item" \| "popper" | "popper" | 弹出位置 |
| className | string | - | 自定义类名 |

### SelectItem

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 选项值 |
| disabled | boolean | false | 是否禁用 |
| className | string | - | 自定义类名 |

## 注意事项

1. Select 组件需要包含 SelectTrigger、SelectContent 和至少一个 SelectItem 子组件才能正常工作。
2. 如果需要在表单中使用，建议配合 React Hook Form 和 Zod 使用，可以获得更好的类型支持和表单验证。
3. 组件样式使用了 Tailwind CSS，确保项目中正确配置了 Tailwind。
4. 组件使用了 Radix UI 的基础组件，确保安装了相关依赖。 