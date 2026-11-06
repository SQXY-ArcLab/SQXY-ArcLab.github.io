---
title: "Python OpenCV"
layout: lesson
description: "图像接口、视频与标注，从小型案例走向视觉实践。"
category_label: "开始编程实践"
lesson_slug: opencv
---
## 一、什么是 OpenCV？

OpenCV 是开源计算机视觉库，提供图像处理、视频读写、特征分析和目标检测等功能。Python 通过 `cv2` 模块调用这些接口，图像通常以 NumPy 数组表示。

### OpenCV 有什么用？

- 读取、保存、裁剪和缩放图片。
- 转换颜色空间，进行滤波、分割和边缘检测。
- 在图像中绘制标记，测量目标轮廓和位置。
- 读取摄像头与视频，逐帧处理并保存结果。
- 构建实验图像分析和简单视觉检测工具。

例如，读取图片并转换为灰度图：

```python
import cv2 as cv

image = cv.imread("input.png")
if image is None:
    raise FileNotFoundError("无法读取 input.png")

gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
if not cv.imwrite("gray.png", gray):
    raise OSError("灰度图保存失败")
```

**说明：** 本教程使用 Python 与 OpenCV 4 的常见接口，需要基本 Python 和 NumPy 数组知识。图像处理原理可结合《图像处理基础学习教程》阅读；这里重点介绍函数、参数、返回值和操作流程。

## 二、安装与检查环境

### 2.1 创建虚拟环境

在新的练习目录中执行：

```bash
python -m venv .venv
```

Linux / macOS 的 Bash 或 Zsh：

```bash
source .venv/bin/activate
```

Windows PowerShell：

```powershell
.venv\Scripts\Activate.ps1
```

若系统使用 `python3` 或 `py`，按实际解释器替换。编辑器也要选择同一虚拟环境。

### 2.2 选择安装包

| 安装包 | 常见用途 |
|---|---|
| `opencv-python` | 常规桌面环境使用 |
| `opencv-contrib-python` | 常规模块加额外 contrib 模块 |
| `opencv-python-headless` | 不使用 OpenCV GUI 的服务器环境 |
| `opencv-contrib-python-headless` | 无 GUI，且需要额外模块 |

**同一环境只选择其中一个。** 它们都提供 `cv2`，不应为增加功能而混装。

普通桌面练习可以安装：

```bash
python -m pip install numpy opencv-python
```

如果只保存图像、不打开窗口，可以在新环境选择 headless 版本。安装包名与导入名不同，不要使用 `pip install cv2`。

### 2.3 检查版本

```python
import sys
import cv2 as cv
import numpy as np

print(sys.executable)
print(cv.__version__)
print(np.__version__)
```

预编译包的功能取决于构建配置，安装成功不等于已启用 CUDA、所有视频编码器或所有 GUI 后端。需要检查时可以查看 `cv.getBuildInformation()`。

## 三、图像数组与代码约定

### 3.1 shape、dtype 和坐标

| 内容 | 常见约定 |
|---|---|
| 彩色图数组 | `(高, 宽, 通道数)` |
| 灰度图数组 | `(高, 宽)` |
| 默认彩色通道 | B、G、R |
| 像素访问 | `image[y, x]` |
| 绘图坐标 | `(x, y)` |
| 缩放目标尺寸 | `(宽, 高)` |
| 常见图像类型 | `uint8`，每通道 0～255 |

例如，`image.shape == (480, 640, 3)` 表示高 480、宽 640，而不是宽 480。

### 3.2 通用读取代码

第四至十三节等图像片段通常假设已经执行以下代码，得到 `image` 和 `gray`：

```python
import cv2 as cv
import numpy as np

image = cv.imread("input.png", cv.IMREAD_COLOR)
if image is None:
    raise FileNotFoundError("无法读取 input.png，请检查路径和文件内容")

gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
```

每个小节独立运行时，先加入导入和读取部分。可以使用自己的图片，也可以先运行第二十一节生成演示素材。

相对路径以当前工作目录为起点，不一定以 `.py` 文件位置为起点。保存前确认输出路径，避免覆盖原图。

## 四、读取、保存与显示图像

### 4.1 imread：读取图像

```python
color = cv.imread("input.png", cv.IMREAD_COLOR)
gray_image = cv.imread("input.png", cv.IMREAD_GRAYSCALE)
unchanged = cv.imread("input.png", cv.IMREAD_UNCHANGED)
```

