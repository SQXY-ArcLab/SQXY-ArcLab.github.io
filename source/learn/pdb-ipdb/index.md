---
title: "Python pdb 与 ipdb"
layout: lesson
description: "断点、单步和调用栈，从中间值定位程序问题。"
category_label: "开始编程实践"
lesson_slug: pdb-ipdb
---
## 一、什么是 pdb 和 ipdb？

pdb 是 Python 标准库中的交互式调试器。它可以让程序暂停，查看变量、逐步执行、设置断点和检查调用栈。

ipdb 是基于 IPython 调试能力的第三方工具，提供类似 pdb 的操作，并结合语法高亮、补全和上下文显示等功能。具体显示和增强能力取决于 ipdb、IPython、Python 版本与终端环境。

### 调试器有什么用？

- 程序报错时，检查出错位置的变量和输入。
- 程序不报错但结果不正确时，观察中间计算。
- 查看一个函数是从哪里调用的、传入了什么参数。
- 在循环中的特定条件出现时暂停。
- 减少反复加入和删除大量 `print()` 的操作。

### pdb 与 ipdb 的区别

| 内容 | pdb | ipdb |
|---|---|---|
| 来源 | Python 标准库 | 第三方包，依赖 IPython |
| 安装 | 通常无需额外安装 | 需要安装到实际运行环境 |
| 常见进入方式 | `breakpoint()`、`pdb.set_trace()` | `ipdb.set_trace()` 或配置 breakpoint hook |
| 常见提示符 | `(Pdb)` | `ipdb>` 等，依版本而异 |
| 基础命令 | 单步、断点、变量、调用栈等 | 大多沿用 pdb 风格，细节以帮助为准 |

**说明：** 本教程使用 Python 3.10 及更新版本的常见功能，以 pdb 命令为主。部分新版 pdb 功能和旧教程存在差异，操作时结合本机版本与 `help` 检查。

## 二、准备环境与安装 ipdb

### 2.1 检查 Python 和 pdb

在终端执行：

```bash
python --version
python -m pdb -h
```

若环境使用 `python3` 或 `py`，按实际解释器替换。不需要通过 pip 安装名为 pdb 的包。

### 2.2 安装 ipdb

在自己的项目虚拟环境中执行：

```bash
python -m pip install ipdb
python -m pip show ipdb
```

使用 Conda 的项目，也可以在创建环境或纯 Conda 管理阶段从选定源安装 ipdb：

```bash
conda create -n debug-practice --override-channels -c conda-forge python=3.11 ipdb
conda activate debug-practice
```

两条路线按已有环境选择，不需要重复安装。确认实际解释器：

```bash
python -c "import sys; print(sys.executable)"
```

### 2.3 选择练习方式

本教程主要在能输入命令的终端中跟做。某些编辑器的只读输出面板、后台任务和重定向运行没有可交互输入，不适合直接使用终端调试器。

将示例保存为普通 `.py` 文件，不要命名为 `pdb.py`、`ipdb.py`，避免遮蔽真正的模块。

## 三、第一次使用 breakpoint()

### 3.1 编写示例

创建 `first_debug.py`：

```python
def add(a, b):
    result = a + b
    breakpoint()
    return result


answer = add(2, 3)
print("结果：", answer)
```

在终端执行：

```bash
python first_debug.py
```

执行到断点时，会出现调试提示符。

### 3.2 查看变量并继续

在调试器中输入：

```text
p a
p b
p result
c
```

预期分别看到 `2`、`3`、`5`，继续后程序输出结果。

**注意：** 这里的 `p` 和 `c` 是调试器命令，不是普通 Python 代码，不需要写进 `.py` 文件。后文调试命令框也采用这种写法，不包含提示符。

### 3.3 breakpoint() 的作用

Python 3.7 起提供内置 `breakpoint()`，默认通过 `sys.breakpointhook` 进入 pdb。它的行为可以被环境变量或程序配置改变，因此“写了 breakpoint”不一定永远启动同一种调试器。

不同 Python 版本进入时显示的源代码行可能略有不同。以当前箭头、命令输出和变量状态为准，不要只凭固定截图判断。

