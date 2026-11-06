---
title: "Miniconda 与 Conda"
layout: lesson
description: "创建独立环境、管理依赖，并把运行条件交给同伴。"
category_label: "开始编程实践"
lesson_slug: conda
---
## 一、什么是 Miniconda 和 Conda？

Miniconda 是一个较小的安装发行包，包含 Conda、Python 和运行所需的少量基础包。Conda 是环境管理器和包管理器，可以创建独立环境、选择 Python 版本，并安装和管理软件依赖。

### 几个常见名称的区别

| 名称 | 是什么 | 常见用途 |
|---|---|---|
| Python | 编程语言及其解释器 | 执行 `.py` 程序 |
| Conda | 环境与包管理工具 | 管理 Python 版本和软件依赖 |
| Miniconda | 较精简的 Conda 安装发行包 | 按项目需要安装包 |
| Anaconda Distribution | 预装较多数据科学工具的发行包 | 获取一组预配置工具 |
| pip | Python 包安装工具 | 安装 PyPI 等来源的 Python 包 |
| venv | Python 自带的虚拟环境工具 | 基于已有 Python 创建环境 |

Conda 管理的不只是 Python 包，还可管理许多编译库和其他语言工具。它不替代操作系统、驱动程序，也不是 Docker 那样的容器系统。

### 为什么要使用？

假设两个项目依赖不同的 Python 或库版本：

```text
项目 A → Python 3.11 + 一组项目依赖
项目 B → Python 3.12 + 另一组项目依赖
```

如果都装在同一个环境中，更新一个库可能影响另一个项目。使用独立环境可以减少这类冲突，也便于记录和交接项目配置。

**建议：** 一个项目或一组兼容的练习使用一个环境。不要把所有学习库都堆到 `base` 环境里。

## 二、安装 Miniconda

### 2.1 选择安装程序

