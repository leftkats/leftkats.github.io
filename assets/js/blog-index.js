(function () {
    var list = document.getElementById('post-list');
    var empty = document.getElementById('post-empty');
    var searchInput = document.getElementById('blog-search-input');
    var allPosts = [];

    function matches(post, query) {
        if (!query) return true;
        var haystack = [post.title, post.excerpt, post.slug]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        return haystack.indexOf(query) !== -1;
    }

    function render(posts, query) {
        list.innerHTML = '';
        if (!posts || !posts.length) {
            empty.hidden = false;
            empty.textContent = query ? 'No posts match your search.' : 'No posts yet.';
            return;
        }
        empty.hidden = true;
        empty.textContent = 'No posts yet.';
        posts
            .slice()
            .sort(function (a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .forEach(function (p) {
            var li = document.createElement('li');
            var time = document.createElement('time');
            time.setAttribute('datetime', p.date);
            time.textContent = p.date;
            var a = document.createElement('a');
            a.href = 'post.html?slug=' + encodeURIComponent(p.slug);
            a.textContent = p.title;
            var ex = document.createElement('p');
            ex.textContent = p.excerpt || '';
            li.appendChild(time);
            li.appendChild(a);
            if (p.excerpt) li.appendChild(ex);
            list.appendChild(li);
            });
    }

    function renderFiltered(query) {
        var normalized = (query || '').trim().toLowerCase();
        var filtered = allPosts.filter(function (post) {
            return matches(post, normalized);
        });
        render(filtered, normalized);
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            renderFiltered(searchInput.value);
        });
    }

    fetch('posts.json')
        .then(function (r) {
            if (!r.ok) throw new Error('fetch');
            return r.json();
        })
        .then(function (posts) {
            allPosts = Array.isArray(posts) ? posts : [];
            renderFiltered(searchInput ? searchInput.value : '');
        })
        .catch(function () {
            allPosts = [
                {
                    slug: 'example',
                    title: 'Example post',
                    date: '2026-03-28',
                    excerpt: 'Open this site over HTTP (e.g. GitHub Pages) to load the full list from posts.json.'
                }
            ];
            renderFiltered(searchInput ? searchInput.value : '');
        });
})();