## 四、其他启动方式

### 4.1 pdb.set_trace()

在需要暂停的位置插入：

```python
import pdb

value = 10
pdb.set_trace()
print(value * 2)
```

适合明确选择 pdb 的场景。与 `breakpoint()` 类似，这类调用需要程序真正执行到该位置。

### 4.2 从命令行启动

不修改源文件，也可以使用：

```bash
python -m pdb first_debug.py
```

调试器通常会在程序开始处暂停，可以先设置断点，再执行 `c`。

当被调试程序结束或异常退出后，命令行 pdb 可能进入事后调试或准备重新运行；需要离开时使用 `q`，不要把再次出现提示符误认为程序没有结束。

### 4.3 携带程序参数

```text
python -m pdb script.py 参数1 参数2
```

脚本名后的参数交给被调试程序，例如使用 `argparse` 的程序。若文件按模块启动，也可以使用 `python -m pdb -m 包名.模块名`，需要正确的包结构和工作目录。

## 五、认识调试提示与当前位置

进入调试时可能显示：

```text
> .../first_debug.py(4)add()
-> return result
(Pdb)
```

- 文件路径：当前查看的源文件。
- 行号：当前停留位置。
- `add()`：当前函数。
- `->`：正常单步场景下通常表示下一条将执行的位置。

当指向 `total = a + b` 时，这一行可能还没有执行，因此 `total` 可能尚未定义。异常后的事后调试则显示已经发生异常的现场，不能直接套用“这一行尚未执行”的理解。

不要把 Notebook 单元格中的运行状态与脚本行号混为一谈。初学时先在普通文件中练习。

## 六、查看代码与获取帮助

### 6.1 list 与 longlist

```text
l
ll
```

`l` 显示附近代码，`ll` 显示当前函数或当前帧的较长代码范围。需要特定行时可以输入：

```text
l 1, 15
```

不同上下文可显示的源代码范围不同，动态生成的代码可能无法完整获取。

### 6.2 help

```text
h
h next
h break
```

`h` 或 `help` 查看命令列表，带命令名称时查看具体语法。调试器增强版的命令支持也应以当前帮助为准。

## 七、查看变量、类型与表达式

### 7.1 p 和 pp

```text
p result
p type(result)
p len(values)
pp records
```

这些是不同变量名的示例，只执行当前作用域中确实存在的表达式。

- `p` 求值并显示结果。
- `pp` 使用较易读的格式展示复杂对象。
- 表达式按当前选中的栈帧求值。

### 7.2 args、whatis 与 locals

```text
args
whatis result
p locals()
```

`args` 查看当前函数参数，`whatis` 查看对象类型，`locals()` 可检查当前局部名称。输出大对象可能使终端难以阅读，应优先查看长度、类型、切片和关键字段。

例如调试数组时，优先查看 `shape`、`dtype`、最小值和最大值，不必打印整个图像。

### 7.3 表达式可能有副作用

调试器不是只读工具。`p items.pop()` 会真的移除元素，`p next(iterator)` 会真的消耗迭代器，函数调用也可能写文件或修改状态。

优先读取已有状态，避免把“检查一下”变成对程序状态的额外修改。

## 八、单步执行：next、step、return 与 continue

| 命令 | 缩写 | 常见作用 |
|---|---|---|
| `next` | `n` | 执行当前行，通常不逐行进入被调用函数 |
| `step` | `s` | 前进到下一个可停位置，可能进入被调用函数 |
| `return` | `r` | 继续运行到当前函数返回 |
| `continue` | `c` | 继续运行，到后续断点等事件再暂停 |
| `until` | `unt` | 运行到更后面的行，或当前帧返回 |
| `quit` | `q` | 退出调试，通常也终止当前被调试运行 |

### 8.1 next 与 step

假设当前行是：

```python
answer = add(2, 3)
```

- 使用 `s`：可以进入 `add()` 内部检查。
- 使用 `n`：通常执行调用后在当前函数的下一行停下。

