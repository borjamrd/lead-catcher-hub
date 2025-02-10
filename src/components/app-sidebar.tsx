
import { FileText, MessageSquare, CheckSquare, Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const items = [
  {
    title: "Hacer test",
    url: "/dashboard/nuevo-test",
    icon: CheckSquare,
  },
  {
    title: "Chat jurídico",
    url: "/dashboard/chat-juridico",
    icon: MessageSquare,
  },
  {
    title: "Mis apuntes",
    url: "/dashboard/mis-apuntes",
    icon: FileText,
  },
  {
    title: "Recursos",
    url: "/dashboard/mis-recursos",
    icon: Database,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>OpositaPlace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
