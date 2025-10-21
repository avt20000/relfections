// full-script-final-play-to-completion.js
document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Reveal animation helpers
  // =========================
  let currentReveals = [];

  const hideCurrentReveals = () => {
    currentReveals.forEach(el => {
      el.hidden = true;
      el.classList.remove('fx-rush-in');
    });
    currentReveals = [];
  };

  // NEW: respectful scroll-to-top helper
  const scrollToTop = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const animateIn = (el) => {
    const isOut = el.dataset.anim === 'out';
    const animClass = isOut ? 'fx-rush-out' : 'fx-rush-in';
    el.classList.remove('fx-rush-in', 'fx-rush-out');
    void el.offsetWidth; // reflow
    el.classList.add(animClass);
    el.addEventListener('animationend', () => el.classList.remove(animClass), { once: true });
  };

  const showRevealsForKey = (key) => {
    hideCurrentReveals();
    const reveals = Array.from(document.querySelectorAll(`.reveal[data-id="${key}"]`));

    reveals.forEach(el => {
      el.hidden = false;
      animateIn(el);

      // background color switch
      if (el.dataset.bg === 'black') {
        document.body.classList.add('black-bg');
      } else {
        document.body.classList.remove('black-bg');
      }
    });

    currentReveals = reveals;

    // NEW: scroll to top once reveals are in the layout
    requestAnimationFrame(scrollToTop);
  };

  // Pause all other videos except the one we’re about to play
  const pauseOthers = (except) => {
    document.querySelectorAll('video').forEach(v => {
      if (v !== except) {
        try { v.pause(); } catch (_) {}
      }
    });
  };

document.querySelectorAll('.playBtn').forEach(btn => {
  const key = btn.dataset.target;
  const video = document.querySelector(`.videoClip[data-target="${key}"]`);

  btn.addEventListener('click', () => {
    btn.style.display = 'none'; // hide the button once clicked

    if (video) {
      // ✅ CASE 1: button linked to a video
      pauseOthers(video);
      video.currentTime = 0;
      const p = video.play();
      if (p && p.catch) p.catch(err => console.warn('Video play blocked:', err));

      video.addEventListener('ended', () => {
        video.pause();
        showRevealsForKey(key);
      }, { once: true });

    } else {
      // ✅ CASE 2: no video — just reveal instantly
      showRevealsForKey(key);
    }
  });
});



  // 2) Click-to-play videos inside reveals (.clickVideo)
  document.querySelectorAll('.clickVideo').forEach(vid => {
    const key = vid.dataset.target;

    vid.addEventListener('click', () => {
      pauseOthers(vid);
      vid.currentTime = 0;
      const p = vid.play();
      if (p && p.catch) p.catch(err => console.warn('Video play blocked:', err));
    });

    vid.addEventListener('ended', () => {
      vid.pause();
      showRevealsForKey(key); // ← now also scrolls to top
    });
  });
});

