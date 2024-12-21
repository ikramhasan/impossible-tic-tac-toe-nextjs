import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Play } from "next/font/google";

const play = Play({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Impossible Tic Tac Toe",
  description: "A game of Tic Tac Toe that is impossible to win.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={play.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