| 选项 | 用途 |
|---|---|
| `IMREAD_COLOR` | 常规三通道 BGR 读取 |
| `IMREAD_GRAYSCALE` | 单通道灰度读取 |
| `IMREAD_UNCHANGED` | 尽可能保留原通道和位深，如 Alpha |

读取失败通常返回 `None`，先检查再调用处理函数。保留原始读取不等于返回图像一定为四通道或一定为 `uint8`。

### 4.2 imwrite：保存图像

```python
from pathlib import Path

output = Path("output")
output.mkdir(parents=True, exist_ok=True)

success = cv.imwrite(str(output / "result.png"), image)
if not success:
    raise OSError("图像保存失败")
```

编码器通常根据文件扩展名选择。JPEG 质量参数示例：

```python
success = cv.imwrite("preview.jpg", image, [cv.IMWRITE_JPEG_QUALITY, 90])
if not success:
    raise OSError("JPEG 保存失败")
```

质量数值不直接等于百分比相似度，JPEG 为有损压缩。二值掩码和类别标签优先使用无损格式。

### 4.3 imshow、waitKey 与窗口释放

以下需要桌面环境和可用 GUI 后端：

```python
cv.namedWindow("Preview", cv.WINDOW_NORMAL)
try:
    cv.imshow("Preview", image)
    cv.waitKey(0)
finally:
    cv.destroyAllWindows()
```

`waitKey(0)` 等待按键，并让窗口处理事件。正数延时以毫秒为单位，但不是精准计时器。没有 GUI 时使用 `imwrite()` 保存结果，不直接调用窗口函数。

## 五、创建图像、像素访问与 ROI

### 5.1 创建画布

```python
canvas = np.zeros((240, 320, 3), dtype=np.uint8)
white = np.full((240, 320, 3), 255, dtype=np.uint8)
```

分别创建黑色与白色三通道图像。

### 5.2 读取和修改像素

```python
canvas[20, 30] = (0, 0, 255)
print(canvas[20, 30])  # BGR 红色
```

访问前确认索引没有超出尺寸。对大量像素操作时，优先使用数组切片和 OpenCV 函数，避免逐像素 Python 循环。

### 5.3 裁剪并复制

```python
canvas[50:100, 60:140] = (0, 255, 0)
roi = canvas[50:100, 60:140].copy()
print(roi.shape)  # (50, 80, 3)
```

结束索引不包含在内。`.copy()` 创建独立图像，避免后续改动影响原画布。

## 六、颜色转换与通道操作

### 6.1 cvtColor

```python
gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
rgb = cv.cvtColor(image, cv.COLOR_BGR2RGB)
hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV)
```

转换标志要对应输入格式，不应把 BGR 图像当成 RGB 转换。灰度图没有三个颜色通道，不能直接使用 BGR 输入标志。

### 6.2 split 与 merge

```python
blue, green, red = cv.split(image)
restored = cv.merge([blue, green, red])
```

只需访问一个通道时可以用 `image[:, :, 0]`，不必拆出所有通道。

### 6.3 HSV 范围

OpenCV 常规 8 位 `COLOR_BGR2HSV` 中，H 为 0～179，S、V 为 0～255。其他软件、浮点格式或 `HSV_FULL` 的数值约定可能不同。

## 七、绘制直线、矩形、圆和文字

绘图函数通常直接修改传入图像。需要保留原图时先复制。

```python
marked = image.copy()

cv.line(marked, (10, 10), (100, 10), (255, 0, 0), 2)
cv.rectangle(marked, (20, 30), (120, 100), (0, 255, 0), 2)
cv.circle(marked, (160, 80), 25, (0, 0, 255), 2)
cv.putText(
    marked, "Object 1", (20, 25),
    cv.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1, cv.LINE_AA
)
```

| 参数 | 含义 |
|---|---|
| 点坐标 | 通常为整数 `(x, y)` |
| 颜色 | 三通道图像通常用 BGR 元组 |
| thickness | 线宽；矩形、圆等闭合形状可用 `-1` 填充 |
| LINE_AA | 抗锯齿线型，适合展示标注 |
| putText 的位置 | 通常是文字基线左端点，不是文本框左上角 |

`putText()` 的内置 Hershey 字体不直接提供完整中文支持。先用英文数字标记；需要中文可后续结合 Pillow 或其他文字渲染方案。

