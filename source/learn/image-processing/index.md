---
title: "图像处理基础"
layout: lesson
description: "像素、颜色、滤波与分割，建立视觉处理的基础认识。"
category_label: "开始编程实践"
lesson_slug: image-processing
---
## 一、什么是图像处理？

数字图像处理是利用计算机对图像进行读取、变换、增强、分析和保存。例如，让图像更容易观察、从背景中分离目标、测量目标面积或提取边缘。

### 图像处理有什么用？

- 调整照片尺寸，裁剪感兴趣区域。
- 改善对比度，减少噪声对观察和分析的影响。
- 提取传感器画面、实验照片中的目标。
- 检查工件轮廓，统计简单场景中的物体数量。
- 为文字识别、目标检测和机器学习准备输入数据。

### 图像处理与计算机视觉

| 概念 | 主要关注 | 示例 |
|---|---|---|
| 图像处理 | 改变或分析图像信号 | 滤波、缩放、对比度调整 |
| 计算机视觉 | 从图像理解目标或场景 | 识别物体、估计位置、理解动作 |

两者存在交叉。处理后“看起来更清楚”，不一定意味着测量或识别结果更准确。

**说明：** 本教程先介绍基础概念，再使用 Python、NumPy 和 OpenCV 4 演示。代码部分需要基本 Python 语法；深度学习模型不属于本教程的入门范围。

## 二、图像是怎样表示的？

### 2.1 像素

数字图像可以看作规则排列的数值网格。网格中的一个位置称为像素（Pixel）。

一幅小型灰度图像可以写成：

```text
  0   0 255 255
  0 128 128 255
255 255   0   0
```

对于常见的 8 位灰度表示，`0` 为黑，`255` 为白，中间数值表示不同灰度。

### 2.2 宽、高和像素数量

图像尺寸通常写成“宽 × 高”：

```text
640 × 480 → 640 列、480 行 → 307200 个像素
1920 × 1080 → 2073600 个像素，约 207 万像素
```

“分辨率”在不同场景可能指像素尺寸或空间细节分辨能力，讨论时应明确含义。PPI / DPI 等密度指标与像素宽高不同，仅修改密度元数据不会自动增加图像细节。

### 2.3 采样与量化

- **采样**：在空间位置上离散取样，决定像素网格有多密。
- **量化**：把测量值映射到有限数值等级，决定每个样本能区分多少级。

采样过疏可能丢失细节或产生混叠；量化等级过少可能出现明显色阶。增加输出尺寸或位深不能自动恢复已经丢失的信息。

### 2.4 位深、通道与容量

| 图像类型 | 常见数组形状 | 常见数据表示 |
|---|---|---|
| 灰度图 | `(高, 宽)` | 每像素一个灰度值 |
| RGB / BGR 彩色图 | `(高, 宽, 3)` | 每像素三个颜色通道 |
| RGBA / BGRA 图 | `(高, 宽, 4)` | 颜色通道加透明度通道 |
| 二值掩码 | 常见为 `(高, 宽)` | 概念上两种值，实际可用 8 位存储 |

“8 位图像”有时指每通道 8 位；三个通道各 8 位的 RGB 图像，像素颜色数据合计为 24 位。

例如，640 × 480、三通道、每通道 1 B 的像素数组：

```text
640 × 480 × 3 × 1 B = 921600 B ≈ 0.879 MiB
```

这不是 PNG 或 JPEG 文件大小，也不包含数组对象、行对齐或元数据等额外开销。

## 三、图像坐标与数组索引

### 3.1 坐标方向

常见图像坐标原点位于左上角，x 向右增加，y 向下增加：

```text
(0,0) ─────→ x
  │
  │
  ↓ y
```

### 3.2 坐标与索引的区别

NumPy 数组通常按“行、列”访问：

```python
pixel = image[y, x]
```

OpenCV 绘图函数中的点通常按 `(x, y)` 传入，缩放目标尺寸通常是 `(宽, 高)`。而 `image.shape` 的前两项通常是 `(高, 宽)`。

### 3.3 裁剪区域

```python
roi = image[20:80, 30:120]
```

表示 y 从 20 到 79、x 从 30 到 119，裁剪结果高 60、宽 90。切片的结束位置不包含在内。

ROI 是 Region of Interest，即感兴趣区域。NumPy 基础切片通常与原数组共享数据，修改它可能影响原图；需要独立副本时使用：

