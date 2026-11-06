---
title: "软件测试与问题复现"
layout: lesson
description: "正常、边界、异常与回归，用证据检查每一次修复。"
category_label: "验证与交接"
lesson_slug: testing
---
## 一、什么是软件测试？

软件测试是通过设计输入、执行程序并比较预期与实际结果，发现问题、检查行为的一组活动。

“程序运行结束”不等于结果正确，“一次测试通过”也不代表没有缺陷。测试需要明确对象、规则、输入和判断依据。

### 为什么要学习？

- 判断自己完成的模块是否满足要求。
- 让错误能够稳定复现，便于同伴定位。
- 修复后自动检查旧问题是否再次出现。
- 避免只靠肉眼看一次输出就交付。

本教程以 Python 标准库 `unittest` 为主，不需要先安装第三方测试框架。

## 二、需求、预期结果与测试依据

### 2.1 先写清楚函数约定

以平均值函数为例，需要决定：

- 接受列表、元组还是任意迭代器？
- 允许字符串、布尔值、缺失值吗？
- 空输入返回什么，还是抛出异常？
- 浮点数怎样比较？

如果要求不明确，先与任务负责人确认，再设计测试。不要用当前程序输出反过来定义“正确答案”。

### 2.2 一份练习约定

```text
函数：mean_value(values)
输入：非空 list 或 tuple，元素为可转换成有限 float 的实数，排除 bool。
输出：平均值 float。
类型不符：TypeError。
空输入、非有限值或超出本例数值处理范围：ValueError。
```

这是一种教学接口选择，不表示所有平均值函数都必须如此。Python 中 bool 是 int 的子类，是否排除需要显式决定。

## 三、正常、边界与异常输入

| 类别 | 示例 | 想检查什么 |
|---|---|---|
| 正常 | `[20, 22, 24]` | 普通计算正确 |
| 边界 | `[5]`、`[0, 0]` | 最小非空规模与零值 |
| 负数 | `[-2, 0, 2]` | 没有错误假设“都为正” |
| 空输入 | `[]` | 不会隐蔽除零或编造结果 |
| 类型异常 | `"123"`、`[1, "2"]` | 明确拒绝错误类型 |
| 非有限值 | `[NaN]`、`[Infinity]` | 数值约定得到执行 |

### 等价类与边界值

等价类是按行为划分的输入组，例如合法非空序列和空序列。每组挑代表样例，避免只测大量相似正常数据。

边界值是规则变化附近的值，例如最小允许长度 1 与不允许长度 0。边界不只指数值最大最小，也包括空文件、缺列、首次运行等。

## 四、手工测试与自动测试

### 4.1 手工测试记录

| 编号 | 输入与操作 | 预期 | 实际 | 结论 |
|---|---|---|---|---|
| T01 | 平均值输入 20、22、24 | 22.0 | 执行后填写 | 待执行 |
| T02 | 输入空序列 | ValueError | 执行后填写 | 待执行 |

“待执行”和“失败”不同，不能在尚未运行时直接打勾通过。

### 4.2 自动测试

把输入和判断规则写成程序，重复执行。适合函数、数据处理和稳定接口；界面观感、硬件接线和复杂真实场景仍可能需要人工验证。

自动测试不是替代思考，错误的断言也会自动重复错误结论。

## 五、单元、集成与端到端测试

| 层次 | 范围 | 示例 |
|---|---|---|
| 单元测试 | 一个较小行为或模块 | 检查平均值函数 |
| 集成测试 | 模块之间的连接 | CSV 解析后调用统计模块并保存结果 |
| 端到端测试 | 主要用户流程 | 从启动工具到生成最终报告 |

分层的边界因项目而异。初学先测关键函数，再补一条能跑通的整体流程，不必为了形式建立复杂框架。

替身或 Mock 可用于隔离网络等外部依赖，但只验证 Mock 设定不等于验证真实服务可用。

## 六、使用 assert 与 unittest

### 6.1 assert 快速检查

```python
result = sum([20, 22, 24]) / 3
assert result == 22.0
```

条件不成立时触发 `AssertionError`。Python 优化运行模式可能移除普通 assert，因此它不适合承担对外输入校验或权限判断。

### 6.2 unittest 的基本结构

保存为 `test_add.py`：

```python
import unittest


def add(a, b):
    return a + b


class TestAdd(unittest.TestCase):
    def test_two_numbers(self):
        self.assertEqual(add(2, 3), 5)


if __name__ == "__main__":
    unittest.main()
```

终端执行：

```bash
python -m unittest -v test_add
```

