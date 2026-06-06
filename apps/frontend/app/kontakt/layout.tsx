export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        main > div { max-width: 100% !important; }
      `}</style>
      {children}
    </>
  );
}
