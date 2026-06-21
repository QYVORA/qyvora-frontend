import { useLocation, Outlet } from 'react-router-dom';
import { BlogsNavbar } from '@/shared/components/layout';
import { Footer } from '@/shared/components/layout';
import { PublicBottomNav } from '@/shared/components/layout';
import ContactModalHost from '@/features/marketing/components/ContactModal';
import ConsentBanner from '@/shared/components/ConsentBanner';

const BlogsLayout = () => {
  const { pathname } = useLocation();
  const isBlogPost = pathname.startsWith('/blogs/') && pathname !== '/blogs';

  return (
    <>
      {!isBlogPost && <BlogsNavbar />}

      <main
        id="main-content"
        className={`w-full min-h-screen flex flex-col ${isBlogPost ? 'pt-0' : 'pt-[80px] pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0'}`}
      >
        <Outlet />
      </main>

      <Footer />
      <PublicBottomNav />
      <ContactModalHost />
      <ConsentBanner />
    </>
  );
};

export default BlogsLayout;
