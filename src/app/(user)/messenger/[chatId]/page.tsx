import ChatRoom from "@/feature/messenger/components/ChatRoom";

interface paramsProps {
    params: Promise<{
        chatId: string;
    }>
}

export default async function MessengerChatPage({ params }: paramsProps) {
    const { chatId } = await params;

    return <ChatRoom roomId={Number(chatId)} />;
}
