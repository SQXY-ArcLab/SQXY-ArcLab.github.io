---
title: "Python 基础库"
layout: lesson
description: "路径、数据读写、日志与参数，补上实用编程工具箱。"
category_label: "开始编程实践"
lesson_slug: python-libraries
---
## 一、什么是 Python 库？

Python 库提供已经实现好的功能，例如操作文件、读取数据、统计数值和绘制图表。使用库时，通过导入模块调用其中的函数、类和常量。

### 模块、包和库的区别

| 名称 | 含义 | 示例 |
|---|---|---|
| 模块 | 可导入的代码单元，常见形式是一个 `.py` 文件 | `math`、`json` |
| 包 | 组织模块的结构，可以包含子模块和子包 | `collections`、`numpy` |
| 库 | 一组可复用功能的统称，不是严格的文件组织单位 | Python 标准库、pandas |

### 标准库与第三方库

- **标准库**：随常规 Python 安装提供，通常无需额外安装，例如 `pathlib`、`csv`、`datetime`。
- **第三方库**：通常需要额外安装，例如 NumPy、pandas、Matplotlib。
- **内置功能**：不需要导入，例如 `print()`、`len()`、`sum()`、`list` 和 `dict`，它们不等同于需要导入的库。

### 学习这些库有什么用？

- 自动整理项目文件和实验记录。
- 读取 CSV、JSON，处理传感器与项目数据。
- 计算统计量并保存分析结果。
- 记录运行日志，定位程序问题。
- 把一次性代码变成可重复运行的命令行工具。

**说明：** 本教程以常用标准库为主，最后介绍三个数据分析基础库。示例适用于 Python 3.10 及更新版本；阅读前应掌握变量、条件、循环、函数、列表、字典和基本异常处理。

## 二、准备环境与导入模块

### 2.1 检查 Python

在终端执行：

```bash
python --version
```

如果环境中使用 `python3`，将本文命令中的 `python` 对应替换。Windows 也可能使用 `py`，应确认运行的是预期解释器。

创建一个独立的 `python-libs-practice` 文件夹，用编辑器保存 `.py` 文件，避免在重要项目目录里试验覆盖文件。

### 2.2 常见导入方式

```python
import math
from pathlib import Path
import statistics as stats

print(math.sqrt(25))
print(Path.cwd())
print(stats.mean([2, 4, 6]))
```

- `import math`：导入模块，通过 `math.函数名` 调用。
- `from pathlib import Path`：从模块导入特定对象。
- `as stats`：为导入对象设置别名。

初学时避免 `from 模块 import *`，否则不容易判断名称来自哪里。

**注意：** 不要把自己的文件命名为 `json.py`、`csv.py`、`random.py` 等同名模块，否则可能导入自己的文件，遮蔽真正的库。

### 2.3 安装第三方库

建议在项目目录创建虚拟环境：

```bash
python -m venv .venv
```

按终端选择一种激活方式：

```bash
# Linux / macOS 的 Bash 或 Zsh
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

激活后安装本教程后半部分需要的库：

```bash
python -m pip install numpy pandas matplotlib
```

标准库无需用 pip 安装。用 `python -m pip` 可以明确把安装操作交给当前 Python；在编辑器中也要选择同一虚拟环境的解释器。

如果不激活环境，也可直接运行其中的解释器，例如 Windows 的 `.venv\Scripts\python.exe` 或 Linux / macOS 的 `.venv/bin/python`。

## 三、math：常用数学运算

`math` 提供平方根、三角函数、对数和常量等功能，主要用于单个数值运算。

```python
import math

print(math.sqrt(25))       # 5.0
print(math.ceil(2.3))      # 3，向上取整
print(math.floor(2.8))     # 2，向下取整
print(math.pi)            # 圆周率
print(math.sin(math.pi / 2))
print(math.log10(1000))    # 3.0
print(math.isclose(0.1 + 0.2, 0.3))  # True
```

说明：

- 三角函数通常使用弧度，角度可用 `math.radians()` 转换。
- `math.sqrt(-1)` 不适用于实数运算，会产生 `ValueError`；复数运算可后续了解 `cmath`。
- 浮点数可能存在表示误差，近似比较可以使用 `math.isclose()`，并按任务选择容差。
- `abs()`、`round()`、`sum()` 是内置函数，不需要导入 `math`。

## 四、random：随机选择与简单模拟

```python
import random

