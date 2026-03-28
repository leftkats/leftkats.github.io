(function () {
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-img');
    var lbExif = document.getElementById('lightbox-exif');
    var closeBtn = document.getElementById('lightbox-close');
    var lastFocus = null;

    function openLightbox(btn) {
        lastFocus = document.activeElement;
        var im = btn.querySelector('img');
        lbImg.src = btn.getAttribute('data-full');
        lbImg.alt = im ? im.alt : '';
        var ap = btn.getAttribute('data-aperture');
        var iso = btn.getAttribute('data-iso');
        var sh = btn.getAttribute('data-shutter');
        if (ap && iso && sh) {
            lbExif.innerHTML = '<span>' + ap + '</span><span>' + iso + '</span><span>' + sh + '</span>';
            lbExif.hidden = false;
        } else {
            lbExif.innerHTML = '';
            lbExif.hidden = true;
        }
        lb.hidden = false;
        requestAnimationFrame(function () {
            lb.classList.add('is-open');
        });
        document.body.classList.add('lightbox-open');
        closeBtn.focus();
    }

    function closeLightbox() {
        lb.classList.remove('is-open');
        document.body.classList.remove('lightbox-open');
        lbImg.src = '';
        lbImg.alt = '';
        lbExif.innerHTML = '';
        lbExif.hidden = true;
        setTimeout(function () {
            lb.hidden = true;
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }, 280);
    }

    document.getElementById('gallery-grid').addEventListener('click', function (e) {
        var t = e.target.closest('.thumb');
        if (!t) return;
        openLightbox(t);
    });

    closeBtn.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lb.classList.contains('is-open')) {
            e.preventDefault();
            closeLightbox();
        }
    });
})();
