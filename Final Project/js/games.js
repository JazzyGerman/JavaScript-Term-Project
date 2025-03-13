// Function to toggle descriptions and active states
function toggleGame(buttonId, descriptionId) {
    // Get all the game buttons and description divs
    const buttons = document.querySelectorAll('.button');
    const descriptions = document.querySelectorAll('.description');
  
    // Hide all descriptions and deactivate all buttons
    descriptions.forEach(desc => {
        desc.classList.remove('active');  // Remove active class to hide description
    });
    buttons.forEach(btn => {
        btn.classList.remove('active'); // Remove active state from all buttons
    });

    // Show the clicked description and activate the clicked button
    const selectedButton = document.getElementById(buttonId);
    const selectedDescription = document.getElementById(descriptionId);

    selectedButton.classList.add('active');  // Add active class to the selected button
    selectedDescription.classList.add('active');  // Show the corresponding description
}

// Add event listeners for each game button
document.getElementById('buildFarmBtn').addEventListener('click', function() {
    toggleGame('buildFarmBtn', 'buildFarmDesc');
});

document.getElementById('horseJumpBtn').addEventListener('click', function() {
    toggleGame('horseJumpBtn', 'horseJumpDesc');
});

document.getElementById('chickenMazeBtn').addEventListener('click', function() {
    toggleGame('chickenMazeBtn', 'chickenMazeDesc');
});

document.getElementById('readmeBtn').addEventListener('click', function() {
    window.open('readme.txt', '_blank');
});
