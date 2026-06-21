import { Outlet } from 'react-router-dom';
import { BlogsNavbar } from '@/shared/components/layout';
import { Footer } from '@/shared/components/layout';
import { PublicBottomNav } from '@/shared/components/layout';
import ContactModalHost from '@/features/marketing/components/ContactModal';
import CookieConsent from '@/shared/components/CookieConsent';

const BlogsLayout = () => (
  <>
    <BlogsNavbar />

    <main
      id="main-content"
      className="w-full min-h-screen flex flex-col pt-[80px] pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0"
    >
      <Outlet />
    </main>

    <Footer />
    <PublicBottomNav />
    <ContactModalHost />
    <CookieConsent />
  </>
);

export default BlogsLayout;
