import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '120px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737373' }}>404</p>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '12px 0 24px' }}>Not found · Introuvable</h1>
        <p>
          <Link href="/en" style={{ marginRight: 16, textDecoration: 'underline' }}>English</Link>
          <Link href="/fr" style={{ textDecoration: 'underline' }}>Français</Link>
        </p>
      </body>
    </html>
  );
}