测试方法名以 `test_` 开头。`TestCase` 中的断言不会因为 Python 的普通 assert 优化规则自动消失。

### 6.3 常用断言

| 断言 | 用途 |
|---|---|
| `assertEqual(a, b)` | 相等 |
| `assertTrue(condition)` | 条件为真 |
| `assertIsNone(value)` | 为 None |
| `assertAlmostEqual(a, b)` | 按指定精度近似比较 |
| `assertRaises(ErrorType)` | 检查异常类型 |

浮点近似比较应按任务选择绝对或相对误差，不能无条件把极大的容差当成“修复”。

## 七、让测试独立、可重复

### 7.1 独立性

测试不应依赖另一个测试先创建某个变量或文件。每个测试准备自己的必要输入，并清理产生的临时资源。

### 7.2 临时目录示例

保存为 `test_file.py`：

```python
from pathlib import Path
import tempfile
import unittest


class TestFileRoundTrip(unittest.TestCase):
    def test_utf8_round_trip(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.txt"
            path.write_text("弧光\n", encoding="utf-8")
            self.assertEqual(path.read_text(encoding="utf-8"), "弧光\n")


if __name__ == "__main__":
    unittest.main()
```

临时目录结束后自动清理，不会依赖自己桌面上的私人路径。

### 7.3 随机、时间与外部依赖

使用随机数据时记录种子；检查时间时避免不必要的精确到瞬间；网络测试区分服务不可达与业务错误。需要速度与稳定性时，先用固定小样例验证核心逻辑。

## 八、怎样报告和复现问题

### 8.1 最小问题报告

```markdown
## 问题

什么输入下出现什么异常或错误结果？

## 环境

系统、运行工具、关键依赖和代码提交。

## 复现步骤

准备文件、进入目录、执行完整命令。

## 预期与实际

分别写明，附必要错误原文或结果文件。

## 频率与范围

每次发生还是偶发？哪些输入不发生？

## 已尝试

每次改动和观察到的结果。
```

### 8.2 复现与根因不同

能稳定触发错误是定位起点，不等于已经知道原因。先描述“空文件导致除零”，再分析为什么没有输入校验，避免把猜测写成事实。

### 8.3 固定输入与版本

保留能触发错误的小数据和代码提交，确认“同名文件”是否真的内容相同。必要时记录哈希帮助核对，但哈希一致本身不说明数据正确。

## 九、回归测试：先失败，再修复

### 9.1 为什么先保存失败证据？

如果新增测试从未在错误版本上失败，可能根本没有覆盖所修复的问题。

推荐流程：

```text
重现错误 → 写能暴露问题的测试 → 确认失败原因正确
→ 修改实现 → 测试通过 → 运行相关回归测试
```

失败应来自目标缺陷，而不是文件没放对、测试没被发现或环境缺失。

### 9.2 不把期望值改成错误结果

程序输出 33，而需求与手算表明应为 22，应检查实现。只有确认需求真的变更时，才修改对应测试和文档。

## 十、一个综合示例：平均值回归测试

### 10.1 准备错误版本

创建 `average.py`：

```python
def mean_value(values):
    return sum(values) / (len(values) - 1)
```

创建初始 `test_average.py`：

```python
import unittest
from average import mean_value


class TestMeanValue(unittest.TestCase):
    def test_three_values(self):
        self.assertAlmostEqual(mean_value([20, 22, 24]), 22.0)


if __name__ == "__main__":
    unittest.main()
```

执行：

```bash
python -m unittest -v test_average
```

应失败，提示实际为 33.0、预期为 22.0。确认这是计算问题，而不是导入错误。

### 10.2 实现约定的输入检查并修复

用以下内容替换 `average.py`：

```python
import math
from numbers import Real


def mean_value(values):
    if not isinstance(values, (list, tuple)):
        raise TypeError("values 必须是 list 或 tuple")
    if not values:
        raise ValueError("values 不能为空")

    numbers = []
    for value in values:
        if isinstance(value, bool) or not isinstance(value, Real):
            raise TypeError("元素必须是实数且不能是 bool")
        try:
            converted = float(value)
        except OverflowError as exc:
            raise ValueError("数值超出支持范围") from exc
        if not math.isfinite(converted):
            raise ValueError("元素必须是有限数值")
        numbers.append(converted)

    try:
        result = math.fsum(numbers) / len(numbers)
    except OverflowError as exc:
        raise ValueError("求和超出支持范围") from exc
    if not math.isfinite(result):
        raise ValueError("结果超出支持范围")
    return result
```

该教学实现按 float 计算，明确拒绝不支持的范围，不提供任意精度数学保证。

