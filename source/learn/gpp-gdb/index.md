---
title: "g++ 与 GDB"
layout: lesson
description: "理解 C++ 编译链接，再亲手检查程序运行现场。"
category_label: "开始编程实践"
lesson_slug: gpp-gdb
---
## 一、什么是 g++ 和 GDB？

g++ 是 GCC 工具链中常用的 C++ 编译驱动程序，负责组织预处理、编译、汇编和链接等步骤。GDB 是调试器，可以在程序运行时设置断点、查看变量、单步执行和检查调用栈。

### 两个工具分别做什么？

| 工具 | 输入 | 常见输出或结果 |
|---|---|---|
| g++ | C++ 源文件、目标文件和库 | 可执行程序、目标文件、错误与警告 |
| GDB | 可执行程序及调试信息 | 暂停程序、检查运行状态、定位问题 |

基本流程：

```text
编写 C++ 源码 → g++ 编译与链接 → 运行程序
                               ↓ 有异常或错误结果
                         GDB 检查运行现场
                               ↓
                     修改源码 → 重新编译 → 验证
```

### 为什么要学习？

- 理解编辑器中“编译”和“运行”背后发生的事情。
- 分辨语法问题、链接问题和运行问题。
- 检查循环、函数参数、指针和中间计算结果。
- 为 C++ 项目、算法实现和嵌入式学习准备基础。

**说明：** 本教程以 Linux / WSL 中的 GCC 与 GDB 为主，示例使用 C++17。需要基础 C++ 语法和终端操作知识，不要求先掌握 Make 或 CMake。

## 二、安装与检查环境

### 2.1 Ubuntu / Debian

在自己的 Linux 环境中执行：

```bash
sudo apt update
sudo apt install build-essential gdb
```

`build-essential` 提供常见编译构建工具，`gdb` 提供调试器。安装命令适用于使用 apt 的系统，其他发行版需按其包管理方式安装。

共用服务器上的工具安装由管理员安排，不需要为了学习直接修改系统工具链。

### 2.2 Windows

可以通过 [WSL 官方安装说明](https://learn.microsoft.com/zh-cn/windows/wsl/install)准备 Ubuntu 环境，再在 WSL 内安装并跟做。

Windows 原生也有其他工具链，但路径、可执行文件格式和调试配置不同。入门时选定一种环境，不要混用 Windows 与 WSL 的工具和生成文件。

### 2.3 macOS

macOS 中名为 `g++` 的系统命令可能实际是 Apple Clang，常用调试器是 LLDB。GNU GCC 与 GDB 的安装、支持架构和调试授权另有要求。

如果要完整跟做本教程的 GDB 部分，优先使用 Linux 虚拟机、服务器或 WSL 环境。LLDB 的命令不能全部照搬 GDB。

### 2.4 检查实际工具

```bash
g++ --version
gdb --version
```

不要只看命令名称，应阅读输出中的编译器类型与版本。编译器、标准库、调试器和目标平台需要相互兼容。

## 三、第一个 C++ 程序

### 3.1 创建源文件

在独立的练习目录创建 `hello.cpp`：

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, ArcLab!\n";
    return 0;
}
```

### 3.2 编译与运行

在源文件所在目录执行：

```bash
g++ -std=c++17 -Wall -Wextra hello.cpp -o hello
./hello
```

预期输出：

```text
Hello, ArcLab!
```

- `-std=c++17`：指定语言标准。
- `-Wall -Wextra`：启用常用警告，不代表打开所有检查。
- `-o hello`：指定输出程序名。
- `./hello`：运行当前目录中的程序。

**注意：** 编译成功通常不会额外显示“成功”。编译失败后，不要误运行目录中之前留下的旧程序；先确认本次编译结果。

## 四、预处理、编译、汇编与链接

### 4.1 四个阶段

```text
hello.cpp
   ↓ 预处理：处理 #include、宏等
hello.ii
   ↓ 编译：生成汇编代码
