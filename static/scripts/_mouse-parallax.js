

export default function MouseParallax(event) {
  this.querySelectorAll(".confettisection .image-elements-wrapper  img").forEach((shift) => {
    const position = shift.getAttribute("parallaxvalue");
    const x = (window.innerWidth - event.pageX * position) / 90;
    const y = (window.innerHeight - event.pageY * position) / 90;

    shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
}