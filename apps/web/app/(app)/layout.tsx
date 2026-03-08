import { AppShell } from "../../components/layout/app-shell";
import { sections } from "../../lib/navigation";

export default function WorkspaceLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell navigation={sections}>{children}</AppShell>;
}