hello.s
   ↓ 汇编：生成目标文件
hello.o
   ↓ 链接：组合目标文件、所需库等
hello
```

默认一步完成不要求手动保留所有中间文件。阶段拆分主要用于理解与排查。

### 4.2 查看中间结果

```bash
g++ -std=c++17 -E hello.cpp -o hello.ii
g++ -std=c++17 -S hello.cpp -o hello.s
g++ -std=c++17 -c hello.cpp -o hello.o
g++ hello.o -o hello
```

| 选项 | 停在哪一步 |
|---|---|
| `-E` | 预处理之后 |
| `-S` | 生成汇编代码之后 |
| `-c` | 生成目标文件之后，不链接 |
| 不指定上述选项 | 通常继续完成链接 |

目标文件 `.o` 通常不能直接当作程序运行。使用 g++ 链接 C++ 程序，会按工具链规则处理所需的 C++ 标准库；直接用 gcc 链接 C++ 目标文件可能缺少相关库。

## 五、常用 g++ 参数

### 5.1 基础参数

| 参数 | 用途 |
|---|---|
| `-std=c++17` | 选择 C++17 标准 |
| `-o 文件名` | 指定输出文件 |
| `-Wall` | 启用一组常见警告 |
| `-Wextra` | 启用更多警告 |
| `-Wpedantic` | 检查部分语言标准相关问题 |
| `-g` | 生成调试信息 |
| `-O0` | 关闭大部分优化，便于入门观察源码步骤 |
| `-Og` | GCC 面向调试体验的优化等级 |
| `-O2` | 常见优化等级之一 |
| `-I目录` | 增加头文件搜索路径 |
| `-L目录` | 增加链接库搜索路径 |
| `-l名称` | 链接指定名称的库 |
| `-D名称=值` | 定义预处理宏 |

### 5.2 调试构建

本教程主要使用：

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 hello.cpp -o hello
```

`-g` 不等于关闭优化，`-O0` 也不等于自动生成调试信息，两者作用不同。

GCC 也支持 `-g -Og` 的调试构建。优化后的程序可以调试，但变量可能被消除、合并，执行位置也可能与源码逐行对应不同。

### 5.3 优化与警告

发布构建可以按项目需要选择优化等级，但不应凭 `-O2` 就判断性能一定满足要求。

`-Werror` 会把启用的警告视作错误，适合有明确规范的项目，不必一开始强制使用；也不要通过关闭所有警告掩盖真正问题。

## 六、多文件编译与头文件

### 6.1 项目结构

```text
multi-file/
├── main.cpp
├── math_utils.cpp
└── math_utils.h
```

`math_utils.h`：

```cpp
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int add(int a, int b);

#endif
```

`math_utils.cpp`：

```cpp
#include "math_utils.h"

int add(int a, int b)
{
    return a + b;
}
```

`main.cpp`：

```cpp
#include <iostream>
#include "math_utils.h"

int main()
{
    std::cout << add(2, 3) << '\n';
    return 0;
}
```

头文件中的函数声明告诉编译器如何调用，源文件中的定义提供实现。头文件保护避免同一翻译单元重复包含造成部分问题，不代替多文件之间的定义规则。

### 6.2 一次编译链接

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 main.cpp math_utils.cpp -o app
./app
```

预期输出 `5`。不要为了链接实现而直接在 `main.cpp` 中 `#include "math_utils.cpp"`。

