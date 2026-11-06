---
title: "计算机网络与 HTTP"
layout: lesson
description: "从地址与端口，到亲手运行一个本地 HTTP 接口。"
category_label: "掌握开发工具"
lesson_slug: network-http
---
## 一、为什么学习网络基础？

安装依赖、克隆仓库、登录服务器和访问接口都需要网络。了解基本概念，可以区分“域名解析失败”“连接不到服务”“接口返回错误”等不同问题。

本教程从地址和连接讲到 HTTP 请求，最后只用 Python 标准库搭建本地练习接口，不需要购买服务器或注册外部服务。

## 二、客户端、服务器与网络

### 2.1 客户端和服务器

| 角色 | 作用 | 示例 |
|---|---|---|
| 客户端 | 发起请求，使用服务 | 浏览器、Python 请求程序 |
| 服务器 | 接收请求并提供结果 | 网页服务、数据接口 |

这是通信中的角色，不是两类固定的电脑。同一台电脑可以同时运行客户端和服务器程序。

### 2.2 局域网与互联网

局域网连接一个有限范围内的设备；互联网连接许多网络。路由器负责网络间转发，实际通信还受路由、防火墙、代理和服务配置等影响。

同一个 Wi-Fi 下不保证任意两个设备都能互访，校园网也可能存在设备隔离策略。

## 三、IP 地址、端口与 localhost

### 3.1 IP 地址

| 类型 | 示例 | 特点 |
|---|---|---|
| IPv4 | `192.168.1.10` | 常用点分十进制表示 |
| IPv6 | `2001:db8::1` | 使用更大的地址空间，示例为文档保留地址 |
| IPv4 回环 | `127.0.0.1` | 当前网络环境中的本机 |
| IPv6 回环 | `::1` | IPv6 的本机回环 |

私有地址不等于能直接从公网访问。公网连接可能经过 NAT 和防火墙，不能只把自己的局域网地址发给同伴就认为服务可达。

### 3.2 端口

端口用于区分通信端点和服务，范围为 0～65535，具体分配和可用性受系统与协议影响。客户端也会使用端口，不能理解为“只有服务器有端口”。

HTTP 常用 80，HTTPS 常用 443，练习服务常选择 8000、8080 等。端口号本身不保证实际运行的就是对应协议。

### 3.3 localhost 与监听地址

`localhost` 通常解析到回环地址。你电脑的 localhost 与队友电脑的 localhost 指向各自环境，不是同一台服务器。

服务绑定 `127.0.0.1` 时只接受本机回环连接；绑定 `0.0.0.0` 通常表示监听所有本机 IPv4 接口，它不是通常应填写给浏览器的远程目标地址。

虚拟机、容器和远程服务器的“本机”有各自的网络上下文。本教程固定使用 `127.0.0.1`，便于本地练习。

## 四、域名、DNS 与 URL

### 4.1 域名与 DNS

域名是便于记忆的名称，DNS 用于查询域名对应的记录，例如 IPv4 的 A 记录、IPv6 的 AAAA 记录。一个域名可以对应多个地址，结果也可能受缓存影响。

DNS 查询成功只说明拿到了相应记录，不说明目标端口和应用一定能访问。

### 4.2 URL 结构

```text
https://example.com:443/api/items?page=2#summary
```

| 部分 | 含义 |
|---|---|
| `https` | 协议方案 |
| `example.com` | 主机名 |
| `443` | 显式端口，使用默认值时通常省略 |
| `/api/items` | 路径 |
| `page=2` | 查询参数 |
| `summary` | 片段，通常由客户端处理，不作为 HTTP 请求目标发送 |

URL 是地址描述，不是服务器上的文件路径保证。接口路径可以由程序处理，不一定对应硬盘文件。

### 4.3 参数编码

空格、中文和特殊字符不能总是原样拼接。Python 可用 `urlencode` 构造查询参数：

```python
from urllib.parse import urlencode

query = urlencode({"name": "弧光", "page": 1})
print("https://example.com/search?" + query)
```

这只构造文本，不会发起访问。URL 中不宜放密码和令牌，地址可能进入日志、历史记录或截图。

## 五、TCP、UDP 与 HTTPS

### 5.1 常见传输方式

| 协议 | 入门理解 | 注意 |
|---|---|---|
| TCP | 提供可靠、有序的字节流 | 不保留应用消息边界，连接成功也不等于业务成功 |
| UDP | 以数据报发送 | 本身不保证可靠交付或顺序，应用可在其上设计额外机制 |

HTTP/1.1、HTTP/2 常运行在 TCP 之上；HTTP/3 使用基于 UDP 的 QUIC。不要把“UDP”简单等同于“所有上层应用都不可靠”。

### 5.2 HTTP 与 HTTPS

HTTPS 将 HTTP 通过安全传输机制保护，提供传输中的机密性、完整性和服务器身份验证等能力。