函数中的显式 `breakpoint()` 或已设置断点仍可能让 `n` 停进去，因此“不进入函数”不是忽略所有断点的保证。

### 8.2 return 与 continue

在 `add()` 内部，只想回到调用者附近可以使用 `r`，然后根据当前位置继续 `n`。需要一路运行到下一个关注位置时使用 `c`。

这些命令正常向前执行，不能让程序自动回到上一条执行前的状态。

### 8.3 until

```text
until 20
```

表示继续到当前帧中行号大于或等于 20 的位置，或当前帧返回。行号必须按实际文件选择，不能把 `until` 当成可任意跳过代码的指令。

## 九、设置、查看与删除断点

### 9.1 按行号设置

```text
b 10
```

在当前文件的第 10 行设置断点，目标应是有效可执行位置。空行、注释或定义时机不合适可能导致失败或行为与预期不同。

指定文件时：

```text
b example.py:10
```

### 9.2 按函数设置

函数已经定义且调试器能够解析其名称时：

```text
b add
```

刚从脚本第一行启动时，后面的函数定义可能尚未执行；这时可以先按源代码行号设置，不要把名称解析失败当作函数不存在。

### 9.3 管理断点

```text
b
disable 1
enable 1
clear 1
```

无参数 `b` 查看断点列表；`disable` 暂停使用，`enable` 恢复，`clear` 删除。编号 `1` 只是示例，应按当前列表替换。

### 9.4 临时断点

```text
tbreak 20
```

命中后自动删除，适合只关注一次的位置。它和源代码中直接写的 `breakpoint()` 不同。

## 十、条件断点与循环调试

### 10.1 只在特定条件暂停

准备 `loop_demo.py`：

```python
def process(values):
    total = 0
    for index, value in enumerate(values):
        total += value
    return total


print(process([2, 4, -3, 8]))
```

从命令行启动：

```bash
python -m pdb loop_demo.py
```

按上述文件原样保存时，累加语句在第 4 行，可以设置：

```text
b 4, value < 0
c
p index
p value
p total
```

预期 `index` 为 `2`，`value` 为 `-3`，`total` 为 `6`。此时尚未执行本轮累加，所以总和还没减去 3。

修改文件后重新核对行号，条件中的变量必须在断点位置有定义。

### 10.2 修改条件与忽略次数

假设断点编号为 1：

```text
condition 1 value < 0
ignore 1 2
```

`condition` 设置断点条件；无条件断点中，`ignore 1 2` 可用于忽略前两次命中。条件断点与忽略计数的组合行为应查阅本机帮助，初学时先分别练习。

## 十一、调用栈与栈帧切换

### 11.1 调用栈是什么？

例如：

```text
main() → summarize() → calculate_average()
```

每次函数调用有自己的栈帧，包含参数、局部变量和执行位置。错误可能出现在最内层，但根因是上一层传错了数据。

### 11.2 where、up 与 down

```text
w
u
args
d
```

- `w` / `where` 显示调用栈。
- `u` / `up` 选择更外层的调用者帧。
- `d` / `down` 返回更内层帧。
- 查看变量时，使用当前选中帧的上下文。

**注意：** `u` 只是切换查看位置，不会撤销函数执行，也不是让程序回到上一条语句。切到不同帧后，同名变量可能有不同值。

## 十二、持续观察与执行临时语句

### 12.1 display

```text
display total
display len(values)
```

在当前帧后续暂停时，表达式值发生变化可自动显示。列出或取消：

```text
display
undisplay total
```

原地修改的可变对象可能不容易被变化检测发现，列表可按需观察 `display values[:]`，同时避免表达式过于昂贵。

### 12.2 感叹号执行 Python 语句

```text
!print(type(result))
```

`!` 在 pdb 提示符中表示执行 Python 语句，不是 IPython 中调用系统 Shell 的同一种语法。

当变量名和调试命令冲突时，明确使用 `p` 或 `!`。例如变量叫 `n`，用 `p n` 查看，不要只输入 `n`，否则会单步执行。

修改变量可能影响程序，且局部变量回写行为受 Python 版本和上下文影响。初学时优先观察，退出后修正源代码并重新运行，不把临时修改当作修复完成。

