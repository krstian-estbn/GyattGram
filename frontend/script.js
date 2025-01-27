// Trigger file input when the button is clicked
document.getElementById('uploadTrigger').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

// Indicate the file is selected and display the file name
document.getElementById('imageInput').addEventListener('change', () => {
    const fileInput = document.getElementById('imageInput');
    const fileInfo = document.getElementById('fileInfo');

    if (fileInput.files.length > 0) {
        fileInfo.textContent = `Ready to upload`; // Show file name
    } else {
        fileInfo.textContent = 'No file selected'; // Reset if no file is selected
    }
});

// Existing submit event listener
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');

    if (!imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('caption', captionInput.value);

    const response = await fetch('http://localhost:10000/uploads', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Gyatt Uploaded.'); // Custom message after upload
        loadImages(); // Refresh the gallery
        captionInput.value = ''; // Clear the caption input field after upload
        document.getElementById('fileInfo').textContent = 'No file selected'; // Reset file info text
    } else {
        alert('Gyatt Error.'); // Custom error message
    }
});

// Load images and captions
async function loadImages() {
    const response = await fetch('http://localhost:10000/images');
    const data = await response.json();

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    data.forEach(({ imageUrl, caption }) => {
        const div = document.createElement('div');
        div.className = 'image-card';
        div.innerHTML = `
            <img src="${imageUrl}" alt="Uploaded Image">
            <p>${caption}</p>
        `;
        div.addEventListener('click', () => openModal(imageUrl, caption));
        gallery.appendChild(div);
    });
}

// Modal functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close');

function openModal(imageUrl, caption) {
    modal.style.display = 'block';
    modalImg.src = imageUrl;
    modalCaption.textContent = caption;
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial load
loadImages();
