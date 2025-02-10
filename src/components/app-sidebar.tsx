
import { FileText, MessageSquare, CheckSquare, Database } from "lucide-react";
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
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">OpositaPlace</h2>
        <nav>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
