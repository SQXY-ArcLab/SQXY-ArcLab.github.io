---
title: "Git 与 GitHub"
layout: lesson
description: "提交、分支、冲突与 PR，让修改成为可追溯的协作成果。"
category_label: "掌握开发工具"
lesson_slug: git-github
---
## 一、什么是 Git 和 GitHub？

Git 是一种分布式版本控制工具，用于记录文件的修改历史。它可以帮助我们查看修改、恢复版本，并让多人同时参与一个项目。

GitHub 是基于 Git 的代码托管与协作平台。除了存放仓库，还提供问题讨论、代码审查、项目文档等功能。

### Git 和 GitHub 的区别

| 名称 | 是什么 | 常见用途 |
|---|---|---|
| Git | 安装在电脑上的版本控制工具 | 记录提交、管理分支、合并修改 |
| GitHub | 在线仓库托管与协作平台 | 分享项目、提交 PR、讨论 Issue |

Git 可以在没有网络、没有 GitHub 账号的情况下使用。本地提交保存在自己电脑中，推送后才会同步到远程仓库。

### 为什么要学习？

- 记录学习笔记、程序和实验文档的修改过程。
- 查看一次修改具体改变了哪些内容。
- 在独立分支上尝试新功能，再合并到项目中。
- 与其他同学共同维护代码、README 和学习资料。
- 为项目交接保留能够追溯的版本历史。

例如，修改一份 README 后，可以执行：

```bash
git status
git diff
git add README.md
git commit -m "补充项目运行说明"
```

这组命令依次查看状态、检查修改、暂存文件并创建本地提交。

## 二、安装 Git 与准备工具

### 2.1 安装 Git

