import { useEffect, useState } from "react";
import api from "../utils/api";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const friendsRes = await api.get("/users/friends");
      setFriends(friendsRes.data || []);

      const reqRes = await api.get("/users/friend-requests");
      setIncoming(reqRes.data?.incomingReqs || []);

      const recRes = await api.get("/users");
      setRecommended(recRes.data || []);
    } catch (err) {
      console.error("Error loading friends data:", err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/users/friend-request/${requestId}/accept`);
      await loadData();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleSend = async (userId) => {
    try {
      await api.post(`/users/friend-request/${userId}`);
      await loadData();
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        friends.map((f) => (
          <div key={f._id} className="mb-2">
            {f.fullName}
          </div>
        ))
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Incoming Requests</h2>
      {incoming.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        incoming.map((req) => (
          <div key={req._id} className="flex items-center gap-4 mb-2">
            <span>{req.sender.fullName}</span>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleAccept(req._id)}
            >
              Accept
            </button>
          </div>
        ))
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">People You May Know</h2>
      {recommended.map((u) => (
        <div key={u._id} className="flex items-center gap-4 mb-2">
          <span>{u.fullName}</span>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => handleSend(u._id)}
          >
            Add Friend
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendsPage;
