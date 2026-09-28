import Hero from '@/components/landing/hero';
import TechStack from '@/components/landing/tech-stack';
import SponsorsStrip from '@/components/landing/sponsors-strip';
import ComponentsGrid from '@/components/landing/components-gird';
import Features from '@/components/landing/features';
import Testimonial from '@/components/landing/testimonial';
import CTA from '@/components/landing/cta';
import Footer from '@/components/landing/footer';

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <main data-landing-page>
            <Hero />
            <TechStack />
            <SponsorsStrip />
            <ComponentsGrid />
            <Features />
            <Testimonial />
            <CTA />
            <Footer />
        </main>
    )
}