从 [Git 官网安装页面](https://git-scm.com/install/)选择对应操作系统的安装方式。

- Windows：安装 Git for Windows 后，可以使用 Git Bash。
- macOS：按官网提供的方式安装，也可以使用系统提示安装的命令行工具。
- Linux：根据所用发行版，通过包管理器安装 Git。

安装完成后，打开终端检查：

```bash
git --version
```

正常情况下会输出版本号，例如：

```text
git version 2.x.x
```

本文使用的 `git switch` 和 `git restore` 需要 Git 2.23 或更新版本。

### 2.2 选择编辑器与终端

可以使用 VS Code 编辑文件，在终端中执行 Git 命令。Windows 用户可在 Git Bash 中跟做，macOS 和 Linux 用户可使用系统终端。

**说明：** 下文命令框中的每一行是一条命令。出现 `YOUR-USERNAME` 等占位文字时，需要替换成实际内容。

## 三、配置用户名与邮箱

首次使用 Git 时，设置提交中记录的作者信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱地址"
```

查看配置：

```bash
git config --global --get user.name
git config --global --get user.email
```

说明：

- `--global` 表示当前操作系统用户的默认配置。
- 在某个仓库中省略 `--global`，可以单独设置该仓库的作者信息。
- 这里的名字和邮箱是提交记录中的身份信息，不是 GitHub 登录凭据。
- 希望 GitHub 关联提交到自己的账号时，可以使用账号中已关联的邮箱；不希望公开个人邮箱，可使用 GitHub 邮箱设置中提供的 `noreply` 地址。

## 四、仓库、工作区、暂存区与提交

### 4.1 仓库

仓库（Repository）用于管理项目文件和版本历史。普通 Git 仓库根目录中通常有一个隐藏的 `.git` 目录，保存版本控制数据。

### 4.2 三个基本区域

| 区域 | 含义 | 对应操作 |
|---|---|---|
| 工作区 | 实际编辑文件的地方 | 使用编辑器修改、保存 |
| 暂存区 | 准备放入下一次提交的内容 | `git add` |
| 本地仓库 | 已经保存的提交历史 | `git commit` |

基本过程可以表示为：

```text
修改并保存文件 → git add → 暂存修改 → git commit → 本地提交
```

**注意：** 保存文件、暂存文件、提交版本和推送远程是不同的操作。`git add` 保存的是执行命令时的文件内容；之后再次修改文件，需要再次暂存才能包含新修改。

### 4.3 文件的常见状态

- 未跟踪（Untracked）：文件存在，但还没有被 Git 纳入版本管理。
- 已修改（Modified）：已跟踪文件与暂存区中的版本不同。
- 已暂存（Staged）：修改已经放入暂存区，准备提交。
- 工作区干净（Clean）：通常表示已跟踪文件没有待提交修改；忽略文件仍可能存在。

## 五、创建仓库与克隆仓库

### 5.1 创建本地仓库

在准备存放练习的位置打开终端：

```bash
mkdir git-practice
cd git-practice
git init -b main
```

说明：

- `mkdir` 创建文件夹，`cd` 进入文件夹。
- `git init` 初始化仓库，`-b main` 指定初始分支名。
- `git init -b` 需要 Git 2.28 或更新版本；旧版本可以先 `git init`，在第一次提交后用 `git branch -M main` 命名分支。

接下来用编辑器在该目录中创建 `README.md`：

```markdown
# Git 学习记录

这是我的第一个 Git 练习仓库。
```

### 5.2 克隆已有仓库

如果项目已经存在，可以直接克隆：

```bash
git clone https://github.com/YOUR-USERNAME/git-practice.git
cd git-practice
```

克隆通常会下载仓库历史、创建工作目录，并将来源仓库命名为远程 `origin`。

**注意：** 创建本地仓库与克隆已有仓库是两种起步方式。克隆后的目录不需要再次执行 `git init`。下载 ZIP 只得到文件快照，不等同于克隆 Git 仓库。

## 六、查看状态与修改内容

### 6.1 查看状态

```bash
git status
```

它会显示当前分支、未跟踪文件、未暂存修改和已暂存修改。

需要简洁显示时可以使用：

```bash
git status --short
```

### 6.2 查看尚未暂存的修改

```bash
git diff
```

查看某个文件：

```bash
git diff -- README.md
```

差异输出通常用 `-` 表示删除的行、用 `+` 表示新增的行。

### 6.3 查看已经暂存的修改

```bash
git diff --staged
```

**注意：** 普通 `git diff` 不显示新建且未跟踪文件的内容。一个文件暂存后，如果没有继续修改，普通 `git diff` 也可能没有输出；此时应查看 `git diff --staged`。

## 七、暂存文件与创建提交

### 7.1 暂存指定文件

```bash
git add README.md
```

可以同时暂存多个文件：

```bash
git add README.md notes.md
```

暂存当前目录及子目录中的修改：

```bash
git add .
```

初学时建议先明确指定文件，使用 `git add .` 前检查状态，避免混入无关文件。

### 7.2 创建提交

```bash
git diff --staged
git commit -m "添加 Git 学习说明"
```

`-m` 后面是提交说明。提交保存暂存区中的内容，并生成提交标识。

### 7.3 提交说明的写法

说明应简洁表达本次修改的目的，例如：

- `添加数据读取函数`
- `修复图片相对路径`
- `补充 Windows 环境配置步骤`

避免只写“修改”“更新”“123”。一次提交尽量围绕一件事，便于查看和回退。

提交后再次执行 `git status`，检查是否还有遗漏的修改。

## 八、查看提交历史

### 8.1 查看完整历史

```bash
git log
```

通常包含提交标识、作者、时间和说明。在分页显示界面中，可按 `q` 退出。

### 8.2 简洁显示与分支图

```bash
git log --oneline
git log --oneline --graph --all
```

其中 `--oneline` 将每次提交显示为一行，`--graph` 显示历史关系图，`--all` 包括所有引用所能到达的提交。

### 8.3 查看一次提交

```bash
git show HEAD
```

`HEAD` 通常指向当前分支的最新提交。也可以将它替换为从日志中复制的提交标识，查看该次提交的说明与修改内容。

## 九、忽略不需要提交的文件

在仓库根目录创建 `.gitignore`，写入忽略规则：

```gitignore
# Python 缓存
__pycache__/
*.pyc

# 本地虚拟环境
.venv/

# 本地配置与日志
.env
*.log

# 构建输出
build/
```

说明：

- `#` 开头的行是注释。
- `*.log` 匹配以 `.log` 结尾的文件。
- `build/` 匹配名为 `build` 的目录。
- `.gitignore` 本身通常应该提交，让团队共享规则。

**注意：** 忽略规则不会自动停止跟踪已经提交的文件。若只想从版本管理中移除某个文件、保留本地副本，可以执行：

```bash
git rm --cached local-config.txt
```

再添加对应忽略规则，并提交这次变更。该操作不会清除旧提交中的文件内容；密码、令牌和私钥不应提交到仓库，误提交后需要先撤销或更换相关凭据。

## 十、分支：独立进行一项修改

### 10.1 什么是分支？

分支可以理解为指向某条提交历史末端的可移动引用。创建分支后，可以沿着新的历史继续提交，再与其他分支合并。

例如，`main` 保存稳定版本，`docs-intro` 用于补充文档。

### 10.2 查看分支

```bash
git branch
```

当前分支前面通常带有 `*`。

### 10.3 创建并切换分支

```bash
git switch -c docs-intro
```

也可以分两步：

```bash
git branch docs-intro
git switch docs-intro
```

在新分支修改文件后，正常执行 `add` 和 `commit`，提交会属于当前分支。

### 10.4 切换与删除分支

```bash
git switch main
git branch -d docs-intro
```

删除前应确认修改已合并；`-d` 会进行合并检查。切换分支前建议先提交或暂存保存当前工作，避免未提交修改被带到其他分支或阻止切换。

旧教程中的 `git checkout 分支名` 也能用于切换；本文使用用途更明确的 `git switch`。

## 十一、合并分支与解决冲突

### 11.1 合并分支

假设 `docs-intro` 上的修改已经提交，需要合并到 `main`：

```bash
git switch main
git merge docs-intro
```

这表示将 `docs-intro` 的历史合并进当前分支。根据分支历史，Git 可能直接快进，也可能创建合并提交。

### 11.2 什么是冲突？

当两个分支修改了同一部分内容，Git 无法自动决定保留哪种结果时，就需要人工解决冲突。

文件中可能出现：

```text
<<<<<<< HEAD
学习目标：掌握 Git 基础操作。
=======
学习目标：掌握 GitHub 协作流程。
>>>>>>> docs-intro
```

在这个合并示例中，上半部分来自当前分支，下半部分来自待合并分支。

### 11.3 解决冲突

1. 执行 `git status`，确认哪些文件冲突。
2. 打开文件，理解双方修改目的。
3. 编辑为最终内容，删除冲突标记。
4. 暂存文件并完成提交。

例如，将最终内容改为：

```text
学习目标：掌握 Git 基础操作和 GitHub 协作流程。
```

然后执行：

```bash
git add README.md
git commit -m "合并学习目标说明"
```

解决后应检查文档或运行程序，确认合并结果正确。删除冲突标记并不代表内容一定正确。

如果决定取消本次合并，可以使用：

```bash
git merge --abort
```

建议开始合并前保持工作区干净，避免与原有未提交修改混在一起。

## 十二、GitHub 账号与身份验证

### 12.1 注册与登录

访问 [GitHub 官网](https://github.com/)，注册账号并验证邮箱。浏览器登录用于网页操作，终端访问远程仓库还需要对应的身份验证方式。

### 12.2 HTTPS 与 SSH

| 方式 | 地址示例 | 身份验证方式 |
|---|---|---|
| HTTPS | `https://github.com/USER/REPO.git` | 凭据管理器、授权工具或个人访问令牌等 |
| SSH | `git@github.com:USER/REPO.git` | 已配置到账号的 SSH 密钥 |

克隆公开仓库通常不需要登录，但推送修改需要身份验证和仓库写入权限。

GitHub 不支持使用账号密码进行 HTTPS Git 身份验证。可按 [GitHub 官方身份验证说明](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)选择配置方式。

使用 SSH 时，按[官方 SSH 配置文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)生成或选择密钥、添加公钥并测试连接。公钥可添加到账号，私钥应保存在自己电脑中。

**注意：** 令牌不要写进远程地址、代码或 README。认证成功说明身份已确认，能否推送仍取决于仓库权限和分支规则。

## 十三、连接远程仓库与同步修改

### 13.1 创建 GitHub 仓库

在 GitHub 新建仓库，填写名称与说明，并选择公开或私有。

如果要上传已经有提交的本地仓库，建议创建空远程仓库，暂不勾选自动生成 README、`.gitignore` 或许可证，避免两边独立生成历史。

如果准备从 GitHub 克隆开始，则可以先在网页上创建 README，再克隆。

### 13.2 添加远程地址

在已有本地仓库目录执行：

```bash
git remote add origin https://github.com/YOUR-USERNAME/git-practice.git
git remote -v
```

`origin` 是远程仓库的本地简称，可以使用其他名称。若已经通过 `clone` 获取项目，通常已存在 `origin`。

### 13.3 推送本地提交

假设当前分支是 `main`，且已经创建提交：

```bash
git push -u origin main
```

`-u` 设置上游跟踪关系。以后在该分支通常可以直接执行 `git push`。

**注意：** `commit` 创建本地版本，`push` 上传本地提交。推送不会自动提交工作区中未提交的修改。

### 13.4 获取远程更新

```bash
git fetch origin
```

`fetch` 更新远程跟踪引用，如 `origin/main`，不会自动把修改合并到当前分支。

需要更新本地 `main` 时：

```bash
git switch main
git pull --ff-only origin main
```

`pull` 会获取并整合远程历史。这里指定 `--ff-only`，只允许快进更新；如果双方历史已分叉，命令会停止，便于先检查原因。

此时可先查看：

```bash
git log --oneline --graph --all
```

确认确实需要合并远程 `main`，并保持工作区干净后，可以执行 `git merge origin/main`，必要时按上一节解决冲突。团队也可能采用 rebase，应按约定选择整合方式。

## 十四、GitHub 协作：Issue、PR 与 Fork

### 14.1 Issue

Issue 用于记录问题、需求或待办事项。例如：

- 报告程序运行错误。
- 提出新增功能。
- 分配一项文档整理任务。

报告问题时，建议写清环境、复现步骤、预期结果、实际结果和错误日志。

### 14.2 Pull Request

Pull Request，简称 PR，用于提出将一个分支的修改合并到另一个分支，并在合并前讨论和审查。

常见流程：

```text
创建分支 → 修改并提交 → 推送分支 → 创建 PR → 审查与修改 → 合并
```

假设拥有项目仓库的写入权限：

```bash
git switch main
git pull --ff-only origin main
git switch -c docs-setup
```

修改并保存 README 后执行：

```bash
git diff
git add README.md
git diff --staged
git commit -m "补充环境配置步骤"
git push -u origin docs-setup
```

随后在 GitHub 创建 PR，确认：

- `base` 是接收修改的目标分支，例如 `main`。
- `compare` 是提供修改的分支，例如 `docs-setup`。
- 标题表达修改目的，正文说明改了什么、如何验证。

如果收到审查意见，在同一分支继续修改、提交并推送，已有 PR 会随之更新。

**注意：** PR 是 GitHub 等平台提供的协作功能，不是本地 `git pull` 命令。创建 PR 也不等于修改已经合并。

### 14.3 Fork

Fork 是在 GitHub 上创建一个与原仓库关联的个人副本。没有原仓库写入权限时，常用流程是：

1. 在 GitHub Fork 原仓库。
2. 克隆自己的 Fork。
3. 创建分支，修改并推送到自己的 Fork。
4. 向原仓库提交跨仓库 PR。

Fork 和 clone 的区别：Fork 创建平台上的仓库副本，clone 将仓库复制到本地。

需要从原仓库获取更新时，可以添加 `upstream`：

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/REPOSITORY.git
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

上例假设原仓库的主分支叫 `main`，本地 `main` 没有分叉。`upstream` 是约定俗成的远程名，与 `push -u` 设置的分支上游关系是不同概念。

## 十五、撤销修改与临时保存

先用 `git status`、`git diff` 判断修改在哪个区域，再选择操作。

### 15.1 取消暂存

```bash
git restore --staged README.md
```

在已有提交的仓库中，这会将文件从暂存状态恢复到 `HEAD` 对应的暂存内容，保留工作区修改，适合“文件不该放进这次提交”的情况。

### 15.2 丢弃未暂存的修改

```bash
git restore README.md
```

默认用暂存区内容恢复工作区文件。**这会丢弃该文件未暂存的修改，执行前先确认这些内容确实不要了。** 它不会删除未跟踪文件。

### 15.3 撤销已提交的修改

对于普通提交，可以使用：

```bash
git revert HEAD
```

它会创建一个新提交，反向撤销最近一次提交的修改，适合保留共享历史。命令可能打开编辑器填写提交说明，也可能因后续修改产生冲突。

如果要撤销其他提交，将 `HEAD` 替换为对应提交标识。合并提交的撤销有额外规则，初学时先不要直接套用。

### 15.4 临时保存未提交的工作

```bash
git stash push -m "临时保存文档修改"
git stash list
git stash pop
```

`stash` 可暂时保存已跟踪文件的修改。需要包含未跟踪文件时使用 `git stash push -u`；忽略文件不在这个范围内。

`pop` 恢复成功后会删除对应暂存记录；若发生冲突，记录通常会保留，需要处理冲突。长期成果仍应整理成正常提交。

**说明：** `git reset --hard`、`git clean -fd` 和强制推送可能丢弃内容或改写共享历史，入门日常操作不需要使用它们。

## 十六、一个综合示例

下面将一份 Markdown 学习笔记保存到 Git，再通过 GitHub 完成一次分支协作。

### 16.1 初始化并提交

确认已经完成作者信息配置，在新的练习位置执行：

```bash
mkdir git-notes
cd git-notes
git init -b main
```

用编辑器创建 `README.md`：

```markdown
# 我的学习笔记

## 已学习内容

- Markdown 基础语法
- Git 本地提交
```

保存后执行：

```bash
git status
git add README.md
git diff --staged
git commit -m "添加学习笔记首页"
git log --oneline
```

### 16.2 上传到 GitHub

在 GitHub 创建名为 `git-notes` 的空仓库，然后执行：

```bash
git remote add origin https://github.com/YOUR-USERNAME/git-notes.git
git push -u origin main
```

完成身份验证后，在网页检查 README 和提交记录。

### 16.3 创建分支并提交修改

```bash
git switch -c docs-github
```

在 README 的列表末尾增加一项：

```markdown
- GitHub 分支与 PR
```

保存并提交：

```bash
git diff
git add README.md
git commit -m "补充 GitHub 学习内容"
git push -u origin docs-github
```

### 16.4 创建 PR、合并并同步

1. 在 GitHub 创建从 `docs-github` 到 `main` 的 PR。
2. 检查提交记录与文件差异，填写修改说明。
3. 在自己的练习仓库合并 PR；团队仓库按审查流程处理。
4. 回到本地更新主分支。

```bash
git switch main
git pull --ff-only origin main
git log --oneline --graph --all
```

确认修改已进入 `main` 后，可执行 `git branch -d docs-github` 删除本地分支。若 PR 使用 squash 或 rebase 合并，Git 可能无法按原提交关系认定它已合并；此时先检查差异，不必急于删除。

## 十七、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| `git: command not found` | 没有安装 Git，或终端找不到程序 | 检查安装与 PATH，重新打开终端 |
| `not a git repository` | 当前目录不在仓库中 | 用 `pwd` 检查位置，进入正确仓库 |
| `Author identity unknown` | 尚未设置作者信息 | 配置 `user.name` 和 `user.email` |
| `nothing to commit` | 没有新修改，或修改未暂存 | 查看 `git status`，确认保存与暂存情况 |
| 文件在 `.gitignore` 中仍被跟踪 | 文件之前已经纳入版本控制 | 按需用 `git rm --cached` 停止跟踪并提交 |
| `remote origin already exists` | 已存在名为 `origin` 的远程 | 先用 `git remote -v` 检查，确需修改时使用 `git remote set-url origin 新地址` |
| `src refspec main does not match any` | 尚无提交，或本地没有 `main` 分支 | 查看提交历史和分支名，完成首个提交或使用实际分支名 |
| `Authentication failed` | HTTPS 凭据无效、过期或使用了账号密码 | 按官方文档检查凭据、令牌或授权工具 |
| `Permission denied (publickey)` | SSH 密钥未正确配置或未被使用 | 按官方 SSH 文档检查密钥与连接测试 |
| `Repository not found` | 地址错误，或没有私有仓库访问权限 | 检查地址、登录账号和仓库权限 |
| 推送提示 `non-fast-forward` | 远程包含本地没有的历史 | 先 fetch 并检查，按团队约定整合后再推送 |
| `pull --ff-only` 提示无法快进 | 本地与远程历史已分叉 | 查看分支图，确认如何 merge 或 rebase |
| 切换分支提示会覆盖修改 | 工作区有未保存到提交的内容 | 提交、stash，或确认无用后丢弃修改 |
| 合并后出现冲突标记 | Git 无法自动合并内容 | 人工编辑、暂存、提交并验证结果 |

## 十八、练习

请在独立的练习目录完成，避免在正在使用的项目中试验撤销和冲突操作。

### 18.1 本地基础练习

- [ ] 检查 Git 版本，设置并查看作者信息。
- [ ] 创建 `git-practice` 仓库和 `README.md`。
- [ ] 创建第一次提交，并使用 `git log --oneline` 查看。
- [ ] 修改 README，对比 `git diff` 和 `git diff --staged`。
- [ ] 分别提交两次不同的修改，使用 `git show` 查看其中一次。
- [ ] 创建 `.gitignore`，忽略一个练习用的 `.log` 文件。
- [ ] 暂存一次修改，再取消暂存，确认工作区内容仍在。

### 18.2 分支与冲突练习

1. 在 `main` 的 README 中写入一行“学习目标：熟悉版本管理”，并提交。
2. 创建 `practice-conflict` 分支，将这一行改成“学习目标：学习分支操作”，并提交。
3. 切回 `main`，把原来同一行改成“学习目标：学习团队协作”，并提交。
4. 在 `main` 执行 `git merge practice-conflict`，观察冲突。
5. 整理为能够表达两个目标的最终文字，删除标记，完成合并提交。
6. 使用 `git status` 与分支图检查结果。

### 18.3 GitHub 协作练习

- [ ] 创建 GitHub 练习仓库，并推送本地提交。
- [ ] 创建新分支，修改 README 并推送。
- [ ] 创建 PR，写清修改内容和检查方式。
- [ ] 邀请同学给出一条审查意见，继续提交一次修改。
- [ ] 合并 PR，并将本地 `main` 更新到远程版本。
- [ ] 创建一个 Issue，记录下一步计划或一个可复现的问题。

完成后，尝试说明 `add`、`commit`、`push`、`pull`、PR 分别解决什么问题，以及本地文件修改后为何不会立刻显示在 GitHub 上。

## 十九、常用命令速查表

| 功能 | 命令示例 |
|---|---|
| 查看 Git 版本 | `git --version` |
| 设置作者名 | `git config --global user.name "名字"` |
| 设置作者邮箱 | `git config --global user.email "邮箱"` |
| 初始化仓库 | `git init -b main` |
| 克隆仓库 | `git clone 仓库地址` |
| 查看状态 | `git status` |
| 查看未暂存差异 | `git diff` |
| 查看已暂存差异 | `git diff --staged` |
| 暂存指定文件 | `git add README.md` |
| 创建提交 | `git commit -m "修改说明"` |
| 查看提交历史 | `git log --oneline` |
| 查看分支图 | `git log --oneline --graph --all` |
| 查看一次提交 | `git show 提交标识` |
| 创建并切换分支 | `git switch -c 分支名` |
| 切换分支 | `git switch main` |
| 合并到当前分支 | `git merge 分支名` |
| 取消进行中的合并 | `git merge --abort` |
| 删除已合并分支 | `git branch -d 分支名` |
| 查看远程地址 | `git remote -v` |
| 添加远程 | `git remote add origin 仓库地址` |
| 首次推送并建立跟踪 | `git push -u origin main` |
| 推送当前分支 | `git push`（已设置合适的上游） |
| 获取远程历史 | `git fetch origin` |
| 快进更新本地 main | `git pull --ff-only origin main`（当前位于 `main`） |
| 取消暂存 | `git restore --staged 文件名` |
| 丢弃未暂存修改 | `git restore 文件名`（会丢弃内容） |
| 反向撤销普通提交 | `git revert 提交标识` |
| 临时保存工作 | `git stash push -m "说明"` |
| 恢复并移除暂存记录 | `git stash pop`（恢复成功时） |

## 二十、相关学习资料

- [Pro Git 中文版](https://git-scm.com/book/zh/v2)：系统学习 Git，入门阶段先读起步、Git 基础和分支相关章节。
- [Git 官方命令参考](https://git-scm.com/docs)：查阅命令参数与具体行为，例如 [restore](https://git-scm.com/docs/git-restore) 和 [pull](https://git-scm.com/docs/git-pull)。
- [GitHub 官方中文 Hello World](https://docs.github.com/zh/get-started/using-github/hello-world)：通过网页操作学习仓库、分支、PR 与合并。
- [GitHub 官方身份验证文档](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)：配置终端与平台之间的身份验证。
- [Learn Git Branching 中文版](https://learngitbranching.js.org/?locale=zh_CN)：通过浏览器交互练习理解提交历史和分支关系。
