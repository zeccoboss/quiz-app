const menu = () => {
    const hambugerMenu = document.getElementById('hambuger');
    const navBar = document.querySelector('#nav-bar');
    
    hambugerMenu.addEventListener('click', () => {
    
         navBar.classList.toggle('toggle-nav-bar')
         console.log(navBar);
         
    });
}

menu();
