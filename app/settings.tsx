import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../src/constants/colors';

const SettingItem = ({
    icon,
    title,
    value,
    onPress,
    type = 'link'
}: {
    icon: string;
    title: string;
    value?: boolean | string;
    onPress?: () => void;
    type?: 'link' | 'toggle' | 'info';
}) => (
    <TouchableOpacity
        style={styles.item}
        onPress={type === 'toggle' ? undefined : onPress}
        disabled={type === 'toggle'}
    >
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={20} color={COLORS.primaryDark} />
            </View>
            <Text style={styles.itemTitle}>{title}</Text>
        </View>

        {type === 'toggle' && (
            <Switch
                trackColor={{ false: '#767577', true: COLORS.primary }}
                thumbColor={value ? '#fcfcfc' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onPress as any}
                value={value as boolean}
            />
        )}

        {type === 'link' && (
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        )}

        {type === 'info' && (
            <Text style={styles.infoText}>{value as string}</Text>
        )}
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);

    return (
        <ScreenWrapper showHeader title="Settings" showMenu={false}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionHeader}>General</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="language-outline"
                        title="Language"
                        value="English"
                        type="info"
                    />
                    <SettingItem
                        icon="moon-outline"
                        title="Dark Mode"
                        type="toggle"
                        value={false}
                        onPress={() => { }}
                    />
                </View>

                <Text style={styles.sectionHeader}>Notifications</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="notifications-outline"
                        title="Push Notifications"
                        type="toggle"
                        value={notifications}
                        onPress={() => setNotifications(!notifications)}
                    />
                    <SettingItem
                        icon="location-outline"
                        title="Location Services"
                        type="toggle"
                        value={location}
                        onPress={() => setLocation(!location)}
                    />
                </View>

                <Text style={styles.sectionHeader}>Security</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="lock-closed-outline"
                        title="Change Password"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="shield-checkmark-outline"
                        title="Privacy Policy"
                        onPress={() => { }}
                    />
                </View>

                <TouchableOpacity style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        marginBottom: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FEE2E2', // Light red
        borderRadius: SIZES.radius,
    },
    deleteText: {
        color: COLORS.error,
        fontWeight: '600',
        marginLeft: 8,
    },
});
