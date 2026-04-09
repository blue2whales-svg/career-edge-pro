// Simple HTML sanitizer that strips dangerous tags/attributes
// Allows only safe formatting tags used in document rendering

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'pre', 'code', 'blockquote',
  'a', 'sup', 'sub',
]);

const ALLOWED_ATTRS = new Set(['class', 'style', 'href', 'target']);

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  function clean(node: Node): void {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        
        if (!ALLOWED_TAGS.has(tag)) {
          // Replace with text content for script/style, or unwrap for others
          if (tag === 'script' || tag === 'style' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
            el.remove();
            continue;
          }
          // Unwrap: keep children, remove the tag
          while (el.firstChild) {
            el.parentNode?.insertBefore(el.firstChild, el);
          }
          el.remove();
          continue;
        }
        
        // Remove disallowed attributes
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          }
          // Strip javascript: URLs
          if (attr.name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
            el.removeAttribute('href');
          }
          // Strip dangerous CSS
          if (attr.name === 'style') {
            const val = attr.value.toLowerCase();
            if (val.includes('expression') || val.includes('javascript') || val.includes('url(')) {
              el.removeAttribute('style');
            }
          }
        }
        
        // Remove event handlers (on*)
        const allAttrs = Array.from(el.attributes);
        for (const a of allAttrs) {
          if (a.name.toLowerCase().startsWith('on')) {
            el.removeAttribute(a.name);
          }
        }
        
        clean(el);
      }
    }
  }
  
  clean(doc.body);
  return doc.body.innerHTML;
}