## 八、缩放、翻转与几何变换

### 8.1 resize：缩放

```python
height, width = image.shape[:2]
small = cv.resize(
    image, (max(1, width // 2), max(1, height // 2)),
    interpolation=cv.INTER_AREA
)
```

| 插值 | 常见使用场景 |
|---|---|
| `INTER_NEAREST` | 二值掩码、类别标签 |
| `INTER_LINEAR` | 普通图像常用缩放 |
| `INTER_AREA` | 普通图像缩小 |
| `INTER_CUBIC` | 放大时可尝试 |

目标尺寸为 `(宽, 高)`，不保持原宽高比会造成形变。

### 8.2 flip 与 rotate

```python
horizontal = cv.flip(image, 1)
vertical = cv.flip(image, 0)
rotated = cv.rotate(image, cv.ROTATE_90_CLOCKWISE)
```

`flipCode=1` 为水平翻转，`0` 为垂直翻转，负数为同时翻转。

### 8.3 仿射变换

```python
height, width = image.shape[:2]
matrix = cv.getRotationMatrix2D((width / 2, height / 2), 15, 1.0)
rotated = cv.warpAffine(image, matrix, (width, height))
```

示例绕中心旋转 15 度，缩放系数为 1。固定画布可能裁掉部分内容，需要时调整变换和平移后的输出范围。

## 九、图像加权与数值运算

### 9.1 add 与 addWeighted

```python
offset = np.full_like(image, 20)
brighter = cv.add(image, offset)

overlay = image.copy()
height, width = image.shape[:2]
cv.rectangle(overlay, (0, 0), (width // 2, height // 2), (0, 255, 0), -1)
blended = cv.addWeighted(image, 0.7, overlay, 0.3, 0)
```

`addWeighted` 按 `α×图像1 + β×图像2 + γ` 计算；输入尺寸、通道和类型需要兼容。8 位 `cv.add()` 使用饱和处理，而 NumPy 的固定宽度数组加法可能回绕。

### 9.2 浮点处理

```python
adjusted = np.clip(image.astype(np.float32) * 1.1 + 10, 0, 255).astype(np.uint8)
normalized = image.astype(np.float32) / 255.0
```

不要把 0～1 的浮点结果直接强制转为 `uint8` 后当作正常 8 位图像保存。恢复显示范围时需要相应乘以 255 并截断。

## 十、平滑滤波与边缘检测

### 10.1 常见滤波接口

```python
mean_blur = cv.blur(image, (3, 3))
gaussian = cv.GaussianBlur(image, (5, 5), 0)
median = cv.medianBlur(image, 3)
```

- `blur()`：均值滤波。
- `GaussianBlur()`：高斯平滑；示例让标准差由核尺寸推导。
- `medianBlur()`：中值滤波，核尺寸为正奇数且大于 1。

核尺寸和输入类型有具体限制。核越大通常平滑越明显，也可能损失目标细节。

### 10.2 Sobel 与 Canny

```python
gradient_x = cv.Sobel(gray, cv.CV_32F, 1, 0, ksize=3)
gradient_y = cv.Sobel(gray, cv.CV_32F, 0, 1, ksize=3)
magnitude = cv.magnitude(gradient_x, gradient_y)

smoothed = cv.GaussianBlur(gray, (5, 5), 0)
edges = cv.Canny(smoothed, 50, 150)
```

Sobel 选择浮点输出可以保留负梯度。Canny 前显式平滑，阈值按输入调整；边缘图与填充目标区域含义不同。

## 十一、阈值、掩码与颜色范围

### 11.1 threshold 的两个返回值

```python
threshold_value, binary = cv.threshold(gray, 127, 255, cv.THRESH_BINARY)
```

第一个返回值为实际使用的阈值，第二个为结果图。`THRESH_BINARY` 对超过阈值的像素赋 255，其余赋 0。

Otsu 自动阈值：

```python
threshold_value, binary = cv.threshold(
    gray, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU
)
```

对本教程常见 8 位单通道输入可直接使用上述形式。自动阈值并不保证在任意光照与背景下正确分割。

### 11.2 inRange 与 bitwise_and

```python
hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV)
lower = np.array([35, 60, 50], dtype=np.uint8)
upper = np.array([85, 255, 255], dtype=np.uint8)

mask = cv.inRange(hsv, lower, upper)
selected = cv.bitwise_and(image, image, mask=mask)
```

