document.addEventListener('DOMContentLoaded', function() {
    const createSnowflake = () => {
        const snowflake = document.createElement('div');
        const snowflakesContainer = document.querySelector('.snowflakes');
        
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '✩';
        snowflake.style.left = `${Math.random() * window.innerWidth}px`;
        snowflake.style.top = '0';
        snowflakesContainer.appendChild(snowflake);

        const fall = () => {
            const currentY = parseFloat(getComputedStyle(snowflake).top);
            const newY = currentY + 0.6;

            if (newY > window.innerHeight) {
                snowflake.remove();
            } else {
                snowflake.style.top = `${newY}px`;
                requestAnimationFrame(fall);
            }
        };

        requestAnimationFrame(fall);
    };

    const isPageVisible = () => !document.hidden;

    const createSnowflakesIfVisible = () => {
        if (isPageVisible()) {
            createSnowflake();
        }
    };

    setInterval(createSnowflakesIfVisible, 300);
});