### 6.3 分别编译后链接

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 -c main.cpp -o main.o
g++ -std=c++17 -Wall -Wextra -g -O0 -c math_utils.cpp -o math_utils.o
g++ main.o math_utils.o -o app
```

修改某个源文件后，可以重新编译对应目标文件，再链接。头文件变化可能影响多个目标文件，项目变大后通常交给 Make 或 CMake 等工具管理依赖。

## 七、头文件路径、库路径与链接错误

### 7.1 -I：头文件路径

假设头文件位于 `include`，源码位于 `src`：

```text
g++ -std=c++17 -Iinclude src/main.cpp src/math_utils.cpp -o app
```

这是另一种项目布局的命令示例，要求文件真实存在。

### 7.2 -L 与 -l：链接库

格式示例：

```text
g++ main.o -L./lib -ldemo -o app
```

`-L./lib` 增加库搜索目录，`-ldemo` 请求名为 demo 的库；Linux 中常见对应文件如 `libdemo.so`、`libdemo.a`。

它不负责寻找头文件，也不保证程序运行时就能找到共享库。静态库链接常受顺序影响，一般把使用库的目标文件放在所需库之前。

### 7.3 典型问题

| 提示 | 所处阶段与常见原因 |
|---|---|
| `fatal error: ... No such file or directory` | 找不到头文件，检查拼写、安装与 `-I` |
| `undefined reference to ...` | 链接时缺少定义、目标文件、库或签名不匹配 |
| `multiple definition of ...` | 同一实体出现不允许的重复定义 |
| `cannot find -ldemo` | 找不到所请求的库，检查 `-L` 和库文件 |

不同系统和链接器的报错措辞可能不同。优先阅读最早的关键错误，不要只看最后一句“链接失败”。

## 八、启动 GDB

### 8.1 载入程序

先用 `-g -O0` 编译，之后执行：

```bash
gdb ./hello
```

进入后出现 `(gdb)` 提示符。下文 GDB 命令都输入在这里，不写进 C++ 源码，也不直接输入普通终端。

### 8.2 run 与 start

```text
run
```

`run` 启动被调试程序。如果没有断点，可能直接运行结束。

```text
start
```

`start` 通常设置一次性的主函数入口暂停并启动程序，适合查看入口附近状态。

### 8.3 程序参数

在终端中使用：

```text
gdb --args ./app 参数1 参数2
```

进入 GDB 后执行 `run`。也可以在 GDB 中用 `set args 参数1 参数2` 设置，并用 `show args` 查看。

`run` 是重新启动，`continue` 是继续当前暂停的运行，两者不同。

## 九、查看源码、变量与类型

### 9.1 list 与 help

```text
list
list main
list 1,20
help
help break
```

`list` 显示代码，`help` 查询命令。源码不可用时，检查调试信息与编译时路径；调试器不能仅凭任意可执行文件自动恢复原始 C++ 源码。

### 9.2 print、whatis 与 ptype

```text
print value
print values[0]
whatis value
ptype value
info locals
info args
```

这些表达式使用的变量要在当前栈帧中有定义。`print` 常缩写为 `p`，`whatis` 查看类型，`ptype` 可以展示更详细的类型结构。

### 9.3 不同进制显示

```text
print/x value
print/t value
print/d value
```

分别按十六进制、二进制和十进制显示适用的值，不会改变变量本身。

源代码中下一条赋值尚未执行时，不能把该变量未初始化的显示当成可靠值。当前行、初始化时机和生命周期都需要一起判断。

## 十、断点与条件断点

### 10.1 设置断点

```text
break main
break calculate_average
break average_demo.cpp:9
```

可以按函数或文件行号设置。行号示例需要与实际文件对应；空行或没有独立机器指令的位置可能映射到附近可执行位置。

重载函数、模板和内联函数可能对应多个位置，必要时用引号和完整签名区分：

```text
break 'add(int, int)'
```

### 10.2 查看与管理

```text
info breakpoints
disable 1
enable 1
delete 1
```

编号按实际列表替换。无编号 `delete` 可能删除所有断点，不要与删除单个断点混淆。

### 10.3 条件断点

```text
break loop_demo.cpp:9 if value < 0
```

当执行到对应位置、且条件为真时暂停。条件变量必须在该位置能被访问。

已存在编号为 1 的断点，也可以设置：

```text
condition 1 value < 0
```

### 10.4 临时断点

```text
tbreak main
```

命中后自动删除，适合只暂停一次的位置。

## 十一、单步执行与继续运行

| 命令 | 常用缩写 | 作用 |
|---|---|---|
| `next` | `n` | 按源码前进，通常不逐行进入调用 |
| `step` | `s` | 按源码前进，可能进入函数调用 |
| `finish` | 无需缩写 | 继续到当前选中函数自然返回 |
| `continue` | `c` | 继续运行，到断点、信号等事件再停下 |
| `until` | `u` | 运行到当前帧中后续位置或返回 |
| `quit` | `q` | 退出 GDB，必要时确认结束被调试进程 |

### next 与 step

在 `result = add(2, 3);` 前暂停时，`step` 可以进入 `add()`，`next` 通常完成调用后在当前帧下一源码位置停下。

其他断点或信号仍可能打断运行，不应把 `next` 理解为无条件忽略函数内部断点。

### finish 与 return 不同

GDB 的 `finish` 正常运行到函数返回；`return` 可以强制结束函数调用并改变运行状态，初学时不用于代替 `finish`。

如果学过 pdb，要注意：pdb 的 `r` 常用于运行到返回，而 GDB 中同名或缩写的含义不同。使用完整命令更清楚。

单步只能正常向前执行，不能自动撤销上一行的副作用。

## 十二、调用栈、栈帧与线程

### 12.1 backtrace

```text
backtrace
bt
```

显示从当前函数到调用者的栈帧。通常 `#0` 为最内层当前帧，`#1` 为调用者。

