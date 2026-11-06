---
title: "开发环境与文件路径"
layout: lesson
description: "分清编辑器、解释器和工作目录，让项目在正确位置运行。"
category_label: "建立共同基础"
lesson_slug: environment-paths
---
## 一、什么是开发环境？

开发环境是完成编写、运行和检查程序所需的一组工具与配置，包括操作系统、编辑器、解释器或编译器、依赖库、终端和项目配置。

“安装了编辑器”不等于已经具备运行某种语言的全部条件。例如 VS Code 可以编辑 Python，但执行代码仍需要 Python 解释器。

### 为什么要学习？

- 知道程序由哪个工具、哪个环境执行。
- 避免“文件明明存在却找不到”的路径问题。
- 区分项目代码、依赖、数据与输出。
- 让同伴能按说明配置并运行同一项目。

本教程使用 Python 演示通用概念。终端命令假设已安装 Python；系统使用 `python3` 或 `py` 时按实际替换。

## 二、编辑器、终端与运行工具

| 工具 | 主要作用 | 示例 |
|---|---|---|
| 编辑器 | 修改与保存文本代码 | VS Code、文本编辑器 |
| 终端 | 输入命令、查看输出 | 系统终端、PowerShell |
| Shell | 解释终端中的命令 | Bash、Zsh、PowerShell |
| 解释器 | 执行对应语言程序 | Python |
| 编译器 | 把源码转换为目标代码等 | g++、Clang |
| 包管理器 | 安装和管理依赖 | pip、Conda |

在 Python 的 `>>>` 提示符中输入 `pip install ...`，与在系统终端执行安装命令不是同一件事。先确认当前是在 Shell、Python 交互窗口、Notebook，还是调试器里。

## 三、文件名、扩展名与文件类型

### 3.1 文件名与扩展名

```text
hello.py         Python 源文件
README.md        Markdown 文档
readings.csv     CSV 数据
config.json      JSON 配置
```

扩展名是名称的一部分，帮助工具判断用途，不保证内容格式正确。把 `.txt` 改成 `.png` 不会得到一张图片。

### 3.2 隐藏扩展名与双重扩展名

某些文件管理器隐藏已知扩展名，界面显示 `hello.py`，实际可能是 `hello.py.txt`。遇到无法运行时，查看文件属性或启用完整文件名显示。

以 `.` 开头的名称在 Linux 等环境中通常作为隐藏项，例如 `.gitignore`；隐藏不等于文件不存在。

### 3.3 命名习惯

项目内建议使用含义明确且一致的名称，例如 `sample_data.csv`、`run_demo.py`。中文路径本身可以有效，但某些工具链兼容有限，入门练习可优先使用短且无空格的目录名。

不要把脚本命名为 `json.py`、`csv.py` 等，避免与库重名。

## 四、目录、绝对路径与相对路径

### 4.1 目录结构

```text
path-demo/
├── main.py
├── data/
│   └── input.txt
└── output/
```

目录用于组织文件，项目根目录通常是放 README、配置与主要代码入口的位置，不等于系统根目录。

### 4.2 两种路径

| 类型 | 含义 | 示例 |
|---|---|---|
| 绝对路径 | 从文件系统的明确起点定位 | `/home/student/path-demo/main.py` |
| Windows 绝对路径 | 包含盘符等完整位置 | `C:\projects\path-demo\main.py` |
| 相对路径 | 从当前参照目录定位 | `data/input.txt` |

- `.` 表示当前目录。
- `..` 表示上一级目录。
- Shell 中的 `~` 常表示用户主目录；程序字符串不一定自动展开它。

Windows 还有 UNC 等路径形式，本教程先掌握本机普通文件路径。

### 4.3 空格、大小写与分隔符

终端中的路径含空格时，用引号包住：

```bash
cd "my project"
```

Linux 路径通常区分大小写；其他系统是否区分还取决于文件系统设置。统一文件名大小写，不依赖“在自己电脑上能找到”。

Python 字符串中反斜杠可能表示转义。Windows 路径可用原始字符串或 `Path` 组合，不要手工拼出 `\n`、`\t` 等歧义序列。

