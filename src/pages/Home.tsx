import Navbar from '../component/Navbar';
import Hero from '../component/Hero';
import Footer from '../component/Footer';

function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-red-100'>
      <Navbar />

      <main className='flex flex-1 items-center justify-center'>
        <Hero />
      </main>

      <Footer />
    </div>
  )
}

export default Home;