```python
roi = image[20:80, 30:120].copy()
```

以上代码用于说明索引，运行前需要先创建或读取 `image`。

## 四、灰度、RGB、BGR 与颜色空间

### 4.1 灰度图

灰度图每个像素用一个数表示强度，适合阈值分割、边缘和形状分析，但转换后会丢失颜色信息。

从 RGB 得到常见灰度表示时，可近似理解为加权求和：

```text
Gray ≈ 0.299R + 0.587G + 0.114B
```

这是常见工程灰度转换的近似表达，不是任意颜色空间下都适用的物理亮度计算。

### 4.2 RGB 与 BGR

RGB 分别表示红、绿、蓝。常见 8 位 RGB 值：

| 颜色 | RGB | BGR |
|---|---|---|
| 红 | `(255, 0, 0)` | `(0, 0, 255)` |
| 绿 | `(0, 255, 0)` | `(0, 255, 0)` |
| 蓝 | `(0, 0, 255)` | `(255, 0, 0)` |
| 白 | `(255, 255, 255)` | `(255, 255, 255)` |
| 黑 | `(0, 0, 0)` | `(0, 0, 0)` |

OpenCV 默认彩色读取通常使用 BGR 顺序，Pillow 和 Matplotlib 常使用 RGB。颜色显示反常时先检查通道顺序。

### 4.3 HSV

- H：色相，表示颜色种类。
- S：饱和度，表示颜色的鲜艳程度。
- V：明度分量，描述颜色模型中的明暗水平。

HSV 常用于按颜色分割。OpenCV 常规 **8 位 `COLOR_BGR2HSV`** 表示中，H 范围为 0～179，S、V 为 0～255；浮点表示或其他转换标志的范围可能不同。

HSV 不是对光照完全不敏感的表示。红色色相跨过环形起点时通常需要两个区间，低饱和度像素的色相也不宜直接当成可靠颜色判断。

### 4.4 Alpha 透明度

常见 8 位 Alpha 中，0 表示完全透明，255 表示完全不透明。是否存在 Alpha、是否预乘颜色以及软件如何合成，取决于格式和工具。

读取透明 PNG 时，默认彩色读取可能丢弃透明度；需要保留时使用相应读取选项。

## 五、常见图像格式

| 格式 | 常见特点 | 适合场景 |
|---|---|---|
| JPEG | 常见为有损压缩，不提供普通 Alpha 透明通道 | 自然照片、允许压缩损失的展示 |
| PNG | 无损压缩，可支持透明度 | 截图、掩码、处理结果 |
| BMP | 常见为未压缩位图，也存在压缩变体 | 简单位图交换 |
| TIFF | 支持多种位深、压缩与多页组织方式 | 扫描、科研及专业图像 |

把 JPEG 另存为 PNG 不会恢复 JPEG 已损失的细节。二值掩码和标签图优先使用无损保存，避免 JPEG 压缩改变像素值。

修改扩展名不等于转换格式，保存操作还需要相应编码器。实验中应保留原图，另存处理结果。

## 六、准备 Python 图像处理环境

### 6.1 安装依赖

建议在独立虚拟环境中执行：

```bash
python -m pip install numpy opencv-python matplotlib
```

没有桌面图形环境的服务器可以选择 `opencv-python-headless`，不要在同一环境中混装多个提供 `cv2` 的 OpenCV 包。

本文通过保存结果文件检查效果，不依赖 `cv2.imshow()`。

### 6.2 检查导入

```python
import cv2 as cv
import numpy as np

print(cv.__version__)
print(np.__version__)
```

### 6.3 示例使用约定

后面的独立小节通常假设已执行以下读取代码，得到 `image` 和 `gray`。每次独立运行时，应先加入导入、读取和检查部分：

```python
import cv2 as cv
import numpy as np

image = cv.imread("input.png", cv.IMREAD_COLOR)
if image is None:
    raise FileNotFoundError("无法读取 input.png，请检查路径、格式和文件内容")

gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
```

准备一张自己的 `input.png`，或先运行第二十节综合示例生成测试图。相对路径从当前工作目录出发，不一定从脚本所在目录出发。

## 七、读取、查看与保存图像

### 7.1 查看属性

```python
print(image.shape)
print(image.dtype)
print(image.nbytes)

height, width = image.shape[:2]
print("宽：", width, "高：", height)
```