rng = random.Random(42)

print(rng.randint(1, 6))
print(rng.choice(["Python", "C", "Java"]))
print(rng.sample(["A", "B", "C", "D"], 2))

items = [1, 2, 3, 4]
rng.shuffle(items)
print(items)
```

| 方法 | 用途 |
|---|---|
| `random()` | 生成大于等于 0、小于 1 的浮点数 |
| `randint(a, b)` | 生成包含两端点的随机整数 |
| `choice(items)` | 随机选择一个元素 |
| `sample(items, k)` | 不放回地抽取 k 个位置对应的元素 |
| `shuffle(items)` | 原地打乱可变序列，返回 `None` |

固定种子便于在相同条件下重复实验。不要将每种方法在不同 Python 版本中的具体输出都视为稳定约定。

`random` 用于模拟和抽样，不用于生成安全令牌；安全随机需求应使用 `secrets`。

## 五、statistics：基础统计

```python
import statistics

values = [18, 20, 20, 22]

print(statistics.mean(values))     # 20
print(statistics.median(values))   # 20.0
print(statistics.pstdev(values))   # 总体标准差
print(statistics.stdev(values))    # 样本标准差
```

- `mean()`：平均值。
- `median()`：中位数。
- `pstdev()`：将数据视为总体时的标准差。
- `stdev()`：估计样本标准差，要求至少两个数据。

调用前应检查数据是否为空、是否包含无效值。统计量选择与样本含义有关，不能只因函数可运行就认为结果适用。

## 六、pathlib：文件与目录路径

### 6.1 创建与组合路径

```python
from pathlib import Path

print(Path.cwd())

folder = Path("practice-data")
folder.mkdir(parents=True, exist_ok=True)

file_path = folder / "notes.txt"
print(file_path.name)      # notes.txt
print(file_path.stem)      # notes
print(file_path.suffix)    # .txt
print(file_path.parent)    # practice-data
```

`/` 在这里用于组合路径，不是数值除法。创建 `Path` 对象不代表文件已经存在。

### 6.2 读写文本

```python
from pathlib import Path

folder = Path("practice-data")
folder.mkdir(parents=True, exist_ok=True)
file_path = folder / "notes.txt"

file_path.write_text("今天学习 pathlib。\n", encoding="utf-8")
content = file_path.read_text(encoding="utf-8")
print(content)
```

`write_text()` 会覆盖已有同名文件。需要追加时可用 `open(..., "a")`，文件较大时也应考虑逐行读取。

### 6.3 检查与查找文件

```python
from pathlib import Path

folder = Path("practice-data")

print(folder.exists())
print(folder.is_dir())

for file_path in sorted(folder.glob("*.txt")):
    if file_path.is_file():
        print(file_path.name)
```

`glob("*.txt")` 查找当前层级的匹配项，`rglob("*.txt")` 递归查找。

相对路径从**程序运行时的当前工作目录**开始，不一定从脚本所在目录开始。需要相对脚本定位时，可在普通 `.py` 脚本中使用 `Path(__file__).resolve().parent`；交互窗口和部分笔记本环境没有 `__file__`。

## 七、文件读写与 with

`open()` 是内置函数，常与基础库配合使用。`with` 会在代码块结束时关闭文件。

```python
from pathlib import Path

file_path = Path("reading-example.txt")

with file_path.open("w", encoding="utf-8") as file:
    file.write("Python\n")
    file.write("Markdown\n")

with file_path.open("a", encoding="utf-8") as file:
    file.write("Git\n")

with file_path.open("r", encoding="utf-8") as file:
    for line in file:
        print(line.rstrip("\n"))
```

| 模式 | 含义 |
|---|---|
| `r` | 读取，文件不存在时报错 |
| `w` | 写入，覆盖已有内容；不存在时创建 |
| `a` | 追加，不存在时创建 |
| `x` | 新建写入，文件已存在时报错 |
| `rb` / `wb` | 二进制读取 / 写入，不使用文本编码参数 |

文本读写建议明确编码。遇到 `UnicodeDecodeError` 时检查源文件的实际编码，不要直接忽略错误以免丢失内容。

## 八、json：结构化数据读写

JSON 常用于配置、接口数据和分析结果。Python 字典与 JSON 文本是不同类型。

### 8.1 对象与字符串转换

```python
import json

