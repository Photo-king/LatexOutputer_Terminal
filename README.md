# Codex StudyView

一个轻量的本地阅读器：在终端与 Codex 交流，在固定网页阅读 Markdown、表格和排版后的 LaTeX。只更新内容，不反复生成页面或 PDF。

## 启动

需要 Python 3.9 或更新版本，无需安装依赖。

```sh
python3 server.py
```

打开 http://127.0.0.1:5541/ 。按 Ctrl+C 停止。

要让服务与终端会话独立运行，可在项目目录执行：

```sh
nohup python3 server.py > /tmp/studyview.log 2>&1 &
```

重启电脑后需重新启动。端口被占用时可用 `python3 server.py --port 5542`。

## 使用

让 Codex 在这个项目中工作，并说：“把讲解写到 content.md”。根目录 `AGENTS.md` 已说明输出约定。网页每秒检查内容变化，保留当前滚动位置；开启“跟随最新内容”会滚动到底部。

也可手动编辑 `content.md`，或启动时指定其他文件：

```sh
python3 server.py --content /absolute/path/notes.md
```

支持 `\(x\)`、`$x$`、`\[x\]`、`$$x$$`，代码块中的公式保持源码。美元金额如果与公式混用，建议写为 `\$10`。LaTeX 由 KaTeX 排版，支持常用数学命令，不编译完整 `.tex` 文档。

这个服务只展示内容，不运行 Codex、不读取聊天数据库。跨项目使用时，写入权限取决于该会话的可写工作区；本项目中的普通内容更新无需额外审批，但权限规则仍适用于网络访问或其他目录。

## 本地资源

KaTeX 0.16.22、Marked 15.0.12、DOMPurify 3.2.6 与 WOFF2 字体均位于 `web/vendor/`，相应许可证随附。页面无需联网。Markdown 输出经过 DOMPurify 清理；服务仅提供 `web/` 中的静态文件和当前内容 API，绑定本机回环地址。
