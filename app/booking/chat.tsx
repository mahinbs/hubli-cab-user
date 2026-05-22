import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';
import { getMessages, sendMessage, subscribeToMessages } from '../../supabase/chat';
import { useAuthStore } from '../../store/authStore';

export default function ChatScreen() {
    const router = useRouter();
    const { rideId } = useLocalSearchParams();
    const { session } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (!rideId) return;

        fetchMessages();

        const subscription = subscribeToMessages(rideId as string, (payload) => {
            setMessages((prev) => [...prev, payload.new]);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [rideId]);

    const fetchMessages = async () => {
        try {
            const data = await getMessages(rideId as string);
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !session?.user || !rideId) return;
        try {
            await sendMessage(rideId as string, session.user.id, inputText.trim());
            setInputText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Chat">
            <View style={styles.driverBar}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatarMini} />
                    <View>
                        <Text style={styles.driverNameMini}>Captain</Text>
                        <Text style={styles.statusMini}>Online</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                flex={1}
            >
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatContent}
                    renderItem={({ item }) => {
                        const isUser = session?.user?.id === item.sender_id;
                        return (
                            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.driverBubble]}>
                                <Text style={[styles.messageText, isUser ? styles.userText : styles.driverText]}>
                                    {item.message}
                                </Text>
                                <Text style={styles.messageTime}>
                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        );
                    }}
                />

                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add" size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message"
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    driverBar: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarMini: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E5E7EB',
    },
    driverNameMini: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    statusMini: {
        fontSize: 12,
        color: COLORS.success,
    },
    chatContent: {
        padding: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    driverBubble: {
        backgroundColor: '#F3F4F6',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    driverText: {
        color: '#1F2937',
    },
    userText: {
        color: '#1F2937',
        fontWeight: '500',
    },
    messageTime: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    attachButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: '#F9FAFB',
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