### 12.2 切换查看位置

```text
frame 1
info args
info locals
up
down
```

`frame`、`up`、`down` 只是切换观察的上下文，不会把程序执行倒回过去。同名局部变量在不同帧可能有不同值。

### 12.3 多线程概览（选学）

```text
info threads
thread apply all bt
```

查看线程与各线程栈。多线程调试还涉及调度和同步，本教程练习先使用单线程程序，不根据单步时序直接推断真实并发行为。

## 十三、观察点与持续显示

### 13.1 display

在变量已初始化且位于作用域内时：

```text
display total
info display
undisplay 1
```

`display` 在后续暂停时自动展示表达式，`undisplay` 按自动显示编号取消。

### 13.2 watch

```text
watch total
continue
```

观察表达式值变化，帮助定位“谁修改了这个变量”。不要在局部变量尚未初始化时，直接把其当前内容视为有效起点。

硬件观察点数量、可监视大小和平台支持有限，软件观察点可能明显拖慢运行。观察点也受局部变量生命周期影响。

`info breakpoints` 可以查看观察点，删除时使用对应编号；某些平台还支持 `rwatch`、`awatch` 等读访问观察。

## 十四、指针、数组与对象检查

### 14.1 查看地址与内容

假设当前作用域中存在 `int values[3]` 和指向它的有效指针 `ptr`：

```text
print ptr
print *ptr
print &values[0]
print values
```

指针值是地址，解引用才是读取指向内容。空指针、悬空指针或越界地址不能因为“调试器能输入表达式”就当成安全有效的数据。

### 14.2 检查内存

在 `int` 为 4 B 的练习平台上：

```text
x/3dw ptr
```

表示从 `ptr` 地址开始，以 4 B 单位显示 3 个十进制整数。`x/8xb ptr` 则显示 8 个十六进制字节；读取范围应位于有效内存内。

### 14.3 C++ 容器

```text
print values
```

如果 `values` 是 `std::vector`，是否能友好显示元素取决于标准库与 GDB pretty-printer 配置。不要依赖某个标准库的内部成员名称作为通用接口。

在调试器中调用成员函数可能执行真实代码、受优化影响或失败。优先查看已有状态；不把调试时修改对象当成源码修复。

## 十五、异常、崩溃与事后分析

### 15.1 停在 C++ 异常抛出处

```text
catch throw
run
```

