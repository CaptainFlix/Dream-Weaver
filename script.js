document.addEventListener('DOMContentLoaded', () => {
    // --- DEBOUNCE HELPER FUNCTION ---
    // This function prevents another function from being called too rapidly.
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- ELEMENT SELECTION ---
    const theBook = document.getElementById('theBook');
    const bookCover = document.getElementById('bookCover');
    const inputPage = document.getElementById('inputPage');
    const storyText1 = document.getElementById('storyText1');
    const storyText2 = document.getElementById('storyText2');
    const actions1 = document.getElementById('actions1');
    const actions2 = document.getElementById('actions2');
    const dreamInput = document.getElementById('dreamInput');
    const pageCountSelect = document.getElementById('pageCountSelect');
    const weaveButton = document.getElementById('weaveButton');

    // --- STATE MANAGEMENT ---
    let lastDreamFragments = '';

    // --- CORE FUNCTIONS ---
    const paginateText = (text) => {
        const CHARS_PER_PAGE = 900;
        if (text.length <= CHARS_PER_PAGE) return [text];
        let splitPoint = text.lastIndexOf(' ', CHARS_PER_PAGE);
        if (splitPoint === -1) splitPoint = CHARS_PER_PAGE;
        return [text.substring(0, splitPoint), text.substring(splitPoint + 1)];
    };
    
    const displayStory = (fullStoryText) => {
        storyText1.innerHTML = '';
        storyText2.innerHTML = ''; 
        actions1.style.display = 'none';
        actions2.style.display = 'none';
        
        const pages = paginateText(fullStoryText);
        
        storyText1.innerHTML = pages[0] || '';
        if (pages.length === 1) {
            actions1.style.display = 'flex';
        }

        if (pages.length > 1) {
            storyText2.innerHTML = pages[1] || '';
            actions2.style.display = 'flex';
        }
        
        inputPage.classList.add('flipped');
    };

    const fetchAndDisplayStory = async (requestBody) => {
        weaveButton.textContent = 'Weaving...';
        weaveButton.disabled = true;
        try {
            const response = await fetch('/generate-story', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(requestBody)
            });
            if (!response.ok) throw new Error('The Weaver could not find the threads.');
            const data = await response.json();
            displayStory(data.story);
        } catch (error) {
            alert(error.message);
        } finally {
            weaveButton.textContent = 'Weave My Dream ✨';
            weaveButton.disabled = false;
        }
    };
    
    // Create a debounced version of our fetch function with a 2-second cooldown
    const debouncedFetch = debounce(fetchAndDisplayStory, 2000);

    const resetBook = () => {
        inputPage.classList.remove('flipped');
        setTimeout(() => {
            storyText1.innerHTML = '';
            storyText2.innerHTML = '';
            actions1.style.display = 'none';
            actions2.style.display = 'none';
        }, 800);
    };

    // --- EVENT LISTENERS ---
    bookCover.addEventListener('click', () => {
        if(theBook.classList.contains('open')) return;
        theBook.classList.add('open');
        bookCover.classList.add('flipped');
        bookCover.addEventListener('transitionend', function handleTransitionEnd() {
            bookCover.style.display = 'none';
            bookCover.removeEventListener('transitionend', handleTransitionEnd);
        });
    });
    
    weaveButton.addEventListener('click', () => {
        const fragments = dreamInput.value.trim();
        if (fragments === '') return alert('Please whisper your dream fragments first.');
        lastDreamFragments = fragments;
        debouncedFetch({ dreamFragments: fragments, pageCount: pageCountSelect.value });
    });

    document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', resetBook));
    
    document.querySelectorAll('.redo-btn').forEach(btn => btn.addEventListener('click', () => {
        if (!lastDreamFragments) return;
        debouncedFetch({ dreamFragments: lastDreamFragments, pageCount: pageCountSelect.value });
    }));
    
    document.querySelectorAll('.save-btn').forEach(btn => btn.addEventListener('click', (event) => {
        const story1 = storyText1.innerText;
        const story2 = storyText2.innerText;
        const fullStory = (story1 + " " + story2).trim();
        if (!fullStory) {
            alert("There's nothing to save!");
            return;
        }
        const blob = new Blob([fullStory], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dream-story.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }));
    
    document.querySelectorAll('.add-btn').forEach(btn => btn.addEventListener('click', () => {
        let story = (storyText1.innerText + ' ' + storyText2.innerText).trim();
        const newFragments = window.prompt("What new threads would you like to add?");
        if (newFragments && newFragments.trim() !== '') {
            debouncedFetch({ existingStory: story, newFragments, pageCount: pageCountSelect.value });
        }
    }));

    // --- YOUR CUSTOM STAR AND NEBULA CODE (MOVED TO THE CORRECT PLACE) ---
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 800;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random();
            if (size < 0.7) {
                star.className = 'star small';
            } else if (size < 0.9) {
                star.className = 'star medium';
            } else {
                star.className = 'star large';
            }
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const duration = 40 + Math.random() * 70;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `-${Math.random() * duration}s`;
            if (Math.random() > 0.95) {
                const hue = Math.floor(Math.random() * 360);
                star.style.backgroundColor = `hsl(${hue}, 100%, 80%)`;
            }
            starsContainer.appendChild(star);
        }
    }

    const nebulasContainer = document.getElementById('nebulas-container');
    if (nebulasContainer) {
        const nebulaCount = 5;
        const nebulaColors = [
            'rgba(138, 43, 226, 0.15)', // Purple
            'rgba(65, 105, 225, 0.15)', // Royal Blue
            'rgba(220, 20, 60, 0.15)',  // Crimson
            'rgba(0, 191, 255, 0.15)',  // Deep Sky Blue
            'rgba(147, 112, 219, 0.15)' // Medium Purple
        ];
        for (let i = 0; i < nebulaCount; i++) {
            const nebula = document.createElement('div');
            nebula.className = 'nebula';
            const size = 200 + Math.random() * 300;
            nebula.style.width = `${size}px`;
            nebula.style.height = `${size}px`;
            nebula.style.left = `${Math.random() * 100}%`;
            nebula.style.top = `${Math.random() * 100}%`;
            nebula.style.backgroundColor = nebulaColors[i % nebulaColors.length];
            nebula.style.animationDelay = `${Math.random() * 20}s`;
            nebulasContainer.appendChild(nebula);
        }
    }
    // --- END OF YOUR CUSTOM CODE ---

}); // <-- This is the closing bracket for the DOMContentLoaded event listener