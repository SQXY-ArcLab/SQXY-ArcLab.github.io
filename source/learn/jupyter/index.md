---
title: "Jupyter 与 JupyterLab"
layout: lesson
description: "用 Notebook 探索数据，理解内核状态与可重复运行。"
category_label: "开始编程实践"
lesson_slug: jupyter
---
## 一、什么是 Jupyter？

Jupyter 是支持交互式计算的开源项目体系。它可以把代码、文字说明、公式、表格和图表放在同一份 Notebook 文档中，适合边运行边观察、边分析边记录。

### 几个常见名称的区别

| 名称 | 是什么 | 主要作用 |
|---|---|---|
| Jupyter | 交互式计算工具与协议的项目体系 | 连接文档界面和不同语言的执行内核 |
| Notebook 文档 | 扩展名为 `.ipynb` 的文件 | 保存单元格、输出和元数据 |
| Jupyter Notebook | Notebook 编辑应用 | 创建、编辑和运行 Notebook |
| JupyterLab | 支持多文档的交互式工作界面 | 同时管理 Notebook、文本、文件和终端 |
| IPython | 增强的 Python 交互式环境 | 提供补全、帮助和魔法命令等 |
| ipykernel | Python 内核实现 | 为 Notebook 执行 Python 代码 |

Jupyter 不只支持 Python，具体能运行什么语言取决于已安装的内核。本教程以 **JupyterLab 4、Notebook 7 和 Python 内核**的常见操作为主，菜单名称和快捷键可能随版本、语言和设置变化。

### 有什么用？

- 学习 Python 和基础库，随时检查变量与中间结果。
- 阅读 CSV，完成数据探索、统计和绘图。
- 记录实验目标、代码、运行结果和结论。
- 展示算法步骤，整理可重复运行的分析报告。

例如，在代码单元格中输入并运行：

```python
values = [20, 22, 24]
sum(values) / len(values)
```

通常会在单元格下方显示 `22.0`。

## 二、Notebook、脚本与内核

### 2.1 Notebook 与普通脚本

| 内容 | `.ipynb` | `.py` |
|---|---|---|
| 组织方式 | 多个代码、Markdown 等单元格 | 普通 Python 源代码 |
| 运行方式 | 可逐个单元格执行 | 通常从程序入口按代码流程执行 |
| 输出保存 | 可以保存在文档中 | 通常不会随源文件保存 |
| 适合场景 | 探索、演示、实验记录 | 可复用模块、工具和项目程序 |

Notebook 内部主要使用 JSON 组织内容，通常应由支持它的工具编辑，不需要手写 JSON。

### 2.2 界面、服务与内核

```text
浏览器中的 JupyterLab 界面
          ↕
Jupyter 服务：管理文件、会话与内核连接
          ↕
Python 内核：执行代码、保存运行中的变量
```

浏览器本身不直接执行这些 Python 代码。运行发生在内核所在的电脑上，可能是本机，也可能是远程服务器。

### 2.3 保存文件不等于保存内核

Notebook 可以保存代码和已有输出，但不会自动把所有内存变量、打开的文件或后台任务完整保存为可恢复状态。

重新打开 Notebook 后，看到旧图表不代表代码刚刚运行，也不代表当前内核已有对应变量。

## 三、安装与启动

### 3.1 使用 Conda 安装

推荐创建独立环境，下面安装 JupyterLab 及本教程的数据分析依赖：

```bash
conda create -n arclab-jupyter --override-channels -c conda-forge python=3.11 jupyterlab ipykernel nbconvert numpy pandas matplotlib
conda activate arclab-jupyter
```

需要使用独立的 Jupyter Notebook 应用时，可在创建环境时同时加入 `notebook`，或在纯 Conda 管理阶段安装：

```bash
conda install -n arclab-jupyter --override-channels -c conda-forge notebook
```

学习 JupyterLab 不要求再安装 Notebook 应用，两者都能使用 `.ipynb` 文档。

