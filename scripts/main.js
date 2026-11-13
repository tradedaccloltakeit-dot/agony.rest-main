/* #agony — terminal page.
   ghostboy's terminal / CRT idea, carrying agony's members, links, gif and song. */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a) => a[Math.floor(Math.random() * a.length)];

  const stage = $('.ag');

  /* ── agony members: pfps and links carried over exactly ── */
  const MEMBERS = {
    lain: {
      pfp: 'assets/lain_icon.png',
      links: [
        ['namemc', 'https://namemc.com/_2'],
        ['instagram', 'https://instagram.com/sword'],
        ['x', 'https://x.com/eternallyexile']
      ]
    },
    anemic: {
      pfp: 'assets/anemic_icon.png',
      links: [
        ['namemc', 'https://namemc.com/Percocet'],
        ['roblox', 'https://www.roblox.com/users/418188320/profile'],
        ['x', 'https://x.com/cr_shing']
      ]
    },
    miserable: {
      pfp: 'assets/miserable_icon.png',
      links: [
        ['namemc', 'https://namemc.com/profile/chiefkeef.3'],
        ['roblox', 'https://www.roblox.com/users/200190663/profile'],
        ['instagram', 'https://instagram.com/hate']
      ]
    }
  };

  /* ── the old agony trick: a random gif tints the member hover ── */
  const GIF_ACCENTS = {
    'alakazam.gif': 'rgba(255, 243, 81, 1)',
    'arceus.gif': 'rgba(223, 231, 79, 1)',
    'articuno.gif': 'rgba(107, 173, 243, 1)',
    'charizard.gif': 'rgba(255, 176, 66, 1)',
    'darkrai.gif': 'rgba(232, 78, 63, 1)',
    'dialga.gif': 'rgba(62, 132, 182, 1)',
    'dragonite.gif': 'rgba(50, 170, 130, 1)',
    'entei.gif': 'rgba(206, 165, 100, 1)',
    'garchomp.gif': 'rgba(237, 88, 65, 1)',
    'gardevoir.gif': 'rgba(154, 233, 154, 1)',
    'genesect.gif': 'rgba(181, 150, 243, 1)',
    'gengar.gif': 'rgba(162, 131, 193, 1)',
    'giratina.gif': 'rgba(255, 214, 0, 1)',
    'groudon.gif': 'rgba(255, 55, 65, 1)',
    'ho-oh.gif': 'rgba(66, 214, 84, 1)',
    'kyogre.gif': 'rgba(90, 164, 255, 1)',
    'kyurem.gif': 'rgba(189, 231, 255, 1)',
    'lugia.gif': 'rgba(151, 165, 239, 1)',
    'mewtwo.gif': 'rgba(220, 164, 235, 1)',
    'moltres.gif': 'rgba(255, 183, 74, 1)',
    'palkia.gif': 'rgba(220, 164, 235, 1)',
    'raikou.gif': 'rgba(255, 221, 123, 1)',
    'rayquaza.gif': 'rgba(98, 195, 147, 1)',
    'reshiram.gif': 'rgba(255, 255, 255, 1)',
    'scizor.gif': 'rgba(214, 68, 68, 1)',
    'suicune.gif': 'rgba(189, 136, 221, 1)',
    'tyranitar.gif': 'rgba(173, 206, 156, 1)',
    'zapdos.gif': 'rgba(255, 214, 66, 1)',
    'zekrom.gif': 'rgba(0, 156, 222, 1)'
  };

  function setRandomGif() {
    const gifs = Object.keys(GIF_ACCENTS);
    const gif = rand(gifs);
    const img = $('#bg-gif');
    const boot = $('#ld-gif');
    if (img) img.src = 'assets/' + gif;
    if (boot) boot.src = 'assets/' + gif;
    stage.style.setProperty('--accent', GIF_ACCENTS[gif]);
  }

  /* picked before the loader paints, so the pokémon is there from the start */
  setRandomGif();

  /* ── name scramble ── */
  function decode(el, finalText, ms) {
    const glyphs = '!<>-_/[]{}=+*^#%&@01';
    return new Promise((resolve) => {
      const t0 = performance.now();
      const frame = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        const done = Math.floor(k * finalText.length);
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          out += i < done ? finalText[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        el.textContent = k >= 1 ? finalText : out;
        el.dataset.text = el.textContent;
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      frame(t0);
    });
  }

  /* ── loader ── */
  const loader = $('#loader');
  const loaderDone = (async () => {
    const fill = $('#ld-fill');
    const pct = $('#ld-pct');
    const msg = $('#ld-msg');
    const dur = reduce ? 250 : 2200;
    const t0 = performance.now();
    await new Promise((resolve) => {
      const tick = () => {
        const p = Math.min(1, Math.max(0, (performance.now() - t0) / dur));
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const n = Math.floor(e * 100);
        fill.style.width = n + '%';
        pct.textContent = n + '%';
        fill.style.opacity = String(0.45 + 0.55 * e);
        fill.style.boxShadow = '0 0 ' + Math.round(3 + 15 * e) + 'px rgba(255,255,255,' + (0.1 + 0.6 * e).toFixed(2) + ')';
        msg.textContent = n < 30 ? 'summoning' : n < 60 ? 'digging up the old page' : n < 90 ? 'syncing audio' : 'awake';
        if (p >= 1) {
          clearInterval(iv);
          resolve();
        }
      };
      const iv = setInterval(tick, 16);
      tick();
    });
    await sleep(reduce ? 0 : 320);
    loader.classList.add('out');
    stage.classList.add('ready');
    await sleep(reduce ? 0 : 480);
  })();

  /* ── music: agony's song.mp3, faded in on the first interaction ── */
  const bgm = $('#bgm');
  const vol = $('#vol');
  const muteBtn = $('#mute');
  const player = $('#player');
  const st = $('#st');
  const npState = $('#np-state');
  let started = false;
  let target = 0.7;
  let ramp = 0;
  let startedAt = 0;

  function label() {
    const silent = bgm.muted || target === 0;
    const playing = started && !bgm.paused && !silent;
    player.classList.toggle('silent', started && silent);
    player.classList.toggle('live', playing);
    stage.classList.toggle('playing', playing);
    const text = !started ? 'click to play' : bgm.paused ? 'paused' : silent ? 'muted' : 'playing';
    st.textContent = text;
    npState.textContent = started ? text : 'paused';
  }

  function sync() {
    vol.style.setProperty('--v', vol.value + '%');
    muteBtn.classList.toggle('muted', bgm.muted || target === 0);
    label();
  }

  /* timer, not rAF: frames are throttled in hidden tabs and the fade would
     stall at volume 0, leaving the song silently "playing" */
  function fadeTo(value, ms) {
    clearInterval(ramp);
    if (!ms) {
      bgm.volume = value;
      return;
    }
    const from = bgm.volume;
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      bgm.volume = from + (value - from) * k;
      if (k >= 1) {
        bgm.volume = value;
        clearInterval(ramp);
      }
    };
    ramp = setInterval(step, 32);
    step();
  }

  async function startMusic() {
    try {
      if (!started) bgm.volume = 0;
      await bgm.play();
      if (!started) {
        started = true;
        startedAt = performance.now();
        fadeTo(target, reduce ? 0 : 1800);
      }
      label();
    } catch (_) {
      /* blocked until the visitor interacts */
    }
  }

  vol.addEventListener('input', () => {
    target = Number(vol.value) / 100;
    clearInterval(ramp);
    bgm.volume = target;
    if (target > 0) bgm.muted = false;
    sync();
    if (!started) startMusic();
  });

  /* pointerdown may already resume the track (the global wake handler runs
     right after), so remember whether the press was meant as "start/resume"
     and never turn that same click into a mute toggle. */
  let resumeIntent = false;
  muteBtn.addEventListener('pointerdown', () => {
    resumeIntent = !started || bgm.paused;
  });

  muteBtn.addEventListener('click', () => {
    const wasResume = resumeIntent;
    resumeIntent = false;
    /* paused (e.g. restored from the back/forward cache): resume first */
    if (wasResume || !started || bgm.paused) {
      bgm.muted = false;
      if (target === 0) {
        target = 0.7;
        vol.value = '70';
      }
      startMusic();
      sync();
      return;
    }
    if (performance.now() - startedAt < 300) return;
    bgm.muted = !bgm.muted;
    sync();
  });

  bgm.addEventListener('error', () => {
    player.classList.remove('live');
    stage.classList.remove('playing');
    st.textContent = 'audio unavailable';
    npState.textContent = 'unavailable';
  });

  /* the label must follow the element, not our assumptions */
  bgm.addEventListener('play', label);
  bgm.addEventListener('pause', label);
  bgm.addEventListener('volumechange', label);
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    player.classList.add('show');
    label();
  });

  sync();

  const wake = ['pointerdown', 'keydown', 'touchend'];
  const onWake = () => {
    startMusic();
    if (started) wake.forEach((ev) => removeEventListener(ev, onWake));
  };
  wake.forEach((ev) => addEventListener(ev, onWake));

  loaderDone.then(() => {
    player.classList.add('show');
    if (!started) startMusic();
  });

  /* ── typed command sequence ── */
  (async () => {
    await loaderDone;
    const blocks = $$('.blk');
    for (const block of blocks) {
      const cmd = block.querySelector('.cmd');
      if (!cmd) {
        block.classList.add('on', 'show');
        continue;
      }
      const text = cmd.dataset.t || '';
      cmd.textContent = '';
      block.classList.add('on');
      if (reduce) {
        cmd.textContent = text;
      } else {
        for (const ch of text) {
          cmd.textContent += ch;
          await sleep(28 + Math.random() * 42);
        }
      }
      await sleep(reduce ? 0 : 140);
      block.classList.add('show');
      if (block.dataset.fx === 'decode' && !reduce) decode($('.name'), 'agony', 1200);
      await sleep(reduce ? 0 : 380);
    }
    $('#end').classList.add('on');
  })();

  /* ── members ── */
  const memberOut = $('#member-out');
  const pfp = $('#mem-pfp');
  const memLabel = $('#mem-label');
  const memLinks = $('#mem-links');

  function selectMember(key) {
    const member = MEMBERS[key];
    if (!member) return;
    pfp.src = member.pfp;
    pfp.alt = key;
    memLabel.textContent = '@' + key;
    memLinks.textContent = '';
    member.links.forEach(([label, href], i) => {
      if (i > 0) {
        const comma = document.createElement('span');
        comma.className = 'comma dim';
        comma.textContent = ',';
        memLinks.appendChild(comma);
      }
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label;
      memLinks.appendChild(a);
    });
    memberOut.hidden = false;
    memberOut.classList.remove('show');
    void memberOut.offsetWidth;
    memberOut.classList.add('show');
    document.title = '#agony; ' + key;
    $$('.mem').forEach((b) => b.classList.toggle('on', b.dataset.member === key));
  }

  $$('.mem').forEach((btn) => btn.addEventListener('click', () => selectMember(btn.dataset.member)));

  const nameEl = $('.term .name');
  if (nameEl && !reduce) {
    let decoding = false;
    nameEl.addEventListener('pointerenter', async () => {
      if (decoding) return;
      decoding = true;
      await decode(nameEl, 'agony', 700);
      decoding = false;
    });
  }

  /* ── close / reopen the terminal ── */
  const term = $('.term');
  const reopen = $('#reopen');
  $('#close').addEventListener('click', () => {
    term.classList.add('closed');
    setTimeout(() => {
      term.style.display = 'none';
      reopen.classList.add('show');
    }, reduce ? 0 : 420);
  });
  reopen.addEventListener('click', () => {
    reopen.classList.remove('show');
    term.style.display = '';
    term.classList.remove('closed');
  });

  /* ── timestamp ── */
  const tsEl = $('#ts');
  const pad = (n) => String(n).padStart(2, '0');
  function tickTime() {
    const d = new Date();
    tsEl.innerHTML =
      '<b class="o">[</b><b class="tp">' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() +
      '</b> <b class="tg">' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) +
      '</b><b class="o">]</b>';
  }
  tickTime();
  setInterval(tickTime, 1000);

  /* ── pointer glow ── */
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  addEventListener('pointermove', (e) => {
    stage.style.setProperty('--mx', e.clientX + 'px');
    stage.style.setProperty('--my', e.clientY + 'px');
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  /* ── page-wide static + glitch bursts ── */
  {
    const canvas = $('#static');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const img = ctx.createImageData(W, H);
    const px = new Uint32Array(img.data.buffer);
    let burst = false;
    let last = 0;

    function draw() {
      for (let y = 0; y < H; y++) {
        const row = y * W;
        const streak = Math.random() < 0.006;
        let x = 0;
        while (x < W) {
          const run = streak ? 8 + ((Math.random() * 40) | 0) : 1;
          const c = (Math.random() * 255) | 0;
          const value = 0xff000000 | (c << 16) | (c << 8) | c;
          for (let k = 0; k < run && x < W; k++, x++) px[row + x] = value;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    draw();
    if (!reduce) {
      const loop = (t) => {
        requestAnimationFrame(loop);
        if (document.hidden || t - last < 60) return;
        last = t;
        draw();
        if (burst) {
          stage.style.setProperty('--gx', ((Math.random() - 0.5) * 6).toFixed(1) + 'px');
          stage.style.setProperty('--gy', ((Math.random() - 0.5) * 2).toFixed(1) + 'px');
        }
      };
      requestAnimationFrame(loop);

      (async () => {
        await loaderDone;
        for (;;) {
          await sleep(2500 + Math.random() * 6500);
          const hits = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < hits; i++) {
            burst = true;
            stage.classList.add('glitch');
            await sleep(90 + Math.random() * 320);
            burst = false;
            stage.classList.remove('glitch');
            stage.style.setProperty('--gx', '0px');
            stage.style.setProperty('--gy', '0px');
            if (i < hits - 1) await sleep(60 + Math.random() * 160);
          }
        }
      })();
    }
  }

  /* ── agony's ✩ snow, drifting like ghostboy's dust ── */
  if (!reduce) {
    const canvas = $('#snow');
    const ctx = canvas.getContext('2d');
    let SW = 0;
    let SH = 0;
    let flakes = [];
    let last = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);

    function roll(f, fresh) {
      f.z = Math.pow(Math.random(), 1.35);
      f.size = 8 + f.z * 9 + rnd(0, 2);
      f.vy = 10 + f.z * 26 + rnd(-3, 5);
      f.amp = rnd(8, 24) * (0.35 + f.z);
      f.freq = rnd(0.0004, 0.0012);
      f.ph = rnd(0, 6.28);
      f.alpha = Math.min(0.5, 0.13 + f.z * 0.3);
      f.tw = rnd(0.0005, 0.0015);
      f.x = Math.random() * SW;
      f.y = fresh ? Math.random() * SH : -rnd(10, 120);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      SW = window.innerWidth;
      SH = window.innerHeight;
      canvas.width = SW * dpr;
      canvas.height = SH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(26, Math.min(70, Math.round((SW * SH) / 22000)));
      flakes = Array.from({ length: n }, () => {
        const f = {};
        roll(f, true);
        return f;
      });
    }

    resize();
    addEventListener('resize', resize);

    const drift = (t) => {
      requestAnimationFrame(drift);
      if (document.hidden || t - last < 16) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const wind =
        Math.sin(t / 6900) * 9 +
        Math.sin(t / 2700 + 1.3) * 5 +
        Math.sin(t / 15300 + 4) * 7 +
        ((pointer.x - SW / 2) / SW) * 8;

      ctx.clearRect(0, 0, SW, SH);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.x += (wind * (0.3 + f.z) + Math.cos(t * f.freq + f.ph) * f.amp) * dt;
        if (f.y > SH + 25 || f.x < -40 || f.x > SW + 40) {
          roll(f, false);
          continue;
        }
        ctx.globalAlpha = f.alpha * (0.85 + 0.15 * Math.sin(t * f.tw + f.ph));
        ctx.fillStyle = '#dfe0e6';
        ctx.font = f.size.toFixed(1) + 'px "JetBrains Mono", "Cascadia", serif';
        ctx.fillText('✩', f.x, f.y);
      }
      ctx.globalAlpha = 1;
    };
    requestAnimationFrame(drift);
  }

  /* ── ouija: ask the spirits ── */
  {
    const form = $('#ouija-form');
    const field = $('#ouija-input');
    const askBtn = $('#ouija-submit');
    const thinking = $('#ouija-thinking');
    const reply = $('#ouija-reply');
    const spelling = $('#ouija-spelling');
    const bye = $('#ouija-bye');
    const again = $('#ouija-again');
    const ouijaError = $('#ouija-error');
    let phase = 'idle';

    function setPhase(next) {
      phase = next;
      const busy = next === 'asking' || next === 'spelling';
      field.disabled = busy;
      askBtn.disabled = busy || field.value.trim().length < 2;
      askBtn.textContent = next === 'asking' ? 'summoning' : 'ask';
      thinking.hidden = next !== 'asking';
      reply.hidden = next !== 'spelling' && next !== 'done';
      bye.hidden = next !== 'done';
      ouijaError.hidden = next !== 'error';
    }

    const YES_NO = /^(am|is|are|was|were|do|does|did|will|would|should|could|can|have|has|may|might)\b/;
    const TOPICS = [
      [/\b(love|crush|heart|feelings|relationship)\b/, [
        'THE HEART HAS A VOICE. LISTEN TO WHAT IT DOES NOT SAY.',
        'SOME FEELINGS ARRIVE BEFORE THEIR NAMES.',
        'NOT EVERY SECRET OF THE HEART BELONGS TO THE DARK.'
      ]],
      [/\b(friend|friends|trust|loyal)\b/, [
        'THE ONES WHO REMAIN WHEN THE LIGHTS GO OUT WILL SHOW YOU THE TRUTH.',
        'TRUST THE ACTIONS YOU CAN SEE. WHISPERS ARE NOT ENOUGH.',
        'A TRUE NAME IS REVEALED BY DEEDS, NOT PROMISES.'
      ]],
      [/\b(money|rich|wealth|job|work|future|success)\b/, [
        'WHAT YOU BUILD IN DAYLIGHT WILL FOLLOW YOU INTO THE DARK.',
        'THE PATH AHEAD IS QUIET, BUT IT IS NOT EMPTY.',
        'SOME DOORS OPEN ONLY WHEN YOU STOP WATCHING THEM.'
      ]],
      [/\b(dead|ghost|spirit|haunt|ouija|agony)\b/, [
        'A WHISPER PASSED THROUGH THE ROOM. IT DID NOT LEAVE ITS NAME.',
        'THE BOARD KNOWS THE QUESTION. THE ANSWER IS STILL HIDING.',
        'SOME ECHOES ARE ONLY MEMORIES FINDING THEIR WAY HOME.'
      ]],
      [/\b(tonight|today|tomorrow|when|time)\b/, [
        'THE CLOCK HAS SEEN MORE THAN IT WILL EVER TELL.',
        'WHEN THE NEXT HOUR ARRIVES, LOOK FOR WHAT HAS CHANGED.',
        'THE MOMENT IS CLOSE, BUT IT CANNOT BE RUSHED.'
      ]],
      [/\b(where|lost|find|location)\b/, [
        'FOLLOW WHAT YOU KNOW, NOT WHAT THE SHADOWS PROMISE.',
        'THE ANSWER WAITS WHERE YOU LAST THOUGHT TO LOOK.',
        'THE WRONG TURN MAY HAVE BEEN THE FIRST CLUE.'
      ]],
      [/\b(why|how|what|who)\b/, [
        'THE SIMPLE ANSWER HIDES INSIDE THE QUESTION YOU DID NOT ASK.',
        'THE TRUTH DOES NOT ALWAYS SPEAK FIRST.',
        'AN OLD ECHO KNOWS, BUT IT WILL NOT SAY EVERYTHING.'
      ]]
    ];
    const FILLER = [
      'SOMETHING STIRS BEYOND THE EDGE OF THE LAMP LIGHT.',
      'THE QUESTION HAS REACHED US. THE ANSWER WILL FIND YOU IN ITS OWN TIME.',
      'THE SHADOWS KEEP THEIR OWN COUNSEL TONIGHT.',
      'NOT EVERYTHING THAT IS SILENT IS GONE.',
      'YOU ALREADY KNOW MORE THAN YOU THINK YOU DO.'
    ];

    function makeAnswer(raw) {
      const q = raw.toLowerCase().trim();
      if (/\b(suicid|self.harm|hurt myself|kill myself|end my life)\b/.test(q))
        return 'YOU MATTER MORE THAN THE BOARD CAN SAY. PLEASE TELL SOMEONE YOU TRUST WHAT YOU ARE FEELING.';
      let extra = null;
      for (const [pattern, lines] of TOPICS) {
        if (pattern.test(q)) {
          extra = rand(lines);
          break;
        }
      }
      if (YES_NO.test(q)) {
        return rand(['YES', 'NO', 'PERHAPS']) + '. ' + (extra || rand(FILLER));
      }
      return extra || rand(FILLER);
    }

    function underLimit() {
      try {
        const key = 'agony-ouija-times';
        const now = Date.now();
        const old = JSON.parse(localStorage.getItem(key) || '[]');
        const recent = (Array.isArray(old) ? old : []).filter((v) => Number(v) > now - 3600000);
        if (recent.length >= 10) return false;
        recent.push(now);
        localStorage.setItem(key, JSON.stringify(recent));
      } catch (_) {
        /* storage disabled */
      }
      return true;
    }

    field.addEventListener('input', () => {
      if (phase !== 'asking' && phase !== 'spelling') askBtn.disabled = field.value.trim().length < 2;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const question = field.value.trim();
      if (question.length < 2 || phase === 'asking' || phase === 'spelling') return;
      if (!underLimit()) {
        ouijaError.textContent = 'the spirits grow tired of you. return in an hour.';
        setPhase('error');
        return;
      }
      spelling.textContent = '';
      ouijaError.textContent = '';
      setPhase('asking');
      await sleep(600 + Math.random() * 900);
      const answer = makeAnswer(question);
      setPhase('spelling');
      for (const ch of answer) {
        spelling.textContent += ch;
        await sleep(/[.,!?]/.test(ch) ? 240 : ch === ' ' ? 60 : 38);
      }
      setPhase('done');
    });

    again.addEventListener('click', () => {
      field.value = '';
      spelling.textContent = '';
      setPhase('idle');
      field.focus();
    });

    setPhase('idle');
  }
})();
