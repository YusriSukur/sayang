document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const slidesContainer = document.getElementById('slides-container');
    const heartsContainer = document.getElementById('hearts-container');
    const greeting = document.getElementById('greeting');
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const slide2 = document.getElementById('slide-2');
    const slide3 = document.getElementById('slide-3');
    const slide4 = document.getElementById('slide-4');
    const slide5 = document.getElementById('slide-5');
    const slide6 = document.getElementById('slide-6');
    const slide7 = document.getElementById('slide-7');
    const toFinalBtn = document.getElementById('to-final-btn');
    const slideFinal = document.getElementById('slide-final');
    const nextButtons = document.querySelectorAll('.next-slide-btn');
    
    // Anniversary Date State
    let anniversaryDate = null;

    // 1. Floating Hearts Animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.opacity = Math.random();
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 300);

    const API_URL = '/api';

    // 2. Login Logic
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('partner-name').value;
        const day = document.getElementById('anniversary-date').value;
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, anniversaryDate: day })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Login gagal');
                return;
            }

            anniversaryDate = new Date(2022, 7, day);
            greeting.innerText = `Happy Anniversary, ${data.user.username}! ❤️`;
            
            // Transition
            loginSection.style.opacity = '0';
            loginSection.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                loginSection.classList.add('hidden');
                slidesContainer.classList.remove('hidden');
                slidesContainer.style.opacity = '0';
                setTimeout(() => {
                    slidesContainer.style.opacity = '1';
                }, 50);
            }, 800);

        } catch (err) {
            console.error(err);
            alert('Gagal menghubungi server. Pastikan backend jalan ya!');
        }
    });

    // 3. Slide 2: NO Button Sequence Logic
    let noClickCount = 0;
    noBtn.addEventListener('click', () => {
        noClickCount++;
        
        if (noClickCount === 1) {
            alert("Harus pilih YES 😡");
        } else if (noClickCount === 2) {
            alert("Sayang gamau baca ya? 🧐");
        } else if (noClickCount === 3) {
            alert("BUBBY NGAMBEK!!! 😤");
        } else if (noClickCount >= 4) {
            // Yes Button Overload
            for (let i = 0; i < 30; i++) {
                const fakeYes = document.createElement('button');
                fakeYes.innerText = 'YES ❤️';
                fakeYes.style.position = 'fixed';
                fakeYes.style.left = Math.random() * 90 + 'vw';
                fakeYes.style.top = Math.random() * 90 + 'vh';
                fakeYes.style.padding = '20px 40px';
                fakeYes.style.borderRadius = '50px';
                fakeYes.style.backgroundColor = '#f48fb1';
                fakeYes.style.color = 'white';
                fakeYes.style.border = 'none';
                fakeYes.style.zIndex = '1000';
                fakeYes.style.cursor = 'pointer';
                fakeYes.style.fontSize = '1.5rem';
                
                fakeYes.addEventListener('click', () => {
                    yesBtn.click();
                });
                
                document.body.appendChild(fakeYes);
            }
            
            // Expand the original Yes button
            yesBtn.style.position = 'fixed';
            yesBtn.style.top = '0';
            yesBtn.style.left = '0';
            yesBtn.style.width = '100vw';
            yesBtn.style.height = '100vh';
            yesBtn.style.fontSize = '5rem';
            yesBtn.style.zIndex = '999';
            yesBtn.innerText = 'KLIK YES SEKARANG! ❤️';
        }
    });

    // 4. Slide 2: YES Button Logic
    yesBtn.addEventListener('click', () => {
        // Cleanup Overload Buttons
        const fakeButtons = document.querySelectorAll('button[style*="fixed"]');
        fakeButtons.forEach(btn => {
            if (btn !== yesBtn) btn.remove();
        });

        // Reset Yes Button Style
        yesBtn.style.position = '';
        yesBtn.style.top = '';
        yesBtn.style.left = '';
        yesBtn.style.width = '';
        yesBtn.style.height = '';
        yesBtn.style.fontSize = '';
        yesBtn.style.zIndex = '';
        yesBtn.innerText = 'YES ❤️';

        // Move to Slide 3
        slide2.classList.remove('active');
        slide3.classList.add('active');
    });

    // 5. Slide Transitions Sequence
    toFinalBtn.addEventListener('click', () => {
        slide3.classList.remove('active');
        slideFinal.classList.add('active');
        startTimer(); // Start timer here as this is the Counter slide
    });

    // Handle generic "Next" buttons
    nextButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const currentSlide = btn.closest('.slide');
            const nextSlide = currentSlide.nextElementSibling;
            
            if (nextSlide && nextSlide.classList.contains('slide')) {
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                
                if (nextSlide.id === 'slide-final') {
                    startTimer();
                }
            }
        });
    });

    // 6. Back Button Logic
    const prevButtons = document.querySelectorAll('.prev-slide-btn');
    prevButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const currentSlide = btn.closest('.slide');
            const prevSlide = currentSlide.previousElementSibling;
            
            if (prevSlide && prevSlide.classList.contains('slide')) {
                currentSlide.classList.remove('active');
                prevSlide.classList.add('active');
            }
        });
    });

    // 7. Restart Button Logic
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const currentSlide = restartBtn.closest('.slide');
            const firstSlide = document.getElementById('slide-2');
            
            currentSlide.classList.remove('active');
            firstSlide.classList.add('active');
            // Reset no click count if needed
            noClickCount = 0;
        });
    }

    // 8. Countdown / Counter Logic
    function startTimer() {
        if (!anniversaryDate) {
            anniversaryDate = new Date(2022, 7, 22); 
        }

        function updateTimer() {
            const now = new Date();
            let years = now.getFullYear() - anniversaryDate.getFullYear();
            let months = now.getMonth() - anniversaryDate.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }

            document.getElementById('years').innerText = years;
            document.getElementById('months').innerText = months;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
});