证书验证失败应检查域名、系统时间、证书链和网络环境，不把关闭证书校验当成常规解决办法。HTTPS 也不保证网站内容本身一定可信。

## 六、HTTP 请求与响应

### 6.1 请求示意

下面用便于阅读的 HTTP/1.1 文本展示，HTTP/2、HTTP/3 的线上格式不同：

```http
GET /api/mean?value=20&value=22 HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

```

请求通常包含方法、目标、头部和可选请求体。头部与正文之间有空行。

### 6.2 响应示意

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"count": 2, "mean": 21.0}
```

响应包含状态码、头部和可选正文。不要把正文中的 `"code": 200` 当成真正的 HTTP 状态码，两者属于不同层次。

### 6.3 常见头部

| 头部 | 用途 |
|---|---|
| `Content-Type` | 正文的媒体类型，例如 JSON |
| `Accept` | 客户端可接受的响应类型 |
| `Authorization` | 传递某些认证信息，具体格式取决于协议 |
| `Content-Length` | 在适用场景表示正文的字节长度 |
| `Location` | 重定向或新资源位置等 |

字符串长度与编码后字节数不一定相同；JSON 中的中文尤其需要注意。

## 七、HTTP 方法与状态码

### 7.1 常见方法

| 方法 | 常见语义 |
|---|---|
| GET | 获取资源，不应设计为修改业务状态 |
| HEAD | 获取与 GET 类似的元信息，不返回对应正文 |
| POST | 提交处理请求，具体行为由接口定义 |
| PUT | 按目标 URI 创建或替换资源表示 |
| PATCH | 对资源进行部分修改 |
| DELETE | 请求删除对应资源 |

最终需读具体接口约定。POST 不因“参数放正文”就自动安全，仍需 HTTPS、鉴权和输入检查。

### 7.2 状态码

| 状态码 | 常见含义 |
|---|---|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 204 | 成功且没有响应正文 |
| 301 / 302 | 常见重定向 |
| 400 | 请求不符合要求 |
| 401 | 缺少或无效认证信息 |
| 403 | 拒绝访问，具体原因依系统而定 |
| 404 | 未找到对应资源，或服务不愿暴露其存在 |
| 405 | 资源不支持该方法 |
| 429 | 请求过多 |
| 500 | 服务端内部错误 |
| 502 / 504 | 网关相关错误或超时 |

4xx、5xx 指引排查方向，但不能仅凭分类把责任归给某个人。服务器也可能错误使用状态码。

## 八、JSON、接口约定与错误处理

调用接口前明确：地址、方法、参数、认证、成功响应、失败响应和限额。

```json
{"sensor": "A", "value": 21.5, "active": true}
```

JSON 是数据格式，不是 Python 字典文本。它使用 `true`、`false`、`null`，键名与字符串用双引号。

客户端应先检查状态、类型和正文是否符合约定，再取字段。返回 HTML 错误页时直接按 JSON 解析，通常只会掩盖真正的服务问题。

### 超时与重试

网络操作需要合理超时。失败不一定意味着服务器未执行请求，重复提交可能重复创建资源；重试前考虑接口幂等性和服务端约定。

浏览器可能受同源策略和 CORS 限制，Python 客户端通常不执行同一套浏览器限制。CORS 不是服务端身份认证，也不应为消除报错而随意开放所有来源。

## 九、浏览器与 curl 检查

### 9.1 开发者工具

打开浏览器开发者工具的 Network 面板，重新访问页面或触发操作，检查请求 URL、方法、状态、头部、耗时和响应。

不要直接公开整份包含 Cookie 或 Authorization 的网络记录。

### 9.2 curl

本地服务启动后，可以执行：

```bash
curl -i "http://127.0.0.1:8000/health"
curl -i "http://127.0.0.1:8000/api/mean?value=20&value=22"
```

`-i` 显示响应头。Windows PowerShell 中如 `curl` 被解析为其他命令，可以使用已安装的 `curl.exe`。

查询 URL 加引号，避免 `&` 被 Shell 当成控制符。命令能否运行取决于 curl 是否可用。

## 十、一个综合示例：本地平均值接口

### 10.1 创建服务端

保存为 `server.py`，只需要 Python 标准库：

```python
import json
import math
from http.server import BaseHTTPRequestHandler, HTTPServer
from statistics import mean
from urllib.parse import parse_qs, urlsplit


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False, allow_nan=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = urlsplit(self.path)
        if url.path == "/health":
            self.send_json(200, {"status": "ok"})
            return
        if url.path != "/api/mean":
            self.send_json(404, {"error": "not found"})
            return

        query = parse_qs(url.query, keep_blank_values=True)
        raw_values = query.get("value", [])
        try:
            if not 1 <= len(raw_values) <= 100:
                raise ValueError("需要 1 到 100 个 value 参数")
            values = [float(value) for value in raw_values]
            if not all(math.isfinite(value) for value in values):
                raise ValueError("value 必须是有限数值")
            average = mean(values)
            if not math.isfinite(average):
                raise ValueError("结果超出支持范围")
        except (ValueError, OverflowError):
            self.send_json(400, {"error": "请提供 1 到 100 个有效有限数值"})
            return

        self.send_json(200, {"count": len(values), "mean": average})


