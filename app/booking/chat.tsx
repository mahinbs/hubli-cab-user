import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const MOCK_MESSAGES = [
    { id: '1', text: 'Good Evening!', time: '9:20 pm', isUser: false },
    { id: '2', text: 'Welcome to Car2go Customer Service', time: '9:25 pm', isUser: false },
    { id: '3', text: 'Welcome to Car2go Customer Service', time: '9:29 pm', isUser: false },
];

export default function ChatScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');

    return (
        <ScreenWrapper style={styles.container} showHeader title="Chat">
            <View style={styles.driverBar}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatarMini} />
                    <View>
                        <Text style={styles.driverNameMini}>Sergio Ramasis</Text>
                        <Text style={styles.statusMini}>Online</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={MOCK_MESSAGES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatContent}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.driverBubble]}>
                        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.driverText]}>
                            {item.text}
                        </Text>
                        <Text style={styles.messageTime}>{item.time}</Text>
                    </View>
                )}
            />

            <View style={styles.inputBar}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add" size={24} color="#6B7280" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
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
