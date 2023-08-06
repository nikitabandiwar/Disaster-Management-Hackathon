document.addEventListener("DOMContentLoaded", function() {
    function openUserVolunteerRegistration() {
        hideAllSections();
        document.querySelector(".user-volunteer-registration-section").style.display = "block";
    }

    function openNGOsRegistration() {
        hideAllSections();
        document.querySelector(".ngos-registration-section").style.display = "block";
    }


    function openDonation() {
        hideAllSections();
        document.querySelector(".donation-section").style.display = "block";
    }

    function hideAllSections() {
        const sections = document.querySelectorAll(".assistance-section > div");
        sections.forEach(section => {
            section.style.display = "none";
        });
    }

    document.querySelector("button:nth-of-type(1)").addEventListener("click", openUserVolunteerRegistration);
    document.querySelector("button:nth-of-type(2)").addEventListener("click", openNGOsRegistration);
    document.querySelector("button:nth-of-type(4)").addEventListener("click", openDonation);
});