### 10.3 扩充测试

替换 `test_average.py`：

```python
import unittest
from average import mean_value


class TestMeanValue(unittest.TestCase):
    def test_three_values(self):
        self.assertAlmostEqual(mean_value([20, 22, 24]), 22.0)

    def test_single_value(self):
        self.assertAlmostEqual(mean_value([5]), 5.0)

    def test_zeros(self):
        self.assertEqual(mean_value([0, 0]), 0.0)

    def test_negative_and_tuple(self):
        self.assertAlmostEqual(mean_value((-2, 0, 2)), 0.0)

    def test_empty(self):
        with self.assertRaises(ValueError):
            mean_value([])

    def test_wrong_container(self):
        for values in (None, "123", {1, 2}):
            with self.subTest(values=values):
                with self.assertRaises(TypeError):
                    mean_value(values)

    def test_wrong_element(self):
        for values in ([1, "2"], [True], [1 + 2j]):
            with self.subTest(values=values):
                with self.assertRaises(TypeError):
                    mean_value(values)

    def test_nonfinite(self):
        for value in (float("nan"), float("inf"), -float("inf")):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    mean_value([value])

    def test_out_of_supported_range(self):
        with self.assertRaises(ValueError):
            mean_value([10 ** 1000])
        with self.assertRaises(ValueError):
            mean_value([1e308, 1e308])


if __name__ == "__main__":
    unittest.main()
```

### 10.4 重跑与记录

```bash
python -m unittest -v test_average
python -m unittest discover -s . -p "test_*.py" -v
```

第二条会发现当前目录中的其他匹配测试，只在自己的练习目录使用。记录初始失败、修复原因、最终通过和未覆盖情况。

## 十一、覆盖率与工具选择

覆盖率表示某类代码结构是否被执行，不直接等于测试质量。走过某行但没有检查关键结果，仍可能漏掉问题。

小型练习先保证有代表性的输入和有效判断。之后可按项目需要学习 pytest 的参数化、夹具，以及 coverage 等工具，不为追求数字而写只重复实现过程的测试。

高风险、复杂接口和故障历史较多的部分应优先投入验证，简单格式改动不必套上庞大测试体系。

## 十二、常见问题排查

| 问题 | 优先检查 |
|---|---|
| 显示运行 0 个测试 | 文件名、方法名、发现目录和继承关系 |
| 导入失败 | 工作目录、模块名、依赖和解释器 |
| 浮点比较偶发失败 | 数值误差与容差是否符合需求 |
| 单独成功，一起失败 | 测试是否共享并修改了状态 |
| 本机成功，同伴失败 | 路径、版本、时区、随机性与输入 |
| 修复后新测试仍通过得很轻易 | 确认错误版本确实会被它检出 |
| 测试输出全绿但业务仍错 | 断言、样例与需求是否真的覆盖目标 |

## 十三、练习

- [ ] 为平均值函数列出正常、边界与异常输入。
- [ ] 跑通一个 unittest，故意改变期望值观察失败。
- [ ] 完成“旧版本失败—修复后通过”的完整流程。
- [ ] 增加一个混合正负数用例，先手算预期。
- [ ] 用临时目录测试一次文件读写，不依赖私人路径。
- [ ] 给一个真实 Demo 写手工测试表，区分未执行和通过。
- [ ] 为一个错误整理最小复现，请同伴复现。
- [ ] 在交接材料中说明哪些验证完成，哪些没有验证。

## 十四、常用操作速查表

| 需求 | 方法 |
|---|---|
| 运行一个测试模块 | `python -m unittest -v test_average` |
| 发现测试 | `python -m unittest discover -s . -p "test_*.py" -v` |
| 精确比较 | `self.assertEqual(actual, expected)` |
| 近似比较 | `self.assertAlmostEqual(actual, expected)` |
| 验证异常 | `with self.assertRaises(ValueError):` |
| 多个子情况 | `with self.subTest(...):` |
| 临时文件隔离 | `tempfile.TemporaryDirectory()` |
| 回归验证 | 错误版本失败，修复版本通过 |

## 十五、相关学习资料

- [Python unittest 官方文档](https://docs.python.org/zh-cn/3/library/unittest.html)：测试结构、断言和发现。
- [Python tempfile](https://docs.python.org/zh-cn/3/library/tempfile.html)：临时资源管理。
- [pytest 官方入门](https://docs.pytest.org/en/stable/getting-started.html)：需要第三方框架时选读。
- [pytest 断言说明](https://docs.pytest.org/en/stable/how-to/assert.html)：比较结果与失败报告。
