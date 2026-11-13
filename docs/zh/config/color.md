---
title: 颜色
order: 1
---

# {{ $frontmatter.title }}

颜色由 `theme.palette`, `theme.shade` 与 `theme.opacity` 三部分决定: 前者决定有哪些颜色, 后两者决定可用档位与透明度.

## 配置

```ts
theme: {
  palette: {
    primary: "sky",
    ink: "slate",
  },
  shade: {
    default: 600,
    subtle: 300,
    strong: 800,
  },
  opacity: {
    default: 100,
    weak: 80,
  },
}
```

### palette

内置调色板与 Tailwind 一致, 共 26 个家族, 每族 11 档.

`palette` 有两种写法: 字符串表示引用内置家族, 对象表示自定义色阶.

字符串形式是内置家族的别名, `{ primary: "sky" }` 之后 `primary` 与 `sky` 指向同一组色阶.

对象形式是自定义色阶, 键为档位数字, 值为任意 CSS 颜色, 至少定义一档. 同名家族写成对象即为覆写, 未写出的档位沿用内置值.

### shade

键名即类名后缀, 取值必须是内置档位 `50` 到 `950` 之一. `default` 作为键名时不带后缀, 因此 `text-primary` 取 `default` 对应的档位.

### opacity

键名即颜色修饰符, 取值是 `0` 到 `100` 的数字. `default` 在这里没有特殊含义, 与其他键等价.

## 规则

颜色名来自 `palette`, 档位与透明度来自 `shade` 与 `opacity`, 三者组合成完整类名. 未列出的键不可用, Tailwind 原有的数字档位与默认修饰符随之消失.

未在 `palette` 中声明的内置家族不会被自动移除, 是否保留取决于[严格模式](./strict.md)中的 `family` 检查; 任意颜色值, 例如 `text-[#fff]`, 由同一处的 `arbitrary` 检查控制.

`white` 与 `black` 只有单体, 不存在 `text-white-subtle` 这类档位写法, 带透明度时仍需声明对应的 `opacity` 键. `transparent`, `current`, `inherit` 三个关键字始终可用.

## 用法

以上配置对应以下写法, 右列为等价的 Tailwind 写法:

| 类名                  | 结果                   | 等价写法           |
| --------------------- | ---------------------- | ------------------ |
| `text-primary`        | 取 `default`, 即 `600` | `text-sky-600`     |
| `text-primary-subtle` | 取 `300`               | `text-sky-300`     |
| `border-ink-strong`   | 取 `800`               | `border-slate-800` |
| `bg-primary/weak`     | 透明度为 `80%`         | `bg-sky-600/80`    |
| `text-white`          | 内置常量, 不受配置影响 | `text-white`       |

## 输出

颜色以变量形式提供, 需要写自定义样式时可以直接引用:

```css
.card {
  color: var(--color-primary-subtle);
  border-color: var(--color-ink-strong);
  background: color-mix(in oklab, var(--color-primary) var(--opacity-weak), transparent);
}
```

命名规则为 `--color-<名>`, `--color-<名>-<键>`, `--opacity-<键>`.

## 报错

自定义色阶缺少被引用的档位时, 构建会报出家族与档位:

```text
color family "primary" has no shade 400
```

色阶为空, 或键名不符合 `[A-Za-z0-9_]+` 时同样会直接报错.

## 相关

- [主题](./theme.md): 多主题下的颜色覆盖.
- [严格模式](./strict.md): 原始色名与任意值.
