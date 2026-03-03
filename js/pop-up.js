const bioButtons = document.querySelectorAll('.blur-btn');
const popUp = document.getElementById('bio-popUp');
const popUpTitle = document.getElementById('popUp-title');
const popUpName = document.getElementById('popUp-name');
const popUpJob = document.getElementById('popUp-job');
const popUpBio = document.getElementById('popUp-bio');
const closeBtn = document.querySelector('.close-popUp');

bioButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const hostTitle = btn.getAttribute('data-who');
    const hostName = btn.closest('.card').querySelector('.what-name').textContent;
    const hostJob = btn.closest('.card').querySelector('.what-job').textContent;
    const bioText = btn.getAttribute('data-bio');

    popUpTitle.textContent = hostTitle;
    popUpName.textContent = hostName;
    popUpJob.textContent = hostJob;
    popUpBio.textContent = bioText;

    popUp.style.display = 'block';
    document.body.classList.add('modal-open');
  });
});

closeBtn.addEventListener('click', () => {
  popUp.style.display = 'none';
  document.body.classList.remove('modal-open');
});

window.addEventListener('click', (e) => {
  if (e.target === popUp) {
    popUp.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});