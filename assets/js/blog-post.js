(function () {
    var titleEl = document.getElementById('post-title');
    var dateEl = document.getElementById('post-date');
    var bodyEl = document.getElementById('post-body');
    var notFoundEl = document.getElementById('post-not-found');
    var postWrap = document.getElementById('post-content');

    function getSlug() {
        var params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    function showNotFound(message) {
        postWrap.hidden = true;
        notFoundEl.hidden = false;
        if (message) {
            notFoundEl.textContent = message;
        }
    }

    function attachCopyButtons() {
        bodyEl.querySelectorAll('pre').forEach(function (pre) {
            if (pre.parentElement && pre.parentElement.classList.contains('code-shell')) {
                return;
            }

            var shell = document.createElement('div');
            shell.className = 'code-shell';
            pre.parentNode.insertBefore(shell, pre);
            shell.appendChild(pre);

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';
            shell.appendChild(btn);

            btn.addEventListener('click', function () {
                var codeEl = pre.querySelector('code');
                var text = codeEl ? codeEl.textContent : pre.textContent;
                if (!text) return;
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = 'Copied';
                    setTimeout(function () {
                        btn.textContent = 'Copy';
                    }, 1200);
                });
            });
        });
    }

    function renderPost(meta, markdown) {
        titleEl.textContent = meta.title || 'Untitled Post';
        dateEl.textContent = meta.date || '';
        if (meta.date) {
            dateEl.setAttribute('datetime', meta.date);
        }
        document.title = titleEl.textContent + ' | Blog';

        if (window.marked && typeof window.marked.parse === 'function') {
            bodyEl.innerHTML = window.marked.parse(markdown);
        } else {
            bodyEl.textContent = markdown;
        }

        if (window.hljs && typeof window.hljs.highlightElement === 'function') {
            bodyEl.querySelectorAll('pre code').forEach(function (block) {
                window.hljs.highlightElement(block);
            });
        }

        attachCopyButtons();
    }

    function fetchPost(meta) {
        return fetch('posts/' + encodeURIComponent(meta.slug) + '.md')
            .then(function (r) {
                if (!r.ok) throw new Error('post-not-found');
                return r.text();
            })
            .then(function (markdown) {
                renderPost(meta, markdown);
            });
    }

    function boot() {
        var slug = getSlug();
        if (!slug) {
            showNotFound('Missing post slug.');
            return;
        }

        fetch('posts.json')
            .then(function (r) {
                if (!r.ok) throw new Error('list-not-found');
                return r.json();
            })
            .then(function (posts) {
                var post = (posts || []).find(function (p) {
                    return p.slug === slug;
                });
                if (!post) {
                    throw new Error('post-meta-not-found');
                }
                return fetchPost(post);
            })
            .catch(function () {
                showNotFound('Post not found.');
            });
    }

    boot();
})();
