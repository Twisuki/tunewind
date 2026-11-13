---
layout: home
title: Tunewind
order: 0

hero:
  name: tunewind
  text: 把设计系统规范带给 Tailwind
  tagline: 强配置, 强约束, 可拓展的原子化 CSS 方案与设计系统.
  actions:
    - theme: brand
      text: 快速开始
      link: ./guide/getting-started.md
    - theme: alt
      text: 核心概念
      link: ./guide/concepts.md
    - theme: alt
      text: GitHub
      link: https://github.com/Twisuki/tunewind

features:
  - title: Tailwind 兼容
    details: 类名语法, 变体与断点与 Tailwind 一致, 现有写法无需改写; 约束只作用于颜色与尺寸的取值.
  - title: 颜色白名单
    details: 颜色与透明度由配置声明, 未声明的组合不会产生样式; 更换主色只需修改一处配置.
  - title: 尺寸单位
    details: 数值尺寸按单位与范围计算, 越界的数字不会生效; 同一类名可以在不同断点使用不同基准.
  - title: 严格模式
    details: 任意值与原始色名可按需关闭, 例外通过放行前缀保留, 收紧程度由项目决定.
  - title: 诊断
    details: 被移除的类可以在构建时警告或中断构建, 便于在 CI 中拦截违规写法.
---
