import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const MENU_ITEMS = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', route: '/profile/edit' },
    { id: '2', title: 'Address', icon: 'location-outline', route: '/profile/address' },
    { id: '3', title: 'History', icon: 'time-outline', route: '/profile/history' },
    { id: '4', title: 'Complain', icon: 'chatbox-ellipses-outline', route: '/profile/complain' },
    { id: '5', title: 'Referral', icon: 'share-social-outline', route: '' },
    { id: '6', title: 'About Us', icon: 'information-circle-outline', route: '' },
    { id: '7', title: 'Settings', icon: 'settings-outline', route: '' },
    { id: '8', title: 'Help and Support', icon: 'help-circle-outline', route: '' },
    { id: '9', title: 'Logout', icon: 'log-out-outline', route: '/auth/signin' },
];

export default function AccountScreen() {
    const router = useRouter();

    const handlePress = (item: any) => {
        if (item.route) {
            if (item.id === '9') {
                router.replace(item.route);
            } else {
                router.push(item.route);
            }
        }
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Profile">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Nate Samson</Text>
                        <Text style={styles.userEmail}>nate@email.com</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => handlePress(item)}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={22} color="#1F2937" />
                                <Text style={styles.menuText}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: '#F9FAFB',
        marginBottom: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    menuContainer: {
        paddingHorizontal: SIZES.padding,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
});