普通三通道 8 位图像常见类型为 `uint8`，灰度图通常只有二维。不要对任意图像都直接解包为 `height, width, channels`。

### 7.2 保存结果

```python
from pathlib import Path

output = Path("output")
output.mkdir(parents=True, exist_ok=True)

if not cv.imwrite(str(output / "gray.png"), gray):
    raise OSError("图像保存失败")
```

`imwrite()` 需要目标父目录已经存在；应检查返回值，编码器或路径等问题也可能抛出异常。保存同名文件会覆盖旧结果。

### 7.3 用 Matplotlib 查看

```python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2)
axes[0].imshow(cv.cvtColor(image, cv.COLOR_BGR2RGB))
axes[0].set_title("Original")
axes[1].imshow(gray, cmap="gray", vmin=0, vmax=255)
axes[1].set_title("Gray")
for ax in axes:
    ax.axis("off")
fig.tight_layout()
fig.savefig("comparison.png", dpi=150)
plt.close(fig)
```

指定灰度显示范围，便于公平比较不同图像；显示程序自动拉伸数值范围时，可能让原本很暗的图像看起来正常。

## 八、像素运算与数据类型

### 8.1 亮度与对比度调整

常见线性变换：

```text
输出 = α × 输入 + β
```

α 控制数值跨度，β 控制偏移；这里的“亮度、对比度”是简化的像素变换含义。

```python
adjusted = np.clip(image.astype(np.float32) * 1.2 + 20, 0, 255).astype(np.uint8)
```

先转换为浮点类型，运算后截断到合法范围，再转回 8 位整数。

### 8.2 避免无符号整数回绕

```python
sample = np.array([250], dtype=np.uint8)
print(sample + np.array([10], dtype=np.uint8))  # [4]，发生回绕
print(cv.add(sample, np.array([10], dtype=np.uint8)))  # 饱和到 255
```

NumPy 的固定宽度数组运算与 OpenCV 的某些饱和运算行为不同。减法也应注意，例如计算梯度或差值时可能需要有符号或浮点类型。

### 8.3 归一化

```python
normalized = image.astype(np.float32) / 255.0
```

对于原本为 0～255 的 8 位输入，这会得到 0～1 的浮点数。类型变成浮点并不自动意味着已经归一化，应检查实际数值范围。

## 九、裁剪、缩放、翻转与旋转

### 9.1 裁剪与缩放

```python
height, width = image.shape[:2]
roi = image[:height // 2, :width // 2].copy()

new_width = max(1, width // 2)
new_height = max(1, height // 2)
small = cv.resize(image, (new_width, new_height), interpolation=cv.INTER_AREA)
```

缩放时保持宽高比可以避免形状失真。增大像素尺寸只是插值，不保证恢复真实细节。

### 9.2 插值方式

| 方法 | 常见用途 |
|---|---|
| 最近邻 `INTER_NEAREST` | 掩码、类别标签等离散数据 |
| 双线性 `INTER_LINEAR` | 普通图像缩放的常用选择 |
| 区域 `INTER_AREA` | 常用于普通图像缩小 |
| 双三次 `INTER_CUBIC` | 放大时可尝试，计算量较高 |

类别掩码若使用普通平滑插值，可能生成原本不存在的类别值。缩小细密纹理时还需要关注抗混叠。

### 9.3 翻转和旋转

```python
flipped = cv.flip(image, 1)  # 水平翻转
rotated = cv.rotate(image, cv.ROTATE_90_CLOCKWISE)
```

任意角度可用仿射变换：

```python
height, width = image.shape[:2]
matrix = cv.getRotationMatrix2D((width / 2, height / 2), 15, 1.0)
rotated = cv.warpAffine(image, matrix, (width, height))
```

固定输出画布时，旋转可能裁掉边角。仿射变换可表达平移、旋转、缩放等；透视变换适合进一步学习纸张或平面目标的视角校正。

## 十、直方图与对比度

### 10.1 什么是灰度直方图？

灰度直方图统计每个灰度值出现的次数。对于 8 位灰度图，常设置 256 个分箱。

```python
hist = cv.calcHist([gray], [0], None, [256], [0, 256])
print("像素总数：", int(hist.sum()))
```

横轴是灰度，纵轴是次数。直方图不保存像素位置，不同图像可以具有相同直方图。

