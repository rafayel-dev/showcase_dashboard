import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { Row, Col, List, Typography, Input, Avatar, Badge, Empty } from 'antd';
import { UserOutlined, SendOutlined, RobotOutlined, SearchOutlined } from '@ant-design/icons';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import AppSpin from '../../components/common/AppSpin';
import { useGetAllChatsQuery, useSendReplyMutation } from '../../RTK/chat/chatApi';
import { BASE_URL } from '../../RTK/api';

const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
    const { data: initialChats, isLoading: isChatsLoading } = useGetAllChatsQuery();
    const [sendReply, { isLoading: isSending }] = useSendReplyMutation();

    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    const [chats, setChats] = useState<any[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<any>(null);

    // Initial load
    useEffect(() => {
        if (initialChats) {
            setChats(initialChats);
        }
    }, [initialChats]);

    // Socket connection
    useEffect(() => {
        // Use BASE_URL for socket connection
        const socketUrl = BASE_URL;
        socketRef.current = io(socketUrl);

        socketRef.current.on("connect", () => {
            console.log("Connected to socket server");
            socketRef.current.emit("get_online_users");
        });

        socketRef.current.on("online_users_list", (users: string[]) => {
            console.log("Received online users list:", users);
            setOnlineUsers(new Set(users));
        });

        socketRef.current.on("user_status_changed", ({ id, status }: { id: string, status: string }) => {
            console.log("User status changed:", id, status);
            setOnlineUsers(prev => {
                const next = new Set(prev);
                if (status === 'online') next.add(id);
                else next.delete(id);
                return next;
            });
        });

        // Update list when any chat is updated
        socketRef.current.on("chat_list_updated", (updatedChat: any) => {
            setChats(prev => {
                const otherChats = prev.filter(c => c._id !== updatedChat._id);
                return [updatedChat, ...otherChats].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const selectedChat = chats?.find(c => c._id === selectedChatId);

    // Auto-select first chat
    useEffect(() => {
        if (!selectedChatId && chats && chats.length > 0) {
            setSelectedChatId(chats[0]._id);
        }
    }, [isChatsLoading, chats]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChatId, selectedChat?.messages]);


    const handleReply = async () => {
        if (!replyText.trim() || !selectedChatId) return;
        try {
            await sendReply({ id: selectedChatId, text: replyText });
            setReplyText('');
        } catch (error) {
            console.error("Failed to send reply", error);
        }
    };

    // Filter chats
    const filteredChats = chats.filter(chat =>
        chat.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.guestId && chat.guestId.includes(searchTerm))
    );

    const isUserOnline = (chat: any) => {
        const id = chat.user?._id || chat.guestId;
        console.log(`Checking online status for chat ${chat._id} (User: ${chat.user?._id}, Guest: ${chat.guestId}) -> ID: ${id} -> Online: ${onlineUsers.has(id)}`);
        return onlineUsers.has(id);
    };

    if (isChatsLoading) return <AppSpin />;

    return (
        <div className="p-4 md:p-6 bg-gray-50 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-between items-center px-1">
                <div>
                    <Title level={3} className="m-0!">💬 Support Center</Title>
                    <Text type="secondary">Manage customer inquiries and live chats</Text>
                </div>
                <div className="hidden md:block">
                    <Badge count={chats.length} overflowCount={99} color="geekblue">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-600 font-medium">
                            Total Conversations
                        </div>
                    </Badge>
                </div>
            </div>

            <Row gutter={[24, 24]} className="flex-1 overflow-hidden pb-2">
                {/* Chat List Sidebar */}
                <Col xs={24} md={9} lg={7} xl={6} className="h-full flex flex-col">
                    <AppCard className="h-full flex flex-col shadow-lg border-0 bg-white" styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}>
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 bg-white z-10 sticky top-0">
                            <Input
                                prefix={<SearchOutlined className="text-gray-400" />}
                                placeholder="Search conversations..."
                                className="rounded-full bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <List
                                className="p-2"
                                itemLayout="horizontal"
                                dataSource={filteredChats}
                                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No chats found" /> }}
                                renderItem={(chat) => (
                                    <List.Item
                                        className={`cursor-pointer rounded-xl mb-1 p-3 transition-all duration-200 border-l-4 ${selectedChatId === chat._id
                                            ? 'bg-violet-50 border-violet-500 shadow-sm'
                                            : 'border-transparent hover:bg-gray-50 hover:pl-4'
                                            }`}
                                        onClick={() => setSelectedChatId(chat._id)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot color={isUserOnline(chat) ? "green" : "gray"} offset={[-6, 36]}>
                                                    <Avatar
                                                        size={44}
                                                        icon={<UserOutlined />}
                                                        className={`transition-colors ${selectedChatId === chat._id ? 'bg-violet-200 text-violet-600' : 'bg-gray-100 text-gray-500'}`}
                                                    />
                                                </Badge>
                                            }
                                            title={
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <Text strong className="truncate max-w-[120px] text-sm text-gray-800">
                                                        {chat.user?.name || `Guest (${chat.guestId?.substring(0, 4)})`}
                                                    </Text>
                                                    <Text className="text-[10px] text-gray-400 font-normal">
                                                        {new Date(chat.updatedAt || chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </div>
                                            }
                                            description={
                                                <div className="flex justify-between items-center">
                                                    <Text type="secondary" className="truncate max-w-[150px] text-xs">
                                                        {chat.lastMessage || "Start of conversation"}
                                                    </Text>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </AppCard>
                </Col>

                {/* Chat Details Window */}
                <Col xs={24} md={15} lg={17} xl={18} className="h-full hidden md:block">
                    <AppCard className="h-full flex flex-col shadow-lg border-0 overflow-hidden bg-white" styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}>
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                                    <div className="flex items-center gap-4">
                                        <Badge dot color={isUserOnline(selectedChat) ? "green" : "gray"} offset={[-5, 45]}>
                                            <Avatar size="large" icon={<UserOutlined />} className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md border-2 border-white" />
                                        </Badge>
                                        <div>
                                            <Title level={5} className="m-0! text-gray-800">
                                                {selectedChat.user?.name || "Guest User"}
                                            </Title>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${isUserOnline(selectedChat) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                <Text type="secondary" className="text-xs">
                                                    {isUserOnline(selectedChat) ? 'Online' : 'Offline'}
                                                    {selectedChat.user?.email ? ` • ${selectedChat.user.email}` : ` • Guest ID: ${selectedChat.guestId}`}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <AppButton type="text" shape="circle" icon={<SearchOutlined />} />
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fc] flex flex-col gap-5 custom-scrollbar bg-slate-50">
                                    {selectedChat.messages.map((msg: any, idx: number) => {
                                        const isAdmin = msg.sender === 'admin';
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`relative px-5 py-3 shadow-sm text-sm leading-relaxed break-all whitespace-pre-wrap ${isAdmin
                                                            ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-2xl rounded-tr-sm'
                                                            : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'
                                                            }`}
                                                    >
                                                        {msg.text}
                                                    </div>
                                                    <Text className="text-[10px] text-gray-400 mt-1 px-1 select-none">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <div className="relative flex items-center gap-3 max-w-4xl mx-auto w-full">
                                        <Input
                                            size="large"
                                            placeholder="Type your message..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onPressEnter={handleReply}
                                            className="rounded-full pl-6 pr-12 py-3 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-violet-200 focus:shadow-sm transition-all text-sm"
                                        />
                                        <AppButton
                                            type="primary"
                                            size="large"
                                            shape="circle"
                                            icon={<SendOutlined className="ml-0.5" />}
                                            onClick={handleReply}
                                            loading={isSending}
                                            className={`${replyText.trim() ? 'opacity-100 scale-100' : 'opacity-80 scale-95'
                                                } transition-all duration-300 bg-violet-600 hover:bg-violet-700 border-none shadow-lg shadow-violet-200 h-11 w-11 flex-shrink-0 flex items-center justify-center`}
                                        />
                                    </div>
                                    <div className="text-center mt-2">
                                        <Text type="secondary" className="text-[10px]">Press Enter to send</Text>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-gray-50/50">
                                <div className="bg-white p-8 rounded-full shadow-sm mb-6 animate-pulse">
                                    <RobotOutlined className="text-6xl text-violet-200" />
                                </div>
                                <Title level={3} className="text-gray-700 mb-2">Welcome to Support Chat</Title>
                                <Text type="secondary" className="max-w-xs text-center mb-8">
                                    Select a conversation from the list to start messaging with your customers.
                                </Text>
                            </div>
                        )}
                    </AppCard>
                </Col>
            </Row>

            {/* Mobile View Placeholder for Detail - In a real responsive app, we'd toggle views */}
            <div className="md:hidden mt-4 text-center">
                <Text type="secondary" className="text-xs">
                    Please view on desktop for full chat experience
                </Text>
            </div>
        </div>
    );
};

export default ChatPage;
