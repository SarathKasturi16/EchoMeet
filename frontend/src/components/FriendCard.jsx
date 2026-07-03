import { Link } from "react-router";
import LanguageFlag from "./LanguageFlag";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriend } from "../lib/api";
import toast from "react-hot-toast";
import { UserMinusIcon } from "lucide-react";

const FriendCard = ({ friend, unreadCounts = {} }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

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
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
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