### 3.2 使用 pip 安装（另一种选择）

在已经创建并选好的 Python 虚拟环境中执行：

```bash
python -m pip install jupyterlab ipykernel nbconvert numpy pandas matplotlib
```

两条安装路线选择一种即可。不要为了安装界面工具，把多个项目的全部依赖混装到系统 Python 中。

### 3.3 从项目目录启动

```bash
mkdir jupyter-practice
cd jupyter-practice
jupyter lab
```

通常会启动服务，并在浏览器打开界面。未自动打开时，使用终端打印的访问地址；本机常见形式为 `http://localhost:8888/lab`，实际端口可能不同。

如果安装了 Notebook 应用，也可以使用 `jupyter notebook`。本教程后续以 JupyterLab 为主。

### 3.4 检查与停止服务

```bash
jupyter --version
jupyter server list
```

终端可能显示带访问令牌 token 的地址，不要把完整地址贴进公开文档。结束使用时，先保存文件，再在启动服务的终端按 `Ctrl+C`，按提示确认停止。

关闭浏览器标签不等于停止服务或内核。

## 四、认识 JupyterLab 界面

| 区域 | 常见用途 |
|---|---|
| 文件浏览器 | 打开、上传、创建和重命名文件 |
| 主工作区 | 使用标签页查看 Notebook、文本、图片等 |
| Launcher 启动页 | 新建 Notebook、终端或其他文档 |
| 菜单栏与命令面板 | 查找运行、内核、保存与导出等操作 |
| Running 面板 | 查看并关闭运行中的内核和终端 |
| 目录面板 | 根据 Markdown 标题浏览 Notebook 结构 |

JupyterLab 的终端运行在服务所在电脑上，不是在浏览器所在电脑上。终端环境与某个 Notebook 的内核环境也不一定相同。

界面布局可以拖动调整，初学时先掌握文件浏览器、Notebook、运行按钮与内核菜单即可。

## 五、创建与保存第一个 Notebook

1. 在文件浏览器中进入练习目录。
2. 打开 Launcher，选择一个 Python 内核创建 Notebook。
3. 把文件重命名为 `first_notebook.ipynb`。
4. 在第一个代码单元格输入下面的代码。
5. 按 `Shift+Enter` 运行。

```python
print("Hello, ArcLab!")
```

### 保存与自动保存

使用保存按钮或 `Ctrl+S`；macOS 常用 `Cmd+S`。通常也有自动保存，但提交或退出前仍应确认已保存。

检查点等恢复功能不代替 Git 和文件备份。Notebook 的输出可能包含输入数据、路径和错误信息，共享前应一并检查。

## 六、单元格类型

### 6.1 Code：代码单元格

执行当前内核对应语言的代码。Python 内核中，例如：

```python
name = "ArcLab"
print(name)
```

### 6.2 Markdown：说明单元格

用于标题、段落、列表、代码展示、公式和图片。输入 Markdown 后运行该单元格，会显示排版效果。

```markdown
# 我的第一次数据分析

## 分析目标

- 读取样例数据。
- 计算平均值。
- 保存结果。

**注意：** 本次使用练习数据。
```

双击已渲染的 Markdown 单元格，或选中后进入编辑模式，可以再次修改。

### 6.3 Raw：原始单元格

保存不交给内核执行的原始内容，主要用于特定导出流程。初学阶段通常不需要使用。

**注意：** Markdown 中的围栏代码块只用于展示，不会执行。真正运行 Python 时，应把代码放进 Code 单元格，不包含外层三个反引号。

## 七、运行与常用快捷键

### 7.1 命令模式与编辑模式

- 编辑模式：光标位于单元格内，可以修改文本。
- 命令模式：用于选择、移动和管理单元格。
- 按 `Esc` 通常进入命令模式，按 `Enter` 进入编辑模式。

### 7.2 常用操作

