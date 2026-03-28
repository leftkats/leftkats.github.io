(function () {
    const seenKey = 'landingSeen';
    const target = 'Handshake complete.';
    const restText = 'I like APIs that read like sentences and logs that tell a story.';
    const siteLinked = 'Portfolio // Gallery // <a href="blog/">Blog</a>';

    const w = document.getElementById('w');
    const nar = document.getElementById('nar');
    const restBlock = document.getElementById('restBlock');
    const siteLine = document.getElementById('siteLine');

    const wait = ms => new Promise(r => setTimeout(r, ms));

    function markSeen() {
        try {
            sessionStorage.setItem(seenKey, '1');
        } catch (_err) {
            // Ignore storage access errors.
        }
    }

    function wasSeen() {
        try {
            return sessionStorage.getItem(seenKey) === '1';
        } catch (_err) {
            return false;
        }
    }

    function renderFinalState() {
        w.style.display = 'none';
        nar.classList.add('on');
        restBlock.textContent = restText;
        siteLine.innerHTML = siteLinked;
        siteLine.style.opacity = 1;
    }

    async function type(el, text, speed = 20) {
        el.innerHTML = '';
        const span = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        el.appendChild(span);
        el.appendChild(cursor);

        for (let i = 0; i < text.length; i++) {
            span.textContent += text[i];
            await wait(speed);
        }
        cursor.remove();
    }

    async function scramble(text) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        for (let i = 0; i <= text.length; i++) {
            let s = text.substring(0, i);
            for (let j = i; j < text.length; j++) {
                s += chars[Math.floor(Math.random() * chars.length)];
            }
            w.textContent = s;
            await wait(40);
        }
    }

    async function run() {
        if (wasSeen()) {
            renderFinalState();
            return;
        }

        await wait(500);
        await scramble(target);
        await wait(1200);
        w.classList.add('out');
        await wait(600);
        w.style.display = 'none';
        nar.classList.add('on');

        await type(restBlock, restText, 15);
        await wait(400);
        siteLine.innerHTML = siteLinked;
        siteLine.style.opacity = 1;
        markSeen();
    }

    run();
})();
