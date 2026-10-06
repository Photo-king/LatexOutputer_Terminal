const content = document.querySelector('#content');
const status = document.querySelector('#status');
let version, source = '';

// Tokenize math before Markdown parses backslashes and underscores. Code is untouched.
marked.use({extensions: [{
  name: 'math', level: 'inline',
  start(src) { const i = src.search(/\\\(|\\\[|\$/); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const pairs = [['\\[', '\\]', true], ['\\(', '\\)', false], ['$$', '$$', true], ['$', '$', false]];
    for (const [open, close, display] of pairs) {
      if (!src.startsWith(open)) continue;
      let end = open.length;
      while ((end = src.indexOf(close, end)) !== -1) {
        if (src[end - 1] !== '\\') break;
        end += close.length;
      }
      if (end < 0 || end === open.length) continue;
      const text = src.slice(open.length, end);
      if (open === '$' && (text.includes('\n') || /^\s|\s$/.test(text))) continue;
      return {type: 'math', raw: src.slice(0, end + close.length), text, display};
    }
  },
  renderer(token) {
    return katex.renderToString(token.text, {displayMode: token.display, throwOnError: false, trust: false, strict: 'ignore', output: 'htmlAndMathml'});
  }
}]});

async function refresh() {
  try {
    const response = await fetch('/api/content', {cache: 'no-store'});
    if (!response.ok) throw new Error('读取失败');
    const data = await response.json();
    if (data.version !== version) {
      const y = window.scrollY;
      const html = DOMPurify.sanitize(marked.parse(data.text), {ADD_TAGS: ['annotation'], ADD_ATTR: ['encoding']});
      content.innerHTML = html;
      source = data.text; version = data.version;
      requestAnimationFrame(() => window.scrollTo(0, document.querySelector('#follow').checked ? document.body.scrollHeight : y));
      status.textContent = `已更新 · ${new Date().toLocaleTimeString('zh-CN')}`;
    } else if (status.dataset.offline) status.textContent = '已连接 · 内容已同步';
    delete status.dataset.offline;
  } catch (error) {
    status.textContent = '连接中断，正在重试 · 已显示的内容仍可阅读';
    status.dataset.offline = 'true';
  } finally { setTimeout(refresh, 1000); }
}
document.documentElement.dataset.theme = localStorage.getItem('studyview-theme') || '';
document.querySelector('#theme').onclick = () => {
  const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  localStorage.setItem('studyview-theme', document.documentElement.dataset.theme);
};
document.querySelector('#copy').onclick = async (event) => {
  try { await navigator.clipboard.writeText(source); event.target.textContent = '已复制'; }
  catch { event.target.textContent = '复制失败，请检查浏览器权限'; }
  setTimeout(() => event.target.textContent = '复制原文', 2000);
};
refresh();