| 操作 | 常见默认快捷键 |
|---|---|
| 运行并移到下一个单元格 | `Shift+Enter` |
| 运行并停留 | `Ctrl+Enter` |
| 运行并在下方插入单元格 | `Alt+Enter`，macOS 对应 Option |
| 上方插入单元格 | 命令模式下按 `A` |
| 下方插入单元格 | 命令模式下按 `B` |
| 改为 Markdown | 命令模式下按 `M` |
| 改为代码单元格 | 命令模式下按 `Y` |
| 删除单元格 | 命令模式下连续按两次 `D` |
| 撤销删除单元格 | 命令模式下按 `Z` |
| 补全代码 | 编辑模式下按 `Tab` |

快捷键可能被系统、浏览器或个人配置占用，找不到时使用菜单或命令面板查询。删除单元格前先确认选中内容。

### 7.3 执行编号

代码单元格左侧的 `[1]`、`[2]` 等表示内核的执行次序，不是文档中固定的行号。`[*]` 通常表示正在执行或等待执行。

## 八、变量状态与执行顺序

### 8.1 单元格共享内核状态

先运行单元格 A：

```python
count = 3
```

再运行单元格 B：

```python
count += 1
print(count)
```

第一次输出 `4`，重复运行 B 会继续增加。单元格不是每次从空白环境独立执行。

### 8.2 删除代码不等于撤销结果

删除或改写 A 中的 `count = 3`，不会自动删除内核中已有的 `count`。同样，清除单元格输出也不会清除变量。

容易产生的问题：文档里已经没有某个变量的定义，程序却暂时还能运行；换一台电脑或重启后就报错。

### 8.3 检查可复现性

完成后使用内核菜单中的“重启内核并运行所有单元格”或类似命令：

```text
保存 → 重启内核 → 从上到下运行全部 → 检查输出 → 再保存
```

目标是让结果由当前文档和输入重新生成，而不是依赖之前手工运行留下的状态。

## 九、内核的选择、中断与重启

### 9.1 查看实际解释器

在 Notebook 的代码单元格中运行：

```python
import sys
print(sys.executable)
print(sys.version)
```

这个路径比界面显示名称更可靠。启动 JupyterLab 的环境与执行 Notebook 的内核环境可以不同。

### 9.2 注册 Conda 环境内核

如果希望另一个项目环境出现在内核列表中，在终端执行：

```bash
conda create -n arclab-analysis --override-channels -c conda-forge python=3.11 ipykernel numpy pandas matplotlib
conda activate arclab-analysis
python -m ipykernel install --user --name arclab-analysis --display-name "Python (arclab-analysis)"
```

回到界面选择对应内核，必要时刷新或重新打开内核选择器。同名 kernelspec 注册可能覆盖已有说明，命名时区分项目。

### 9.3 中断、重启、关闭

| 操作 | 作用 |
|---|---|
| Interrupt Kernel | 尝试中断当前计算，保留其余内核状态 |
| Restart Kernel | 重启执行进程，清除内存中的变量状态 |
| Shut Down Kernel | 结束内核进程并释放资源 |
| Clear Outputs | 清除文档显示的结果，不清除变量 |

中断不一定能立即停止所有底层调用或外部子进程。重启后，旧输出可能仍显示，需要重新运行或清除，以免误读。

关闭 Notebook 标签通常不会关闭内核，结束长任务后应在 Running 面板检查。

## 十、Notebook 中的 Markdown、公式与图片

### 10.1 标题组织报告

```markdown
# 传感器数据分析

## 一、分析目标

## 二、输入与环境

## 三、处理过程

## 四、结果与限制
```

标题可以配合目录面板导航。建议每段代码前说明目的，后面解释关键结果，不要只放代码和截图。

### 10.2 数学公式

在 Markdown 单元格中输入：

```markdown
平均值为 $\bar{x}$。

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i
$$
```

