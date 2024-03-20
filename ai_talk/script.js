document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const [prevButton, nextButton] = ['.prev-btn', '.next-btn'].map(selector => document.querySelector(selector));

    const findCurrentSlideIndex = () => {
        const currentHash = window.location.hash;
        return Array.from(slides).findIndex(slide => `#${slide.id}` === currentHash);
    };

    let currentIndex = findCurrentSlideIndex();
    if (currentIndex === -1) currentIndex = 0; // Default to first slide if hash is not found

    const scrollToSlide = (index) => {
        const targetSlide = slides[index];
        if (targetSlide) {
            const topPosition = targetSlide.offsetTop;
            window.scrollTo({
                top: topPosition,
                behavior: 'smooth'
            });
        }
    };

    const navigateSlide = (direction) => {
        if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        } else if (direction === 'next' && currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            // Do nothing if we're at the first/last slide and trying to go further
            return;
        }
        window.location.hash = slides[currentIndex].id; // Update URL's fragment
        scrollToSlide(currentIndex);
    };

    prevButton.addEventListener('click', () => navigateSlide('prev'));
    nextButton.addEventListener('click', () => navigateSlide('next'));

    window.addEventListener('hashchange', () => {
        const newIndex = findCurrentSlideIndex();
        if (newIndex !== -1) {
            currentIndex = newIndex;
            scrollToSlide(currentIndex);
        }
    });
});