### 10.2 直方图均衡化

```python
equalized = cv.equalizeHist(gray)
```

它通过灰度映射改变分布，有时能增强对比度，也可能放大噪声或改变原有视觉关系。并非所有图像都应追求“分布铺满”。

### 10.3 CLAHE

```python
clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
local_enhanced = clahe.apply(gray)
```

CLAHE 是限制对比度的自适应直方图均衡化。`tileGridSize` 表示网格划分数量，参数要结合图像和任务选择。

不要直接对 BGR 三个通道分别均衡化后就假定颜色不变；需要彩色增强时可进一步学习亮度相关通道处理。

## 十一、滤波、卷积与去噪

### 11.1 噪声

常见噪声模型包括加性高斯噪声、椒盐噪声和与成像过程相关的其他噪声。真实噪声不一定完全符合某种简化模型。

去噪通常伴随细节损失，滤波核越大并不一定越好。

### 11.2 邻域与滤波核

滤波根据像素周围的邻域计算输出。例如 3 × 3 均值核：

```text
1/9 × [1 1 1
       1 1 1
       1 1 1]
```

它把邻域平均值作为输出，能够平滑变化，也可能模糊边缘。图像边界没有完整邻域时，需要选择边界处理规则。

### 11.3 常见滤波方法

```python
mean_blur = cv.blur(image, (3, 3))
gaussian = cv.GaussianBlur(image, (5, 5), 0)
median = cv.medianBlur(image, 3)
```

| 方法 | 直观特点 |
|---|---|
| 均值滤波 | 邻域取平均，简单但可能明显模糊 |
| 高斯滤波 | 按距离加权，常用于平滑和预处理 |
| 中值滤波 | 邻域取中值，常用于椒盐类噪声 |
| 双边滤波 | 同时考虑距离与数值差异，尝试平滑并保留边缘，计算量较高 |

高斯和中值示例的核尺寸使用正奇数。不同方法可接受的数据类型和参数有具体限制。

### 11.4 自定义滤波

```python
kernel = np.ones((3, 3), dtype=np.float32) / 9
filtered = cv.filter2D(image, -1, kernel)
```

`-1` 表示输出深度与输入相同。严格来说，OpenCV 的 `filter2D` 直接计算的是相关操作；数学卷积会翻转核。对上面的对称均值核，两者结果相同。

## 十二、阈值分割与二值图像

### 12.1 固定阈值

设阈值为 T，超过 T 的像素设为 255，其余为 0：

```python
used_threshold, binary = cv.threshold(gray, 127, 255, cv.THRESH_BINARY)
```

OpenCV 的普通 `THRESH_BINARY` 对 `gray > T` 输出最大值；等于阈值时属于 0。

输出的二值图通常用 `uint8` 保存为 0、255，并不意味着磁盘上或内存中每像素一定只占 1 bit。

### 12.2 Otsu 自动阈值

```python
blurred = cv.GaussianBlur(gray, (5, 5), 0)
used_threshold, binary = cv.threshold(
    blurred, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU
)
```

Otsu 根据直方图选择阈值，以降低类内方差。双峰等场景可能适用，但不保证在复杂背景或光照不均时得到正确目标。

### 12.3 自适应阈值

```python
adaptive = cv.adaptiveThreshold(
    gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY, 11, 2
)
```

它根据局部邻域计算阈值，常用于光照不均的文本等场景。`11` 为大于 1 的奇数邻域尺寸，`2` 为从局部加权均值中减去的常数。

目标是暗色时，可能需要 `THRESH_BINARY_INV`，使目标成为白色前景，再进行后续形态学与轮廓处理。

## 十三、掩码与颜色分割

### 13.1 什么是掩码？

掩码指定哪些位置属于感兴趣区域。在常见 OpenCV 掩码中，0 表示不选取，非零表示选取。

```python
mask = np.zeros(gray.shape, dtype=np.uint8)
height, width = gray.shape
mask[:height // 2, :width // 2] = 255

selected = cv.bitwise_and(image, image, mask=mask)
```

这里选择左上区域，其余位置为黑色。掩码不是透明度图，也不是灰度越大权重就越高的加权图。

### 13.2 HSV 颜色范围分割