上例演示绿色范围，实际参数需要采样验证。`inRange` 检查各通道闭区间，输出单通道 0/255 掩码。

`bitwise_and` 的掩码通常要求与输入宽高相同、8 位单通道；非零表示参与输出，不表示按灰度做透明度混合。

## 十二、形态学操作

```python
kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))

eroded = cv.erode(binary, kernel)
dilated = cv.dilate(binary, kernel)
opened = cv.morphologyEx(binary, cv.MORPH_OPEN, kernel)
closed = cv.morphologyEx(binary, cv.MORPH_CLOSE, kernel)
```

| 接口 | 白色前景下的常见效果 |
|---|---|
| `erode()` | 收缩前景 |
| `dilate()` | 扩张前景 |
| `MORPH_OPEN` | 先腐蚀后膨胀，可能去除小白点 |
| `MORPH_CLOSE` | 先膨胀后腐蚀，可能填小缺口 |

结构元素还可以选择 `MORPH_ELLIPSE`、`MORPH_CROSS`。参数应根据目标尺度确定，过度处理可能删除小目标或连接多个目标。

## 十三、轮廓与连通区域

### 13.1 findContours

```python
contours, hierarchy = cv.findContours(
    binary, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE
)
```

示例输入为 8 位单通道二值图；`RETR_EXTERNAL` 只返回外部轮廓。OpenCV 4 通常返回轮廓与层级两个对象，不要直接套用早期版本的三返回值写法。

### 13.2 测量与标注

```python
marked = image.copy()
for contour in contours:
    area = cv.contourArea(contour)
    if area < 100:
        continue
    x, y, width, height = cv.boundingRect(contour)
    perimeter = cv.arcLength(contour, True)
    cv.rectangle(marked, (x, y), (x + width - 1, y + height - 1), (0, 0, 255), 2)
    print(area, perimeter)
```

`boundingRect` 返回 `(x, y, 宽, 高)`，不是两个角的坐标。轮廓面积与像素数量不是同一定义。

### 13.3 connectedComponentsWithStats

```python
label_count, labels, stats, centroids = cv.connectedComponentsWithStats(
    binary, connectivity=8
)

for label in range(1, label_count):
    x = stats[label, cv.CC_STAT_LEFT]
    y = stats[label, cv.CC_STAT_TOP]
    width = stats[label, cv.CC_STAT_WIDTH]
    height = stats[label, cv.CC_STAT_HEIGHT]
    pixel_area = stats[label, cv.CC_STAT_AREA]
    print(label, (x, y, width, height), pixel_area, centroids[label])
```

第 0 个标签为背景，目标通常从标签 1 开始。8 连通允许斜对角相邻像素相连，4 连通只考虑上下左右，可能得到不同数量。

## 十四、模板匹配

### 14.1 matchTemplate

需要另行准备 `template.png`，它应比待搜索图像小，具有明显且非恒定的纹理：

```python
template = cv.imread("template.png", cv.IMREAD_GRAYSCALE)
if template is None:
    raise FileNotFoundError("无法读取 template.png")

height, width = template.shape
if height > gray.shape[0] or width > gray.shape[1]:
    raise ValueError("模板不能大于搜索图像")
if np.std(template) == 0:
    raise ValueError("请选择有纹理的模板")

response = cv.matchTemplate(gray, template, cv.TM_CCOEFF_NORMED)
min_value, max_value, min_location, max_location = cv.minMaxLoc(response)

x, y = max_location
matched = image.copy()
cv.rectangle(matched, (x, y), (x + width - 1, y + height - 1), (0, 0, 255), 2)
print("最高响应：", max_value)
```

输入为宽 W、高 H，模板为宽 w、高 h 时，响应图形状为 `(H-h+1, W-w+1)`。

### 14.2 不同方法的判定方向

- `TM_CCOEFF_NORMED` 等相关性方法通常取最大响应。
- `TM_SQDIFF`、`TM_SQDIFF_NORMED` 取最小响应。
- 响应值不是通用概率，必须在样例上验证阈值。

单个最高响应不等于一定找到真实目标。常规模板匹配对尺度、旋转和外观变化敏感，多目标匹配还需要阈值与重复框处理。

## 十五、窗口交互：鼠标与滑动条

本节需要桌面环境，可以作为选学内容。

### 15.1 鼠标回调

