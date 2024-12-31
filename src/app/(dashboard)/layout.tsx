export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-8 space-y-8">
      {children}
    </main>
  );
}
