import { Link } from "react-router";
import LanguageFlag from "./LanguageFlag";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriend } from "../lib/api";
import toast from "react-hot-toast";
import { UserMinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useStreamClient } from "../hooks/useStreamClient";

const FriendCard = ({ friend, unreadCounts = {} }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const chatClient = useStreamClient();

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!chatClient || !friend?._id) return;

    const checkOnlineStatus = async () => {
      try {
        const response = await chatClient.queryUsers({ id: { $in: [friend._id] } });
        if (response.users.length > 0) {
          setIsOnline(response.users[0].online);
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };

    checkOnlineStatus();

    const handleEvent = (event) => {
      if (event.user?.id === friend._id) {
        setIsOnline(event.user.online);
      }
    };

    chatClient.on("user.presence.changed", handleEvent);
    return () => {
      chatClient.off("user.presence.changed", handleEvent);
    };
  }, [chatClient, friend?._id]);

  const channelId = authUser?._id && friend?._id ? [authUser._id, friend._id].sort().join("-") : "";
  const hasUnread = unreadCounts[channelId] > 0;
  
  const { mutate: deleteFriendMutation, isPending } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: () => {
      toast.success("Friend removed successfully");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  });

  const handleDeleteFriend = () => {
    if (confirm(`Are you sure you want to remove ${friend.fullName} from your friends list?`)) {
      deleteFriendMutation(friend._id);
    }
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full">
      <div className="card-body p-4 flex flex-col gap-3">
        {/* USER INFO */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 truncate">
            <div className="avatar size-12">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
            <div className="flex flex-col truncate">
              <h3 className="font-semibold truncate leading-tight">{friend.fullName}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`size-1.5 rounded-full ${isOnline ? "bg-success" : "bg-base-content/20"}`} />
                <span className="text-[10px] font-medium text-base-content/50 leading-none">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteFriend}
            className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/15"
            title="Remove Friend"
            disabled={isPending}
          >
            <UserMinusIcon className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            <LanguageFlag language={friend.nativeLanguage} />
            Language: {friend.nativeLanguage}
          </span>
          {friend.gender && (
            <span className="badge badge-accent text-xs capitalize">
              Gender: {friend.gender}
            </span>
          )}
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full flex items-center justify-center gap-2 mt-auto">
          <span>Message</span>
          {hasUnread && (
            <span className="size-2.5 rounded-full bg-error inline-block animate-pulse" />
          )}
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

