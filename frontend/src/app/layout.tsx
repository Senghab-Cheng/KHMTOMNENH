import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
