import './globals.css';

export const metadata = {
  title: 'IT Leave Portal - EEC',
  description: 'Leave Application System for IT Department',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
