import { useSidebarStore } from "@/store/useSidebarStore";
import { ChevronsLeft } from "lucide-react";

export default function CloseSidebar() {
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
    return (
        <button onClick={toggleSidebar} className="ml-auto">
            <ChevronsLeft className="size-5 text-white" />
        </button>
    )
}