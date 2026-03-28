(function () {
    var list = document.getElementById('post-list');
    var empty = document.getElementById('post-empty');

    function render(posts) {
        list.innerHTML = '';
        if (!posts || !posts.length) {
            empty.hidden = false;
            return;
        }
        empty.hidden = true;
        posts.forEach(function (p) {
            var li = document.createElement('li');
            var time = document.createElement('time');
            time.setAttribute('datetime', p.date);
            time.textContent = p.date;
            var a = document.createElement('a');
            a.href = 'posts/' + encodeURIComponent(p.slug) + '.html';
            a.textContent = p.title;
            var ex = document.createElement('p');
            ex.textContent = p.excerpt || '';
            li.appendChild(time);
            li.appendChild(a);
            if (p.excerpt) li.appendChild(ex);
            list.appendChild(li);
        });
    }

    fetch('posts.json')
        .then(function (r) {
            if (!r.ok) throw new Error('fetch');
            return r.json();
        })
        .then(render)
        .catch(function () {
            render([
                {
                    slug: 'example',
                    title: 'Example post',
                    date: '2026-03-28',
                    excerpt: 'Open this site over HTTP (e.g. GitHub Pages) to load the full list from posts.json.'
                }
            ]);
        });
})();
