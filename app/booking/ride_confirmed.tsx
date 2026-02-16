import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeMap from '../../src/components/map/HomeMap';
import { COLORS } from '../../src/constants/colors';

const { height } = Dimensions.get('window');

type RideStatus = 'ARRIVING' | 'ARRIVED' | 'STARTED' | 'COMPLETED';

export default function LiveTrackingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState<RideStatus>('ARRIVING');
    const [timer, setTimer] = useState(215); // 3:35 in seconds

    useEffect(() => {
        let statusTimer: NodeJS.Timeout;

        if (status === 'ARRIVING') {
            statusTimer = setTimeout(() => setStatus('ARRIVED'), 5000);
        } else if (status === 'ARRIVED') {
            statusTimer = setTimeout(() => setStatus('STARTED'), 5000);
        } else if (status === 'STARTED') {
            statusTimer = setTimeout(() => {
                setStatus('COMPLETED');
                router.replace('/booking/payment-summary');
            }, 5000);
        }

        return () => clearTimeout(statusTimer);
    }, [status]);

    useEffect(() => {
        if (status === 'ARRIVING' && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [status, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCancel = () => {
        router.push('/booking/cancel-ride');
    };

    const getStatusText = () => {
        switch (status) {
            case 'ARRIVING': return `Your driver is coming in ${formatTime(timer)}`;
            case 'ARRIVED': return "Your driver has arrived!";
            case 'STARTED': return "Ride in progress to destination...";
            case 'COMPLETED': return "Ride completed!";
            default: return "";
        }
    };

    const getDistanceText = () => {
        switch (status) {
            case 'ARRIVING': return "800m (5mins away)";
            case 'ARRIVED': return "Driver is here";
            case 'STARTED': return "En route to destination";
            case 'COMPLETED': return "Arrived at destination";
            default: return "";
        }
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <View style={styles.mapContainer}>
                <HomeMap />

                {/* Header Actions */}
                <View style={[styles.header, { top: insets.top + 10 }]}>
                    <TouchableOpacity style={styles.topButton} onPress={() => router.replace('/(tabs)')}>
                        <Ionicons name="menu" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <View style={styles.topRightActions}>
                        <TouchableOpacity style={styles.topButton}>
                            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topButton}>
                            <Ionicons name="search-outline" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Arrival Badge */}
                <View style={styles.arrivalBadge}>
                    <Text style={styles.arrivalText}>{getStatusText()}</Text>
                </View>
            </View>

            {/* Bottom Sheet Card */}
            <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.driverInfo}>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/handsome-young-man-with-new-haircut_273609-12182.jpg' }}
                        style={styles.driverAvatar}
                    />
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>Sergio Ramasis</Text>
                        <Text style={styles.carModel}>{getDistanceText()}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color={COLORS.primaryDark} />
                            <Text style={styles.ratingText}>4.9 (531 reviews)</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg' }}
                        style={styles.carIcon}
                    />
                </View>

                <View style={styles.paymentMethod}>
                    <View>
                        <Text style={styles.paymentLabel}>Payment method</Text>
                        <View style={styles.methodRow}>
                            <Ionicons name="card" size={20} color="#1F2937" />
                            <Text style={styles.methodText}>**** **** **** 8970</Text>
                        </View>
                    </View>
                    <Text style={styles.price}>$220.00</Text>
                </View>

                <View style={styles.bottomActions}>
                    <TouchableOpacity style={styles.iconAction} onPress={() => router.push('/booking/chat')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.primaryDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconAction} onPress={() => router.push('/booking/calling')}>
                        <Ionicons name="call-outline" size={22} color={COLORS.primaryDark} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.cancelButton, (status === 'STARTED' || status === 'COMPLETED') && styles.disabledButton]}
                        onPress={handleCancel}
                        disabled={status === 'STARTED' || status === 'COMPLETED'}
                    >
                        <Text style={styles.cancelText}>Cancel Ride</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    topRightActions: {
        flexDirection: 'row',
        gap: 12,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    arrivalBadge: {
        position: 'absolute',
        bottom: 280,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    arrivalText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    carModel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#6B7280',
    },
    carIcon: {
        width: 80,
        height: 50,
    },
    paymentMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 24,
    },
    paymentLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    methodText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconAction: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    disabledButton: {
        backgroundColor: '#E5E7EB',
        opacity: 0.5,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
});
