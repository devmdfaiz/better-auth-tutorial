export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full min-h-screen items-center justify-center">
      {children}
    </main>
  );
}
