(function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cmdEl = document.getElementById('typed-cmd');
    var cursor = document.getElementById('term-cursor');
    var rest = document.getElementById('hero-rest');
    var cmd = 'whoami';

    function wait(ms) {
        return new Promise(function (r) {
            setTimeout(r, ms);
        });
    }

    function typeCmd() {
        var i = 0;
        var ms = reduced ? 0 : 52;
        return new Promise(function (resolve) {
            function step() {
                if (i >= cmd.length) {
                    resolve();
                    return;
                }
                cmdEl.textContent += cmd.charAt(i++);
                setTimeout(step, ms);
            }
            if (reduced) {
                cmdEl.textContent = cmd;
                resolve();
                return;
            }
            step();
        });
    }

    function run() {
        return wait(reduced ? 0 : 720)
            .then(function () {
                return typeCmd();
            })
            .then(function () {
                return wait(reduced ? 0 : 380);
            })
            .then(function () {
                cursor.classList.add('is-off');
                rest.hidden = false;
                requestAnimationFrame(function () {
                    rest.classList.add('is-visible');
                });
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