下面是一段独立可运行的示例：

```python
import cv2 as cv
import numpy as np

canvas = np.zeros((240, 320, 3), dtype=np.uint8)


def on_mouse(event, x, y, flags, userdata):
    if event == cv.EVENT_LBUTTONDOWN:
        print("点击坐标：", x, y)
        cv.circle(canvas, (x, y), 4, (0, 255, 0), -1)


cv.namedWindow("Mouse")
cv.setMouseCallback("Mouse", on_mouse)
try:
    while True:
        cv.imshow("Mouse", canvas)
        if cv.waitKey(20) & 0xFF == ord("q"):
            break
finally:
    cv.destroyAllWindows()
```

点击窗口可以打印坐标并标点，按 `q` 退出。

### 15.2 滑动条调阈值

在已经读取 `gray` 的桌面脚本中运行：

```python
def on_change(value):
    pass


cv.namedWindow("Threshold")
cv.createTrackbar("T", "Threshold", 127, 255, on_change)
try:
    while True:
        threshold = cv.getTrackbarPos("T", "Threshold")
        _, preview = cv.threshold(gray, threshold, 255, cv.THRESH_BINARY)
        cv.imshow("Threshold", preview)
        if cv.waitKey(20) & 0xFF == ord("q"):
            break
finally:
    cv.destroyAllWindows()
```

调好后应记录具体参数，而不是只保留交互窗口截图。

## 十六、读取视频与摄像头

### 16.1 VideoCapture 与 read

使用本地视频文件的独立示例：

```python
import cv2 as cv

capture = cv.VideoCapture("input.mp4")
try:
    if not capture.isOpened():
        raise OSError("无法打开视频")

    frame_count = 0
    while True:
        success, frame = capture.read()
        if not success:
            break
        gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        frame_count += 1

    print("成功读取帧数：", frame_count)
finally:
    capture.release()
```

`read()` 返回成功标志与图像。文件读到末尾或解码失败时都可能返回失败，是否正常结束需要结合输入和日志判断。

### 16.2 读取摄像头

把输入改为 `cv.VideoCapture(0)`，通常表示尝试打开编号为 0 的摄像头；实际编号、权限和可用后端取决于电脑环境。

实时预览可在成功读帧后使用 `imshow()`、`waitKey()`，退出时释放设备并关闭窗口。练习前确认摄像头可用、未被其他程序占用。

### 16.3 属性查询与设置

```python
capture = cv.VideoCapture("input.mp4")
try:
    if not capture.isOpened():
        raise OSError("无法打开视频")
    print("宽：", capture.get(cv.CAP_PROP_FRAME_WIDTH))
    print("高：", capture.get(cv.CAP_PROP_FRAME_HEIGHT))
    print("帧率：", capture.get(cv.CAP_PROP_FPS))
finally:
    capture.release()
```

摄像头可以尝试通过 `set()` 请求宽高和帧率，但返回成功也不应代替实际读帧验证。属性是否支持、数值是否准确取决于驱动、文件和后端。

## 十七、视频保存与抽帧

### 17.1 VideoWriter

下面把视频帧标注后写入新文件，输出路径不要与输入相同：

```python
import math
import cv2 as cv

capture = cv.VideoCapture("input.mp4")
writer = None
try:
    if not capture.isOpened():
        raise OSError("无法打开输入视频")
    success, frame = capture.read()
    if not success:
        raise OSError("无法读取首帧")

    height, width = frame.shape[:2]
    fps = capture.get(cv.CAP_PROP_FPS)
    if not math.isfinite(fps) or fps <= 0:
        raise ValueError("无法确定帧率，请先明确所需输出帧率")

    fourcc = cv.VideoWriter_fourcc(*"mp4v")
    writer = cv.VideoWriter("annotated.mp4", fourcc, fps, (width, height))
    if not writer.isOpened():
        raise OSError("无法创建输出视频，检查路径、编码器与后端")

    index = 0
    while success:
        marked = frame.copy()
        cv.putText(marked, f"Frame {index}", (10, 30),
                   cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        writer.write(marked)
        index += 1
        success, frame = capture.read()
finally:
    capture.release()
    if writer is not None:
        writer.release()
```

编码器、容器和操作系统的支持情况不同，`mp4v` 只是示例。写入帧必须符合声明的宽高、类型和通道约定，完成后应重新打开输出核对。

