// Toggle Navigation Menu
const menu = () => {
    const hambugerMenu = document.getElementById("hambuger");
    const navBar = document.querySelector("#nav-bar");
    
    hambugerMenu.addEventListener("click", () => {
        navBar.classList.toggle("toggle-nav-bar");
    });
};

menu();

// define global variables
let currentQuestion = 0;
let interval; // Timer reference
let correctAnswers = []; // Store correct answers
let finalResult = [];
let category = "Georgeography";

// Get the timer elements
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

// Set the initial time
let h = 0,
    m = 10,
    s = 0;

const time = document.querySelector('.time');
time.textContent = `${m.toString().padStart(2, 0)} m : ${s.toString().padStart(2, 0)} s`;
// ${h.toString().padStart(2, 0)} h : 

//set data to store the result
let data = [];

const quizSubject = document.querySelectorAll('.quiz-subject');
quizSubject.forEach((subject) => {  
    subject.innerHTML = '';
    subject.textContent = category;
});

// Fetch questions from the server
const getQuestions = async () => {
    const questionSection = document.querySelector('.questions');
    
    try {
        const response = await fetch(`json/${category.toLocaleLowerCase()}.json`);
        const data = await response.json();
        
        data.forEach((question, index) => {
            // Create a container for each question
            const questionContainer = document.createElement('div');
            questionContainer.setAttribute("class", "question-container");
            questionContainer.style.display = "none"; // Hide initially
            
            // Store correct answer for later validation
            correctAnswers.push(question.answer);
            
            // Store the final result
            finalResult.push(question);
            
            // Create the question container
            questionContainer.innerHTML = `
                <h2 class="question-head">${category}</h2>
                <p class="question-number">Question ${index + 1} of ${data.length}.</p>
                <p class="question">${index + 1}. &nbsp; ${question.question}</p>

                <!-- Create the options -->
                ${question.options.map((option, i) => `
                    <div class="option">
                        <input type="radio" id="opt${i + 1}-${index}" name="option-${index}" value="${option}">
                        <label for="opt${i + 1}-${index}">${option}</label>
                    </div>
                `).join('')}

                <!-- Add a button to navigate to the next question -->
                <div class="buttons">
                    <button class="next-button button">Next</button>
                </div>
            `;
            
            
            // Append the container to the section
            questionSection.appendChild(questionContainer);
        });
        
        // Change the last "Next" button to "Submit"
        const nextButtons = document.querySelectorAll(".next-button");
        if (nextButtons.length > 0) {
            nextButtons[nextButtons.length - 1].textContent = "Submit";
        }
        
        // Setup quiz logic
        setupQuizLogic();
    } catch (e) {
        console.error("Error fetching questions:", e);
    }
};

getQuestions();


// Setup quiz logic
function setupQuizLogic() {
    // Get the start quiz button and question containers
    const startQuizButton = document.querySelector('#start-quiz-button');
    const questionContainers = document.querySelectorAll('.question-container');
    
    questionContainers.forEach(q => q.style.display = "none");
    
    // Add event listener to the start quiz button
    startQuizButton.addEventListener('click', () => {
        startQuiz();
        startTimer();
        
        // Show the first question
        if (questionContainers.length > 0) {
            questionContainers[0].style.display = "block";
        }
    });
    
    // Add event listener to the document to listen for click events
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("next-button")) {
            loopThroughQuestions();
        }
    });
}

// Loop through the questions
function loopThroughQuestions() {
    // Get all the question containers
    const questionContainers = document.querySelectorAll('.question-container');
    
    // Check if the current question is the last
    if (currentQuestion < questionContainers.length - 1) {
        questionContainers[currentQuestion].style.display = "none";
        currentQuestion++;
        questionContainers[currentQuestion].style.display = "block";
    } else {
        questionContainers[currentQuestion].style.display = "none";
        endAndSaveQuiz();
    }
}

// Start the quiz
function startQuiz() {
    document.querySelector('.tip').style.display = 'none';
    document.querySelector('.time-area').style.display = 'flex';
}

// Timer logic
function startTimer() {

    interval = setInterval(() => {
        if (h === 0 && m === 0 && s === 0) {
            clearInterval(interval);
            alert('Time up!');

            // Hide the question container
            document.querySelector('.question-container').style.display = 'none';
            
            // End the quiz
            endAndSaveQuiz();
            return;
        }
        
        // Update the time
        if (s === 0) {
            if (m > 0) {
                m--;
                s = 59;
            } else if (h > 0) {
                h--;
                m = 59;
                s = 59;
            }
        } else {
            s--;
        }
        
        // Update the timer display
        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');
    }, 1000);
}