```python
hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV)
lower = np.array([35, 60, 50], dtype=np.uint8)
upper = np.array([85, 255, 255], dtype=np.uint8)
green_mask = cv.inRange(hsv, lower, upper)
green_region = cv.bitwise_and(image, image, mask=green_mask)
```

这是一个绿色范围的演示起点，不能直接作为所有相机、所有光照下的通用参数。`inRange` 在每个通道检查闭区间范围，输出 0 或 255。

## 十四、形态学：腐蚀、膨胀、开运算与闭运算

形态学根据结构元素处理形状，以下以“白色为前景”的二值图为例。

```python
kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))

eroded = cv.erode(binary, kernel, iterations=1)
dilated = cv.dilate(binary, kernel, iterations=1)
opened = cv.morphologyEx(binary, cv.MORPH_OPEN, kernel)
closed = cv.morphologyEx(binary, cv.MORPH_CLOSE, kernel)
```

| 操作 | 顺序 | 常见效果 |
|---|---|---|
| 腐蚀 | 基本操作 | 收缩白色前景，可能去除细小结构 |
| 膨胀 | 基本操作 | 扩张白色前景，可能连接邻近区域 |
| 开运算 | 先腐蚀后膨胀 | 去掉小白点、断开细连接 |
| 闭运算 | 先膨胀后腐蚀 | 填补小暗缺口、连接近邻前景 |

效果依赖核的形状、尺寸和迭代次数。开运算可能删除真实小目标，闭运算可能把两个物体粘在一起，不应把它们当成固定必做步骤。

## 十五、梯度与边缘检测

### 15.1 梯度

梯度描述图像数值变化的方向与强度。边缘常对应较大的变化，但纹理、阴影和噪声也可能产生边缘响应。

```python
gradient_x = cv.Sobel(gray, cv.CV_32F, 1, 0, ksize=3)
gradient_y = cv.Sobel(gray, cv.CV_32F, 0, 1, ksize=3)
magnitude = cv.magnitude(gradient_x, gradient_y)
```

使用浮点输出可以保留负梯度，避免直接写回无符号 8 位时损失符号。梯度图转成显示图像时，需另行说明缩放和截断方式。

### 15.2 Canny 边缘

```python
smoothed = cv.GaussianBlur(gray, (5, 5), 0)
edges = cv.Canny(smoothed, 50, 150)
```

Canny 包含梯度、非极大值抑制和双阈值连接等步骤。这里先显式平滑，避免把 `cv.Canny()` 理解为已替你完成任意所需的去噪。

`50`、`150` 是示例阈值，需要调节。边缘图不等于目标填充区域，不能直接把边缘白像素数量当作目标面积。

## 十六、轮廓、连通区域与目标测量

### 16.1 查找轮廓

在 8 位单通道二值图中查找白色前景边界：

```python
contours, hierarchy = cv.findContours(
    binary, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE
)
```

- `RETR_EXTERNAL` 只取外部轮廓，不单独返回内部孔洞的层级结构。
- `CHAIN_APPROX_SIMPLE` 压缩边界中的冗余点。
- 以上返回形式适用于 OpenCV 4。

### 16.2 面积、周长与外接矩形

```python
result = image.copy()

for contour in contours:
    area = cv.contourArea(contour)
    if area < 100:
        continue
    perimeter = cv.arcLength(contour, True)
    x, y, width, height = cv.boundingRect(contour)
    cv.rectangle(result, (x, y), (x + width - 1, y + height - 1), (0, 0, 255), 2)
    print(area, perimeter, (x, y, width, height))
```

`contourArea` 计算轮廓几何面积，与区域中非零像素的个数不一定相等。连通区域的像素面积可使用 `connectedComponentsWithStats()` 进一步学习。

### 16.3 质心

```python
for contour in contours:
    moments = cv.moments(contour)
    if moments["m00"] != 0:
        center_x = moments["m10"] / moments["m00"]
        center_y = moments["m01"] / moments["m00"]
        print(center_x, center_y)
```

先检查分母，避免零面积轮廓导致除零。坐标和面积默认是像素单位；换成毫米、平方毫米需要标定，透视变化下不能简单对所有位置使用同一比例。

## 十七、频域与傅里叶变换简介

空间域直接处理像素与邻域，频域关注图像中不同空间变化频率的成分。

- 低频通常对应缓慢变化和大范围结构。
- 高频通常对应快速变化，例如细节、边缘，也可能包含噪声。
- 低通滤波可平滑图像，高通处理可突出某些变化，但会同时影响有用信息。