该流程不保留输入音轨，也不自动保留可变帧率时间戳。声明的 FPS 决定播放速度，不等于处理程序实际每秒处理多少帧。

### 17.2 按帧号间隔抽帧

```python
from pathlib import Path
import cv2 as cv

output = Path("frames")
output.mkdir(parents=True, exist_ok=True)
capture = cv.VideoCapture("input.mp4")
try:
    if not capture.isOpened():
        raise OSError("无法打开视频")
    index = 0
    while True:
        success, frame = capture.read()
        if not success:
            break
        if index % 30 == 0:
            path = output / f"frame_{index:06d}.png"
            if not cv.imwrite(str(path), frame):
                raise OSError(f"无法保存 {path}")
        index += 1
finally:
    capture.release()
```

每 30 帧抽一张，不等于任意视频中都每秒抽一张。按真实时间抽样需要另行考虑帧率和时间戳。

## 十八、批量处理图像

### 18.1 遍历目录

下面把 `input-images` 中可读取的普通图片转换为灰度 PNG，输出到另一个目录：

```python
from pathlib import Path
import cv2 as cv

source = Path("input-images")
output = Path("gray-images")
if not source.is_dir():
    raise NotADirectoryError(source)
output.mkdir(parents=True, exist_ok=True)

extensions = {".png", ".jpg", ".jpeg", ".bmp"}
for path in sorted(source.iterdir()):
    if not path.is_file() or path.suffix.lower() not in extensions:
        continue
    image = cv.imread(str(path), cv.IMREAD_COLOR)
    if image is None:
        print("跳过无法读取的文件：", path)
        continue
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    # 保留原扩展名作为名称的一部分，区分 a.jpg 和 a.png。
    target = output / f"{path.name}.gray.png"
    if not cv.imwrite(str(target), gray):
        raise OSError(f"无法保存 {target}")
```

重复运行可能覆盖同名输出。批量任务建议同时记录成功、失败、输入版本和参数，不要静默忽略所有异常。

### 18.2 结果记录

检测结果可保存到 CSV 或 JSON，至少包含输入名称、目标数量、位置、面积和处理参数。NumPy 标量写入 JSON 前可能需要用 `int()`、`float()` 转为 Python 类型。

## 十九、调试输入、类型与参数

发生 OpenCV 断言错误时，先缩小到一张输入，打印：

```python
print(type(image))
print(image.shape)
print(image.dtype)
print(image.min(), image.max())
```

这段检查本身也要求输入不是 `None`、数组非空。按下面顺序排查：

1. 文件或视频是否成功读取？
2. 图像是二维还是三维，通道顺序是否正确？
3. 数据类型和数值范围是否满足接口要求？
4. ROI 是否为空，掩码是否同尺寸？
5. 参数是否适合当前图像尺度？

先保存中间结果，检查问题从哪一步出现。只调整最后一个阈值，可能掩盖上游读取或颜色转换错误。

## 二十、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|---|---|---|
| 安装后仍无法导入 `cv2` | 解释器不一致或包冲突 | 检查解释器与环境，只选择一种 OpenCV 包 |
| `imread` 返回 `None` | 路径、权限、格式或文件内容问题 | 检查工作目录、文件存在和格式支持 |
| 图像红蓝互换 | RGB / BGR 不一致 | 使用对应 `cvtColor` 转换 |
| `cvtColor` 报空输入 | 读取失败或空 ROI | 在调用前检查输入 |
| `imshow` 无法使用 | headless 包或没有 GUI 环境 | 改为保存结果，或配置桌面环境 |
| 窗口无响应 | 没有持续处理窗口事件 | 正确调用 `waitKey`，在桌面主流程运行 |
| 掩码操作断言失败 | 掩码类型、通道、尺寸不符合要求 | 使用同宽高 8 位单通道掩码 |
| 轮廓数量很多 | 噪声、碎片或分割方向错误 | 先检查二值图，再验证去噪和筛选条件 |
| 模板匹配总能画出一个框 | 只取最大值，没有验证是否真实匹配 | 使用样例验证阈值和失败条件 |
| 摄像头打不开 | 权限、编号、占用或后端问题 | 核对设备并先用系统相机检查 |
| 视频写不出或播放异常 | 编码器、尺寸、通道或 FPS 不匹配 | 检查 `isOpened`、帧属性并重新读取输出 |
| 保存成功但颜色很暗 | 浮点范围或类型转换不正确 | 核对 0～1 与 0～255 的约定 |

