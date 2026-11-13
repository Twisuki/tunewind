---
title: 尺寸
order: 3
---

# {{ $frontmatter.title }}

尺寸由单位与范围组成. 数值不再固定为 `0.25rem` 的倍数, 而是按配置的单位计算.

## 配置

```ts
size: {
  min: 0,
  step: 1,
  max: 64,
  units: {
    default: "4px",
    x: "1px",
    r: { value: "1rem", step: 0.5 },
    q: "4rem",
    o: { value: "8rem", max: 16 },
  },
}
```

`units` 必须包含 `default`, 其余名称自定, 键名会成为类名后缀.

单位可以写成长度字符串, 也可以写成对象. 对象的 `value` 必填, `min` `step` `max` 会覆盖全局值.

`max` 必须存在, 可以写在 `size.max`, 也可以写在单位上. `min` 默认 `0`, `step` 默认 `1`.

## 规则

数字乘以单位得到实际尺寸, 可用数字由范围枚举而成. 单位自身未给出范围时, 沿用 `size` 上的全局值.

`step` 决定数字的步进. 取 `1` 时只可用整数, 取 `0.5` 时可用 `0`, `0.5`, `1`, `1.5` 这样的数值.

`min` 与 `max` 为闭区间, 范围外的数字不会生成. 未列出的数字与超出范围的数字表现一致, 都不产生任何声明.

不表示具体长度的写法保持 Tailwind 原样, 包括 `w-full`, `w-1/3`, `w-fit`, `h-screen`, 以及 `text-sm`, `font-semibold`, `rounded-lg`, `z-10`, `grid-cols-3`, `border-2` 这类与尺寸无关的工具类.

断点可以覆盖单位, 见[断点](./layout.md).

## 用法

数值尺寸类由数字与单位名组成, 例如 `p-4` 与 `w-8r`.

| 类名     | 结果                                      |
| -------- | ----------------------------------------- |
| `p-4`    | `4 * 4px`, 即 `16px`                      |
| `w-64x`  | `64 * 1px`, 即 `64px`                     |
| `w-8r`   | `8 * 1rem`                                |
| `w-0.5r` | `0.5 * 1rem`, 因为 `r` 的 `step` 为 `0.5` |
| `w-16q`  | `16 * 4rem`                               |
| `w-0`    | `0`, 始终可用                             |

同一个长度可以有多种写法, 例如 `w-4r`, `w-16q` 与 `w-64x` 都是 `64px`. 可用写法由配置决定, 应按照对象所处的尺度选择合适的单位.

## 输出

单位与间距以变量形式提供:

```css
.panel {
  padding: calc(2 * var(--unit));
  gap: var(--spacing-4);
  width: var(--spacing-8r);
}
```

命名规则为 `--unit`, `--unit-<名>`, `--spacing-<数字><后缀>`.

## 报错

单位未给出 `max`, 且 `size.max` 也未声明时报错, 文案中的名称为缺少范围的单位:

```text
size unit "r" has no max
```

单位的 `min` 大于 `max` 时报错:

```text
size unit "q" has larger min than max
```

`units` 缺少 `default` 时报错:

```text
units must define a default unit
```

## 相关

- [断点](./layout.md): 断点内的单位覆盖.
- [严格模式](./strict.md): 任意值尺寸的处理方式.
