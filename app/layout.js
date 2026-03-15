export const metadata = {
  title: 'GEPCO Bill Checker',
  description: 'View real official GEPCO duplicate bills instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
