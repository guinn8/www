class SlideNavigator {
    constructor() {
      this.slides = document.querySelectorAll('.slide-container');
      this.currentSlideIndex = 0;
      this.initEventListeners();
      this.navigateToHashSlide();
    }
  
    initEventListeners() {
      document.querySelector('.prev-btn').addEventListener('click', () => this.handleArrowClick(false));
      document.querySelector('.next-btn').addEventListener('click', () => this.handleArrowClick(true));
      window.addEventListener('hashchange', () => this.navigateToHashSlide());
    }
  
    navigateToSlide(index) {
      if (index >= 0 && index < this.slides.length) {
        this.currentSlideIndex = index;
        window.scrollTo({ top: this.slides[index].offsetTop, behavior: 'smooth' });
      }
    }
  
    handleArrowClick(isNext) {
      const newIndex = isNext ? this.currentSlideIndex + 1 : this.currentSlideIndex - 1;
      this.navigateToSlide(newIndex);
    }
  
    navigateToHashSlide() {
      const hash = window.location.hash;
      const index = parseInt(hash.replace('#slide', ''), 10) - 1;
      if (!isNaN(index) && index !== this.currentSlideIndex) {
        this.navigateToSlide(index);
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new SlideNavigator());
  