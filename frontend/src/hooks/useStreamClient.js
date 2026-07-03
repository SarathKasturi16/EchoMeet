import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "./useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export function useStreamClient() {
  const { authUser } = useAuthUser();
  const [chatClient, setChatClient] = useState(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const connect = async () => {
      try {
        if (client.userID !== authUser._id) {
          if (client.userID) {
            await client.disconnectUser();
          }
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }
        setChatClient(client);
      } catch (err) {
        console.error("Failed to connect stream client", err);
      }
    };

    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData?.token, authUser?._id]);

  return chatClient;
}
