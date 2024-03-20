document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const [prevButton, nextButton] = ['.prev-btn', '.next-btn'].map(selector => document.querySelector(selector));
    let currentIndex = findCurrentSlideIndex();
    if (currentIndex === -1) currentIndex = 0;
    updateHashSilently(currentIndex);
    const scrollToSlide = (index) => {
        const targetSlide = slides[index];
        if (targetSlide) {
            const topPosition = targetSlide.offsetTop;
            const offset = (window.innerHeight - targetSlide.offsetHeight) / 2;
            window.scrollTo({
                top: topPosition - offset,
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
            return;
        }
        updateHashSilently(currentIndex);
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
    window.addEventListener('scroll', updateHashOnScroll);
    function findCurrentSlideIndex() {
        const currentHash = window.location.hash;
        return Array.from(slides).findIndex(slide => `#${slide.id}` === currentHash);
    }
    function updateHashSilently(index) {
        const id = slides[index].id;
        history.replaceState(null, null, '#' + index);
    }
    function updateHashOnScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        let closestSlideIndex = 0;
        let smallestDifference = Infinity;
        slides.forEach((slide, index) => {
            const difference = Math.abs(slide.offsetTop - scrollPosition);
            if (difference < smallestDifference) {
                smallestDifference = difference;
                closestSlideIndex = index;
            }
        });
        if (closestSlideIndex !== currentIndex) {
            currentIndex = closestSlideIndex;
            updateHashSilently(currentIndex);
        }
    }
    setTimeout(() => scrollToSlide(currentIndex), 0);
  });