Jupyter 通常支持通过 MathJax 渲染公式。导出后的显示仍与格式和查看工具有关。

### 10.3 图片

```markdown
![温度变化曲线](output/temperature.png)
```

保持图片与 Notebook 的相对位置，共享时一并提供图片文件。也可以将图片作为附件保存到 Markdown 单元格，但会增大 `.ipynb` 文件，应确认使用方式和导出效果。

## 十一、输出、表格与图表

### 11.1 print 与最后一个表达式

```python
values = [20, 22, 24]
print("数据数量：", len(values))
values
```

`print()` 明确输出文本；代码单元格最后一个表达式通常使用富显示机制展示结果。多个对象需要分别展示时可以用 `display()`。

### 11.2 展示表格

```python
import pandas as pd
from IPython.display import display

df = pd.DataFrame({"sensor": ["A", "B"], "value": [20.0, 24.0]})
display(df)
display(df.describe())
```

显示结果可能被截断，不能把“界面只显示部分行”当成数据只有这些行。需要核对时查看 `shape`、筛选或保存结果文件。

### 11.3 绘图

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([0, 1, 2], [20, 22, 24], marker="o")
ax.set_xlabel("Time (s)")
ax.set_ylabel("Temperature (deg C)")
ax.set_title("Readings")
fig.tight_layout()
plt.show()
```

常见 Python Notebook 环境会在单元格下显示图像。示例使用英文标签，避免默认字体缺少中文字形；中文需要配置可用字体。

在循环中反复创建大量图后，应适时 `plt.close(fig)`，避免积累图形对象。图表只显示在 Notebook 中，并不代表已经另存为图片文件。

## 十二、文件路径与数据读写

### 12.1 确认当前目录

```python
from pathlib import Path

print(Path.cwd())
```

普通本地内核通常从 Notebook 相关目录开始，但远程内核、设置或 `%cd` 操作可能改变它。遇到文件找不到时先检查实际目录。

Notebook 中通常没有普通脚本意义上的 `__file__`，不要照搬 `Path(__file__)` 定位文件。

### 12.2 使用相对目录

推荐结构：

```text
analysis-project/
├── analysis.ipynb
├── data/
│   └── readings.csv
├── output/
├── environment.yml
└── README.md
```

在项目目录作为工作目录时：

```python
from pathlib import Path
import pandas as pd

input_path = Path("data") / "readings.csv"
output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(input_path)
df.to_csv(output_dir / "readings-copy.csv", index=False, encoding="utf-8")
```

此示例需要预先准备相应 CSV。重复运行会覆盖同名输出，练习时与原始数据分开保存。

## 十三、IPython 魔法命令与帮助

魔法命令由 IPython 内核提供，不是标准 Python 语法，也不是每种 Jupyter 内核都支持。

### 13.1 常用行魔法

```ipython
%pwd
%whos
%time sum(range(100000))
%timeit sum(range(100000))
```

| 命令 | 用途 |
|---|---|
| `%pwd` | 查看当前工作目录 |
| `%cd 路径` | 改变当前内核工作目录，影响后续相对路径 |
| `%whos` | 查看交互环境中变量的概要 |
| `%time` | 对一次执行计时 |
| `%timeit` | 多次执行，估计小段代码耗时 |
| `%run script.py` | 运行脚本，可将其部分结果引入交互命名空间 |

`timeit` 会重复执行，不要直接用它计时会发送请求、追加文件或修改数据的操作。

### 13.2 单元格魔法

`%%time` 放在代码单元格第一行，测量该单元格执行时间：

```ipython
%%time
total = sum(range(100000))
print(total)
```

### 13.3 帮助与补全

```ipython
len?
```

也可以使用普通 Python：

```python
help(len)
```

编辑时使用 `Tab` 补全，函数参数提示方式受当前界面和设置影响。不要把 `%`、`%%` 和 `?` 扩展语法直接放进普通 `.py` 脚本期待原样运行。

## 十四、在 Notebook 中安装依赖

### 14.1 优先在环境配置阶段安装

为便于复现，项目依赖优先在终端和环境文件中管理，再选择对应内核运行。不要把每次启动就升级全部依赖写成 Notebook 的常规步骤。

### 14.2 临时安装与解释器确认

需要在 IPython 内核临时安装某个包时，可以使用：

```ipython
%pip install pandas
```

`%pip` 面向当前内核环境，比直接 `!pip install ...` 更明确。安装后可能需要重启内核，尤其是已经导入或包含二进制扩展的包。

如果当前内核属于 Conda 环境，仍需遵循“先 Conda、后 pip”的依赖策略，避免重复安装同一库，并把临时变更同步到环境说明中。

### 14.3 感叹号命令

IPython 支持 `!命令` 调用系统 Shell，但程序来源和语法取决于环境。`!cd ...` 不会持久改变 Python 内核工作目录，持久切换应使用 `%cd` 或 Python 接口。

Notebook 内核、Shell 子进程和 JupyterLab 终端不是同一个会话，不能只看终端中的激活名称推断所有地方都使用同一 Python。

## 十五、错误排查、长任务与资源管理

### 15.1 阅读错误信息

```python
values = [20, 22, 24]
try:
    print(values[10])