## 十三、异常后的事后调试

### 13.1 什么是事后调试？

异常已经发生后，进入保留的回溯现场，检查出错栈帧中的变量。

它用于分析已经结束的错误路径，不是从异常前自动恢复执行或倒放程序。

### 13.2 命令行 pdb 自动进入

创建 `error_demo.py`：

```python
def calculate_average(values):
    return sum(values) / len(values)


print(calculate_average([]))
```

运行：

```bash
python -m pdb error_demo.py
```

在初始提示符输入 `c`，发生 `ZeroDivisionError` 后，可查看：

```text
w
p values
p len(values)
```

根据当前选中的帧，必要时使用 `u` / `d` 调整。确认输入为空后，退出并决定函数应返回什么或抛出什么业务异常。

### 13.3 在程序中显式进入

独立示例：

```python
import pdb
import traceback


def calculate_average(values):
    return sum(values) / len(values)


try:
    calculate_average([])
except ZeroDivisionError as exc:
    traceback.print_exc()
    pdb.post_mortem(exc.__traceback__)
```

显式传入异常回溯，便于确认调试的是哪次错误。不要在无人值守服务中默认进入需要人工输入的调试流程。

## 十四、使用 ipdb

### 14.1 ipdb.set_trace()

安装后创建独立示例：

```python
import ipdb


def multiply(a, b):
    result = a * b
    ipdb.set_trace()
    return result


print(multiply(3, 4))
```

在提示符中练习：

```text
p a
p b
p result
n
c
```

基础操作通常与 pdb 相似，增强命令、补全和显示范围以当前版本的帮助为准。

### 14.2 让 breakpoint() 使用 ipdb

Linux / macOS 的 Bash 或 Zsh，可仅为本次运行设置：

```bash
PYTHONBREAKPOINT=ipdb.set_trace python first_debug.py
```

Windows PowerShell 可在当前会话设置：

```powershell
$env:PYTHONBREAKPOINT = "ipdb.set_trace"
python first_debug.py
Remove-Item Env:PYTHONBREAKPOINT
```

这里假设此前没有需要保留的同名环境变量；已有设置应记录并恢复原值。要求执行脚本的解释器中已安装 ipdb。

设置 `PYTHONBREAKPOINT=0` 可让使用默认 hook 的 `breakpoint()` 不进入调试。它不会禁用显式 `pdb.set_trace()`、`ipdb.set_trace()`，也不代表代码中的调试调用已清理。

### 14.3 异常时进入 ipdb

```python
from ipdb import launch_ipdb_on_exception

with launch_ipdb_on_exception():
    values = []
    average = sum(values) / len(values)
```

这段代码故意触发异常供练习。上下文管理器会介入异常处理，练习后应移除，不把它当成正常业务异常处理策略。

## 十五、在 IPython 与 Jupyter 中调试

### 15.1 异常后使用 %debug

先在 Python 内核的代码单元格中故意触发异常：

```python
values = []
sum(values) / len(values)
```

然后在下一个单元格运行：

```ipython
%debug
```

在交互调试中检查变量、调用栈，用 `q` 退出。`%debug` 通常针对最近一次异常，之后再发生异常可能覆盖所关注的现场。

### 15.2 自动异常调试

```ipython
%pdb on
```

之后发生异常时尝试自动进入调试。练习结束后关闭：

```ipython
%pdb off
```

这些由 IPython 提供，不要求额外安装 ipdb，也不是标准 `.py` 语法。界面的图形调试器又是另一种交互方式，是否可用取决于前端、内核与配置。

### 15.3 注意 Notebook 状态

调试时使用的是当前内核的变量状态。确认不是旧单元格留下的数据导致结果变化；修复后重启内核并按顺序全部运行。

## 十六、一个综合示例：定位错误的平均值

下面的程序可以运行，但结果不正确。先观察和定位，再修改，不要直接把错误输出改成期望值。

### 16.1 创建带问题的程序

保存为 `average_demo.py`，按下列代码原样保留行结构：

