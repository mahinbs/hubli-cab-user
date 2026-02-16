import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}


const MENU_ITEMS = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', route: '/profile/edit' },
    { id: '2', title: 'Address', icon: 'location-outline', route: '/profile/address' },
    { id: '3', title: 'History', icon: 'time-outline', route: '/profile/history' },
    { id: '4', title: 'Complain', icon: 'chatbox-ellipses-outline', route: '/profile/complain' },
    { id: '5', title: 'Referral', icon: 'share-social-outline', route: '' }, // Keep as is if no page requested
    { id: '6', title: 'About Us', icon: 'information-circle-outline', route: '/about' },
    { id: '7', title: 'Settings', icon: 'settings-outline', route: '/settings' },
    { id: '8', title: 'Help and Support', icon: 'help-circle-outline', route: '/support' },
    { id: '9', title: 'Logout', icon: 'log-out-outline', route: '/auth/login' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    React.useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const handlePress = (route: string) => {
        onClose();
        if (route) {
            if (route === '/auth/login') {
                // Perform any logout logic here (e.g., clearing tokens)
                // For now, just navigate to login and replace history
                router.replace(route as any);
            } else {
                router.push(route as any);
            }
        }
    };

    return (
        <View
            style={[styles.overlay, !isOpen && { height: 0, width: 0 }]}
            pointerEvents={isOpen ? 'auto' : 'none'}
        >
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
            <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>Nate Samson</Text>
                    <Text style={styles.email}>nate@email.com</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                <View style={styles.menu}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => handlePress(item.route)}
                        >
                            <Ionicons name={item.icon as any} size={22} color="#1F2937" />
                            <Text style={styles.menuText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 25,
        marginBottom: 30,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 20,
    },
    menu: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 15,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
});

export default Sidebar;