except IndexError as exc:
    print("索引错误：", exc)
```

实际排错应阅读回溯，确认出错单元格、行号、变量类型与输入。捕获异常应针对明确情况，不要用空的 `except` 隐藏所有错误。

### 15.2 长任务

一个内核通常按请求顺序执行代码；前面的长计算未结束，后面的单元格可能一直等待。

先用小数据验证，再扩大规模。避免无限循环、一次打印几百万行或显示超大表格，使浏览器和文件都难以使用。

### 15.3 内存与输出

删除变量、清除输出和关闭文档是不同操作。删除部分引用不一定立刻释放所有内存；结束不再使用的内核通常是更彻底的资源回收方式。

保存了大量图像或日志的 Notebook 可能很大。提交前按任务需要清理无关输出，保留必要结果和独立导出文件。

## 十六、导出 Notebook 与重新执行

以下命令在已经安装 `nbconvert` 的终端环境执行。

### 16.1 HTML：便于阅读

```bash
jupyter nbconvert --to html analysis.ipynb
```

通常生成 `analysis.html`。默认转换主要使用已有输出，不自动保证代码重新执行。HTML 适合分享阅读结果，不等于获得可运行的 Notebook 界面。

### 16.2 Markdown 与脚本

```bash
jupyter nbconvert --to markdown analysis.ipynb
jupyter nbconvert --to script analysis.ipynb
```

Markdown 导出可能伴随图片资源目录，分享时一并保留。脚本导出不会自动把 Notebook 整理成良好的 Python 模块，魔法命令和执行顺序仍需检查。

### 16.3 执行后另存

```bash
jupyter nbconvert --to notebook --execute analysis.ipynb --output analysis-executed.ipynb --ExecutePreprocessor.timeout=120
```

这会尝试从新内核执行 Notebook，另存带输出的结果。超时值针对单元格执行等待，不应简单当成整个项目的总运行时间。

执行工具需要能找到 Notebook 指定的内核，输入文件和依赖也必须可用。不要使用允许忽略全部错误的选项来掩盖复现问题。

### 16.4 PDF

PDF 导出可能需要额外的 TeX、Pandoc 或浏览器相关依赖，具体取决于选择的导出器。初学时先验证 HTML，再按需要配置 PDF，不必为了写第一份 Notebook 安装全部工具链。

## 十七、分享、版本管理与可复现性

### 17.1 一份可交接 Notebook 应包含什么？

- 输入数据与来源，或者能够得到同一输入的说明。
- 运行环境、依赖和内核选择方法。
- 目标、处理步骤、关键参数和结论。
- 清晰的文件路径、输出位置和已知限制。

不要只交一张结果截图，也不要假设 `.ipynb` 自动包含全部外部 CSV 和图片。

### 17.2 提交前检查

```text
保存原始输入 → 重启内核并全部运行 → 检查结果
→ 删除无关内容 → 保存 Notebook → 提交代码和环境说明
```

随机操作应记录种子，涉及库行为时记录版本；涉及模型、设备和外部服务时还需记录对应条件。

### 17.3 与 Git 配合

Notebook 可以由 Git 管理，但输出与元数据会增加差异噪声。团队应约定哪些结果保留、哪些清除；协作审查可进一步使用 nbdime 等专用工具。

适合复用的函数逐步移入 `.py` 模块，让 Notebook 负责组织分析与展示。修改模块后，已运行的内核不一定自动重新导入，应明确重新加载或重启。

### 17.4 可信状态与代码执行

Notebook 的可信状态主要影响已保存富输出等内容的处理，不是代码安全沙箱。来源不明的 Notebook 不要直接“运行全部”，先检查代码、系统命令与文件操作。

共享前检查输出中是否含令牌、访问地址、个人路径或不适合公开的数据。

## 十八、远程使用（选学）

如果团队提供 JupyterHub，按管理员给出的入口与环境说明使用。需要通过 SSH 访问自己的服务器时，可以使用本地端口转发。

在远程服务器上激活正确环境，进入项目目录后启动：

```bash
jupyter lab --no-browser --ip=127.0.0.1 --port=8888
```

在本地电脑的另一个终端执行：

```bash
ssh -N -L 8889:127.0.0.1:8888 student@server.example.com
```

将用户名和地址替换为实际值，在本地浏览器打开 `http://127.0.0.1:8889/lab`，按服务提示使用令牌或配置好的认证方式。