```python
spectrum = np.fft.fftshift(np.fft.fft2(gray.astype(np.float32)))
display_spectrum = np.log1p(np.abs(spectrum))
```

`fft2` 计算二维离散傅里叶变换，`fftshift` 将零频移到中心，`log1p` 便于显示跨度很大的幅值。频谱图不是原图的空间位置图，入门阶段先理解含义即可。

## 十八、怎样判断处理结果是否有效？

### 18.1 先明确目标

“增强可读性”“准确分割目标”“测量真实尺寸”需要不同的评价方式。先定义任务，再决定处理流程。

### 18.2 常见检查方法

| 任务 | 可检查的内容 |
|---|---|
| 图像增强 | 目标细节是否保留，是否引入伪影或过度饱和 |
| 去噪 | 噪声是否减弱，边缘和小结构是否被抹除 |
| 目标计数 | 与人工标注数量比较，检查漏检和重复计数 |
| 分割 | 与参考掩码比较，观察误选与漏选 |
| 测量 | 与标定目标或已知尺寸比较，记录误差 |

### 18.3 IoU 简介

两个二值区域的交并比：

```text
IoU = 交集像素数 / 并集像素数
```

```python
def binary_iou(predicted, reference):
    if predicted.shape != reference.shape:
        raise ValueError("掩码尺寸必须一致")
    predicted = predicted != 0
    reference = reference != 0
    intersection = np.count_nonzero(predicted & reference)
    union = np.count_nonzero(predicted | reference)
    return intersection / union if union else float("nan")
```

双方都为空时分母为 0，上例返回 NaN，实际评测需提前约定规则。不能只挑一张成功图像说明方法普遍有效。

## 十九、记录可复现的图像实验

建议保存原图、处理脚本、参数、版本、关键中间结果和最终结果。

```text
image-practice/
├── input/
├── output/
├── process.py
└── README.md
```

README 至少说明输入来源、处理目标、运行方式、参数选择和已知限制。比较两个方法时尽量使用相同输入、显示范围和评价规则。

尺寸变化后，阈值中的面积、核大小和检测参数可能需要调整。科研或测量用途应记录处理步骤，避免只保留看起来最好的结果。

## 二十、一个综合示例

下面生成黑底白色目标，加入少量孤立白点，完成阈值分割、开运算、连通区域统计和轮廓标注。无需下载图片。

### 20.1 完整代码

保存为 `image_demo.py`：

```python
from pathlib import Path
import json

import cv2 as cv
import numpy as np


def save_image(path, image):
    if not cv.imwrite(str(path), image):
        raise OSError(f"无法保存图像：{path}")


def main():
    output = Path("output")
    output.mkdir(parents=True, exist_ok=True)

    # 生成固定的合成图，便于比较和复现。
    image = np.zeros((240, 320, 3), dtype=np.uint8)
    cv.rectangle(image, (30, 40), (100, 120), (255, 255, 255), -1)
    cv.circle(image, (220, 140), 35, (255, 255, 255), -1)
    for x, y in [(10, 10), (150, 20), (300, 220)]:
        image[y, x] = (255, 255, 255)

    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    threshold, binary = cv.threshold(gray, 127, 255, cv.THRESH_BINARY)
    kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))
    cleaned = cv.morphologyEx(binary, cv.MORPH_OPEN, kernel)

    # 第 0 个标签为背景，其余标签为白色前景连通区域。
    label_count, labels, stats, centroids = cv.connectedComponentsWithStats(
        cleaned, connectivity=8
    )
    regions = []
    for label in range(1, label_count):
        area = int(stats[label, cv.CC_STAT_AREA])
        if area < 100:
            continue
        regions.append({
            "pixel_area": area,
            "bbox": [
                int(stats[label, cv.CC_STAT_LEFT]),
                int(stats[label, cv.CC_STAT_TOP]),
                int(stats[label, cv.CC_STAT_WIDTH]),
                int(stats[label, cv.CC_STAT_HEIGHT]),
            ],
            "centroid": [float(value) for value in centroids[label]],
        })
    regions.sort(key=lambda region: region["bbox"][0])

    contours, _ = cv.findContours(
        cleaned, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE
    )
    marked = image.copy()
    for region in regions:
        x, y, width, height = region["bbox"]
        cv.rectangle(
            marked, (x, y), (x + width - 1, y + height - 1), (0, 0, 255), 2
        )
    cv.drawContours(marked, contours, -1, (0, 255, 0), 1)

    save_image(output / "original.png", image)
    save_image(output / "gray.png", gray)
    save_image(output / "binary.png", binary)
    save_image(output / "cleaned.png", cleaned)
    save_image(output / "marked.png", marked)

    report = {
        "threshold": threshold,
        "object_count": len(regions),
        "regions": regions,
    }
    (output / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("检测到的目标数：", len(regions))


if __name__ == "__main__":
    main()
```

