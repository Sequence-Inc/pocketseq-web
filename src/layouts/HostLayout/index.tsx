import { useState } from "react";
import SideBar from "src/layouts/SideBar";
import Toolbar from "../Toolbar";

export default function HostLayout({ userSession, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <SideBar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                userSession={userSession}
            />
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Toolbar setSidebarOpen={setSidebarOpen} />
                <main className="relative flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    );
}