data = {"name": "弧光", "members": 5, "active": True}

text = json.dumps(data, ensure_ascii=False, indent=2)
print(text)

restored = json.loads(text)
print(restored["name"])
```

- `dumps()`：Python 对象转 JSON 字符串。
- `loads()`：JSON 字符串转 Python 对象。
- `ensure_ascii=False`：输出中文字符，而非默认 ASCII 转义形式。
- `indent=2`：格式化缩进，方便阅读。

### 8.2 写入与读取文件

```python
import json
from pathlib import Path

file_path = Path("config-example.json")
data = {"project": "ArcLab", "languages": ["Python", "C"]}

with file_path.open("w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

with file_path.open("r", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded["languages"])
```

`dump()` / `load()` 处理文件对象；带 `s` 的 `dumps()` / `loads()` 处理字符串。

JSON 属性名和字符串使用双引号，标准 JSON 不支持注释。集合、日期对象等不能直接按默认方式序列化，需要先转换；不合法文本可能引发 `json.JSONDecodeError`。

## 九、csv：表格数据读写

CSV 适合保存规则的二维数据，例如采集记录和实验结果。字段中可能含逗号或换行，不应简单用 `split(",")` 代替 CSV 解析。

### 9.1 写入表格

```python
import csv

rows = [
    {"name": "sensor_a", "value": 20.5},
    {"name": "sensor_b", "value": 22.0},
]

with open("measurements.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=["name", "value"])
    writer.writeheader()
    writer.writerows(rows)
```

### 9.2 读取表格

先运行上一段生成文件，再读取：

```python
import csv

with open("measurements.csv", "r", encoding="utf-8", newline="") as file:
    reader = csv.DictReader(file)
    for row in reader:
        value = float(row["value"])
        print(row["name"], value)
```

说明：

- `newline=""` 让 `csv` 模块处理换行，减少跨平台换行问题。
- `DictReader` 用表头作为键，读取的普通字段默认是字符串。
- 数值转换需要检查空值和格式，`float("")` 会报错。
- 表头、编码和分隔符应与输入文件一致；部分带 BOM 的 UTF-8 文件可使用 `utf-8-sig` 读取。

## 十、datetime 与 time：时间记录和计时

### 10.1 日期计算与格式化

```python
from datetime import datetime, timedelta, timezone

started = datetime(2026, 11, 5, 9, 30)
deadline = started + timedelta(days=7)

print(started.strftime("%Y-%m-%d %H:%M"))
print(deadline.strftime("%Y-%m-%d"))

parsed = datetime.strptime("2026-11-05", "%Y-%m-%d")
print(parsed.date())

now_utc = datetime.now(timezone.utc)
print(now_utc.isoformat())
```

`strftime()` 把时间对象格式化为字符串，`strptime()` 按指定格式解析字符串。常见标记为 `%Y` 年、`%m` 月、`%d` 日、`%H` 时、`%M` 分、`%S` 秒。

上例的 `started` 没有时区，`now_utc` 有 UTC 时区。记录跨机器时间时应明确时区，不要直接混合无时区和有时区对象进行比较。

### 10.2 测量运行耗时

```python
import time

start = time.perf_counter()
total = sum(range(100_000))
elapsed = time.perf_counter() - start

print(total)
print(f"耗时：{elapsed:.6f} 秒")
```

测量时间间隔适合用 `perf_counter()`，记录现实日期时间适合用 `datetime`。一次简单计时不等于严谨的性能比较。

## 十一、collections：计数与分组

### 11.1 Counter 计数

```python
from collections import Counter

levels = ["INFO", "ERROR", "INFO", "WARNING", "ERROR"]
counts = Counter(levels)

print(counts["INFO"])        # 2
print(counts["DEBUG"])       # 0
print(counts.most_common(2))
```

适合统计类别、标签和日志级别。`Counter("ERROR")` 统计的是字符，`Counter(["ERROR"])` 统计的是完整字符串元素。

### 11.2 defaultdict 分组

```python
from collections import defaultdict

groups = defaultdict(list)
records = [("A", 20), ("B", 25), ("A", 22)]

for name, value in records:
    groups[name].append(value)

print(dict(groups))  # {'A': [20, 22], 'B': [25]}
```

`defaultdict(list)` 在用下标访问缺失键时创建一个新列表，减少重复的初始化代码。

## 十二、re：正则表达式

`re` 可以按模式查找、提取或替换文本。

```python
import re

text = "sensor_a=20.5, sensor_b=22.0"
values = re.findall(r"\d+(?:\.\d+)?", text)
print(values)  # ['20.5', '22.0']

filename = "  notes   day1  "
normalized = re.sub(r"\s+", "_", filename.strip())
print(normalized)  # notes_day1

print(re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", "sensor_a") is not None)
```

| 写法 | 常见含义 |
|---|---|
| `\d` | 数字字符 |
| `\s` | 空白字符 |
| `.` | 通常匹配除换行外的任意字符 |
| `+` | 前一项出现一次或多次 |
| `*` | 前一项出现零次或多次 |
| `?` | 前一项出现零次或一次 |
| `[A-Z]` | 一个大写英文字母 |
| `\.` | 字面点号 |

`r"..."` 是原始字符串写法，便于表达反斜杠。`search()` 查找任意位置的匹配，`fullmatch()` 检查整个字符串，`findall()` 返回所有匹配。

上例的数值模式仅用于演示正数与小数，不完整支持负数、科学计数法或全部数值格式。简单分隔和固定文本判断优先使用 `split()`、`in` 等字符串功能。

## 十三、os、sys 与 subprocess：运行环境和外部程序

### 13.1 查看解释器与读取环境变量

```python
import os
import sys

print(sys.version)
print(sys.executable)
print(os.environ.get("PROJECT_MODE", "practice"))
```

`sys.executable` 可用于确认当前解释器，`os.environ.get()` 读取环境变量并提供默认值。文件路径操作可以优先使用 `pathlib`。

### 13.2 调用外部程序

```python
import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-c", "print(2 + 3)"],
    capture_output=True,
    text=True,
    encoding="utf-8",
    check=True,
    timeout=5,
)

print(result.stdout.strip())  # 5
```

- 参数列表中的每个元素分别表示一个命令参数。
- `capture_output=True` 捕获标准输出和标准错误。
- `check=True` 在返回码非零时抛出 `CalledProcessError`。
- `timeout` 限制等待时间，超时抛出 `TimeoutExpired`。

不需要 Shell 功能时保留默认 `shell=False`。文件路径含空格时也作为一个列表元素传入，不要手工拼接成 Shell 命令。

## 十四、logging：记录运行过程

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)

logger.debug("检查输入细节")
logger.info("开始处理数据")
logger.warning("发现一条空记录")
logger.error("输入文件格式不正确")
```

常用级别从低到高为 `DEBUG`、`INFO`、`WARNING`、`ERROR`、`CRITICAL`。上例设置为 `INFO`，因此不会显示 `debug` 信息。

默认日志输出到标准错误流；如果希望写入文件，可在独立脚本的配置中指定 `filename="run.log"`、`encoding="utf-8"`。

`print()` 适合展示直接结果，日志适合记录进度、问题和排查信息。Notebook 或已配置日志的程序中，`basicConfig()` 可能不会改变现有设置，不要因此直接认为日志失效。

## 十五、argparse：为程序添加命令行参数

将下面代码保存为 `greet.py`：

```python
import argparse

parser = argparse.ArgumentParser(description="输出问候信息")
parser.add_argument("name", help="需要问候的名字")
parser.add_argument("--repeat", type=int, default=1, help="重复次数")
args = parser.parse_args()

if args.repeat < 1:
    parser.error("--repeat 必须大于等于 1")

for _ in range(args.repeat):
    print(f"Hello, {args.name}!")
```

在终端运行：

```bash
python greet.py ArcLab --repeat 2
python greet.py --help
```

`name` 是位置参数，`--repeat` 是可选参数。`type=int` 负责整数转换，取值范围仍需要程序检查。`--help` 会显示自动生成的用法说明。

## 十六、shutil 与 tempfile：复制和临时文件

```python
from pathlib import Path
import shutil
import tempfile

with tempfile.TemporaryDirectory() as temp_dir:
    folder = Path(temp_dir)
    source = folder / "source.txt"
    target = folder / "backup.txt"

    source.write_text("backup example\n", encoding="utf-8")
    shutil.copy2(source, target)
    print(target.read_text(encoding="utf-8"))
```

`copy2()` 复制内容并尝试保留文件元数据，具体保留情况取决于系统。临时目录在 `with` 结束后自动清理，不应当作永久存储位置。

目录操作还包括 `copytree()` 和 `rmtree()`，其中 `rmtree()` 会递归删除目录；初学练习不需要用它清理重要项目。

## 十七、NumPy：数组与批量数值计算

本节开始使用第三方库，需要先完成安装。

```python
import numpy as np

values = np.array([20.0, 21.5, 19.5, 22.0])

print(values.shape)        # (4,)
print(values.dtype)
print(values + 1)          # 每个元素加 1
print(values.mean())       # 20.75
print(values[values > 20]) # 条件筛选

matrix = np.array([[1, 2], [3, 4]])
print(matrix.shape)        # (2, 2)
print(matrix.sum(axis=0))  # [4 6]，沿行方向汇总，得到每列的和
print(matrix.sum(axis=1))  # [3 7]，沿列方向汇总，得到每行的和
```

数组有形状和数据类型，适合规则的数值数据。Python 列表的 `+` 常表示拼接，NumPy 数组的 `+` 通常表示逐元素相加。

数组的 `*` 是逐元素乘法，矩阵乘法通常使用 `@`。不同形状能否运算取决于广播规则；切片可能与原数组共享数据，需要独立副本时使用 `.copy()`。

## 十八、pandas：表格数据处理

```python
import pandas as pd

df = pd.DataFrame({
    "sensor": ["A", "A", "B", "B"],
    "value": [20.0, None, 22.0, 24.0],
})

print(df.head())
print(df["value"].isna())

clean = df.dropna(subset=["value"])
selected = clean.loc[clean["value"] >= 22, ["sensor", "value"]]
summary = clean.groupby("sensor", as_index=False)["value"].mean()

print(selected)
print(summary)
summary.to_csv("sensor-summary.csv", index=False, encoding="utf-8")
```

- `DataFrame` 表示二维表格，`Series` 常用于表示单列数据。
- `dropna()` 按指定条件移除缺失记录。
- `.loc` 按标签或条件选取行列。
- `groupby()` 按类别分组，随后计算统计量。
- `to_csv(..., index=False)` 保存时不额外写入行索引。

读取现有 CSV 可以使用 `pd.read_csv("文件路径")`。删除缺失值只是一种示例策略，实际项目应先判断缺失原因，记录清洗规则和被排除的数据量。

## 十九、Matplotlib：绘制与保存图表

```python
import matplotlib.pyplot as plt

times = [0, 1, 2, 3]
temperatures = [20.0, 21.5, 19.5, 22.0]

fig, ax = plt.subplots()
ax.plot(times, temperatures, marker="o", label="Sensor A")
ax.set_xlabel("Time (s)")
ax.set_ylabel("Temperature (deg C)")
ax.set_title("Temperature readings")
ax.grid(True, alpha=0.3)
ax.legend()
fig.tight_layout()
fig.savefig("temperature.png", dpi=150)
plt.close(fig)
```

`fig` 表示整张图，`ax` 表示绘图区。上例直接保存文件，不要求有图形窗口；在交互环境中需要显示时可在关闭前调用 `plt.show()`。

图表应标注名称和单位。示例用英文标签避免默认字体缺少中文；需要中文时应配置已安装的中文字体。保存同名图片会覆盖原文件。

## 二十、一个综合示例

下面编写一个仅使用标准库的程序：读取传感器 CSV，检查输入，按传感器分组统计，并保存 JSON 结果。

### 20.1 准备目录和输入

```text
sensor-demo/
├── analyze.py
└── data/
    └── readings.csv
```

创建 `data/readings.csv`，内容如下：

```csv
sensor,value
A,20
A,22
B,24
B,26
```

### 20.2 编写程序

将下面代码保存为 `analyze.py`：

```python
import argparse
import csv
import json
import logging
import math
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean


def load_values(file_path):
    groups = defaultdict(list)
    with file_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if reader.fieldnames != ["sensor", "value"]:
            raise ValueError("表头必须依次为 sensor,value")

        for record_no, row in enumerate(reader, start=1):
            # CSV 记录可能跨行，这里记录数据记录序号，不称为文件行号。
            sensor = (row.get("sensor") or "").strip()
            if None in row or not sensor:
                raise ValueError(f"第 {record_no} 条记录的列数或名称有误")
            try:
                value = float(row["value"])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"第 {record_no} 条记录不是有效数值") from exc
            if not math.isfinite(value):
                raise ValueError(f"第 {record_no} 条记录不是有限数值")
            groups[sensor].append(value)

    if not groups:
        raise ValueError("输入没有数据记录")
    return groups


def main():
    parser = argparse.ArgumentParser(description="按传感器统计 CSV 数据")
    parser.add_argument("input", type=Path, help="输入 CSV 路径")
    parser.add_argument("--output", type=Path, default=Path("output/summary.json"))
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    try:
        if args.input.resolve() == args.output.resolve():
            raise ValueError("输出路径不能与输入路径相同")
        groups = load_values(args.input)
        summary = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "sensors": {
                sensor: {
                    "count": len(values),
                    "mean": mean(values),
                    "min": min(values),
                    "max": max(values),
                }
                for sensor, values in sorted(groups.items())
            },
        }
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(
            json.dumps(summary, ensure_ascii=False, indent=2, allow_nan=False) + "\n",
            encoding="utf-8",
        )
    except (OSError, ValueError, csv.Error) as exc:
        parser.exit(1, f"处理失败：{exc}\n")

    logging.info("已完成 %d 个传感器的统计，结果：%s", len(groups), args.output)


if __name__ == "__main__":
    main()
```

### 20.3 运行与检查

在 `sensor-demo` 目录打开终端：

```bash
python analyze.py data/readings.csv --output output/summary.json
python analyze.py --help
```

打开结果文件，应看到 A、B 各有 2 条记录，平均值分别为 `21.0`、`25.0`。生成时间按 UTC 记录，每次运行不同。

上例采用“遇到无效数据立即停止”的规则，输出同名文件会覆盖。实际项目也可以设计为跳过无效记录，但必须明确记录跳过数量和原因。该示例将数据保存在内存中，适合小型练习，不适合直接处理超大文件。

## 二十一、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| `ModuleNotFoundError` | 第三方库未安装，或装到了其他解释器 | 检查 `sys.executable`，用该解释器执行 `-m pip` |
| 导入出现循环引用或找不到函数 | 自己的文件与库同名 | 检查 `json.py` 等命名，改名并重启解释器 |
| `FileNotFoundError` | 路径不对或工作目录不同 | 打印 `Path.cwd()`，检查文件实际位置 |
| `PermissionError` | 目录无写入权限、文件被占用等 | 检查目标目录与文件占用情况 |
| `UnicodeDecodeError` | 文件编码与读取编码不一致 | 确认来源编码，再设置 `encoding` |
| `JSONDecodeError` | JSON 格式不正确 | 检查双引号、逗号、括号及错误位置 |
| CSV 数值转换失败 | 字段为空、带非数值内容或列不对 | 检查表头和原始记录，明确转换规则 |
| `KeyError` | 字典键或表头与预期不一致 | 检查实际字段名、大小写和 BOM |
| 正则结果不符合预期 | 转义、匹配范围或分组理解有误 | 用最小文本测试，优先使用原始字符串 |
| 日志没有 INFO 信息 | 日志级别或已有配置影响输出 | 检查级别和处理器，独立脚本中验证 |
| NumPy 运算形状不匹配 | 数组形状不符合广播或矩阵运算要求 | 查看 `.shape`，明确运算维度 |
| 图中中文显示成方框 | 当前字体不包含中文字形 | 选择并配置已安装的中文字体 |

## 二十二、练习

请在独立练习目录完成，保留输入数据、程序、输出和简短说明。

### 22.1 标准库基础

- [ ] 用 `math` 计算半径为 3 的圆面积，并近似比较计算结果。
- [ ] 用固定种子的 `random.Random` 模拟投骰子 100 次，再用 `Counter` 统计点数。
- [ ] 用 `pathlib` 查找目录中的 `.md` 文件，输出名称与大小。
- [ ] 用 `json` 保存一份学习计划，再读取并输出任务名称。
- [ ] 写入含表头的 CSV，读取后将数值字段转换为数字并求平均。
- [ ] 用 `datetime` 计算某一天之后第 7 天的日期。
- [ ] 用 `re` 从样例日志中提取符合约定格式的编号。
- [ ] 用 `logging` 区分运行进度与错误信息。

### 22.2 综合示例扩展

1. 跑通传感器统计程序，核对每组数量、平均值、最小值和最大值。
2. 加入一条 C 传感器记录，重新运行并检查输出。
3. 分别尝试空文件、只有表头、空传感器名称、无效数值和 `NaN`，观察错误信息。
4. 给程序添加一个可选阈值参数，统计每组超过阈值的记录数量。
5. 将输入格式、运行命令、处理规则和预期输出写成 README。

### 22.3 第三方库练习（选做）

- [ ] 用 NumPy 计算一组数据的均值，并筛选大于均值的数据。
- [ ] 用 pandas 读取同一份传感器 CSV，按传感器统计均值，与标准库结果比较。
- [ ] 用 Matplotlib 绘制采样值曲线，标注横轴、纵轴及单位，保存 PNG。
- [ ] 记录所用 Python 和第三方库版本，让另一名同学复现结果。

## 二十三、常用功能速查表

| 需求 | 常用模块或库 | 示例 |
|---|---|---|
| 开平方 | `math` | `math.sqrt(25)` |
| 随机选择 | `random` | `rng.choice(items)` |
| 平均数 | `statistics` | `statistics.mean(values)` |
| 组合路径 | `pathlib` | `Path("data") / "input.csv"` |
| 读取文本 | `pathlib` | `path.read_text(encoding="utf-8")` |
| 递归找文件 | `pathlib` | `folder.rglob("*.md")` |
| JSON 字符串编码 / 解码 | `json` | `json.dumps(data)` / `json.loads(text)` |
| CSV 字典读取 / 写入 | `csv` | `csv.DictReader(file)` / `csv.DictWriter(file, fieldnames=...)` |
| 格式化时间 | `datetime` | `dt.strftime("%Y-%m-%d")` |
| 日期偏移 | `datetime` | `dt + timedelta(days=7)` |
| 测量耗时 | `time` | 两次 `time.perf_counter()` 作差 |
| 分类计数 | `collections` | `Counter(items)` |
| 按键分组 | `collections` | `defaultdict(list)` |
| 模式查找 | `re` | `re.findall(pattern, text)` |
| 查看解释器路径 | `sys` | `sys.executable` |
| 读取环境变量 | `os` | `os.environ.get("PROJECT_MODE")` |
| 运行外部命令 | `subprocess` | `subprocess.run(args, check=True)` |
| 输出运行日志 | `logging` | `logger.info("处理完成")` |
| 命令行参数 | `argparse` | `parser.add_argument("input")` |
| 复制文件 | `shutil` | `shutil.copy2(source, target)` |
| 自动清理临时目录 | `tempfile` | `tempfile.TemporaryDirectory()` |
| 数值数组 | NumPy | `np.array(values)` |
| 表格读取 | pandas | `pd.read_csv(path)` |
| 创建绘图区 | Matplotlib | `fig, ax = plt.subplots()` |

速查表示例中的 `path`、`rng`、`logger`、`parser` 等对象需要先按正文创建，不能脱离上下文直接运行。

## 二十四、相关学习资料

- [Python 官方中文标准库目录](https://docs.python.org/zh-cn/3/library/index.html)：按实际任务查阅模块，不必逐页通读。
- [pathlib 文档](https://docs.python.org/zh-cn/3/library/pathlib.html)：文件与目录路径。
- [json 文档](https://docs.python.org/zh-cn/3/library/json.html)、[csv 文档](https://docs.python.org/zh-cn/3/library/csv.html)：结构化数据读写。
- [collections 文档](https://docs.python.org/zh-cn/3/library/collections.html)：计数与分组等容器工具。
- [datetime 文档](https://docs.python.org/zh-cn/3/library/datetime.html)、[re 文档](https://docs.python.org/zh-cn/3/library/re.html)：时间和文本处理。
- [logging 入门](https://docs.python.org/zh-cn/3/howto/logging.html)、[argparse 教程](https://docs.python.org/zh-cn/3/howto/argparse.html)：日志与命令行程序。
- [NumPy 官方入门](https://numpy.org/doc/stable/user/absolute_beginners.html)：英文，介绍数组、形状和基础运算。
- [pandas 官方入门](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html)：英文，介绍表格读写、筛选、统计和绘图。
- [Matplotlib 官方入门](https://matplotlib.org/stable/users/explain/quick_start.html)：英文，介绍图形对象与绘图方法。

阅读官方文档时注意版本选择，应优先查看与自己安装版本对应的页面。