`catch throw` 在支持的平台和运行环境中可以捕获 C++ 异常抛出事件。可能先停在异常运行库内部，再通过 `bt` 找到自己的调用帧。

### 15.2 段错误与未定义行为

Linux 中非法内存访问可能表现为 `SIGSEGV`。暂停后先查看：

```text
bt
info locals
info args
```

数组越界、释放后使用等属于未定义行为，不保证每次崩溃，也不保证崩溃位置就是首次错误位置。程序“这次没崩”不代表正确。

### 15.3 Core dump（选学）

系统配置允许时，崩溃可能生成 core 或由系统服务收集。使用与崩溃版本匹配的可执行文件和调试信息分析：

```text
gdb ./app core文件路径
```

core 中是事后状态，不能像正常存活进程一样继续运行。core 的生成位置、大小限制与读取方式依系统而异，不要求入门时修改系统配置。

## 十六、Sanitizer：辅助发现运行问题

支持的 GCC / 平台中，可以用插桩检查补充 GDB：

```bash
g++ -std=c++17 -Wall -Wextra -g -O1 -fno-omit-frame-pointer -fsanitize=address,undefined bug.cpp -o bug-sanitized
./bug-sanitized
```

- AddressSanitizer：帮助发现多种越界、释放后使用等内存问题。
- UndefinedBehaviorSanitizer：检查支持范围内的多种未定义行为。
- `-fno-omit-frame-pointer`：在支持的平台上帮助保留栈回溯信息。

需要编译器、链接步骤和运行库支持，不能保证发现全部错误。示例把编译与链接放在一条命令中，因此两阶段都会收到对应选项。

可使用下面的 `bug.cpp` 练习，代码故意包含错误：

```cpp
#include <iostream>

int main()
{
    int values[3] = {1, 2, 3};
    int total = 0;
    for (int i = 0; i <= 3; ++i)
    {
        total += values[i];
    }
    std::cout << total << '\n';
    return 0;
}
```

`i == 3` 时访问了数组之外的位置。修复循环条件为 `i < 3`，重新编译并运行，预期得到 `6`。错误版本的输出不应视为确定值。

## 十七、一个综合示例：定位错误的平均值

下面程序能编译运行，但计算结果错误。先用 GDB 检查输入和中间值，再修复。

### 17.1 创建程序

保存为 `average_demo.cpp`，按下列代码原样保留行结构：

```cpp
#include <iostream>

double calculate_average(const int* values, int count)
{
    int total = 0;
    for (int i = 0; i < count; ++i)
    {
        total += values[i];
    }
    int divisor = count - 1;
    double average = static_cast<double>(total) / divisor;
    return average;
}

int main()
{
    int values[] = {20, 22, 24};
    double result = calculate_average(values, 3);
    std::cout << "Average: " << result << '\n';
    return 0;
}
```

编译并运行：

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 average_demo.cpp -o average_demo
./average_demo
```

错误版本输出 `Average: 33`，期望应为 `Average: 22`。

### 17.2 暂停并检查

```bash
gdb ./average_demo
```

按原样代码，第 11 行是计算平均值的语句。在 GDB 中输入：

```text
break average_demo.cpp:11
run
print count
print total
print divisor
print static_cast<double>(total) / count
```

应分别看到 `3`、`66`、`2` 和 `22`。除法语句还没有执行，`average` 尚未得到本轮赋值。

### 17.3 检查调用栈与计算结果

```text
bt
up
info locals
down
next
print average
continue
```

`up` 查看 `main()`，`down` 返回计算函数。`next` 执行除法后，`average` 为 `33`。证据表明总和正确，错误来自分母少了 1。

### 17.4 修改函数

退出 GDB，加入 `<stdexcept>` 头文件，并替换函数定义：

```cpp
double calculate_average(const int* values, int count)
{
    if (values == nullptr || count <= 0)
    {
        throw std::invalid_argument("values must be valid and count positive");
    }
    long long total = 0;
    for (int i = 0; i < count; ++i)
    {
        total += values[i];
    }
    return static_cast<double>(total) / count;
}
```

调用者仍需保证指针指向至少 `count` 个有效元素；仅检查非空不能验证数组实际长度。累加改为 `long long` 适合本练习，也不代表无限范围安全。

### 17.5 重新编译与验证

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 average_demo.cpp -o average_demo
./average_demo
```

