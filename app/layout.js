import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export const metadata = {
  title: 'CMMC Review — The Independent CMMC Compliance Hub',
  description: 'Free CMMC education, readiness assessments, and a verified partner directory for defense contractors. Learn the requirements, check your posture, find compliance help.',
  keywords: 'CMMC, CMMC compliance, CMMC Level 2, NIST 800-171, defense contractor cybersecurity, CMMC readiness, CMMC assessment, find CMMC MSP, CMMC certification',
  openGraph: {
    title: 'CMMC Review — CMMC Compliance, Finally Clear',
    description: 'The free, independent resource for defense contractors navigating CMMC certification.',
    url: 'https://cmmcreview.org',
    siteName: 'CMMC Review',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
