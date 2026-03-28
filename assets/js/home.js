(function () {
    var welcome = document.getElementById('welcome');
    var narrative = document.getElementById('narrative');
    var line1 = document.getElementById('line1');
    var line2 = document.getElementById('line2');
    var rule = document.getElementById('rule');
    var actions = document.getElementById('cta-row');
    var footnote = document.getElementById('footnote');
    var socialDock = document.getElementById('social-dock');
    var socialBtn = socialDock.querySelector('.social-btn');

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealSocial() {
        socialDock.classList.add('is-ready');
        if (reduced) {
            socialBtn.classList.add('is-in');
            return;
        }
        setTimeout(function () {
            socialBtn.classList.add('is-in');
        }, 160);
    }

    function wait(ms) {
        return new Promise(function (r) {
            setTimeout(r, ms);
        });
    }

    function typeInto(el, chars, speedMs) {
        return new Promise(function (resolve) {
            el.textContent = '';
            var wrap = document.createElement('span');
            wrap.className = 'typed';
            var cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.setAttribute('aria-hidden', 'true');
            el.appendChild(wrap);
            el.appendChild(cursor);
            var i = 0;

            function step() {
                if (i >= chars.length) {
                    cursor.classList.add('done');
                    resolve();
                    return;
                }
                wrap.textContent += chars.charAt(i);
                i += 1;
                setTimeout(step, speedMs);
            }
            step();
        });
    }

    function run() {
        if (reduced) {
            welcome.classList.add('is-visible');
            welcome.textContent = 'Welcome.';
            return wait(400).then(function () {
                welcome.style.display = 'none';
                narrative.hidden = false;
                narrative.classList.add('is-visible');
                line1.textContent =
                    'My name is Eleftherios Katsinelos — I work in data, software, and photography.';
                line2.innerHTML =
                    'I care about clarity in numbers and patience in light. Terminal & light for the build; the <strong>gallery</strong> for the pause.';
                rule.classList.add('is-visible');
                actions.classList.add('is-visible');
                footnote.classList.add('is-visible');
                document.body.classList.add('intro-revealed');
                revealSocial();
            });
        }

        return wait(400)
            .then(function () {
                welcome.classList.add('is-visible');
                return typeInto(welcome, 'Welcome.', 42);
            })
            .then(function () {
                welcome.classList.add('is-settled');
                return wait(1750);
            })
            .then(function () {
                welcome.classList.remove('is-settled');
                welcome.classList.add('is-gone');
                return wait(920);
            })
            .then(function () {
                welcome.style.display = 'none';
                narrative.hidden = false;
                narrative.classList.add('is-visible');
                return typeInto(
                    line1,
                    'My name is Eleftherios Katsinelos — I work in data, software, and photography.',
                    42
                );
            })
            .then(function () {
                return wait(420);
            })
            .then(function () {
                return typeInto(
                    line2,
                    'I care about clarity in numbers and patience in light. Terminal & light for the build; the gallery for the pause.',
                    22
                );
            })
            .then(function () {
                return wait(400);
            })
            .then(function () {
                rule.classList.add('is-visible');
                return wait(420);
            })
            .then(function () {
                actions.classList.add('is-visible');
                footnote.classList.add('is-visible');
                document.body.classList.add('intro-revealed');
                revealSocial();
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
