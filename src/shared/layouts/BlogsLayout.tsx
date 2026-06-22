import { useLocation, Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout';
import { Footer } from '@/shared/components/layout';
import ContactModalHost from '@/features/marketing/components/ContactModal';
import ConsentBanner from '@/shared/components/ConsentBanner';

const BlogsLayout = () => {
  const { pathname } = useLocation();
  const isBlogPost = pathname.startsWith('/blogs/') && pathname !== '/blogs';

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="w-full flex flex-col bg-bg"
      >
        <Outlet />
      </main>

      {isBlogPost && <Footer />}
      <ContactModalHost />
      <ConsentBanner />
    </>
  );
};

export default BlogsLayout;
