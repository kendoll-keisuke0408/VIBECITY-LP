document.addEventListener('DOMContentLoaded', function () {
    console.log("VIBE CITY System Initialized...");

    // --- Navigation & Scroll ---
    const header = document.querySelector('.main-header');
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');

    // Scroll Effect for Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
            header.style.padding = '10px 0';
        } else {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
            header.style.padding = '15px 0';
        }
    });

    // Mobile Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
            // Reset hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // --- Hero Carousel ---
    const heroImages = document.querySelectorAll('.hero-backgrounds img');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentHeroIndex = 0;
    const heroIntervalTime = 5000;

    function changeHeroImage(index) {
        heroImages.forEach(img => img.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));

        heroImages[index].classList.add('active');
        heroDots[index].classList.add('active');
        currentHeroIndex = index;
    }

    if (heroImages.length > 0) {
        setInterval(() => {
            let nextIndex = (currentHeroIndex + 1) % heroImages.length;
            changeHeroImage(nextIndex);
        }, heroIntervalTime);

        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                changeHeroImage(index);
            });
        });
    }

    // --- GSAP Opening Animation ---
    try {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();

            // 1. Loader Animation
            tl.to("#loader-bar", {
                width: "100%",
                duration: 1.5,
                ease: "power2.inOut"
            })
                .to(".loader-content", {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    delay: 0.2
                })
                .to("#opening-overlay", {
                    height: 0,
                    duration: 0.8,
                    ease: "expo.inOut"
                })
                // 2. Hero Content Animation
                .to(".hero-content-wrapper", {
                    opacity: 1,
                    duration: 0.1
                })
                .to(".hero-label", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                })
                .to(".hero-catchphrase-container", {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    onComplete: () => {
                        // Start Text Decoding after animation
                        if (typeof decodeEffect === 'function') {
                            decodeEffect();
                        }
                    }
                }, "-=0.5");
        } else {
            throw new Error("GSAP is not defined");
        }
    } catch (e) {
        console.error("Animation Error:", e);
        // Fallback: Show content immediately
        const overlay = document.getElementById('opening-overlay');
        if (overlay) overlay.style.display = 'none';

        const heroContent = document.querySelector('.hero-content-wrapper');
        if (heroContent) heroContent.style.opacity = 1;

        const heroLabel = document.querySelector('.hero-label');
        if (heroLabel) {
            heroLabel.style.transform = 'none';
            heroLabel.style.opacity = 1;
        }

        const catchphrase = document.querySelector('.hero-catchphrase-container');
        if (catchphrase) {
            catchphrase.style.transform = 'skew(-10deg)';
            catchphrase.style.opacity = 1;
        }

        // Start Text Decoding immediately
        setTimeout(() => {
            if (typeof decodeEffect === 'function') {
                decodeEffect();
            }
        }, 500);
    }



    // --- Text Decoding Effect ---
    const decodeTextElement = document.getElementById('decode-text');
    let decodeEffect; // Define outside to call later

    if (decodeTextElement) {
        const lines = JSON.parse(decodeTextElement.dataset.textLines);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let currentLineIndex = 0;

        decodeEffect = function () {
            const targetText = lines[currentLineIndex];
            let iteration = 0;
            let interval = setInterval(() => {
                decodeTextElement.innerText = targetText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return targetText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iteration >= targetText.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        currentLineIndex = (currentLineIndex + 1) % lines.length;
                        decodeEffect();
                    }, 4000);
                }

                iteration += 1 / 2; // Speed control
            }, 30);
        }
        // Initial call is handled by GSAP onComplete
    }

    // --- Audio Player Logic ---
    const bgmPlayer = document.getElementById('bgm-player');
    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (bgmToggleBtn && bgmPlayer) {
        // Set volume low for BGM
        bgmPlayer.volume = 0.3;

        const bgmInfo = document.getElementById('bgm-info');

        bgmToggleBtn.addEventListener('click', () => {
            if (bgmPlayer.paused) {
                bgmPlayer.play().catch(e => console.log("Audio play failed:", e));
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                bgmToggleBtn.style.borderColor = 'var(--accent-color-1)';
                bgmToggleBtn.style.boxShadow = '0 0 20px var(--accent-color-1)';
                if (bgmInfo) bgmInfo.style.opacity = '1';
            } else {
                bgmPlayer.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                bgmToggleBtn.style.borderColor = 'rgba(255,255,255,0.5)';
                bgmToggleBtn.style.boxShadow = 'none';
                if (bgmInfo) bgmInfo.style.opacity = '0';
            }
        });
    }

    // Preview Player (Multi-instance support)
    const previewButtons = document.querySelectorAll('.preview-play-btn');

    previewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const audioId = btn.dataset.audioTarget;
            const audio = document.getElementById(audioId);

            if (!audio) return;

            // Stop other previews
            previewButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherAudioId = otherBtn.dataset.audioTarget;
                    const otherAudio = document.getElementById(otherAudioId);
                    if (otherAudio) {
                        otherAudio.pause();
                        otherAudio.currentTime = 0;
                    }
                    otherBtn.textContent = 'PREVIEW PLAY';
                    otherBtn.classList.remove('playing');
                }
            });

            if (audio.paused) {
                // Stop main BGM if playing
                if (bgmPlayer && !bgmPlayer.paused) {
                    bgmToggleBtn.click(); // Use click to toggle UI state correctly
                }

                // Stop main grid audio player if playing
                if (mainAudioPlayer && !mainAudioPlayer.paused) {
                    mainAudioPlayer.pause();
                    if (currentPlayBtn) {
                        currentPlayBtn.textContent = 'PLAY';
                        currentPlayBtn.classList.remove('active');
                        currentPlayBtn = null;
                    }
                }

                audio.currentTime = 0;
                audio.play();
                btn.textContent = 'STOP PREVIEW';
                btn.classList.add('playing');
            } else {
                audio.pause();
                btn.textContent = 'PREVIEW PLAY';
                btn.classList.remove('playing');
            }

            // Reset on end
            audio.onended = () => {
                btn.textContent = 'PREVIEW PLAY';
                btn.classList.remove('playing');
            };
        });
    });

    // Grid Audio Players
    const mainAudioPlayer = document.getElementById('audio-player');
    let currentPlayBtn = null;

    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.song-card');
            const src = card.dataset.audioSrc;

            if (!src) return;

            if (currentPlayBtn === this && !mainAudioPlayer.paused) {
                mainAudioPlayer.pause();
                this.textContent = 'PLAY';
                this.classList.remove('active');
                currentPlayBtn = null;
            } else {
                // Stop BGM
                if (bgmPlayer && !bgmPlayer.paused) {
                    bgmToggleBtn.click();
                }

                if (currentPlayBtn) {
                    currentPlayBtn.textContent = 'PLAY';
                    currentPlayBtn.classList.remove('active');
                }

                mainAudioPlayer.src = src;
                mainAudioPlayer.play();
                this.textContent = 'STOP';
                this.classList.add('active');
                currentPlayBtn = this;
            }
        });
    });

    if (mainAudioPlayer) {
        mainAudioPlayer.onended = () => {
            if (currentPlayBtn) {
                currentPlayBtn.textContent = 'PLAY';
                currentPlayBtn.classList.remove('active');
                currentPlayBtn = null;
            }
        };
    }

    // --- Modals (POI & Blog) ---
    const poiModal = document.getElementById('poi-modal');
    const blogModal = document.getElementById('blog-modal');
    const closeButtons = document.querySelectorAll('.poi-modal-close');

    // POI Click
    document.querySelectorAll('.poi').forEach(poi => {
        poi.addEventListener('click', function () {
            const title = this.dataset.title;
            const desc = this.dataset.description;
            const img = this.dataset.image;

            document.getElementById('poi-modal-title').textContent = title;
            document.getElementById('poi-modal-description').textContent = desc;

            const modalImg = document.getElementById('poi-modal-image');
            if (img) {
                modalImg.src = img;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }

            poiModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Blog Click
    // Blog Button Click
    // Blog Nav Link Click
    const navBlogLink = document.getElementById('nav-blog-link');
    if (navBlogLink) {
        navBlogLink.addEventListener('click', (e) => {
            e.preventDefault(); // リンクのデフォルト動作（#へのジャンプ）を無効化
            blogModal.style.display = 'block';
            setTimeout(() => {
                blogModal.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    }

    // Like Button Click
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const countSpan = this.querySelector('.count');
            let count = parseInt(countSpan.textContent);

            if (!this.classList.contains('liked')) {
                count++;
                this.classList.add('liked');
                this.style.color = 'var(--accent-color)';
            } else {
                count--;
                this.classList.remove('liked');
                this.style.color = '';
            }

            countSpan.textContent = count;
        });
    });

    // Comment Button Click (Placeholder)
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Comment feature coming soon!');
        });
    });

    /* Old Blog Card Logic - Removed
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function (e) {
            const title = this.dataset.title;
            const meta = this.dataset.meta;
            const body = this.dataset.body;

            if (title && body) {
                document.getElementById('blog-modal-title').textContent = title;
                document.getElementById('blog-modal-meta').textContent = meta;
                document.getElementById('blog-modal-body').innerHTML = body;

                blogModal.style.display = 'block';
                // 少し遅らせてactiveクラスを追加し、アニメーションを発火させる
                setTimeout(() => {
                    blogModal.classList.add('active');
                }, 10);
                document.body.style.overflow = 'hidden';
            }
        });
    });
    */

    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            poiModal.style.display = 'none';

            // Blog Modal Close Animation
            if (blogModal.style.display === 'block') {
                blogModal.classList.remove('active');
                setTimeout(() => {
                    blogModal.style.display = 'none';
                }, 400); // CSS transition time matches
            }

            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target == poiModal) {
            poiModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target == blogModal) {
            blogModal.classList.remove('active');
            setTimeout(() => {
                blogModal.style.display = 'none';
            }, 400);
            document.body.style.overflow = 'auto';
        }
    });

    // Artist Card Scroll Effect for Mobile
    const artistCards = document.querySelectorAll('.artist-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            threshold: 0.5 // 50% visible
        });

        artistCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Mobile Song Card Tap Interaction
    const songCards = document.querySelectorAll('.song-card');
    songCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // スマホサイズのみ有効にする簡易判定
            if (window.innerWidth <= 768) {
                // ボタン自体のクリックなら何もしない
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }

                // すでにアクティブなら非アクティブに、そうでなければアクティブに
                const isActive = this.classList.contains('mobile-active');

                // 他のカードのアクティブを消す（排他制御）
                songCards.forEach(c => c.classList.remove('mobile-active'));

                if (!isActive) {
                    this.classList.add('mobile-active');
                }
            }
        });
    });

    // --- Chart Date Logic ---
    const chartPeriodElement = document.getElementById('chart-period');
    if (chartPeriodElement) {
        const today = new Date();
        const day = today.getDay(); // 0 (Sun) - 6 (Sat)

        // Calculate start of week (Monday)
        // If today is Sunday (0), go back 6 days. Otherwise go back day-1 days.
        const diffToMon = day === 0 ? 6 : day - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMon);

        // Calculate end of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Format Date: YYYY.MM.DD
        const formatDate = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}.${m}.${d}`;
        };

        chartPeriodElement.textContent = `WEEKLY CHART : ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    }



    // --- Comment Submission Logic (Local Demo with Persistence) ---
    const commentsList = document.getElementById('comments-list');
    const countSpan = document.getElementById('comment-count');

    // Load saved comments
    const savedComments = JSON.parse(localStorage.getItem('vibeCityComments') || '[]');

    if (commentsList && countSpan) {
        // Prepend saved comments (reverse order so newest is top)
        savedComments.forEach(comment => {
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.style.marginBottom = '8px';
            newComment.style.fontSize = '0.8rem';
            newComment.innerHTML = `<span style="color: var(--accent-color); font-weight: bold;">${escapeHtml(comment.name)}:</span> <span style="color: #fff;">${escapeHtml(comment.text)}</span>`;
            commentsList.insertBefore(newComment, commentsList.firstChild);
        });

        // Update count
        let currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + savedComments.length;
    }
    const submitBtn = document.getElementById('submit-comment');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('comment-name');
            const textInput = document.getElementById('comment-text');
            const commentsList = document.getElementById('comments-list');
            const countSpan = document.getElementById('comment-count');

            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (name && text) {
                // Create new comment element
                const newComment = document.createElement('div');
                newComment.className = 'comment-item';
                newComment.style.marginBottom = '8px';
                newComment.style.fontSize = '0.8rem';
                newComment.style.animation = 'fadeIn 0.5s ease'; // Simple fade in if CSS supports it, otherwise just appears

                // Add content
                newComment.innerHTML = `<span style="color: var(--accent-color); font-weight: bold;">${escapeHtml(name)}:</span> <span style="color: #fff;">${escapeHtml(text)}</span>`;

                // Insert at the top
                commentsList.insertBefore(newComment, commentsList.firstChild);

                // Update count
                let currentCount = parseInt(countSpan.textContent);
                countSpan.textContent = currentCount + 1;

                // Save to localStorage
                const comments = JSON.parse(localStorage.getItem('vibeCityComments') || '[]');
                comments.push({ name, text });
                localStorage.setItem('vibeCityComments', JSON.stringify(comments));

                // Clear inputs
                nameInput.value = '';
                textInput.value = '';

                // Visual feedback
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'SENT!';
                submitBtn.style.background = '#4CAF50';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'var(--accent-color)';
                }, 2000);
            } else {
                alert('Please enter both a name and a comment.');
            }
        });
    }

    // Helper to prevent XSS in demo
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