## 五、当前工作目录与脚本目录

### 5.1 当前工作目录

程序中的普通相对路径通常从当前工作目录出发，不一定从源码目录出发。

保存为 `where_am_i.py`：

```python
from pathlib import Path

print("当前工作目录：", Path.cwd())
print("脚本位置：", Path(__file__).resolve())
print("脚本目录：", Path(__file__).resolve().parent)
```

在终端中从不同目录运行这个文件，对比结果。普通脚本中的 `__file__` 可定位源码；Notebook 或交互窗口通常不能直接照搬这一用法。

### 5.2 两种路径策略

```python
from pathlib import Path

# 策略一：按调用者的工作目录解释输入。
input_from_cwd = Path("data") / "input.txt"

# 策略二：读取与脚本一起交付的固定资源。
base_dir = Path(__file__).resolve().parent
input_from_script = base_dir / "data" / "input.txt"
```

两种方式都有用途。命令行工具常按工作目录解释用户提供的路径；跟脚本一起发布的固定样例可相对脚本定位。项目应明确约定，不要随意切换。

## 六、PATH 与命令查找

### 6.1 PATH 是什么？

PATH 是 Shell 或系统查找可执行命令时使用的目录列表。输入 `python` 时，实际运行哪个解释器受 PATH、别名和启动方式等影响。

查看 Python 实际位置：

```bash
python -c "import sys; print(sys.executable)"
python --version
```

### 6.2 路径与环境变量

环境变量保存传给进程的配置，不是全部都表示文件路径。查看时只打印需要的项，不要把可能包含令牌的整个环境公开贴出。

```python
import os

print(os.environ.get("PROJECT_MODE", "practice"))
```

不要为临时练习随意覆盖 PATH、HOME 等系统变量。命令找不到时，先检查安装位置、终端和环境激活状态。

## 七、虚拟环境与依赖安装

### 7.1 一个项目一个环境

虚拟环境隔离依赖，避免不同项目争用同一组库。可以选择 venv 或 Conda，初学时不要叠加激活两种环境。

venv 示例：

```bash
python -m venv .venv
```

Bash / Zsh 激活：

```bash
source .venv/bin/activate
```

Windows PowerShell 激活：

```powershell
.venv\Scripts\Activate.ps1
```

激活受限制时，也可直接调用环境内解释器，不需要为了跟做而全局放宽系统策略。

### 7.2 确认安装目标

```bash
python -m pip --version
python -c "import sys; print(sys.executable)"
```

使用 `python -m pip` 可以将安装操作交给当前 Python。编辑器、Notebook 内核和已有终端可能指向不同环境，需要分别确认。

### 7.3 环境说明

项目应记录 Python 版本、主要依赖与安装方法。`requirements.txt`、`environment.yml` 都是常用方式，但含义不同；Conda 文件不能直接交给 pip 使用。

环境目录通常不上传到 Git，保存创建说明和依赖配置即可。具体操作见同目录的 Miniconda 与 Conda 教程。

## 八、文本编码与权限

### 8.1 明确文本编码

```python
from pathlib import Path

path = Path("notes-example.txt")
path.write_text("今天完成环境配置。\n", encoding="utf-8")
print(path.read_text(encoding="utf-8"))
```

这会覆盖已有同名文件。读取编码要与文件实际编码相符，出现乱码或解码错误时先确认来源，不直接忽略错误。

### 8.2 读写权限

文件存在不代表当前用户可读取，目录存在也不代表可以在里面写入。Linux 可用 `ls -l` 检查，Windows 可查看文件属性与权限。

个人项目放在用户可写目录。权限错误不应一律通过管理员身份或 `sudo` 运行程序解决。

## 九、项目目录与原始数据

推荐小型结构：

```text
project/
├── README.md
├── main.py
├── data/
│   └── sample.txt
├── output/
├── tests/
└── environment.yml
```

代码、输入和输出分开。原始数据尽量保留，清洗或分析结果另存，不让实验脚本直接覆盖唯一输入。

备份、版本管理和同步不是同一个概念。Git 能记录被提交的文件，不会自动备份未跟踪的大数据、外部设备配置或云端资源。