### 20.2 运行与检查

```bash
python image_demo.py
```

预期检测到 2 个目标。查看 `output` 中的中间结果，检查孤立白点是否消失，矩形和圆形是否仍分别存在，以及标注位置是否正确。

需要跟做前面小节时，可复制 `output/original.png` 为工作目录中的 `input.png`。

### 20.3 示例的限制

- 输入是对比鲜明的合成图，不代表真实照片的复杂程度。
- 目标互不接触；接触后可能被当作一个连通区域。
- 面积阈值 100 只用于此练习，不能原样套用到所有分辨率。
- 开运算可能略微改变目标边界，测量面积时应评估影响。
- 程序会覆盖 `output` 中的同名结果，应在独立目录运行。

## 二十一、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| `ModuleNotFoundError: cv2` | OpenCV 未安装到当前解释器 | 检查解释器，用 `python -m pip` 安装 |
| `imread()` 返回 `None` | 路径、文件内容或格式有问题 | 检查工作目录、实际文件与格式支持 |
| 调用时报输入为空 | 没有检查读取结果，或裁剪得到空数组 | 在处理前检查图像和切片范围 |
| 红色与蓝色互换 | RGB、BGR 顺序混淆 | 明确输入与显示工具的通道约定 |
| 裁剪位置或缩放尺寸颠倒 | `(y,x)` 与 `(x,y)` 混用 | 检查 shape、切片和函数尺寸约定 |
| 图像加亮后出现异常暗点 | `uint8` 运算回绕 | 转浮点计算并截断，或使用适当饱和运算 |
| 二值化结果全黑或全白 | 阈值、范围、前景方向不适合 | 检查灰度分布、类型和反向阈值 |
| 目标数量偏多 | 噪点、碎片或目标内部被断开 | 检查掩码，合理滤波并验证面积筛选 |
| 两个物体被算作一个 | 前景接触或闭运算连接 | 检查连通区域，必要时学习分水岭等方法 |
| 掩码缩放后出现其他数值 | 使用了平滑插值 | 离散标签使用最近邻并核对唯一值 |
| 结果无法保存 | 父目录不存在、路径或编码器问题 | 创建目录，检查返回值与异常 |
| 服务器无法打开图像窗口 | 没有图形显示环境 | 保存结果文件，通过支持的查看方式检查 |

## 二十二、练习

建议记录参数、输出与观察，不只保存最终图片。

### 22.1 基础概念

1. 一幅 800 × 600 的三通道、每通道 8 位图像，像素数据共多少字节？为什么不能直接当作 JPEG 文件大小？
2. `image.shape == (480, 640, 3)` 时，宽高分别是多少？`image[10, 20]` 对应哪个坐标？
3. 比较灰度图、二值图与掩码的含义。
4. 说明为什么 RGB 图像直接交给按 BGR 解释的程序时可能颜色异常。
5. 为什么缩放后的掩码通常要使用最近邻插值？

### 22.2 操作练习

- [ ] 运行综合示例，检查 2 个目标和三处噪点的变化。
- [ ] 读取生成图像，输出尺寸、类型、像素数组占用字节数。
- [ ] 裁剪左上区域，分别缩小和放大，并记录新尺寸。
- [ ] 对比均值、高斯和中值滤波，观察边缘与噪点。
- [ ] 比较固定阈值、Otsu 和自适应阈值，解释结果差异。
- [ ] 改变形态学核尺寸，记录目标数量和面积如何变化。
- [ ] 给两个目标增加连接桥，观察连通区域数量变化。
- [ ] 使用 Canny 提取边缘，说明为何不能用边缘像素数替代目标面积。

### 22.3 小项目：颜色目标提取

