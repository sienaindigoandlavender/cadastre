import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="label-tiny mb-4">404</p>
      <h1 className="editorial text-4xl mb-4">Not found · Introuvable</h1>
      <p className="text-ink-secondary mb-8">
        The page you requested does not exist. La page demandée n’existe pas.
      </p>
      <div className="flex justify-center gap-4 text-sm">
        <Link href="/en" className="underline">English</Link>
        <Link href="/fr" className="underline">Français</Link>
      </div>
    </div>
  );
}
