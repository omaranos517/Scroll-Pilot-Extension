// Create buttons
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.innerText = '⬆ Top';

const scrollBottomBtn = document.createElement('button');
scrollBottomBtn.id = 'scrollBottomBtn';
scrollBottomBtn.innerText = '⬇ Bottom';

// Add buttons to body
document.body.appendChild(scrollTopBtn);
document.body.appendChild(scrollBottomBtn);

// Scroll behavior
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBottomBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});