本地 8889 转发到远程 8888，所用内核和文件都位于远程电脑。端口被占用时选择其他端口并对应调整，不需要为了入门关闭认证或直接公开监听所有网络接口。

## 十九、一个综合示例

下面创建 `sensor_analysis.ipynb`，按顺序添加单元格，分析一份小型传感器样例数据，并保存清洗结果与图表。无需下载数据。

### 19.1 Markdown 单元格：目标

```markdown
# 传感器数据分析

## 分析目标

- 检查样例数据中的缺失值。
- 按传感器计算平均值。
- 保存清洗后的 CSV 和统计图。

本例采用人工构造的数据，只用于学习 Notebook 操作。
```

### 19.2 代码单元格：环境与依赖

```python
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from IPython.display import display

print("Python：", sys.executable)
print("NumPy：", np.__version__)
print("pandas：", pd.__version__)
print("工作目录：", Path.cwd())

output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)
```

### 19.3 代码单元格：输入与检查

```python
df = pd.DataFrame({
    "sensor": ["A", "A", "A", "B", "B", "B"],
    "time_s": [0, 1, 2, 0, 1, 2],
    "value": [20.0, 22.0, np.nan, 24.0, 26.0, 28.0],
})

display(df)
display(df.isna().sum())
```

应看到 `value` 列有 1 条缺失记录。

### 19.4 Markdown 单元格：处理规则

```markdown
## 处理规则

本例移除 value 缺失的记录，并报告移除数量。
真实实验应先确认缺失原因，不能默认所有缺失都适合删除。
```

### 19.5 代码单元格：清洗与统计

```python
clean = df.dropna(subset=["value"]).copy()
removed_count = len(df) - len(clean)
summary = clean.groupby("sensor", as_index=False).agg(
    count=("value", "count"),
    mean=("value", "mean"),
    minimum=("value", "min"),
    maximum=("value", "max"),
)

print("移除记录数：", removed_count)
display(summary)

assert removed_count == 1
assert np.isclose(summary.loc[summary["sensor"] == "A", "mean"].iloc[0], 21.0)
assert np.isclose(summary.loc[summary["sensor"] == "B", "mean"].iloc[0], 26.0)
```

