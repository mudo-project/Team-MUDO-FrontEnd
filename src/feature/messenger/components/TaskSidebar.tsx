'use client'

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import ReceivedTaskList from "./ReceivedTaskList";
import SentTaskList from "./SentTaskList";
import { RoomTaskCard } from "../utils";
import { getChatRoomsAction, getCurrentUserIdAction, getTaskCardsAction } from "../actions";
import { useMessengerRealtime, useMessengerRealtimeRoomList } from "./MessengerRealtimeProvider";

export default function TaskSidebar({ view }: { view: "received" | "sent" }) {
    const [query, setQuery] = useState("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [roomTaskCards, setRoomTaskCards] = useState<RoomTaskCard[]>([]);
    const [roomIds, setRoomIds] = useState<number[]>([]);

    const loadTaskCards = useCallback(() => {
        return getChatRoomsAction()
            .then((rooms) => {
                setRoomIds(rooms.map((room) => room.id));
                return Promise.all(
                    rooms.map((room) =>
                        getTaskCardsAction(room.id).then((data) =>
                            data.content.map((card) => ({ roomId: room.id, roomName: room.name, card })),
                        ),
                    ),
                );
            })
            .then((perRoom) => setRoomTaskCards(perRoom.flat()));
    }, []);

    useEffect(() => {
        getCurrentUserIdAction().then(setCurrentUserId);
        void loadTaskCards();
    }, [loadTaskCards]);

    useMessengerRealtimeRoomList(roomIds);
    useMessengerRealtime((event) => {
        if (event.eventType.startsWith("TASK_CARD_")) {
            void loadTaskCards();
        }
    });

    const trimmedQuery = query.trim();
    const filtered = trimmedQuery
        ? roomTaskCards.filter((item) => item.card.content.includes(trimmedQuery))
        : roomTaskCards;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#E7EFE9] p-3">
                <label className="flex h-8 w-full min-w-44 items-center rounded-md border border-[#DCE8DE] bg-white px-3">
                    <Search className="h-3.5 w-3.5 text-[#718096]" strokeWidth={1.8} />
                    <input
                        aria-label="업무 검색"
                        className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="업무 검색"
                        value={query}
                    />
                </label>
            </div>

            {view === "received"
                ? <ReceivedTaskList items={filtered} currentUserId={currentUserId} onChange={loadTaskCards} />
                : <SentTaskList items={filtered} currentUserId={currentUserId} onChange={loadTaskCards} />
            }
        </div>
    );
}
