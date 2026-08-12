import ChatListItem from "./ChatListItem";

export default function ChatList({ rooms }: { rooms: MessengerRoomListItemData[] }) {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto" aria-label="채팅방">
            {rooms.map((room) => (
                <ChatListItem room={room} key={room.id} />
            ))}
        </div>
    );
}