## 二十一、一个综合示例

下面生成一张含两个绿色目标和一个蓝色干扰物的图像，通过 HSV 分割、形态学和连通区域统计完成检测，保存标注图和 JSON 报告。无需下载素材，也不需要摄像头或桌面窗口。

### 21.1 完整代码

保存为 `opencv_demo.py`：

```python
from pathlib import Path
import json

import cv2 as cv
import numpy as np


def save_image(path, image):
    if not cv.imwrite(str(path), image):
        raise OSError(f"无法保存：{path}")


def main():
    output = Path("opencv-output")
    output.mkdir(parents=True, exist_ok=True)

    image = np.zeros((300, 400, 3), dtype=np.uint8)
    cv.rectangle(image, (30, 40), (120, 130), (0, 255, 0), -1)
    cv.circle(image, (280, 180), 40, (0, 255, 0), -1)
    cv.rectangle(image, (160, 30), (220, 80), (255, 0, 0), -1)
    image[10, 10] = (0, 255, 0)  # 一个孤立绿色噪点

    hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV)
    lower = np.array([35, 60, 50], dtype=np.uint8)
    upper = np.array([85, 255, 255], dtype=np.uint8)
    mask = cv.inRange(hsv, lower, upper)
    kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))
    clean = cv.morphologyEx(mask, cv.MORPH_OPEN, kernel)

    count, labels, stats, centroids = cv.connectedComponentsWithStats(
        clean, connectivity=8
    )
    regions = []
    for label in range(1, count):
        area = int(stats[label, cv.CC_STAT_AREA])
        if area < 100:
            continue
        regions.append({
            "bbox": [
                int(stats[label, cv.CC_STAT_LEFT]),
                int(stats[label, cv.CC_STAT_TOP]),
                int(stats[label, cv.CC_STAT_WIDTH]),
                int(stats[label, cv.CC_STAT_HEIGHT]),
            ],
            "pixel_area": area,
            "centroid": [float(value) for value in centroids[label]],
        })
    regions.sort(key=lambda region: region["bbox"][0])

    marked = image.copy()
    for index, region in enumerate(regions, start=1):
        x, y, width, height = region["bbox"]
        cv.rectangle(marked, (x, y), (x + width - 1, y + height - 1), (0, 0, 255), 2)
        cv.putText(marked, f"ID {index}", (x, max(15, y - 5)),
                   cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv.LINE_AA)

    save_image(output / "input.png", image)
    save_image(output / "mask.png", mask)
    save_image(output / "clean.png", clean)
    save_image(output / "marked.png", marked)

    report = {
        "opencv_version": cv.__version__,
        "hsv_lower": lower.tolist(),
        "hsv_upper": upper.tolist(),
        "object_count": len(regions),
        "regions": regions,
    }
    (output / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("绿色目标数量：", len(regions))


if __name__ == "__main__":
    main()
```

### 21.2 运行与检查

```bash
python opencv_demo.py
```

预期绿色目标数量为 2。检查：蓝色矩形是否未进入掩码，单个绿色噪点是否被去除，矩形和圆形是否都被标注。

需要使用前面小节的读取代码时，可将 `opencv-output/input.png` 复制为当前目录的 `input.png`。程序重复运行会覆盖同名输出。

### 21.3 使用范围

合成图颜色纯、目标分离明显。真实图像还受光照、反光、阴影、压缩与目标接触等影响；颜色区间、核尺寸和面积阈值都需要重新验证。

## 二十二、练习

### 22.1 基础操作

- [ ] 安装并记录 Python、NumPy 与 OpenCV 版本。
- [ ] 读取图片，输出宽、高、类型和通道数量。
- [ ] 保存灰度图、缩小图和一个独立 ROI。
- [ ] 在副本上画矩形、圆和英文编号，确认原图未改变。
- [ ] 分别转换 BGR、RGB、HSV，说明各自用途。
- [ ] 比较 NumPy 加法和 `cv.add()` 在 8 位边界上的行为。

### 22.2 分割与测量

- [ ] 跑通综合示例，核对 2 个绿色目标。
- [ ] 增加一个绿色目标，检查报告是否更新。
- [ ] 将两个绿色目标连接起来，观察连通区域数量变化。
- [ ] 记录 `contourArea` 和连通区域像素面积，比较两者。
- [ ] 改变输入尺寸，检查面积阈值与核大小是否仍合适。
- [ ] 对一张真实图片尝试颜色分割，记录至少一种失败情况。