1. 自行拍摄一张有明确颜色目标的图片，保存原图。
2. 转换到 HSV，观察目标区域的数值范围。
3. 使用 `inRange` 生成掩码，记录上下界。
4. 按需要进行形态学处理，比较处理前后。
5. 标注连通区域或轮廓，保存数量、像素面积与外接矩形。
6. 更换一张光照不同的图片，检查参数能否继续使用。
7. 写一份 README，说明输入、处理流程、参数、结果和失败情况。

### 22.4 部分参考答案

| 题目 | 参考结果 |
|---|---|
| 800 × 600 × 3 的 8 位像素数据 | 1440000 B，约 1.373 MiB，不含额外开销 |
| `(480, 640, 3)` | 高 480、宽 640、3 通道 |
| `image[10, 20]` | 行 10、列 20，即 `(x=20, y=10)` |
| 阈值 T=127、`THRESH_BINARY` | 127 变为 0，128 变为 255 |
| 白色前景做开运算 | 通常可去除小白点，也可能删除真实小结构 |
| 轮廓面积与非零像素数 | 是不同定义，通常不能直接当作相同数值 |

## 二十三、常用知识与函数速查表

| 需求 | 概念或 OpenCV / NumPy 示例 |
|---|---|
| 读取 BGR 图像 | `cv.imread(path, cv.IMREAD_COLOR)` |
| 保留原有通道读取 | `cv.imread(path, cv.IMREAD_UNCHANGED)` |
| 读取图像宽高 | `height, width = image.shape[:2]` |
| 读取坐标 `(x,y)` | `image[y, x]` |
| 裁剪并复制 | `image[y1:y2, x1:x2].copy()` |
| BGR 转灰度 | `cv.cvtColor(image, cv.COLOR_BGR2GRAY)` |
| BGR 转 RGB | `cv.cvtColor(image, cv.COLOR_BGR2RGB)` |
| BGR 转 HSV | `cv.cvtColor(image, cv.COLOR_BGR2HSV)` |
| 缩放 | `cv.resize(image, (width, height))` |
| 高斯平滑 | `cv.GaussianBlur(image, (5, 5), 0)` |
| 中值滤波 | `cv.medianBlur(image, 3)` |
| 固定阈值 | `cv.threshold(gray, 127, 255, cv.THRESH_BINARY)` |
| 颜色范围 | `cv.inRange(hsv, lower, upper)` |
| 应用掩码 | `cv.bitwise_and(image, image, mask=mask)` |
| 开运算 | `cv.morphologyEx(binary, cv.MORPH_OPEN, kernel)` |
| 闭运算 | `cv.morphologyEx(binary, cv.MORPH_CLOSE, kernel)` |
| 边缘检测 | `cv.Canny(smoothed, 50, 150)` |
| 外部轮廓 | `cv.findContours(binary, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)` |
| 轮廓几何面积 | `cv.contourArea(contour)` |
| 前景像素数 | `cv.countNonZero(binary)` |
| 连通区域统计 | `cv.connectedComponentsWithStats(binary, connectivity=8)` |
| 保存图像 | `cv.imwrite(path, image)`，检查返回值 |

示例中的变量需先按正文创建，速查表不能代替输入类型、尺寸和参数检查。

## 二十四、相关学习资料

- [OpenCV-Python 官方教程](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)：按基础操作、颜色空间、滤波、阈值、形态学、边缘与轮廓顺序选读，英文。
- [OpenCV：基础图像操作](https://docs.opencv.org/4.x/d3/df2/tutorial_py_basic_ops.html)：像素、属性与 ROI。
- [OpenCV：颜色空间](https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html)、[阈值分割](https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html)：通道转换和分割方法。
- [OpenCV：平滑滤波](https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html)、[形态学](https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html)：邻域处理和形状操作。
- [OpenCV：Canny](https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html)、[轮廓特征](https://docs.opencv.org/4.x/dd/d49/tutorial_py_contour_features.html)：边缘与目标测量。
- [Pillow 图像概念说明](https://pillow.readthedocs.io/en/stable/handbook/concepts.html)：图像模式、通道及坐标等，英文。
- [NumPy 官方入门](https://numpy.org/doc/stable/user/absolute_beginners.html)：补充数组、索引、类型与批量运算基础，英文。

阅读时选择与已安装版本相符的文档。先用小型、可解释的输入验证，再将方法迁移到真实项目。