确认输出 `Average: 22`。再测试一个元素、含零数据、空指针或非正数量的处理。异常测试需要调用者捕获相应异常，不能只看程序是否退出。

修改源码后必须重新编译，并确保调试的是新生成文件。GDB 不会因你保存了 `.cpp` 就自动重新构建整个项目。

## 十八、一个条件断点练习

保存为 `loop_demo.cpp`，按原样保留行结构：

```cpp
#include <iostream>

int main()
{
    int values[] = {2, 4, -3, 8};
    int total = 0;
    for (int value : values)
    {
        total += value;
    }
    std::cout << total << '\n';
    return 0;
}
```

编译并启动：

```bash
g++ -std=c++17 -Wall -Wextra -g -O0 loop_demo.cpp -o loop_demo
gdb ./loop_demo
```

在真正使用 `value` 的第 9 行设置条件断点：

```text
break loop_demo.cpp:9 if value < 0
run
print value
print total
```

预期 `value` 为 `-3`、`total` 为 `6`，因为本轮累加尚未执行。这里刻意选在循环体内，避免在循环变量尚未进入有效位置时求值。

## 十九、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 找不到 g++ / gdb | 未安装或当前环境 PATH 不正确 | 检查工具安装和所在终端 |
| g++ 输出 Apple Clang | macOS 的命令映射 | 确认真实编译器，GDB 练习使用匹配环境 |
| 编译语法错误很多 | 前面的括号、分号、类型等错误引发连锁问题 | 从第一条关键错误开始修复 |
| `undefined reference` | 漏了定义、目标文件或库，签名不一致 | 检查编译与链接输入 |
| 程序输出仍像旧版本 | 本次编译失败或运行了其他路径的文件 | 检查构建结果和执行路径 |
| GDB 找不到源码或变量 | 缺少调试信息、源码路径变化 | 用 `-g` 重新构建并检查对应源码 |
| 显示 `<optimized out>` | 优化消除了或改变了变量存储 | 用适合调试的构建，核对优化等级 |
| 行号断点没有停在预期位置 | 没执行到该路径、优化或行号变化 | 核对程序版本、断点位置和输入 |
| `next` 进入函数 | 函数内已有断点或发生信号 | 检查断点与停止原因 |
| 查看变量提示不在当前上下文 | 选错帧或已超出作用域 | 用 `bt`、`frame`、`info locals` 检查 |
| 观察点设置失败 | 硬件数量、大小、支持或表达式问题 | 减少观察点，检查平台帮助 |
| GDB 启动程序被拒绝 | 系统调试权限、容器策略或授权限制 | 按管理员与系统文档配置，不直接关闭系统保护 |
| 数组越界却没有崩溃 | 未定义行为没有必然表现 | 修正代码，结合 Sanitizer 与测试 |
| 异常停在标准库中 | 捕获的是底层抛出过程 | 用调用栈找到自己的代码帧 |

## 二十、练习

### 20.1 编译基础

- [ ] 检查实际编译器和 GDB 版本。
- [ ] 编译运行 `hello.cpp`，解释 `-std`、`-Wall`、`-o`。
- [ ] 使用 `-E`、`-S`、`-c` 生成中间文件，说明区别。
- [ ] 跑通多文件示例，分别尝试一步构建和分步构建。
- [ ] 故意漏掉 `math_utils.cpp`，观察链接报错，再修复。
- [ ] 说明头文件声明与函数定义的区别。

### 20.2 GDB 基础

