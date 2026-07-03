import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const { logoutMutation } = useLogout();

    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        refetchInterval: 5000,
    });
    const pendingCount = friendRequests?.incomingReqs?.length || 0;

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            logoutMutation();
        }
    };

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* LOGO - ONLY IN THE CHAT PAGE */}
                    {isChatPage && (
                        <div className="pl-5">
                            <Link to="/" className="flex items-center gap-2.5">
                                <img src="/logo.png" className="size-9 object-contain" alt="EchoMeet Logo" />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                                    EchoMeet
                                </span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to={"/notifications"}>
                            <button className="btn btn-ghost btn-circle relative">
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                                {pendingCount > 0 && (
                                    <span className="badge badge-error badge-xs absolute top-1 right-1 animate-pulse" />
                                )}
                            </button>
                        </Link>
                    </div>

                    {/* TODO */}
                    <ThemeSelector />

                    <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                            {authUser?.profilePic ? (
                                <img src={authUser.profilePic} alt="User Avatar" rel="noreferrer" />
                            ) : (
                                <span className="text-sm font-semibold">{authUser?.fullName?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>

                    {/* Logout button */}
                    <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
                        <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;