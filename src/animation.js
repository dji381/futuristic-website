import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP
 */
gsap.registerPlugin(ScrollTrigger);
// Create the ScrollTrigger
ScrollTrigger.create({
    trigger: ".about-container",
    start: "top top",
    onEnter: () => {
        gsap.set(".webgl", {
            position: "absolute",
            top: "0px",
            left: "0px"
        });
    },
    onLeaveBack: () => {
        gsap.set(".webgl", {
            position: "fixed",
            top: "10px",
            left: "10px"
        });
    }
});
 // Split text into words and wrap each word in a span
 const text = document.querySelector('.about-paralax p');
 text.innerHTML = text.textContent.split(' ').map(word => `<span>${word}</span>`).join(' ');

 // Create the ScrollTrigger
 gsap.fromTo(".about-paralax span", 
     { opacity: 0 }, 
     { 
         opacity: 1, 
         duration: 1, 
         stagger: 0.5, 
         scrollTrigger: {
             trigger: ".about-paralax",
             start: "top 70%",
             end: "top top",
             scrub: true
         }
     }
 );

  // Create the ScrollTrigger for the program container
  gsap.fromTo(".programm-text span", 
    { opacity: 0 }, 
    { 
        opacity: 1, 
        duration: 1, 
        stagger: 1, 
        scrollTrigger: {
            trigger: ".program-container",
            start: "top 90%",
            end: "top top",
            scrub: true
        }
    }
);