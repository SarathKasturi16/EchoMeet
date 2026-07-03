import express from "express";
import { getMyFriends, getRecommendedUsers, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests, getOutgoingFriendRequests, deleteFriend } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);

router.delete("/friends/:id", deleteFriend);

router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.put("/friend-request/:id/decline", declineFriendRequest);

router.get("/friend-requests", getFriendRequests);

router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;