- [ ] 使用 `start` 在主函数附近暂停。
- [ ] 设置函数断点、行号断点，查看并删除。
- [ ] 使用 `next`、`step`、`finish`，比较行为。
- [ ] 查看局部变量、函数参数和调用栈。
- [ ] 使用 `print/x`、`print/t` 查看一个整数。
- [ ] 在有效作用域中观察一个累加变量的变化。

### 20.3 综合调试

- [ ] 完成平均值案例，记录分母错误的证据。
- [ ] 修复后重新编译，并验证单元素和非法输入。
- [ ] 完成负数条件断点练习，解释暂停时的总和。
- [ ] 使用 Sanitizer 检查故意越界的数组循环，再修复。
- [ ] 写一份调试记录，包含输入、构建命令、断点、原因与验证结果。

## 二十一、常用命令速查表

### 21.1 g++

| 功能 | 命令示例 |
|---|---|
| 查看编译器 | `g++ --version` |
| 调试构建 | `g++ -std=c++17 -Wall -Wextra -g -O0 main.cpp -o app` |
| 仅预处理 | `g++ -E main.cpp -o main.ii` |
| 生成汇编 | `g++ -S main.cpp -o main.s` |
| 生成目标文件 | `g++ -g -O0 -c main.cpp -o main.o` |
| 多目标文件链接 | `g++ main.o utils.o -o app` |
| 增加头文件路径 | `-Iinclude` |
| 增加库路径 / 请求库 | `-Llib` / `-ldemo` |
| 运行时插桩 | `-fsanitize=address,undefined`，需要平台支持 |

### 21.2 GDB

| 功能 | 命令示例 |
|---|---|
| 载入程序 | 终端中 `gdb ./app` |
| 携带参数载入 | 终端中 `gdb --args ./app 参数` |
| 启动 / 在 main 暂停启动 | `run` / `start` |
| 查看源码 | `list` |
| 设置断点 | `break main`、`break main.cpp:10` |
| 设置条件 | `break main.cpp:10 if count > 5` |
| 查看断点与观察点 | `info breakpoints` |
| 禁用 / 恢复 / 删除 | `disable 1` / `enable 1` / `delete 1` |
| 临时断点 | `tbreak main` |
| 单步不进入 / 可能进入 | `next` / `step` |
| 运行至自然返回 | `finish` |
| 继续当前运行 | `continue` |
| 查看变量 | `print value` |
| 查看局部变量 / 参数 | `info locals` / `info args` |
| 查看类型 | `whatis value`、`ptype value` |
| 查看调用栈 | `bt` |
| 选择帧 | `frame 1`、`up`、`down` |
| 自动显示表达式 | `display total` |
| 值变化时暂停 | `watch total` |
| 查看线程 | `info threads` |
| 查看所有线程栈 | `thread apply all bt` |
| 查看帮助 / 退出 | `help` / `quit` |

命令中的路径、变量、行号和断点编号都要按实际代码替换。

## 二十二、相关学习资料

- [GCC 官方：编译阶段与输出选项](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)：理解 `-E`、`-S`、`-c` 与构建流程，英文。
- [GCC 官方：调试选项](https://gcc.gnu.org/onlinedocs/gcc/Debugging-Options.html)：`-g` 与优化的关系。
- [GCC 官方：链接选项](https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html)：目标文件和库的链接。
- [GCC 官方：运行时插桩](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)：Sanitizer 的支持与限制。
- [GDB 官方手册](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)：按需查阅命令，不必一开始通读。
- [GDB：断点](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Set-Breaks.html)、[观察点](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Set-Watchpoints.html)：暂停条件与变量变化监控。
- [GDB：单步执行](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Continuing-and-Stepping.html)、[调用栈](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Backtrace.html)：控制执行与检查调用关系。

官方文档的当前版本可能比本机工具新，功能与行为应结合实际版本确认。先完成“编译一个程序、设置断点、查看变量、修复并验证”的完整流程，再学习大型项目构建与高级调试。
