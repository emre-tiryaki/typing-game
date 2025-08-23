// Animation and Effects utilities(gpt komple)
export class AnimationManager {
    static addFadeIn(element) {
        element.classList.add("fade-in");
        setTimeout(() => element.classList.remove("fade-in"), 500);
    }

    static addSlideUp(element) {
        element.classList.add("slide-up");
        setTimeout(() => element.classList.remove("slide-up"), 300);
    }

    static smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}
