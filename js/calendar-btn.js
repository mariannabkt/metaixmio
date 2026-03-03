document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('calendarBtn');

  // Links
  const googleLink = "https://www.google.com/calendar/render?action=TEMPLATE&text=TEDxAUEB%20%E2%80%93%20Μεταίχμιο&dates=20260307T083000Z/20260307T200000Z&details=Το%20TEDxAUEB%20επιστρέφει%20για%20δέκατη%20τέταρτη%20χρονιά,%20συνεχίζοντας%20να%20φέρνει%20στο%20παρασκήνιο%20ιδέες%20που%20αλλάζουν%20τα%20πάντα.%20Το%20Σάββατο%207%20Μαρτίου%202026,%20στην%20Τεχνόπολη%20Δήμου%20Αθηναίων,%20το%20TEDxAUEB%202026%20προσκαλεί%20το%20κοινό%20να%20εξερευνήσει%20το%20«Μεταίχμιο».&location=Τεχνόπολη%20Δήμου%20Αθηναίων,%20Πειραιώς%20100,%20Αθήνα%20118%2054,%20Ελλάδα";
  const icsLink = "tedxaueb-metaixmio.ics";

  btn.addEventListener('click', () => {
    // Use matchMedia to detect desktop vs mobile/tablet
    if (window.matchMedia("(min-width: 1024px)").matches) {
      // Desktop → open Google Calendar
      window.open(googleLink, "_blank");
    } else {
      // Mobile / tablet → download ICS
      const link = document.createElement('a');
      link.href = icsLink;
      link.download = "tedxaueb-metaixmio.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});
