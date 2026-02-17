import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // only include weights you need
  display: "swap",
  preload: true
});

export const metadata = {
    title: 'BooksnPDF - Free & Premium PDF Books & eBooks Plateform',
    description: 'Download free & thousands of eBooks across programming, business, design, and more. Secure payment via PhonePe.',
    keywords: 'pdf books, ebooks, free pdf book, free pdfs, online books, digital books, programming books, business books, books pdf, Atomic Habits PDF, Best motivation ebooks PDF, NCERT new Books pdf, bookspdf',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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