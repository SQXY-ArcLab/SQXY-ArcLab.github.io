---
title: "Linux 入门"
layout: lesson
description: "目录、命令、管道与脚本，建立命令行工作的基本能力。"
category_label: "掌握开发工具"
lesson_slug: linux
---
## 一、什么是 Linux？

Linux 严格来说指操作系统内核。日常所说的 Linux 系统，通常是把 Linux 内核、系统工具和应用软件组合起来的发行版，例如 Ubuntu、Debian 和 Fedora。

Linux 既可以通过图形界面操作，也可以通过命令行操作。本教程主要介绍命令行基础，示例以 **Ubuntu / Debian 环境中的 Bash** 为主；其他发行版的安装命令和部分工具可能不同。

### Linux 有什么用？

- 配置开发环境，运行程序和项目 Demo。
- 登录服务器，查看日志和管理自己的进程。
- 整理实验数据，完成文本搜索和简单统计。
- 编写脚本，自动执行重复操作。
- 参与嵌入式、数据处理和科研计算项目。

例如，下面的命令可以查看当前位置、列出文件并创建目录：

```bash
pwd
ls
mkdir linux-practice
```

**注意：** 命令行操作会实际改变文件和系统状态。练习时使用自己的独立目录，执行删除、覆盖和权限修改前确认目标。

## 二、准备 Linux 学习环境

### 2.1 Windows：使用 WSL

