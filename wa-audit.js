window.analyzeWebsite = function() {
const data = {
url: window.location.href,
title: document.title,
timestamp: new Date().toISOString(),
technologies: { whatsapp: { detected: false, indicators: [] }, meta: {}, links: [], scripts: [], forms: [] }
};
const patterns = { links: ['wa.me','whatsapp.com','api.whatsapp.com','chat.whatsapp.com'], meta: ['whatsapp','wa-'] };
document.querySelectorAll('a').forEach(link => {
const href = link.href;
const text = link.innerText.toLowerCase();
if (patterns.links.some(p => href.includes(p)) || text.includes('whatsapp')) {
data.technologies.whatsapp.detected = true;
data.technologies.whatsapp.indicators.push({ type: 'link', value: href, text: link.innerText });
}
data.technologies.links.push({ href: href, text: link.innerText.substring(0,50) });
});
document.querySelectorAll('meta').forEach(meta => {
const name = meta.getAttribute('name') || '';
const property = meta.getAttribute('property') || '';
const content = meta.getAttribute('content') || '';
data.technologies.meta[name || property] = content;
if (patterns.meta.some(p => name.toLowerCase().includes(p) || property.toLowerCase().includes(p))) {
data.technologies.whatsapp.detected = true;
data.technologies.whatsapp.indicators.push({ type: 'meta', name: name || property, content: content });
}
});
document.querySelectorAll('script').forEach(script => {
const src = script.src;
if (src && (src.includes('whatsapp') || src.includes('wa.'))) {
data.technologies.whatsapp.detected = true;
data.technologies.whatsapp.indicators.push({ type: 'script', src: src });
}
if (src) data.technologies.scripts.push(src);
});
document.querySelectorAll('[class*="whatsapp"], [class*="wa-"], [id*="whatsapp"], [id*="wa-"]').forEach(el => {
data.technologies.whatsapp.detected = true;
data.technologies.whatsapp.indicators.push({ type: 'element', tag: el.tagName, class: el.className, id: el.id });
});
document.querySelectorAll('form').forEach(form => {
data.technologies.forms.push({ action: form.action, method: form.method, inputs: form.querySelectorAll('input').length });
});
const report = `<!DOCTYPE html><html><head><title>Analysis: ${data.title}</title><style>body{font-family:Arial;margin:20px;background:#f5f5f5}.container{max-width:1200px;margin:0 auto;background:white;padding:20px;border-radius:8px}.whatsapp{background:#DCF8C6;border-left:4px solid #25D366}.badge{display:inline-block;padding:3px 8px;border-radius:3px;font-size:12px}.detected{background:#25D366;color:white}.not-detected{background:#ccc}.url{word-break:break-all;color:#0066cc}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #ddd}</style></head><body><div class="container"><h1>📊 Website Analysis Report</h1><p><strong>URL:</strong> <a href="${data.url}" target="_blank">${data.url}</a></p><p><strong>Title:</strong> ${data.title || 'No title'}</p><div class="${data.technologies.whatsapp.detected ? 'whatsapp' : ''}"><h2>📱 WhatsApp</h2><p><span class="badge ${data.technologies.whatsapp.detected ? 'detected' : 'not-detected'}">${data.technologies.whatsapp.detected ? '✓ DETECTED' : '✗ Not Detected'}</span></p>${data.technologies.whatsapp.indicators.length ? `<h3>Indicators:</h3><ul>${data.technologies.whatsapp.indicators.map(i => `<li><strong>${i.type}:</strong> ${JSON.stringify(i)}</li>`).join('')}</ul>` : '<p>No WhatsApp found.</p>'}</div><h2>🔗 Links (${data.technologies.links.length})</h2>${data.technologies.links.length ? `<table>${data.technologies.links.slice(0,15).map(l => `<tr><td class="url">${l.href || '#'}</td><td>${l.text}</td></tr>`).join('')}</table>` : '<p>No links.</p>'}<h2>📜 Scripts (${data.technologies.scripts.length})</h2><ul>${data.technologies.scripts.slice(0,10).map(s => `<li class="url">${s}</li>`).join('')}</ul><h2>📋 Forms (${data.technologies.forms.length})</h2><p>Total forms: ${data.technologies.forms.length}</p><h2>💡 Summary</h2><ul><li>WhatsApp: ${data.technologies.whatsapp.detected ? 'Yes' : 'No'}</li></ul></div></body></html>`;
const newTab = window.open();
newTab.document.write(report);
newTab.document.close();
};