```python
def calculate_average(values):
    total = sum(values)
    count = len(values) - 1
    average = total / count
    return average


def main():
    values = [20, 22, 24]
    result = calculate_average(values)
    print("平均值：", result)


if __name__ == "__main__":
    main()
```

正常运行会输出 `33.0`，而正确平均值应为 `22.0`。

### 16.2 从命令行设置断点

```bash
python -m pdb average_demo.py
```

原样代码的除法语句位于第 4 行，在初始提示符输入：

```text
b 4
c
p values
p total
p count
p len(values)
p total / len(values)
```

应观察到：

- 输入为 `[20, 22, 24]`。
- 总和为 `66`。
- 当前 `count` 为 `2`，但实际数据量为 `3`。
- 用实际数量计算得到 `22.0`。

此时第 4 行的除法尚未执行，直接 `p average` 可能提示尚未定义。

### 16.3 检查调用者

```text
w
u
p values
d
n
p average
```

`u` 查看 `main()` 的输入，`d` 返回 `calculate_average()`；`n` 执行除法后，再检查错误结果 `33.0`。

### 16.4 修复源代码

退出调试，修改函数：

```python
def calculate_average(values):
    if not values:
        raise ValueError("values 不能为空")
    total = sum(values)
    count = len(values)
    return total / count
```

这里约定输入是支持长度与求和的非空数值序列；如果需要支持任意迭代器或混合数据类型，还需要补充接口设计。

### 16.5 重新验证

保留修复后的函数，检查正常与边界输入：

```python
import math

assert math.isclose(calculate_average([20, 22, 24]), 22.0)
assert math.isclose(calculate_average([5]), 5.0)
assert math.isclose(calculate_average([0, 0]), 0.0)

try:
    calculate_average([])
except ValueError:
    print("空输入检查通过")
else:
    raise AssertionError("空输入应抛出 ValueError")
```

调试器帮助我们发现分母错误，测试帮助我们确认修改后的行为。完成后移除临时调试调用，重新正常运行程序。

## 十七、调试时的常见问题

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 程序没有在 breakpoint 停下 | 没经过该路径，或 hook 被禁用/改写 | 检查执行路径、解释器与 PYTHONBREAKPOINT |
| 没有调试提示或输入失效 | 使用了只读输出面板或无交互运行 | 切换到可交互终端 |
| `p variable` 提示未定义 | 当前行尚未赋值，或选错栈帧 | 查看位置，用 `w`、`u`、`d` 检查上下文 |
| 输入 `n` 没显示变量 n | 与调试命令重名 | 使用 `p n` |
| 使用 next 却进入了函数 | 函数中有断点或显式调试调用 | 查看断点列表和源码 |
| 行号断点位置不正确 | 修改文件后行号变化 | 重新查看源码与行号，再设置断点 |
| up 后程序没有回到过去 | 误解调用栈切换 | 它只改变查看帧，不撤销执行 |
| 事后调试不能正常继续业务流程 | 异常现场不是可恢复运行快照 | 根据证据修复后重新执行 |
| display 没发现列表变化 | 列表被原地修改 | 观察副本、长度或关键字段 |
| 修改局部变量没有预期效果 | 版本、作用域与局部变量回写规则影响 | 优先修改源文件后重跑 |
| 出现 `BdbQuit` | 调试器退出，或输入流结束 | 检查是否执行 q、终端是否支持交互 |
| ipdb 无法导入 | 安装到了其他解释器或文件同名 | 查看解释器路径与模块命名 |
| Notebook 调试的不是目标错误 | 最近一次回溯已被其他错误覆盖 | 重新触发目标异常后立即 `%debug` |

## 十八、调试习惯与记录

1. 先明确预期结果与实际结果，准备最小可复现输入。
2. 先读错误回溯或计算流程，再选择靠近疑点的断点。
3. 检查输入、类型、长度和关键中间值，不盲目单步所有库代码。
4. 定位到原因后修改源代码，重新运行并覆盖边界情况。
5. 记录问题、原因、修改和验证方式，清理临时断点。

