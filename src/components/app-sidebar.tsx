
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useActiveOpposition } from "@/hooks/use-active-opposition";
import {
  Bell,
  BookOpen,
  CheckSquare,
  Database,
  FileText,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
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
  {
    title: "Mis notificaciones",
    url: "/dashboard/mis-notificaciones",
    icon: Bell,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { data: opposition } = useActiveOpposition();

  const [selectedOppositionId, setSelectedOppositionId] = useState<string | null>(null);

  useEffect(() => {
    if (opposition?.id) {
      setSelectedOppositionId(opposition.id);
    }
  }, [opposition]);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        {/* Oppositions Selector */}
        <div className="mb-6">
          {opposition ? (
            <Select value={selectedOppositionId ?? ""} disabled>
              <SelectTrigger className="w-full sm:w-auto bg-muted border-muted-foreground/10 text-foreground h-11 text-base rounded-lg">
                <SelectValue placeholder="Selecciona una oposición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={opposition.id} value={opposition.id}>
                  {opposition.name}
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/dashboard/oposiciones">Agrega tu primera oposición</Link>
            </Button>
          )}
        </div>

        <nav>
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive =
                location.pathname === item.url ||
                (item.url !== "/dashboard" &&
                  location.pathname.startsWith(item.url));

              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            
            <li>
              <Separator className="my-2" />
            </li>
            
            <li>
              <Link
                to="/dashboard/oposiciones"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === "/dashboard/oposiciones"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Oposiciones</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
