
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
import { useOppositionStore } from "@/stores/useOppositionStore";
import {
  Bell,
  BookOpen,
  CheckSquare,
  Database,
  LayoutDashboard,
  Map,
  MessageSquare
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import StudyCycleSelector from "./StudyCycleSelector";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Roadmap",
    url: "/dashboard/roadmap",
    icon: Map,
  },
  {
    title: "Tests",
    url: "/dashboard/tests",
    icon: CheckSquare,
  },
  {
    title: "Chat jurídico",
    url: "/dashboard/chat-juridico",
    icon: MessageSquare,
  },
  // {
  //   title: "Mis apuntes",
  //   url: "/dashboard/mis-apuntes",
  //   icon: FileText,
  // },
  {
    title: "Recursos",
    url: "/dashboard/mis-recursos",
    icon: Database,
  },
  {
    title: "Mis notificaciones",
    url: "/dashboard/mis-notificaciones",
    icon: Bell,
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { data: oppositionList = [] } = useActiveOpposition();
  
  const { currentSelectedOppositionId, setCurrentOppositionId } = useOppositionStore();
  
  useEffect(() => {
    if (oppositionList.length > 0 && !currentSelectedOppositionId) {
      setCurrentOppositionId(oppositionList[0].id);
    }
  }, [oppositionList, currentSelectedOppositionId, setCurrentOppositionId]);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <div className="mb-6">
          {oppositionList.length > 0 ? (
            <div>
            <Select
              value={currentSelectedOppositionId ?? ""}
              onValueChange={setCurrentOppositionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una oposición" />
              </SelectTrigger>
              <SelectContent>
                {oppositionList.map((oppo) => (
                  <SelectItem key={oppo.id} value={oppo.id}>
                    {oppo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <StudyCycleSelector oppositionId={currentSelectedOppositionId}  />
              </div>
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
