class SlideNavigator {
    constructor() {
      this.slides = document.querySelectorAll('.slide');
      this.prevButton = document.querySelector('.prev-btn');
      this.nextButton = document.querySelector('.next-btn');
      this.currentIndex = this.calculateInitialIndex();
      this.setupEventListeners();
      this.updateHashSilently(this.currentIndex);
      window.onload = () => this.scrollToSlide(this.currentIndex);
    }
  
    setupEventListeners() {
      this.prevButton.addEventListener('click', () => this.navigateSlide('prev'));
      this.nextButton.addEventListener('click', () => this.navigateSlide('next'));
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
      window.addEventListener('scroll', this.updateHashOnScroll.bind(this));
    }
  
    calculateInitialIndex() {
      const hashIndex = parseInt(window.location.hash.substring(1), 10);
      if (!isNaN(hashIndex) && hashIndex >= 0 && hashIndex < this.slides.length) {
        return hashIndex;
      }
      return 0;
    }
  
    updateHashSilently(index) {
      const slideId = this.slides[index].id || index;
      const newUrl = `${window.location.pathname}${window.location.search}#${slideId}`;
      history.replaceState(null, '', newUrl);
    }
  
    scrollToSlide(index) {
      const targetSlide = this.slides[index];
      if (targetSlide) {
        const topPosition = targetSlide.offsetTop;
        const offset = (window.innerHeight - targetSlide.offsetHeight) / 2;
        window.scrollTo({
          top: topPosition - offset,
          behavior: 'smooth'
        });
      }
    }
  
    navigateSlide(direction) {
      if (direction === 'prev' && this.currentIndex > 0) {
        this.currentIndex--;
      } else if (direction === 'next' && this.currentIndex < this.slides.length - 1) {
        this.currentIndex++;
      } else {
        return;
      }
      this.updateHashSilently(this.currentIndex);
      this.scrollToSlide(this.currentIndex);
    }
  
    handleHashChange() {
      const newIndex = this.calculateInitialIndex();
      if (newIndex !== this.currentIndex) {
        this.currentIndex = newIndex;
        this.scrollToSlide(this.currentIndex);
      }
    }
  
    updateHashOnScroll() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      let closestSlideIndex = 0;
      let smallestDifference = Infinity;
      this.slides.forEach((slide, index) => {
        const difference = Math.abs(slide.offsetTop - scrollPosition);
        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestSlideIndex = index;
        }
      });
      if (closestSlideIndex !== this.currentIndex) {
        this.currentIndex = closestSlideIndex;
        this.updateHashSilently(this.currentIndex);
      }
    }
  }