访问 [Miniconda 官方安装指引](https://www.anaconda.com/docs/getting-started/installation)，选择 Miniconda 以及对应的系统和架构：

- Windows、macOS 或 Linux。
- x86-64 或 ARM64 等与设备匹配的架构。
- Apple Silicon 电脑通常应选择对应 ARM64 安装包。

安装步骤、支持的系统及可用安装包以官方页面为准。已经有可正常使用的 Conda 时，一般不需要为了跟做本教程再次安装。

### 2.2 Windows

1. 运行对应安装程序，按向导选择安装位置。
2. 个人电脑可按需要选择仅为当前用户安装。
3. 安装完成后打开安装程序提供的 Miniconda Prompt 或相应命令提示符。
4. 先确认 Conda 可以运行，再按需初始化 PowerShell 等终端。

不要为了让命令立即可用，随意把多个 Python、Conda 安装目录全部加入系统 PATH。终端中使用哪个解释器，应通过后文检查确认。

### 2.3 macOS / Linux

按官网选择图形安装或 Shell 安装方式。使用 Shell 安装包时，先进入下载目录，再运行实际文件：

```text
bash 你下载的Miniconda安装包.sh
```

这里是格式说明，需要替换成真实文件名，不要原样执行。按向导确认安装目录、初始化选项，完成后重新打开终端。

### 2.4 检查安装

```bash
conda --version
conda info
```

如果能显示 Conda 版本、安装位置和平台等信息，说明当前终端能够调用 Conda。

## 三、终端初始化与 base 环境

### 3.1 conda init

某些终端中，`conda` 可以运行，但 `conda activate` 仍提示需要初始化。按实际 Shell 选择一种：

```bash
conda init bash
```

```bash
conda init zsh
```

```powershell
conda init powershell
```

`conda init` 会调整相应 Shell 的启动配置，不需要每次开终端都运行。执行后按提示关闭并重新打开终端。

如果当前终端完全找不到 `conda`，先从安装程序提供的终端或安装位置确认安装，不要直接把“初始化”当成所有问题的解决办法。

### 3.2 base 是什么？

`base` 是 Conda 安装的基础环境，通常包含 Conda 本身。提示符中的 `(base)` 表示当前激活它，不代表项目环境已经创建。

可以选择关闭新终端自动激活 base：

```bash
conda config --set auto_activate_base false
```

这只是改变默认激活行为，不会卸载 Conda，也不删除 base。需要时仍可执行 `conda activate base`。

## 四、环境、项目目录与解释器

### 4.1 环境与目录不是一回事

| 内容 | 保存什么 | 示例 |
|---|---|---|
| 项目目录 | 代码、输入数据、README、配置文件 | `my-project/` |
| Conda 环境 | Python、库和环境所需文件 | 名为 `arclab-py` 的环境 |
| 当前工作目录 | 相对路径查找的起点 | 执行程序时所在的目录 |

激活环境不会自动进入项目目录，进入项目目录也不会必然激活对应环境。

### 4.2 命名环境与路径环境

命名环境常通过 `-n` 指定名称，路径环境常通过 `-p` 指定位置。本教程以命名环境为主。

同一个项目中不要再叠加激活 venv 环境，避免解释器与依赖来源混淆。

## 五、创建与查看环境

### 5.1 创建环境

下面创建 Python 3.11 环境，从 conda-forge 获取包：

```bash
conda create -n arclab-py --override-channels -c conda-forge python=3.11 pip
```

参数说明：

- `-n arclab-py`：环境名称。
- `python=3.11`：选择 Python 3.11 系列。
- `pip`：在该环境安装 pip，方便后续按需使用。
- `-c conda-forge`：指定软件源。
- `--override-channels`：本次不额外使用配置中的其他源。

先阅读将安装的软件包与位置，再确认执行。需要网络，求解结果也取决于当前平台和可用包。

### 5.2 查看环境列表

```bash
conda env list
```

也可以使用：

```bash
conda info --envs
```

当前激活环境通常有 `*` 标记，同时会显示实际安装路径。

### 5.3 一次声明主要依赖

还没有创建环境时，可以把需求一起交给求解器：

```bash
conda create -n data-practice --override-channels -c conda-forge python=3.11 numpy pandas matplotlib
```

上面是另一个环境示例，不需要为了学会创建命令而把所有示例环境都建一遍。

## 六、激活、切换与退出

### 6.1 激活环境

```bash
conda activate arclab-py
python --version
```

激活会调整当前 Shell 的环境变量和命令查找路径，让命令优先使用对应环境的工具。它不会改变已打开程序内部的解释器。

### 6.2 确认 Python 路径

```bash
python -c "import sys; print(sys.executable)"
python -m pip --version
```

检查输出路径是否位于预期环境中。提示符可能经过定制，因此不能只凭环境名称判断。

### 6.3 切换与退出

```bash
conda activate data-practice
conda deactivate
```

切换命令要求目标环境已存在。`deactivate` 退出当前激活层，可能回到 base 或之前的状态；不等于删除环境。

## 七、安装、查询和删除软件包

### 7.1 安装包

为指定环境安装：

```bash
conda install -n arclab-py --override-channels -c conda-forge numpy pandas matplotlib
```

如果已经激活目标环境，也可以省略 `-n`；初学时保留环境名有助于确认目标。

Conda 会求解依赖，安装某个包可能同时安装或调整其他包。阅读执行计划，不要只看自己输入的包名。

### 7.2 搜索与查看

```bash
conda search --override-channels -c conda-forge numpy
conda list -n arclab-py
conda list -n arclab-py numpy
```

`search` 查询软件源中的包，`list` 查看环境中已安装的包。`conda list` 最后的名称参数用于筛选显示，不会安装包。

### 7.3 指定版本

```bash
conda install -n arclab-py --override-channels -c conda-forge "numpy=1.26"
```

这是版本约束的写法示例，不要求把现有环境降级。指定版本能否满足，还取决于 Python、平台和其他依赖。

版本范围使用引号，避免 Shell 把比较符解释为重定向等语法：

```bash
conda install -n arclab-py --override-channels -c conda-forge "numpy>=1.26,<3"
```

### 7.4 删除包

```bash
conda remove -n arclab-py matplotlib
```

删除可能连带影响依赖它的包，执行前检查计划。不要直接删除环境内的库文件来代替卸载。

## 八、Channel：软件源与配置

### 8.1 什么是 Channel？

Channel 是 Conda 查找与下载包的位置，例如 conda-forge 和配置中的默认源。不同源可能采用不同构建和依赖组合。

本教程的主要安装示例明确指定 conda-forge，并通过 `--override-channels` 避免无意混用。

### 8.2 查看配置

```bash
conda config --show-sources
conda config --show channels
conda config --show channel_priority
```

`.condarc` 是常见的配置文件。配置可能来自多个位置，因此不要只修改一个文件就认为其他设置已全部消失。

### 8.3 配置当前环境的源

如果希望后续在同一环境中省略重复参数，激活目标环境后可配置：

```bash
conda activate arclab-py
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
```

这些设置针对当前激活环境。仍应查看最终生效的源列表；本教程保留显式安装参数，便于独立阅读。

严格优先级用于限制同名包跨源选择，不保证任意混源都兼容，也可能让某些依赖组合无法满足。项目尽量保持一致的软件源策略。

### 8.4 镜像与使用条件

网络较慢时，可按学校或团队提供的可信镜像配置说明操作，并记录变更。Conda 的 channel 与 pip 的 index 是两套配置，修改其中一个不代表另一个同步改变。

软件下载源、服务条款及组织使用条件应按所选提供方的当前说明执行，Miniconda、Conda 工具与某个源服务不能简单视为同一件事。

## 九、Conda 与 pip 配合使用

### 9.1 基本顺序

1. 创建独立 Conda 环境。
2. 先用 Conda 安装能满足需求的依赖。
3. 再用该环境的 pip 安装其余包。
4. 记录 Conda 和 pip 两部分依赖，安装后运行验证。

### 9.2 用当前解释器调用 pip

例如，选择 PyPI 的 OpenCV 包时：

```bash
conda activate arclab-py
python -m pip install opencv-python
python -m pip check
```

前提是环境中尚未通过其他方式安装 OpenCV。不同 OpenCV 发行包都提供 `cv2`，同一环境只选择一套，不要再叠加安装 Conda 的 `opencv` 或另一个提供 `cv2` 的 pip 包。

`pip check` 检查已声明的 Python 依赖关系，不验证全部底层二进制兼容性、设备与实际功能。

### 9.3 注意事项

- 不要在 Conda 环境中使用 `pip install --user`，避免包落到环境外。
- 避免在 Conda 与 pip 中来回替换同一个包。
- pip 安装可能替换 Conda 已安装的依赖，Conda 求解器不能完整掌握这些变更。
- pip 参与后若要大幅调整 Conda 依赖，优先修改依赖说明并新建环境验证。
- `pip freeze` 输出不是完整 Conda 环境说明，不能记录 Python 解释器和全部底层库。

## 十、验证库与运行程序

### 10.1 简单导入检查

```bash
conda activate arclab-py
python -c "import numpy; print(numpy.__version__)"
```

能安装不代表能运行，至少检查一次真实导入和最小功能。

### 10.2 保存测试脚本

将下面代码保存为 `check_env.py`：

```python
import sys
import numpy as np

print("解释器：", sys.executable)
print("Python：", sys.version)
print("NumPy：", np.__version__)
print("平均值：", np.array([20, 22, 24]).mean())
```

在脚本所在目录执行：

```bash
python check_env.py
```

平均值应为 `22.0`，解释器应位于目标环境。

### 10.3 不激活也能运行

```bash
conda run -n arclab-py python check_env.py
```

`conda run` 在指定环境中启动命令，不要求当前 Shell 已激活该环境，但脚本路径仍需正确。适合自动化或不方便修改当前激活状态的场景。

## 十一、在 VS Code 与 Jupyter 中使用

### 11.1 VS Code 选择解释器

1. 打开项目目录，安装或启用 Python 扩展。
2. 在命令面板选择 `Python: Select Interpreter`。
3. 选择对应的 Conda 环境。
4. 重新打开所需终端，运行 `sys.executable` 检查。

编辑器选中的解释器、已有终端和 Notebook 内核可能各不相同，需要分别确认。

### 11.2 注册 Jupyter 内核

需要 Notebook 时，建议在项目初始依赖中加入 `ipykernel`：

```bash
conda install -n arclab-py --override-channels -c conda-forge ipykernel
conda activate arclab-py
python -m ipykernel install --user --name arclab-py --display-name "Python (arclab-py)"
```

这组 Conda 安装操作应安排在 pip 安装阶段之前。内核注册中的 `--user` 表示安装用户级内核说明，与不建议使用的 `pip install --user` 不是同一操作。

注册内核不等于安装完整 Jupyter 界面。可以在已配置的 VS Code 或 Jupyter 中选择该内核，并执行：

```python
import sys
print(sys.executable)
```

删除 Conda 环境后，旧内核条目可能还在。可用 `jupyter kernelspec list` 查看，确认后用 `jupyter kernelspec uninstall arclab-py` 移除对应注册信息。

## 十二、environment.yml：描述项目环境

### 12.1 手写一份环境文件

新建 `environment.yml`：

```yaml
name: arclab-data
channels:
  - conda-forge
  - nodefaults
dependencies:
  - python=3.11
  - numpy
  - pandas
  - matplotlib
  - pip
```

- `name`：默认环境名称。
- `channels`：软件源与顺序。
- `nodefaults`：环境文件中的特殊项，表示不额外使用默认源，不是实际下载源。
- `dependencies`：需要安装的包及约束。

YAML 用空格缩进，不要用 Tab。

### 12.2 从文件创建

```bash
conda env create -f environment.yml
conda activate arclab-data
```

指定不同名称创建副本：

```bash
conda env create -n arclab-data-copy -f environment.yml
```

目标环境应尚未存在。环境名称相同不代表依赖一定相同，实际结果仍受文件内容与求解结果影响。

### 12.3 包含 pip 依赖

例如项目确实选择 pip 安装 OpenCV 时，可写：

```yaml
name: arclab-vision
channels:
  - conda-forge
  - nodefaults
dependencies:
  - python=3.11
  - numpy
  - pip
  - pip:
      - opencv-python
```

不同时添加 Conda 的 OpenCV 包。跨机器共享时仍需确认目标平台支持所选版本，必要时为项目补充经过验证的版本约束。

## 十三、导出与复现环境

### 13.1 导出主要安装需求

```bash
conda env export -n arclab-py --from-history --file environment-history.yml
```

`--from-history` 主要记录 Conda 显式安装需求，减少平台相关的间接依赖，通常更便于迁移。

它不是精确锁定文件，也不能当作完整 pip 依赖清单。共享前检查 `channels`、依赖与可能出现的本机 `prefix` 路径，手动补充必要 pip 需求，移除不应固定到别人电脑的路径。

### 13.2 导出较完整的环境清单

```bash
conda env export -n arclab-py --no-builds --file environment-full.yml
```

这会记录更多已安装依赖，`--no-builds` 移除构建字符串，通常仍包含版本约束。它可能包含检测到的 pip 包，但仍应人工检查完整性与可安装性。

更多细节不代表跨平台更稳：某些依赖只存在于当前操作系统或架构。

### 13.3 同平台显式清单

```bash
conda list -n arclab-py --explicit > explicit-spec.txt
conda create -n arclab-exact --file explicit-spec.txt
```

显式清单记录具体 Conda 包 URL，主要用于兼容的同平台、同架构环境。它不完整覆盖 pip 包，也不保存输入数据、驱动和项目代码；包文件还必须能够取得。

### 13.4 新版 conda export

较新的 Conda 提供统一导出命令，例如：

```bash
conda export -n arclab-py --from-history --format=environment-yaml --file environment-new.yml
```

如果当前版本没有该命令，使用前面的 `conda env export`。导出格式随版本和插件变化，先查看 `conda export --help`。

Conda 导出的 requirements 格式不一定是 pip 格式，不要仅根据 `.txt` 扩展名就交给 `pip install -r`。

### 13.5 导出后还要验证

在新名称的环境中重建，运行项目最小示例，核对解释器、导入和结果。环境文件可以帮助复现，但不能保证在任何机器上自动得到完全相同结果。

## 十四、更新、复制与删除环境

### 14.1 更新单个包

```bash
conda update -n arclab-py --override-channels -c conda-forge numpy
```

这是纯 Conda 管理阶段的示例。更新可能影响相关依赖；需要稳定复现时先复制或重建测试环境，不要在交付前直接更新全部包。

### 14.2 按文件更新

```bash
conda env update -n arclab-data -f environment.yml
```

需要移除不在目标说明中的包时，可以按需求使用 `--prune`，先阅读其行为和执行计划。涉及 pip 混合依赖时，删除旧环境、从维护后的说明新建并验证通常更清晰。

### 14.3 复制环境

```bash
conda create -n arclab-py-test --clone arclab-py
```

克隆便于在本机试验，创建后仍需验证；外部路径、可编辑安装和额外文件等可能影响实际可用性。

### 14.4 删除环境

先退出目标环境，再执行：

```bash
conda deactivate
conda env remove -n arclab-py-test
conda env list
```

确认名称与路径，删除会移除环境及其中安装的软件。普通命名环境与项目代码目录分开，不代表可以不检查环境位置就删除；不要用该操作删除 base。

## 十五、查看历史、清理缓存与获取帮助

### 15.1 查看修订记录

```bash
conda list -n arclab-py --revisions
```

Conda 记录环境的部分包事务历史。按某个修订恢复可使用：

```text
conda install -n arclab-py --revision 修订编号
```

先核对实际编号。修订回退不是整个项目或 pip 操作的完整备份，仍应保留环境说明和代码版本。

### 15.2 清理缓存

先查看预期清理内容：

```bash
conda clean --tarballs --dry-run
```

确认后再执行：

```bash
conda clean --tarballs
```

这主要清理下载的软件包归档，不是删除环境。删除后再次安装可能需要重新下载，不必使用强制清除所有缓存来解决每一个问题。

### 15.3 获取帮助

```bash
conda --help
conda create --help
conda env export --help
```

命令不认识某个参数时，先检查 Conda 版本与该命令的本机帮助。

## 十六、一个综合示例

下面创建一个数据练习环境，运行 NumPy 程序，再用环境文件重建并验证。

### 16.1 准备项目目录

```bash
mkdir conda-practice
cd conda-practice
```

创建 `environment.yml`：

```yaml
name: arclab-demo
channels:
  - conda-forge
  - nodefaults
dependencies:
  - python=3.11
  - numpy
```

### 16.2 创建并激活

```bash
conda env create -f environment.yml
conda activate arclab-demo
python -c "import sys; print(sys.executable)"
```

### 16.3 编写运行程序

保存为 `demo.py`：

```python
import sys
import numpy as np

values = np.array([20.0, 22.0, 24.0])

print("Python 路径：", sys.executable)
print("NumPy 版本：", np.__version__)
print("平均值：", values.mean())
print("最大值：", values.max())
```

运行：

```bash
python demo.py
```

平均值应为 `22.0`，最大值应为 `24.0`。

### 16.4 导出与重建

```bash
conda env export -n arclab-demo --from-history --file environment-history.yml
conda env create -n arclab-demo-copy -f environment.yml
conda run -n arclab-demo-copy python demo.py
```

这里用手写的项目说明重建，另外保存导出文件用于比较。也可以先整理 `environment-history.yml`，再从该文件创建一个新名称环境。

比较两边的解释器路径和结果。它们应使用不同环境路径，关键计算结果一致；没有锁定的版本仍可能不同。

### 16.5 整理交接文件

```text
conda-practice/
├── environment.yml
├── environment-history.yml
├── demo.py
└── README.md
```

README 记录系统与架构、Conda 版本、创建方式、运行命令和预期结果。不要把整个环境目录上传到 Git 仓库；保留可重建说明与项目代码。

## 十七、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 找不到 `conda` | 当前终端没有加载 Conda，或未安装成功 | 先从安装程序提供的终端检查安装位置 |
| 提示先运行 `conda init` | 当前 Shell 尚未初始化 | 选择对应 Shell 初始化并重开终端 |
| 环境激活后 Python 路径不对 | 多安装冲突、别名或编辑器配置不同 | 查看 `sys.executable`、当前环境和终端配置 |
| `EnvironmentNameNotFound` | 名称错误，或使用了另一套 Conda 安装 | 查看 `conda env list` 与 `conda info` |
| `PackagesNotFoundError` | 当前源、平台或版本没有该包 | 检查拼写、源和架构，用 `conda search` 查询 |
| `UnsatisfiableError` 或依赖冲突 | 版本约束或源组合不兼容 | 检查约束，新建最小环境逐步定位 |
| 下载慢或失败 | 网络、源、代理或证书配置问题 | 核对可信源与网络配置，避免关闭证书验证作为通用修复 |
| 已安装但 `import` 失败 | 安装环境与运行解释器不一致，或二进制不兼容 | 核对路径、版本和安装来源，必要时重建 |
| Notebook 使用旧版本 | 内核不是目标环境或未重启 | 选择正确内核，检查路径并重启 |
| YAML 创建失败 | 缩进、平台特定依赖或本地路径问题 | 检查文件、约束与 `prefix`，不要直接复制整机路径 |
| 环境名字相同但结果不同 | 依赖版本、系统或输入不一致 | 对照清单、平台和最小运行结果 |
| 删除环境后内核仍显示 | Jupyter 注册条目残留 | 确认后移除对应 kernelspec |

## 十八、练习

请在自己的练习环境操作，不使用老师或队友正在运行的公共环境。

### 18.1 环境基础

- [ ] 说明 Miniconda、Conda、Python 和 pip 的区别。
- [ ] 查看 Conda 版本、安装路径和环境列表。
- [ ] 创建一个指定 Python 版本的独立环境。
- [ ] 激活后检查 `sys.executable` 和 `python -m pip --version`。
- [ ] 在不同项目目录切换，观察环境是否自动改变。
- [ ] 用 `conda run` 在不切换当前环境的情况下运行一条命令。

### 18.2 包与环境复现

- [ ] 安装 NumPy，查看版本并运行最小计算。
- [ ] 查看当前源配置，解释 `-c` 与 `--override-channels`。
- [ ] 手写一个只含 Python 和 NumPy 的 `environment.yml`。
- [ ] 比较 `--from-history` 与较完整导出文件的内容。
- [ ] 以新名称从 YAML 创建环境，运行同一脚本并核对结果。
- [ ] 解释为什么显式清单不能直接保证跨操作系统复现。

### 18.3 工具与交接

- [ ] 在 VS Code 中选择环境，确认运行路径。
- [ ] 使用 Notebook 时选择正确内核并检查解释器。
- [ ] 克隆一个练习环境，确认后删除克隆。
- [ ] 写一份 README，让同伴根据文件创建环境并运行示例。

完成后，应能回答：激活环境和进入目录有什么区别、库装到哪里、代码由哪个 Python 执行、如何让别人重建，以及复现还有哪些限制。

## 十九、常用命令速查表

| 功能 | 命令示例 |
|---|---|
| 查看版本 | `conda --version` |
| 查看基本信息 | `conda info` |
| 查看环境 | `conda env list` |
| 创建环境 | `conda create -n demo --override-channels -c conda-forge python=3.11` |
| 激活 / 退出 | `conda activate demo` / `conda deactivate` |
| 查看解释器 | `python -c "import sys; print(sys.executable)"` |
| 指定环境运行 | `conda run -n demo python script.py` |
| 查询包 | `conda search --override-channels -c conda-forge numpy` |
| 安装包 | `conda install -n demo --override-channels -c conda-forge numpy` |
| 查看已安装包 | `conda list -n demo` |
| 更新包 | `conda update -n demo --override-channels -c conda-forge numpy` |
| 删除包 | `conda remove -n demo numpy` |
| 查看配置来源 | `conda config --show-sources` |
| 查看源 | `conda config --show channels` |
| 当前环境 pip 安装 | `python -m pip install 包名` |
| YAML 创建 | `conda env create -f environment.yml` |
| YAML 指定新名称创建 | `conda env create -n demo-copy -f environment.yml` |
| YAML 更新 | `conda env update -n demo -f environment.yml` |
| 导出主要需求 | `conda env export -n demo --from-history --file environment-history.yml` |
| 导出不含构建号的清单 | `conda env export -n demo --no-builds --file environment-full.yml` |
| 查看 Conda 修订记录 | `conda list -n demo --revisions` |
| 克隆环境 | `conda create -n demo-copy --clone demo` |
| 删除环境 | `conda env remove -n demo`，先退出目标环境 |
| 预览清理下载归档 | `conda clean --tarballs --dry-run` |
| 查看命令帮助 | `conda create --help` |

表中的环境名和文件名需要按实际情况替换；删除、更新与清理前确认目标。

## 二十、相关学习资料

- [Miniconda 官方安装入口](https://www.anaconda.com/docs/getting-started/installation)：按操作系统选择安装步骤。
- [Anaconda Distribution 与 Miniconda](https://www.anaconda.com/docs/getting-started/concepts/anaconda-or-miniconda)：比较两种发行包。
- [Conda 官方：环境管理](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)：创建、激活、导出和 pip 配合使用。
- [Conda 官方：包管理](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-pkgs.html)：安装、查询和更新。
- [Conda 官方：软件源管理](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-channels.html)：Channel、优先级和兼容问题。
- [conda env export](https://docs.conda.io/projects/conda/en/stable/commands/env/export.html)、[新版 conda export](https://docs.conda.io/projects/conda/en/stable/commands/export.html)：导出参数与格式。
- [VS Code 官方 Python 环境说明](https://code.visualstudio.com/docs/python/environments)：编辑器解释器选择与环境使用。

文档以本机命令帮助和匹配的 Conda 版本为准，不要求初学时学习全部高级参数。
