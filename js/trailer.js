const modal = document.getElementById('trailerModal');
const btn = document.getElementById('trailerBtn');
const span = document.querySelector('.close');
const video = document.getElementById('trailerVideo');

// Open modal and play video
btn.onclick = () => {
  modal.style.display = "block";
  video.play();
}

// Close modal and pause video
span.onclick = () => {
  modal.style.display = "none";
  video.pause();
}

// Close modal when clicking outside video
window.onclick = (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
    video.pause();
  }
}