// Variables to store quiz results
let attempted = 0;
let unanswered = 0;
let correct = 0;
let wrong = 0;

// End the quiz and save the result
function endAndSaveQuiz() {
    clearInterval(interval); // Stop the timer
    
    // Get all the question containers
    const questionContainers = document.querySelectorAll(".question-container");
    
    // Loop through the questions and calculate the result
    questionContainers.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        
        if (selectedOption) {
            attempted++;
            if (selectedOption.value === correctAnswers[index]) {
                correct++;
            } else {
                wrong++;
            }
        } else {
            unanswered++;
        }
    });
    
    // Get the section to display the result
    const questionSection = document.querySelector('.tip');
    
    // Clear the section
    questionSection.innerHTML = '';

    // Create a new section to display the result
    const resultElement =document.createElement('section');
    resultElement.setAttribute("class", "result-element");
    resultElement.innerHTML = `
    <h2>Results</h2>

    <div class="result">
        <p class="result__score">You scored <span class="score">${correct}</span> out of <span class="total">20</span></p>
        <p>Grade: ${correct >= 15 ? 'A' : correct >= 10 ? 'B' : correct >= 5 ? 'C' : 'F'}</p>
    </div>

    <div class="result__details">
        <p class="result__details__correct">Correct: <span class="correct">${correct}</span></p>
        <p class="result__details__wrong">Wrong: <span class="wrong">${wrong}</span></p>
        <p class="result__details__attempted">Attempted: <span class="correct">${attempted}</span></p>
        <p class="result__details__wrong">Unanswered: <span class="wrong">${unanswered}</span></p>
    </div>

    <div class="result__buttons">
        <button class="result__buttons__button" id="retake">Retake</button>
        <button class="result__buttons__button" id="home">Home</button>
        <button class="result__buttons__button" id="show-answers">Show answers</button>
    </div>
    `;
    
    // Display the section
    questionSection.style.display = "block";

    // Append the result to the section
    questionSection.appendChild(resultElement);

    // Add event listeners to the buttons
    const showFinalResultButton = document.querySelector('#show-answers');
    const retakeButton = document.querySelector('#retake');
    const homeButton = document.querySelector('#home');

    showFinalResultButton.addEventListener('click', showFinalResult);

    retakeButton.addEventListener('click', () => {
        location.reload();
    }
    );

    homeButton.addEventListener('click', () => {        
        window.location.href = "index.html";
    }
    );  

    // Hide the timer
    document.querySelector('.time-area').style.display = 'none';

    // Save the result
    saveData();
}

// Show final result
function showFinalResult() {
    // Ensure this code runs after the questions are fetched
    getQuestions().then(() => {
        const questionSection = document.querySelector('.questions');
        questionSection.innerHTML = ''; // Clear the section
        
        // Loop through the final result and display the questions
        finalResult.forEach((result, index) => {
            const finalQuestionContainer = document.createElement('div');
            finalQuestionContainer.setAttribute("class", "question-container");
            finalQuestionContainer.style.display = "block"; // Show initially
            finalQuestionContainer.innerHTML = `

            <h2 class="question-head">Preview</h2>
                <p class="question-number">Question ${index + 1} of ${result.length}.</p>
                <p class="question">${index + 1}. &nbsp; ${result.question}</p>

                ${result.options.map((option, i) => `
                    <div class="option">
                        <input type="radio" id="opt${i + 1}-${index}" name="option-${index}" value="${option}">
                        <label for="opt${i + 1}-${index}">${option}</label>
                    </div>
                `).join('')}
                            
                <div class="close-section">
                    <button class="close">close</button>
                </div>
        `;

        // Add event listener to the close button
        const closeButton = finalQuestionContainer.querySelector('.close');
        closeButton.addEventListener('click', () => {   
            location.href = "index.html";
        });

        questionSection.style.display = "block";
        
        // Append the container to a specific section in the DOM
        questionSection.appendChild(finalQuestionContainer);            
        });
        
        // Show the correct answers
        correctAnswers.forEach((answer, index) => {
            const selectedOption = document.querySelector(`input[name="option-${index}"][value="${answer}"]`);
            selectedOption.checked = true;
        });
        
    });
} 

// Save data to local storage
function saveData() {
    // Get the data from local storage
    let storedData = localStorage.getItem("result");

    // Parse the data
    if (storedData) {
        data = JSON.parse(storedData);
    }       

    // save the result to local storage
    let result = {
        category: category,
        correct: correct,
        wrong: wrong,
        attempted: attempted,
        unanswered: unanswered,
    };

    // add the result to the data array
    data.push(result);
    
    // Save the result to local storage
    localStorage.setItem("result", JSON.stringify(data));
}