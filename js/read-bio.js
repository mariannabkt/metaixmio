const toggleLinks = document.querySelectorAll(".toggle-bio");

toggleLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        
        const speakerCard = link.closest(".speaker-card");
        speakerCard.classList.toggle("active");

        if (speakerCard.classList.contains("active")) {
            link.textContent = "Close Bio";
        } else {
            link.textContent = "Read Bio";
        }
    });
});