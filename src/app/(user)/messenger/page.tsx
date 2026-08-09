import { redirect } from "next/navigation";
import { getChatRoomsAction } from "@/feature/messenger/actions";

export default async function MessengerPage() {
    const rooms = await getChatRoomsAction();

    if (rooms.length === 0) {
        return (
            <section className="flex flex-1 items-center justify-center text-[12px] text-[#94A3B8]">
                참여 중인 채팅방이 없습니다
            </section>
        );
    }

    redirect(`/messenger/${rooms[0].id}`);
}