### 19.6 代码单元格：绘图并保存

```python
fig, ax = plt.subplots()
for sensor, group in clean.groupby("sensor"):
    ax.plot(group["time_s"], group["value"], marker="o", label=sensor)

ax.set_xlabel("Time (s)")
ax.set_ylabel("Value (a.u.)")
ax.set_title("Sensor readings")
ax.legend(title="Sensor")
ax.grid(True, alpha=0.3)
fig.tight_layout()
fig.savefig(output_dir / "sensor-readings.png", dpi=150)
plt.show()
plt.close(fig)

clean.to_csv(output_dir / "clean.csv", index=False, encoding="utf-8")
summary.to_csv(output_dir / "summary.csv", index=False, encoding="utf-8")
```

`a.u.` 表示这里使用任意单位，真实数据应写明实际单位。重复运行会覆盖同名输出。

### 19.7 Markdown 单元格：结论

```markdown
## 结果与限制

- 移除 1 条缺失记录，剩余 5 条。
- A 有 2 条有效记录，平均值为 21.0。
- B 有 3 条有效记录，平均值为 26.0。
- 样本数量很小，不能据此推断设备长期性能。
- 结果保存到 output 目录。
```

### 19.8 重新运行与导出

保存文件，重启内核并从上到下运行，确认断言通过，再保存。

在对应目录的终端执行：

```bash
jupyter nbconvert --to html sensor_analysis.ipynb
```

交接时提供 `.ipynb`、环境说明、必要输入与输出。HTML 作为阅读版本，不代替可运行文件。

## 二十、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 找不到 `jupyter` | 工具未装到当前环境，或环境未激活 | 检查安装环境和终端路径 |
| 浏览器未自动打开 | 自动启动浏览器失败或无 GUI | 使用终端打印的实际地址 |
| 内核列表没有项目环境 | 未注册或缺少 ipykernel | 在目标环境安装并注册，重新检查列表 |
| 终端能导入，Notebook 不能 | 两者解释器不同 | 在 Notebook 中打印 `sys.executable` |
| `NameError` | 定义单元格未执行或内核已重启 | 按文档顺序从上到下运行 |
| 重复运行后结果变化 | 原地修改变量、追加操作或随机状态 | 重启验证，减少隐含状态并记录随机种子 |
| 删除代码后变量仍存在 | 内核保留旧状态 | 重启内核并全部运行 |
| `[*]` 长时间不结束 | 长任务、无限循环或排队等待 | 先尝试中断，必要时重启并缩小输入 |
| 清除输出后内存仍高 | 变量和运行进程还在 | 检查对象与任务，结束不用的内核 |
| 图片或 CSV 找不到 | 当前工作目录或相对路径不同 | 用 `Path.cwd()` 检查并统一目录结构 |
| 关闭标签后仍占用资源 | 内核或终端未停止 | 在 Running 面板关闭不再使用的会话 |
| 导出结果不更新 | 导出使用了保存的旧输出 | 重启运行、保存后导出，或使用执行导出 |
| `.py` 中 `%time` 报语法错误 | 使用了 IPython 扩展语法 | 改为普通 Python 或在 IPython 中运行 |
| Notebook 太大或浏览器卡顿 | 大表格、大量图像或日志输出 | 限制显示量，另存结果并清理无关输出 |

## 二十一、练习

### 21.1 基础操作

- [ ] 说明 JupyterLab、Notebook 文档和 Python 内核的关系。
- [ ] 创建 `first_notebook.ipynb`，分别添加 Markdown 和代码单元格。
- [ ] 使用标题、列表、公式和一段代码输出。
- [ ] 练习运行、插入、切换类型与撤销删除单元格。
- [ ] 查看实际解释器路径和当前工作目录。

### 21.2 状态与环境

