import Sidebar from "@/components/Sidebar";
import DashboardWrapper from "./DashboardWrapper";
import { ActiveRestauranteProvider } from "@/providers/ActiveRestauranteProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ActiveRestauranteProvider>
      <DashboardWrapper>
        <Sidebar>{children}</Sidebar>
      </DashboardWrapper>
    </ActiveRestauranteProvider>
  );
}
