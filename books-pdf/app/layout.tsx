import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // only include weights you need
  display: "swap",
  preload: true
});
const poppins = Poppins({ 
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-poppins',
    preload: true,
});

type RootLayoutProps = {
  children: ReactNode;
};
export const metadata = {
    title: 'BookMarket - Free & Premium PDF Books & eBooks Plateform',
    description: 'Download free & thousands of eBooks across programming, business, design, and more. Secure payment via PhonePe.',
    keywords: 'pdf books, ebooks, online books, digital books, programming books, business books',
};

export default function RootLayout({ children }: { children: RootLayoutProps }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                    {/* Toast Notifications */}
                    <Toaster 
                        position="top-right"
                        reverseOrder={false}
                        gutter={8}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}