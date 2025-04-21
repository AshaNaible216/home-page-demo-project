import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { PersonalizationProvider } from "../context/PersonalizationContext";
import ThemeManager from "../components/ThemeManager";
import AccessibilityProvider from "../components/AccessibilityProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naible - Personal Intelligence",
  description:
    "A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.",
  openGraph: {
    title: "Naible - Personal Intelligence",
    description:
      "A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naible - Personal Intelligence",
    description:
      "A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <AuthProvider>
          <PersonalizationProvider>
            <AccessibilityProvider>
              <ThemeManager>{children}</ThemeManager>
            </AccessibilityProvider>
          </PersonalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
