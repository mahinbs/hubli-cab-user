import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E5E7EB',
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: COLORS.primaryDark,
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    title: 'Favourite',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="offer"
                options={{
                    title: 'Offer',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pricetag" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
