document.getElementById('imageForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const prompt = document.getElementById('prompt').value;
    const imageContainer = document.getElementById('imageContainer');

    // Clear previous images
    imageContainer.innerHTML = '';

    // Call the Pollinations API
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    
    if (response.ok) {
        const imageUrl = await response.url; // Get the image URL from the response
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = prompt;
        imgElement.style.maxWidth = '100%'; // Responsive image size
        imageContainer.appendChild(imgElement); // Add the image to the container
    } else {
        console.error('Error generating image:', response.statusText);
        imageContainer.innerHTML = 'Error generating image. Please try again.';
    }
});