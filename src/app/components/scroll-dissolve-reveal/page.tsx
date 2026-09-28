import { ComponentShowcase } from "@/components/ui/component-showcase";
import ScrollDissolveRevealDemo from "@/components/docs/scroll-dissolve-reveal-demo";

export default function Page() {
  return (
    <div className="w-full max-w-4xl">
      <ComponentShowcase 
        componentName="scroll-dissolve-reveal"
        title="Scroll Dissolve Reveal"
        description="A beautiful image dissolve effect driven by scrolling using React Three Fiber and Shaders."
      >
        <ScrollDissolveRevealDemo />
      </ComponentShowcase>
    </div>
  );
}