1. 按第八节先定义 `count`，再重复运行增加操作，解释结果。
2. 删除定义单元格，观察变量是否仍存在。
3. 重启内核后只运行增加操作，观察并解释报错。
4. 恢复合理顺序，重启并运行所有单元格。
5. 创建或选择一个独立环境内核，检查它与启动服务的环境是否相同。

### 21.3 综合分析与交接

- [ ] 完成传感器综合示例，核对缺失数量、有效记录数与均值。
- [ ] 增加一组 C 传感器数据，让统计与图表自动更新。
- [ ] 为新增数据补充合理断言，修改结论与限制说明。
- [ ] 保存结果 CSV、图像和 HTML 阅读版。
- [ ] 写清环境与运行方法，让同伴从新内核运行成功。
- [ ] 使用完成后保存文件，检查并关闭不需要的内核。

## 二十二、常用操作速查表

| 需求 | 操作或命令 |
|---|---|
| 启动 JupyterLab | 终端执行 `jupyter lab` |
| 启动 Notebook 应用 | 安装后执行 `jupyter notebook` |
| 查看服务 | `jupyter server list`，注意输出可能含 token |
| 查看内核注册 | `jupyter kernelspec list` |
| 注册 Python 内核 | `python -m ipykernel install --user --name 名称 --display-name "显示名"` |
| 查看当前解释器 | `sys.executable`，先 `import sys` |
| 查看工作目录 | `Path.cwd()` 或 IPython 中 `%pwd` |
| 运行并下一格 | `Shift+Enter` |
| 切换到 Markdown | 命令模式 `M` |
| 切换到代码 | 命令模式 `Y` |
| 展示多个对象 | `display(a)`、`display(b)` |
| 当前内核 pip 安装 | IPython 中 `%pip install 包名` |
| 单行计时 | IPython 中 `%time 表达式` |
| 重复计时 | IPython 中 `%timeit 表达式` |
| 整格计时 | IPython 中首行 `%%time` |
| 清除变量状态 | 重启内核 |
| 清除文档输出 | 使用 Clear Outputs 类命令，不清除变量 |
| 静态 HTML 导出 | `jupyter nbconvert --to html 文件.ipynb` |
| Markdown 导出 | `jupyter nbconvert --to markdown 文件.ipynb` |
| 脚本导出 | `jupyter nbconvert --to script 文件.ipynb` |
| 执行后另存 | `jupyter nbconvert --to notebook --execute 输入.ipynb --output 输出.ipynb` |

## 二十三、相关学习资料

- [JupyterLab 官方安装指南](https://jupyterlab.readthedocs.io/en/stable/getting_started/installation.html)：安装方式与版本说明，英文。
- [JupyterLab 界面说明](https://jupyterlab.readthedocs.io/en/stable/user/interface.html)、[Notebook 操作](https://jupyterlab.readthedocs.io/en/stable/user/notebook.html)：了解界面、单元格与执行。
- [运行中的内核与终端](https://jupyterlab.readthedocs.io/en/stable/user/running.html)：理解关闭文档与关闭进程的区别。
- [Jupyter Notebook 官方说明](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html)：Notebook 应用与文档格式。
- [IPython 内核安装](https://ipython.readthedocs.io/en/stable/install/kernel_install.html)：跨环境注册和选择内核。
- [IPython 魔法命令](https://ipython.readthedocs.io/en/stable/interactive/magics.html)：`%pip`、`%timeit`、`%run` 等功能。
- [nbconvert 使用指南](https://nbconvert.readthedocs.io/en/latest/usage.html)：HTML、Markdown、脚本与其他格式导出。
- [Jupyter Server 访问认证说明](https://jupyter-server.readthedocs.io/en/latest/operators/security.html)：令牌、认证与服务访问。

入门时先完成一份能够从空白内核顺序运行的 Notebook，再按实际需要学习扩展、交互组件和调试功能。