单步执行会改变运行时序，不适合据此直接判断真实性能。多线程、多进程、异步任务、底层 C 扩展和远程服务还需要专门工具与调试策略，本教程先聚焦单进程 Python 代码。

## 十九、练习

### 19.1 基础操作

- [ ] 运行 `first_debug.py`，查看参数、结果和当前代码。
- [ ] 用 `python -m pdb` 启动脚本，不改代码设置行号断点。
- [ ] 分别使用 `n`、`s`、`r`、`c`，说明它们的区别。
- [ ] 设置一个断点，查看、禁用、恢复并删除。
- [ ] 用 `w`、`u`、`d` 查看调用者和当前函数变量。

### 19.2 条件与异常

- [ ] 完成负数条件断点练习，解释为什么停下时总和仍为 6。
- [ ] 给循环增加一个异常输入，定位第一次出现异常的记录。
- [ ] 用事后调试检查空列表除零现场，说明它与正常断点的区别。
- [ ] 创建一个与命令重名的变量，用 `p` 正确查看。

### 19.3 综合与 ipdb

- [ ] 完成平均值案例，记录错误分母的来源和验证结果。
- [ ] 安装 ipdb，用相同基础命令检查一个函数。
- [ ] 尝试让 `breakpoint()` 进入 ipdb，练习后恢复环境配置。
- [ ] 在 Jupyter 中触发一次异常，用 `%debug` 检查（选做）。
- [ ] 写一份简短调试记录，包含输入、预期、实际、断点、原因与修复验证。

## 二十、常用命令速查表

| 需求 | 命令或写法 |
|---|---|
| 源码中进入默认调试器 | `breakpoint()` |
| 源码中显式进入 pdb | `import pdb; pdb.set_trace()` |
| 源码中进入 ipdb | `import ipdb; ipdb.set_trace()` |
| 命令行启动 | `python -m pdb script.py` |
| 查看帮助 | 调试器中 `h` 或 `h 命令名` |
| 查看附近代码 | `l` |
| 查看当前帧完整代码 | `ll` |
| 查看表达式 | `p expression` |
| 格式化展示对象 | `pp expression` |
| 查看函数参数 | `args` |
| 查看类型 | `whatis expression` |
| 单步但通常不进入调用 | `n` |
| 单步并可能进入调用 | `s` |
| 运行到当前函数返回 | `r` |
| 继续运行 | `c` |
| 运行到后面的行 | `until 行号` |
| 查看调用栈 | `w` |
| 选择外层 / 内层帧 | `u` / `d` |
| 设置行号断点 | `b 文件名:行号` 或 `b 行号` |
| 设置条件断点 | `b 行号, 条件表达式` |
| 查看断点 | 无参数 `b` |
| 删除断点 | `clear 断点编号` |
| 禁用 / 恢复断点 | `disable 编号` / `enable 编号` |
| 临时断点 | `tbreak 行号` |
| 自动观察表达式 | `display expression` |
| 取消观察 | `undisplay expression` |
| 执行 Python 语句 | `!statement` |
| 事后调试 | Python 中 `pdb.post_mortem(traceback)` |
| Notebook 最近异常调试 | IPython 中 `%debug` |
| 退出调试 | `q` |

速查表的调试命令输入在调试提示符后，Python 调用写在源码或交互环境中，命令行启动写在终端中。

## 二十一、相关学习资料

- [Python 官方 pdb 文档](https://docs.python.org/zh-cn/3/library/pdb.html)：启动方式、调试命令与版本变化。
- [Python 内置 breakpoint 说明](https://docs.python.org/zh-cn/3/library/functions.html#breakpoint)：默认 hook 与参数传递。
- [ipdb 项目仓库与说明](https://github.com/gotcha/ipdb)：安装、调用和异常调试功能，英文。
- [IPython 魔法命令](https://ipython.readthedocs.io/en/stable/interactive/magics.html)：`%debug` 与 `%pdb` 等命令，英文。

先熟练掌握查看变量、单步、断点和调用栈，再根据项目需要学习高级调试功能。文档中的新版行为不一定适用于旧 Python 或所有 ipdb / IPython 组合。