WSL 可以让 Windows 运行 Linux 环境。在满足系统要求的 Windows 上，按[微软官方安装说明](https://learn.microsoft.com/zh-cn/windows/wsl/install)，以管理员身份打开 PowerShell，执行：

```powershell
wsl --install
```

根据提示完成安装、必要的重启和 Linux 用户创建。后续本文的 Bash 命令在 Ubuntu 等 Linux 终端中执行，不直接复制到 PowerShell。

查看安装情况可在 PowerShell 执行：

```powershell
wsl --list --verbose
```

### 2.2 使用虚拟机或已有 Linux 电脑

可以在虚拟机中安装 Ubuntu，也可以使用已经配置好的 Linux 电脑。初学者不需要为了练命令行重新分区安装双系统。

macOS 的终端也支持许多相似命令，但 macOS 不是 Linux，部分参数、权限和系统管理方式不同。完整跟做时使用 Linux 环境。

### 2.3 确认当前环境

在 Linux 终端执行：

```bash
uname -s
cat /etc/os-release
whoami
pwd
```

分别用于查看内核名称、发行版信息、当前用户和当前位置。

## 三、终端、Shell 与命令格式

### 3.1 终端和 Shell

| 名称 | 含义 |
|---|---|
| 终端 | 输入命令、显示结果的界面 |
| Shell | 解释命令并调用程序的命令解释器，例如 Bash |
| 命令 | 要执行的程序或 Shell 内建功能，例如 `ls`、`cd` |

终端中可能显示类似提示符：

```text
student@ubuntu:~$
```

它通常提示用户名、主机和当前路径。**输入命令时不需要复制提示符。** 不同系统的提示符外观可能不同。

### 3.2 命令的基本结构

```text
命令 [选项] [参数]
```

例如：

```bash
ls -l /home
```

- `ls`：命令，列出目录内容。
- `-l`：选项，使用详细格式。
- `/home`：参数，指定要查看的位置。

文档中的方括号通常表示可选内容，不是要原样输入的字符。路径和文件名通常区分大小写。

### 3.3 常用快捷操作

| 操作 | 按键 |
|---|---|
| 补全命令或路径 | `Tab`，可能需要按两次查看候选 |
| 查看上一条命令 | 方向键上 |
| 中断当前前台程序 | `Ctrl+C` |
| 移到行首 / 行尾 | Bash 常见设置下为 `Ctrl+A` / `Ctrl+E` |
| 清理终端显示 | `clear` 或 `Ctrl+L` |
| 退出当前 Shell | `exit` |

输入密码时终端通常不会显示字符或星号，这是正常现象。清屏不会删除文件，也不会清除已保存的历史记录。

## 四、目录结构与路径

### 4.1 常见目录

| 路径 | 常见用途 |
|---|---|
| `/` | 整个文件系统的根目录 |
| `/home` | 普通用户的主目录通常位于这里 |
| `/root` | root 管理员的主目录 |
| `/etc` | 系统与服务配置 |
| `/usr` | 系统提供的许多程序、库和共享资源 |
| `/var` | 日志等经常变化的数据 |
| `/tmp` | 临时文件，不应作为长期存储位置 |

`/` 是根目录，`/root` 是一个用户的主目录，两者不同。

### 4.2 绝对路径和相对路径

- 绝对路径从 `/` 开始，例如 `/home/student/project`。
- 相对路径从当前目录开始，例如 `data/result.txt`。
- `.` 表示当前目录，`..` 表示上一级目录。
- `~` 在 Shell 中通常展开为当前用户的主目录。

例如：

```bash
cd ~
pwd
cd /tmp
cd ..
```

文件和目录名中包含空格时，用引号包住：

```bash
mkdir "my notes"
cd "my notes"
```

## 五、查看和切换目录

### 5.1 查看当前位置

```bash
pwd
```

### 5.2 查看目录内容

```bash
ls
ls -l
ls -a
ls -lh
```

| 选项 | 含义 |
|---|---|
| `-l` | 显示权限、所有者、大小等详细信息 |
| `-a` | 显示包含隐藏项的全部目录项 |
| `-h` | 与 `-l` 等配合，以易读单位显示大小 |

Linux 中以 `.` 开头的名称通常被当作隐藏项，例如 `.git`、`.bashrc`。

### 5.3 切换目录

```bash
cd /home
cd ~
cd ..
cd -
```

`cd -` 返回上一次所在的目录。执行文件操作前，可先用 `pwd` 和 `ls` 确认当前位置。

## 六、创建、复制、移动与删除

以下示例在新建的练习目录内执行：

```bash
mkdir linux-practice
cd linux-practice
```

如果目录已存在，先检查内容，或换一个新的练习目录名。

### 6.1 创建目录与文件

```bash
mkdir notes
mkdir -p project/data
touch notes/day1.md
```

- `mkdir` 创建目录。
- `mkdir -p` 可以创建缺少的父目录。
- `touch` 在文件不存在时创建空文件；对已有文件使用时主要更新时间戳，不会清空内容。

### 6.2 复制

```bash
cp notes/day1.md notes/day1-backup.md
cp -r notes notes-backup
```

`-r` 表示递归复制目录。复制到已有路径时，结果取决于目标是否是目录；覆盖前可使用 `cp -i` 请求确认。

### 6.3 移动与重命名

```bash
mv notes/day1-backup.md notes/day1-copy.md
mv notes/day1-copy.md project/
```

`mv` 既能移动，也能重命名。目标同名时可能覆盖，可使用 `mv -i` 请求确认。

### 6.4 删除

```bash
rm -i project/day1-copy.md
rmdir notes-backup
```

`rm -i` 删除前询问；`rmdir` 只删除空目录，上例中的备份目录不为空时会拒绝删除。

确实要删除练习用的非空目录时，可以执行：

```bash
rm -ri notes-backup
```

其中 `-r` 递归处理目录，`-i` 逐项询问。命令行删除通常不会进入桌面回收站，初学阶段不要用 `rm -rf` 代替日常删除。

## 七、查看和编辑文本文件

### 7.1 创建示例内容

在练习目录执行：

```bash
printf 'first line\nsecond line\nthird line\n' > notes/example.txt
```

`printf` 输出文本，`\n` 表示换行，`>` 将输出写入文件。这里会覆盖已有同名文件，详细规则见后文。

### 7.2 查看整个文件或部分内容

```bash
cat notes/example.txt
head -n 2 notes/example.txt
tail -n 2 notes/example.txt
```

分别显示全部内容、前两行、后两行。

较大的文件可以分页查看：

```bash
less notes/example.txt
```

在 `less` 中可用方向键或空格翻页，输入 `/关键词` 搜索，按 `n` 查找下一处，按 `q` 退出。

持续观察日志新增内容：

```bash
tail -f notes/example.txt
```

按 `Ctrl+C` 停止观察，不会删除日志。

### 7.3 编辑文件

可以使用图形编辑器，也可以使用终端编辑器，例如：

```bash
nano notes/day1.md
```

在 Nano 中通常用 `Ctrl+O` 保存、回车确认文件名，用 `Ctrl+X` 退出。编辑器是否安装取决于环境。

## 八、查找文件与搜索内容

### 8.1 用 find 查找文件

```bash
find . -type f -name '*.md'
find . -type d -name 'notes'
```

- `.`：从当前目录开始。
- `-type f`：只找普通文件；`-type d`：只找目录。
- `-name`：按名称模式匹配。

模式加引号，让 `find` 接收完整的 `*.md`，避免 Shell 提前展开。

### 8.2 用 grep 搜索内容

```bash
grep -n 'second' notes/example.txt
grep -i 'SECOND' notes/example.txt
grep -rn 'TODO' notes/
```

| 选项 | 含义 |
|---|---|
| `-n` | 显示行号 |
| `-i` | 忽略大小写 |
| `-r` | 递归搜索目录 |
| `-v` | 选择不匹配的行 |
| `-F` | 按普通字符串匹配，不解释正则表达式 |

例如，查找含有点号的完整字符串时：

```bash
grep -Fn 'data.csv' notes/example.txt
```

没有输出可能表示没有匹配，并不一定是命令错误。`grep` 默认使用正则表达式，匹配普通文字时可以优先考虑 `-F`。

### 8.3 通配符

Shell 常用 `*` 匹配零个或多个字符，`?` 匹配一个字符，例如：

```bash
ls notes/*.md
```

这类模式通常不匹配以 `.` 开头的隐藏名称。Shell 通配符与 `grep` 的正则表达式是不同规则，不能混用。

## 九、重定向、管道与文本统计

### 9.1 输出重定向

```bash
printf 'first record\n' > result.txt
printf 'second record\n' >> result.txt
```

- `>`：写入文件，文件已有内容会被覆盖。
- `>>`：追加到文件末尾。
- `<`：从文件读取标准输入。

例如：

```bash
wc -l < result.txt
```

`wc -l` 统计换行符数量；通常可用于统计正常以换行结尾的文本行数。

### 9.2 标准输出与标准错误

程序通常把正常结果写到标准输出，把错误信息写到标准错误：

```bash
ls notes > files.txt
ls missing-file.txt 2> errors.txt
ls notes missing-file.txt > combined.txt 2>&1
```

`2>` 重定向标准错误，`2>&1` 将标准错误连接到当时标准输出的位置。重定向顺序会影响结果。

**注意：** 不要把同一文件同时作为输入和 `>` 的输出，例如 `sort result.txt > result.txt`，它可能先被清空。应写入另一个文件再检查。

### 9.3 管道

`|` 把前一个命令的标准输出交给后一个命令的标准输入：

```bash
grep -F 'ERROR' app.log | wc -l
```

这会统计 `app.log` 中包含 `ERROR` 的行数。执行前需要准备对应文件，完整例子见综合示例。

### 9.4 排序与去重

```bash
sort names.txt
sort names.txt | uniq
sort names.txt | uniq -c
```

`uniq` 只合并相邻重复行，因此通常先排序。`uniq -c` 统计相邻相同记录的数量；排序结果可能受语言区域设置影响。

## 十、权限、用户与 sudo

### 10.1 查看权限

```bash
ls -l notes/example.txt
id
```

权限字段可能类似：

```text
-rw-r--r--
```

首字符表示类型，后面三组分别对应所有者、所属组和其他用户：

| 符号 | 普通文件中的含义 | 目录中的含义 |
|---|---|---|
| `r` | 读取内容 | 列出目录项名称 |
| `w` | 修改内容 | 创建、删除或重命名目录项，通常还需要 `x` |
| `x` | 尝试作为程序执行 | 进入目录、访问其中已知名称的项目 |

删除文件主要受父目录权限等条件影响，并非只由文件自身的 `w` 决定。

### 10.2 修改权限

为自己的脚本增加所有者执行权限：

```bash
chmod u+x hello.sh
```

数字权限中 `r=4`、`w=2`、`x=1`，三位分别对应所有者、组、其他用户：

```bash
chmod 644 notes/example.txt
```

`644` 表示所有者可读写，其他人只读。应按实际需要授权，不要用 `chmod 777` 处理所有权限问题。

### 10.3 sudo

`sudo` 根据授权策略，以其他身份执行命令，通常是管理员 root。安装系统软件等操作可能需要它。

遇到 `Permission denied` 时，先确认路径、文件归属和任务要求，不要直接给所有命令加 `sudo`。个人学习文件一般放在自己的主目录中。

## 十一、进程与后台任务

### 11.1 查看进程

```bash
ps -ef
top
```

`ps` 显示进程信息，`top` 动态显示资源占用，按 `q` 退出。PID 是进程编号。

### 11.2 启动一个后台练习任务

```bash
sleep 60 &
jobs
```

`&` 将命令放入后台，`jobs` 查看当前 Shell 管理的任务。

需要切回前台时，可以执行：

```bash
fg %1
```

`%1` 是任务编号，按实际 `jobs` 输出替换；切回前台后可用 `Ctrl+C` 中断。

### 11.3 结束自己的进程

```text
kill PID
```

将 `PID` 替换为已核实的进程编号。默认发送终止信号，让程序有机会清理退出；不要把 `kill -9` 作为常规第一步。

后台任务不保证在终端关闭后继续运行。服务器上的长期任务可后续学习 `tmux` 或任务调度工具。

## 十二、安装软件与查看系统资源

### 12.1 Ubuntu / Debian 的 apt

```bash
sudo apt update
sudo apt install git
```

- `apt update` 更新软件包索引，不是升级所有已安装软件。
- `apt install git` 安装 Git，操作前阅读包管理器列出的变更。
- 安装完成后可用 `git --version` 检查。

这组命令适用于采用 apt 的发行版；Fedora 等系统使用不同包管理器。学校或团队共用服务器上，按管理员安排安装软件。

### 12.2 查看磁盘与内存

```bash
df -h
du -sh .
free -h
```

| 命令 | 用途 |
|---|---|
| `df -h` | 查看已挂载文件系统的容量与剩余空间 |
| `du -sh .` | 汇总当前目录的磁盘占用 |
| `free -h` | 查看内存与交换空间概况 |

`free` 的空闲值不等于全部可用内存，阅读时还要关注 `available`。部分精简环境可能未预装这些工具。

## 十三、打包与压缩

### 13.1 创建 tar.gz 文件

在练习目录中执行：

```bash
tar -czf notes.tar.gz notes/
```

- `c`：创建归档。
- `z`：使用 gzip 压缩。
- `f`：后面指定归档文件名。

### 13.2 查看归档内容

```bash
tar -tzf notes.tar.gz
```

### 13.3 解压到指定目录

```bash
mkdir -p restored
tar -xzf notes.tar.gz -C restored
```

`x` 表示解包，`-C` 指定目标目录。解压前先查看内容，选择独立目标目录，避免覆盖现有文件。

## 十四、远程登录与文件传输

### 14.1 SSH 登录

使用老师或队长提供的用户名和服务器地址：

```bash
ssh student@server.example.com
```

`server.example.com` 是示例地址，需要替换。指定非默认端口时：

```bash
ssh -p 2222 student@server.example.com
```

首次连接可能询问是否信任主机密钥。应核对管理员提供的主机指纹再确认。登录后执行的命令通常作用于远程电脑，可用 `hostname` 和 `pwd` 确认。

退出远程会话：

```bash
exit
```

### 14.2 SCP 传输文件

以下命令在本地终端执行，假设远程目标目录已存在：

```bash
scp notes/example.txt student@server.example.com:~/project/
scp student@server.example.com:~/project/result.txt ./
```

分别表示上传本地文件和下载远程文件。SSH 的端口选项是小写 `-p`，SCP 指定端口使用大写 `-P`。

需要 SSH 密钥时使用管理员认可的配置方式，公钥可交给管理员配置，私钥保留在自己电脑中。

## 十五、环境变量、引号与脚本

### 15.1 Shell 变量和环境变量

```bash
project_name="linux-practice"
printf '%s\n' "$project_name"
export PROJECT_MODE="practice"
```

赋值时等号两边不加空格。普通 Shell 变量存在于当前 Shell；`export` 将变量加入后续子进程的环境。

`PATH` 是查找命令所用的目录列表，可以查看：

```bash
printf '%s\n' "$PATH"
command -v bash
```

不要随意覆盖 `PATH`、`HOME` 等已有系统变量，否则可能影响工具运行。

### 15.2 单引号与双引号

```bash
project_name="ArcLab"
printf '%s\n' '$project_name'
printf '%s\n' "$project_name"
```

第一条输出字面文本 `$project_name`，第二条输出 `ArcLab`。双引号通常允许变量展开，同时保留变量中的空格；使用路径变量时建议加双引号。

### 15.3 编写简单脚本

用编辑器在练习目录创建 `hello.sh`：

```bash
#!/usr/bin/env bash

name="ArcLab"
printf 'Hello, %s!\n' "$name"
pwd
```

保存后执行：

```bash
bash hello.sh
```

也可以添加执行权限后直接运行：

```bash
chmod u+x hello.sh
./hello.sh
```

`./` 明确指定当前目录中的文件。第一种方式由 Bash 读取脚本，不要求脚本自身具有执行权限；第二种方式需要执行权限，并由首行指定解释器。

脚本建议保存为 UTF-8、使用 Linux 的 LF 换行；Windows 的 CRLF 换行可能导致解释器路径或命令异常。

## 十六、获取帮助

### 16.1 命令帮助

```bash
ls --help
man ls
```

许多程序支持 `--help`，详细文档可以用 `man` 查看，按 `q` 退出。不是所有命令都支持相同帮助选项，精简环境也可能没有安装手册。

Bash 内建命令可以使用：

```bash
help cd
```

### 16.2 理解命令结果

遇到错误时记录当前目录、执行命令和错误原文。先检查帮助中的参数说明，再判断是路径、权限、依赖还是输入内容的问题。

命令没有输出不代表失败，可以查看上一条命令的退出状态：

```bash
printf '%s\n' "$?"
```

通常 `0` 表示成功，非零表示其他状态，具体含义依命令而定。例如 `grep` 返回 `1` 表示没有匹配。

## 十七、一个综合示例

下面创建一份日志，查找错误、统计数量，并打包结果。请在一个全新的目录中跟做；如果目录名已存在，先换名。

### 17.1 准备目录与数据

```bash
mkdir linux-log-demo
cd linux-log-demo
mkdir data output
printf 'INFO start\nERROR sensor_timeout\nINFO retry\nERROR sensor_timeout\nERROR connection_failed\nINFO finish\n' > data/app.log
cat data/app.log
```

### 17.2 搜索并保存错误记录

```bash
grep -nF 'ERROR' data/app.log
grep -F 'ERROR' data/app.log > output/errors.txt
wc -l < output/errors.txt
```

最后一条命令的预期输出为 `3`，表示有三行错误记录。

### 17.3 统计重复记录

```bash
sort output/errors.txt | uniq -c > output/error-counts.txt
cat output/error-counts.txt
```

结果应包含 `sensor_timeout` 两次、`connection_failed` 一次；行顺序和数字前的空白可能因环境而不同。

### 17.4 打包并验证

```bash
tar -czf log-results.tar.gz data/ output/
tar -tzf log-results.tar.gz
mkdir restored
tar -xzf log-results.tar.gz -C restored
diff output/errors.txt restored/output/errors.txt
```

最后的 `diff` 没有输出、退出状态为 `0`，表示两个文件内容相同。

### 17.5 整理操作记录

在 `README.md` 中记录目录结构、每条关键命令的作用和预期结果。把文档、样例数据和统计输出放在一起，便于同伴复现。

## 十八、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| `command not found` | 命令未安装、拼写错误或不在 PATH 中 | 检查拼写，用 `command -v` 查询，再按环境安装 |
| `No such file or directory` | 当前目录错误、文件名或大小写不一致 | 用 `pwd`、`ls` 检查路径 |
| `Permission denied` | 缺少所需权限或脚本执行权限 | 检查 `ls -l`、父目录和文件归属，按需授权 |
| `File exists` | 目标名称已存在 | 先检查已有内容，再复用或换名 |
| `Directory not empty` | 用 `rmdir` 删除非空目录 | 先查看内容，确认后处理具体文件 |
| 文件名有空格时出错 | Shell 将路径拆成多个参数 | 用引号包住完整路径 |
| `grep` 没有输出 | 没有匹配、大小写不同或规则理解错误 | 检查样例，按需使用 `-i` 或 `-F` |
| 输出文件突然变空 | 使用 `>` 覆盖，或输入输出使用同一文件 | 检查重定向，改用独立输出文件 |
| 脚本提示 `bad interpreter` 或出现 `^M` | 首行解释器路径或 CRLF 换行有问题 | 检查解释器，转换为 LF 换行 |
| WSL 命令在 PowerShell 与 Linux 中表现不同 | 当前使用了不同 Shell | 确认操作位置，在对应终端执行 |
| SSH 连接超时或拒绝 | 网络、地址、端口或服务有问题 | 核对服务器信息，联系管理员检查服务 |
| SSH 提示主机密钥变化 | 服务器重装或连接目标发生变化等 | 向管理员核实指纹，不直接忽略提示 |

## 十九、练习

请在自己的独立练习目录完成以下任务。

### 19.1 文件与目录

- [ ] 查看系统发行版、当前用户名和当前位置。
- [ ] 创建 `notes`、`data` 和 `output` 三个子目录。
- [ ] 创建并编辑 `notes/day1.md`。
- [ ] 复制一份备份，再把备份移动并重命名。
- [ ] 用绝对路径和相对路径分别进入同一个目录。
- [ ] 创建一个含空格的文件名，用引号正确查看它。
- [ ] 删除一个明确不要的练习文件，解释 `rm` 与 `rmdir` 的区别。

### 19.2 文本处理

- [ ] 完成综合示例，核对三行错误记录和重复次数。
- [ ] 用 `find` 找出练习目录中的所有 `.md` 文件。
- [ ] 用 `head` 和 `tail` 查看日志开头、结尾各两行。
- [ ] 给日志追加一条错误记录，重新生成结果并解释变化。
- [ ] 比较 `>` 与 `>>` 的作用。

### 19.3 脚本与交接

- [ ] 创建 `hello.sh`，分别用 `bash hello.sh` 和 `./hello.sh` 运行。
- [ ] 查看并解释脚本的权限。
- [ ] 用 `sleep 60 &` 创建后台任务，查看任务并结束它。
- [ ] 将数据与结果打包，在新目录解压并对比文件。
- [ ] 写一份 README，让同伴按步骤完成日志筛选任务。

完成后，尝试说明：相对路径从哪里开始、管道传递什么、重定向何时覆盖文件、脚本为什么有时需要执行权限，以及为什么不应该遇到权限问题就直接使用 `sudo`。

## 二十、常用命令速查表

| 功能 | 命令示例 |
|---|---|
| 查看发行版 | `cat /etc/os-release` |
| 查看当前位置 | `pwd` |
| 列出目录详细信息 | `ls -lah` |
| 返回主目录 | `cd ~` |
| 返回上级目录 | `cd ..` |
| 创建多层目录 | `mkdir -p project/data` |
| 创建空文件或更新时间戳 | `touch notes.md` |
| 复制文件 | `cp -i a.txt b.txt` |
| 复制目录 | `cp -r source target` |
| 移动或重命名 | `mv -i old.txt new.txt` |
| 询问后删除文件 | `rm -i file.txt` |
| 删除空目录 | `rmdir empty-dir` |
| 查看小型文本 | `cat file.txt` |
| 分页查看文本 | `less file.txt` |
| 查看前十行 | `head -n 10 file.txt` |
| 查看后十行 | `tail -n 10 file.txt` |
| 持续观察新增内容 | `tail -f app.log` |
| 查找文件 | `find . -type f -name '*.md'` |
| 按普通字符串搜索 | `grep -nF 'ERROR' app.log` |
| 排序并统计重复行 | `sort names.txt \| uniq -c` |
| 统计文本换行数 | `wc -l file.txt` |
| 查看身份与所属组 | `id` |
| 增加自己的执行权限 | `chmod u+x hello.sh` |
| 查看进程 | `ps -ef` |
| 查看当前 Shell 任务 | `jobs` |
| 请求结束指定进程 | `kill PID`（替换实际 PID） |
| 查看磁盘空间 | `df -h` |
| 查看目录占用 | `du -sh .` |
| 打包压缩 | `tar -czf notes.tar.gz notes/` |
| 查看归档 | `tar -tzf notes.tar.gz` |
| 解压到已有目录 | `tar -xzf notes.tar.gz -C restored` |
| SSH 登录 | `ssh 用户名@服务器地址` |
| Bash 执行脚本 | `bash hello.sh` |
| 查看命令说明 | `man ls` |
| 查看 Bash 内建帮助 | `help cd` |

## 二十一、相关学习资料

- [Ubuntu 官方命令行入门](https://ubuntu.com/tutorials/command-line-for-beginners)：以实际操作介绍目录、文件和命令组合，英文。
- [Missing Semester 中文版](https://missing-semester-cn.github.io/2020/)：选读 Shell 入门、Shell 工具和脚本、命令行环境；为 MIT 课程的社区中文翻译。
- [The Linux Command Line 作者官网](https://linuxcommand.org/tlcl.php)：提供面向命令行新手的英文教材和免费 PDF。
- [GNU Bash 手册](https://www.gnu.org/software/bash/manual/)：查阅变量、引号、重定向、管道和脚本规则，英文。
- [GNU Coreutils 手册](https://www.gnu.org/software/coreutils/manual/)：查阅 `ls`、`cp`、`mv`、`rm`、`sort` 等基础工具，英文。
- [微软 WSL 安装文档](https://learn.microsoft.com/zh-cn/windows/wsl/install)：Windows 用户准备 Linux 环境的中文官方说明。
