// Toggle Navigation Menu
const menu = () => {
    const hambugerMenu = document.getElementById("hambuger");
    const navBar = document.querySelector("#nav-bar");
    
    hambugerMenu.addEventListener("click", () => {
        navBar.classList.toggle("toggle-nav-bar");
    });
};

menu();

const results = JSON.parse(localStorage.getItem("result")) || [];

// console.log(results);

function renderResult() {
    const resultContainer = document.querySelector("#result-container");
    resultContainer.innerHTML = "";

    results.forEach((result) => {
        const resultCard = document.createElement("section");
        resultCard.setAttribute("class", "result_card");
    
        resultCard.innerHTML = `
                                <h2>Result details</h2>
    
                                <div class="result__details">
                                    <p class="catgory">Cartegory: ${result.category}</p>
                                    <p class="result__details__correct">Correct: <span class="correct">${result.correct}</span></p>
                                    <p class="result__details__wrong">Wrong: <span class="wrong">${result.wrong}</span></p>
                                    <p class="result__details__attempted">Attempted: <span class="correct">${result.attempted}</span></p>
                                    <p class="result__details__wrong">Unanswered: <span class="wrong">${result.unanswered}</span></p>
                                </div>
    
                                <div class="menu_bar">
                                    <span class="menu_items"></span>
                                    <span class="menu_items"></span>
                                    <span class="menu_items"></span>
                                </div>
    
                                <div class="menu_conrols">
                                    <span id="delete" class="delete">Delete</span>
                                </div>
        `;
    
        console.log(result);
        resultContainer.appendChild(resultCard);

        const deleteButton = resultCard.querySelector("#delete");
        deleteButton.addEventListener("click", () => {
            const index = results.indexOf(result);
            results.splice(index, 1);
            localStorage.setItem("result", JSON.stringify(results));
            renderResult();
        });

        const menuBar = resultCard.querySelector(".menu_bar");
        const menuControl = resultCard.querySelector(".menu_conrols");

        menuBar.addEventListener("click", () => {
            menuControl.classList.toggle("toggle-menu");
        });
        
    });
        
}

if (results.length === 0) {
    const resultContainer = document.querySelector("#result-container");
    resultContainer.innerHTML = `<h2 class="no_result">No result found</h2>`;

    const navigate = document.createElement("a");
    navigate.setAttribute("href", "index.html");
    navigate.setAttribute("class", "navigate");
    navigate.textContent = "Navigate to Home";
    resultContainer.appendChild(navigate);
} else {
    renderResult();
}
