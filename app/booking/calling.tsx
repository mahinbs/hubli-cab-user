import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../src/constants/colors';

export default function CallingScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://img.freepik.com/free-photo/handsome-young-man-with-new-haircut_273609-12182.jpg' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>Sergio Ramasis</Text>
                <Text style={styles.status}>Calling...</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="volume-high" size={24} color="#1F2937" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="mic-off" size={24} color="#1F2937" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.endCall]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="call" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="videocam" size={24} color="#1F2937" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        paddingVertical: 100,
    },
    content: {
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
        borderWidth: 4,
        borderColor: COLORS.primary + '30',
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    endCall: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EF4444',
    },
});
