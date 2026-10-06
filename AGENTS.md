# StudyView

This project is a local reading companion for terminal Codex. When the user asks for an explanation or study content to appear on the webpage, write the full explanation to `content.md` at this project root. Replace the previous content unless the user requests appending. Keep the terminal response brief and link http://127.0.0.1:5541/.

Use Markdown with LaTeX: `\(...\)` / `$...$` for inline math and `\[...\]` / `$$...$$` for display math. Put display equations in separate paragraphs. Do not recreate HTML/CSS or export PDFs for routine explanations. Chinese prose, readable formula descriptions, headings, lists, and Markdown tables are supported.

Start with `python3 server.py`. The server binds to 127.0.0.1 only. Static assets are vendored; no API keys, Node installation, or network calls are needed for normal use. Do not automatically read or publish other Codex sessions.