### 22.3 视频与交互（按环境选做）

- [ ] 使用滑动条调阈值，并把最终参数写入文档。
- [ ] 鼠标点击图像，打印坐标并标记位置。
- [ ] 读取一段本地视频，统计成功读取的帧数。
- [ ] 每隔 30 帧保存图片，说明为什么不一定是每秒一张。
- [ ] 输出一段带帧号的视频，重新打开检查尺寸和播放情况。
- [ ] 有可用摄像头时，尝试读取并正确释放设备。

提交材料建议包含代码、输入来源、关键参数、结果、运行说明和已知问题。摄像头与编码器不可用时，先完成不依赖设备的部分。

## 二十三、常用接口速查表

| 功能 | 示例 |
|---|---|
| 读图 | `cv.imread(path, cv.IMREAD_COLOR)` |
| 写图 | `cv.imwrite(path, image)`，检查返回值 |
| 窗口显示 | `cv.imshow("Preview", image)` |
| 窗口事件与按键 | `cv.waitKey(20)` |
| 关闭窗口 | `cv.destroyAllWindows()` |
| 灰度转换 | `cv.cvtColor(image, cv.COLOR_BGR2GRAY)` |
| HSV 转换 | `cv.cvtColor(image, cv.COLOR_BGR2HSV)` |
| 画框 | `cv.rectangle(image, (x1,y1), (x2,y2), color, 2)` |
| 写文字 | `cv.putText(image, text, origin, font, scale, color)` |
| 缩放 | `cv.resize(image, (width, height))` |
| 旋转 90 度 | `cv.rotate(image, cv.ROTATE_90_CLOCKWISE)` |
| 加权混合 | `cv.addWeighted(a, alpha, b, beta, gamma)` |
| 高斯滤波 | `cv.GaussianBlur(image, (5,5), 0)` |
| 固定阈值 | `cv.threshold(gray, 127, 255, cv.THRESH_BINARY)` |
| 范围掩码 | `cv.inRange(hsv, lower, upper)` |
| 掩码选取 | `cv.bitwise_and(image, image, mask=mask)` |
| 开运算 | `cv.morphologyEx(mask, cv.MORPH_OPEN, kernel)` |
| 边缘 | `cv.Canny(smoothed, 50, 150)` |
| 外部轮廓 | `cv.findContours(binary, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)` |
| 外接矩形 | `cv.boundingRect(contour)` |
| 连通区域统计 | `cv.connectedComponentsWithStats(binary, connectivity=8)` |
| 模板匹配 | `cv.matchTemplate(gray, template, cv.TM_CCOEFF_NORMED)` |
| 响应极值 | `cv.minMaxLoc(response)` |
| 读取视频或摄像头 | `cv.VideoCapture(path_or_index)` |
| 读取一帧 | `success, frame = capture.read()` |
| 创建视频输出 | `cv.VideoWriter(path, fourcc, fps, (width,height))` |
| 释放视频资源 | `capture.release()` / `writer.release()` |

速查表中的变量需要先按正文定义，参数和类型检查不能省略。

## 二十四、相关学习资料

- [OpenCV-Python 官方教程](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)：按 GUI 功能、核心操作和图像处理章节学习，英文。
- [OpenCV Python 安装包说明](https://pypi.org/project/opencv-python/)：包的选择、安装和常见环境问题。
- [图像基础操作](https://docs.opencv.org/4.x/d3/df2/tutorial_py_basic_ops.html)、[绘图函数](https://docs.opencv.org/4.x/dc/da5/tutorial_py_drawing_functions.html)：数组、ROI 与标注。
- [颜色空间转换](https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html)、[阈值分割](https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html)：图像转换与掩码生成。
- [模板匹配](https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html)：匹配方法和响应图。
- [视频读写](https://docs.opencv.org/4.x/dd/d43/tutorial_py_video_display.html)：视频、摄像头与输出。
- [HighGUI 接口参考](https://docs.opencv.org/4.x/d7/dfc/group__highgui.html)：窗口、按键、鼠标与滑动条。

查阅时注意 OpenCV 版本与示例语言。C++ 文档中的函数签名与 Python 返回值形式可能不同，应同时查看对应 Python 接口。
