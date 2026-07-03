import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { useStreamClient } from "../hooks/useStreamClient";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const chatClient = useStreamClient();

  const { data: unreadCounts = {} } = useQuery({
    queryKey: ["unreadCounts", chatClient?.userID],
    queryFn: async () => {
      if (!chatClient) return {};
      const channels = await chatClient.queryChannels({
        type: 'messaging',
        members: { $in: [chatClient.userID] }
      });
      const counts = {};
      channels.forEach(channel => {
        counts[channel.id] = channel.state.unreadCount;
      });
      return counts;
    },
    enabled: !!chatClient,
    refetchInterval: 5000,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const filteredFriends = friends.filter((friend) => {
    const matchesName = friend.fullName.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesLanguage = selectedLanguage === "" || friend.nativeLanguage?.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesName && matchesLanguage;
  });

  const uniqueLanguages = Array.from(
    new Set(friends.map((f) => f.nativeLanguage?.toLowerCase()).filter(Boolean))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm w-full sm:w-48"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="select select-bordered select-sm w-full sm:w-40 capitalize"
            >
              <option value="">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content opacity-75">No friends match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} unreadCounts={unreadCounts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