if __name__ == "__main__":
    with HTTPServer(("127.0.0.1", 8000), Handler) as server:
        print("练习服务：http://127.0.0.1:8000")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
```

这是本机教学服务，只演示 GET，不用于正式部署。Python 的 `http.server` 不是生产服务框架，默认不支持的方法也不会自动成为完整 API。

### 10.2 启动和访问

在第一个终端执行：

```bash
python server.py
```

在浏览器或第二个终端请求 `/health`、`/api/mean?value=20&value=22`，预期均为 200，平均值为 `21.0`。

再访问无参数、`value=abc`、`value=NaN` 和不存在路径，观察 400、404。端口被占用时先确认占用程序，或修改服务和客户端使用的端口，不要直接结束不认识的进程。

### 10.3 Python 客户端

保持服务运行，保存为 `client.py`：

```python
import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen


def main():
    query = urlencode([("value", 20), ("value", 22)])
    url = "http://127.0.0.1:8000/api/mean?" + query
    try:
        with urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
            print("HTTP 状态：", response.status)
            print("平均值：", data["mean"])
    except HTTPError as exc:
        print("HTTP 错误：", exc.code)
        print(exc.read().decode("utf-8", errors="replace"))
    except (URLError, TimeoutError) as exc:
        print("连接或超时问题：", exc)


if __name__ == "__main__":
    main()
```

`HTTPError` 是 `URLError` 的子类，先捕获更具体的类型。此客户端只针对本例响应约定，不是处理所有 HTTP 服务的通用实现。

### 10.4 结束与复现

服务终端按 `Ctrl+C` 停止。重启后重新运行客户端，结果应一致。将服务启动命令、端口、请求样例和预期响应写入 README。

## 十一、分层排查网络问题

| 现象 | 优先检查 |
|---|---|
| DNS 解析失败 | 域名拼写、DNS、网络和代理 |
| Connection refused | 地址、端口、监听位置与服务是否启动 |
| Connection timed out | 网络路径、防火墙、目标状态和超时设置 |
| TLS / 证书错误 | 域名、系统时间、信任链和代理配置 |
| HTTP 404 | 已经获得 HTTP 响应，再检查路径和路由 |
| HTTP 400 | 参数、类型、必填项和请求正文 |
| HTTP 401 / 403 | 认证方式、权限与服务规则 |
| HTTP 500 | 服务日志、输入与具体异常 |
| JSON 解析失败 | 实际正文、Content-Type、错误页和编码 |
| 只有浏览器请求失败 | 检查 CORS、浏览器限制及请求差异 |

`ping` 使用的机制与 HTTP 不同。ping 成功不证明网页服务正常，ping 失败也不一定表示 HTTP 不通。

## 十二、练习

- [ ] 解释客户端、服务器、IP、端口、域名和 DNS。
- [ ] 拆解一个 URL 的协议、主机、端口、路径和查询参数。
- [ ] 说明 localhost 为什么不能直接代表队友的电脑。
- [ ] 跑通本地服务、curl 和 Python 客户端。
- [ ] 分别制造 200、400、404，记录请求和实际响应。
- [ ] 停止服务后请求，区分连接失败与 HTTP 404。
- [ ] 用开发者工具检查一次请求，去除敏感信息后写记录。
- [ ] 为接口整理一张输入、成功响应和失败响应表。

验收：能判断问题发生在寻址、连接、HTTP 还是业务数据层，不只说“网络不行”。

## 十三、知识速查表

| 概念 | 核心含义 |
|---|---|
| IP | 网络层地址 |
| 端口 | 区分通信端点与服务 |
| DNS | 查询域名记录 |
| URL | 描述资源地址和参数等 |
| TCP | 可靠有序字节流 |
| HTTP | 请求响应语义与消息规则 |
| HTTPS | 受安全传输保护的 HTTP |
| Content-Type | 正文媒体类型 |
| 200 / 400 / 404 / 500 | 成功 / 请求不合要求 / 未找到 / 服务错误 |
| 超时 | 等待有限，不保证对方未处理请求 |

## 十四、相关学习资料

- [MDN：互联网如何工作](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)：网络基础。
- [MDN：HTTP 概述](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Overview)：请求响应与组件。
- [MDN：HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Status)：按具体状态查阅。
- [Python http.server](https://docs.python.org/zh-cn/3/library/http.server.html)：本地教学服务与限制。
- [Python urllib.request](https://docs.python.org/zh-cn/3/library/urllib.request.html)：标准库客户端。