## 十、一个综合示例：换个目录也能运行

### 10.1 准备文件

在独立的 `path-demo` 中创建：

```text
path-demo/
├── main.py
└── data/
    └── input.txt
```

`data/input.txt` 内容：

```text
Python
Markdown
Git
```

`main.py`：

```python
from pathlib import Path
import sys


def main():
    base_dir = Path(__file__).resolve().parent
    input_path = base_dir / "data" / "input.txt"
    output_dir = base_dir / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    lines = input_path.read_text(encoding="utf-8").splitlines()
    nonempty = [line for line in lines if line.strip()]
    report = f"非空行数：{len(nonempty)}\n"
    (output_dir / "report.txt").write_text(report, encoding="utf-8")

    print("解释器：", sys.executable)
    print("工作目录：", Path.cwd())
    print("输入：", input_path)
    print(report, end="")


if __name__ == "__main__":
    main()
```

### 10.2 从项目内运行

```bash
python main.py
```

预期统计出 3 个非空行，结果保存在项目的 `output/report.txt`。

### 10.3 从上级目录运行

```bash
cd ..
python path-demo/main.py
```

统计仍应成功，输出仍在项目目录中。原因是固定资源相对脚本定位，而不是依赖当前工作目录。

重复运行会覆盖报告文件，符合本例约定。删除输入时应出现明确的文件错误，不应凭空生成假数据继续报告成功。

## 十一、常见问题排查

| 问题 | 优先检查 |
|---|---|
| 文件存在但找不到 | 当前工作目录、相对路径起点、完整文件名 |
| `.py` 被当成文本 | 实际扩展名、启动方式与解释器 |
| 安装后仍无法导入 | pip 和运行程序是否使用同一 Python |
| Notebook 可以，终端不行 | 内核、解释器和工作目录是否一致 |
| 换电脑后路径失效 | 是否写死某人的绝对路径 |
| 中文读取报错 | 源文件编码与 `encoding` 参数 |
| 写入失败 | 父目录、权限、占用与磁盘空间 |
| 命令找不到 | 安装位置、激活状态与 PATH |
| 改代码后结果没变化 | 文件是否保存、运行的是否为正确文件 |

## 十二、练习

- [ ] 区分编辑器、终端、Shell 和解释器。
- [ ] 查看一个文件的完整名称，识别双重扩展名。
- [ ] 画出自己的项目目录树。
- [ ] 用两种相对路径定位同一个样例文件。
- [ ] 从两个工作目录运行 `where_am_i.py`，记录区别。
- [ ] 创建独立环境，核对解释器与 pip 路径。
- [ ] 完成综合示例，验证从上级目录运行仍成功。
- [ ] 删除或重命名练习输入，读懂错误，再恢复文件。
- [ ] 写一份环境说明，请同伴按步骤运行。

验收：能解释“在哪个目录、由哪个 Python、读取哪个文件、结果写到哪里”。

## 十三、常用操作速查表

| 需求 | 示例 |
|---|---|
| 当前目录 | Python 中 `Path.cwd()` |
| 脚本目录 | 普通脚本中 `Path(__file__).resolve().parent` |
| 组合路径 | `base / "data" / "input.txt"` |
| 判断普通文件 | `path.is_file()` |
| 建立父目录 | `path.mkdir(parents=True, exist_ok=True)` |
| 读取文本 | `path.read_text(encoding="utf-8")` |
| 查看解释器 | `python -c "import sys; print(sys.executable)"` |
| 查看 pip 位置 | `python -m pip --version` |
| 创建 venv | `python -m venv .venv` |

变量需按正文先定义；路径策略应按项目输入约定选择。

## 十四、相关学习资料

- [Python 官方 pathlib](https://docs.python.org/zh-cn/3/library/pathlib.html)：路径组合、读写与检查。
- [Python 官方 venv](https://docs.python.org/zh-cn/3/library/venv.html)：环境创建和使用。
- [VS Code Python 环境说明](https://code.visualstudio.com/docs/python/environments)：解释器选择。
- [Conda 环境管理](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)：使用 Conda 的项目查阅。
