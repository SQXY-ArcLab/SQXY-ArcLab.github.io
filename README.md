# ArcLab · 弧光实验室

基于 Hexo 的组织官网与学习中心。首页、学习路径、教程、项目实践和参与维护页面使用同一套自定义主题。

- 站点地址：https://sqxy-arclab.github.io/
- 仓库目标：`SQXY-ArcLab/SQXY-ArcLab.github.io`
- Node.js：24，见 `.nvmrc`
- 内容源：`source/`；生成结果：`public/`（不提交）

## 本地预览

```bash
npm ci
npm run build
npm run server
```

打开终端给出的本地地址，默认 `http://127.0.0.1:4000`。退出时按 `Ctrl+C`。

```bash
npm test
```

会构建并检查主要页面、内部链接、目录锚点、静态资源和公式渲染输出。界面交互和视觉效果仍需在浏览器检查。

## 目录

```text
source/
  _data/learning.json     学习分组、教程顺序和说明
  learn/                 16 篇教程与学习中心
  about/                 团队公开介绍
  projects/              实践入口与经确认的公开项目
  contribute/            贡献方法
themes/arclab/           自定义 EJS 布局、CSS、JavaScript
scripts/site.js          首页、站点地图与数学渲染
tools/                  内容导入、资源准备和构建检查
.github/workflows/      PR 检查与 Pages 发布
```

## 修改教程

直接修改 `source/learn/<slug>/index.md`，保留顶部 Front-matter。教程用 `layout: lesson`，普通页面用 `layout: page`。

新增教程：

1. 在 `source/_data/learning.json` 的 `lessons` 中增加标题、固定 slug、说明、关键词和分组。
2. 创建 `source/learn/<slug>/index.md`，格式参考现有教程。
3. 检查本地链接，执行 `npm test`。
4. 提交分支和 PR，说明实际验证。

不要随意修改既有 slug，它是网站公开地址的一部分。图片可放 `source/images/`，通过 `/images/文件名` 引用。

## 从原学习资料重新导入（可选）

初次搭建时，16 篇教程从上级筹备目录按明确清单导入。正常维护以当前仓库 `source/learn/` 为准，**不需要每次运行导入**。

如果仍以原目录作为源，需要确认没有网站内独立修改后执行：

```bash
npm run import-lessons -- /原学习资料所在目录
```

它会覆盖对应教程快照并调整站内链接；先检查 diff 再提交。仓库已保存完整教程，CI 构建不依赖外部目录。

## 自动部署

仓库 Settings → Pages → Build and deployment → Source 设为 **GitHub Actions**。

- PR：只构建和检查，不发布。
- 合并或推送到 `main`：通过检查后发布。
- 可在 Actions 页面手动运行工作流。
- 使用 GitHub 自带 `GITHUB_TOKEN` 与 Pages OIDC，不需要在仓库保存个人访问令牌。

只有网站源码进入此仓库。内部企划、私有项目源码和未确认的项目资料未纳入站点。新增公开内容前由团队确认。

## 部署到不同地址

当前配置是组织主站：

```yaml
url: https://sqxy-arclab.github.io
root: /
```

如改用项目子目录站点，需要同步调整 `_config.yml`、内容中的根路径链接以及站点地图，不能只改仓库名就假定全部可用。

## 维护与交接

- `package-lock.json` 与源码一起提交，CI 使用 `npm ci`。
- KaTeX 字体和样式随构建复制到站点本地，不依赖第三方 CDN。
- 暂未安装评论、统计或追踪脚本。
- 没有捏造成员名单、获奖信息、联系方式或项目成果。
- 网站主题与资料目前没有统一的额外开源许可；转载和再分发需按团队约定及第三方授权处理。

详细的从零搭建、首次发布和排错步骤见 [部署与维护指南](部署与维护指南.md)。
