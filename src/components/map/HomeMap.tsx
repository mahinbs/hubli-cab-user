import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getNearbyDrivers, subscribeToDrivers } from '../../../supabase/profiles';

interface HomeMapProps {
    region?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    showDrivers?: boolean;
    pickup?: { latitude: number; longitude: number };
    dropoff?: { latitude: number; longitude: number };
}

const HomeMap: React.FC<HomeMapProps> = ({ region, showDrivers = true, pickup, dropoff }) => {
    const [drivers, setDrivers] = useState<any[]>([]);

    useEffect(() => {
        if (!showDrivers) return;

        // 1. Initial fetch of drivers
        const fetchDrivers = async () => {
            try {
                // If we have a region, fetch nearby. Otherwise fetch all online (for demo)
                const lat = region?.latitude || 15.3647; // Hubli
                const lng = region?.longitude || 75.1240;
                const data = await getNearbyDrivers(lat, lng, 10);
                setDrivers(data || []);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchDrivers();

        // 2. Subscribe to driver updates
        const subscription = subscribeToDrivers((payload) => {
            const updatedDriver = payload.new;
            if (payload.eventType === 'UPDATE') {
                setDrivers(prev => {
                    const exists = prev.find(d => d.id === updatedDriver.id);
                    if (exists) {
                        return prev.map(d => d.id === updatedDriver.id ? updatedDriver : d);
                    }
                    return [...prev, updatedDriver];
                });
            } else if (payload.eventType === 'INSERT') {
                setDrivers(prev => [...prev, updatedDriver]);
            } else if (payload.eventType === 'DELETE') {
                setDrivers(prev => prev.filter(d => d.id === payload.old.id));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [showDrivers, region]);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region || {
                    latitude: 15.3647,
                    longitude: 75.1240,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {/* Pickup Marker */}
                {pickup && (
                    <Marker coordinate={pickup} title="Pickup">
                        <View style={styles.pickupMarker}>
                            <View style={styles.pickupInner} />
                        </View>
                    </Marker>
                )}

                {/* Dropoff Marker */}
                {dropoff && (
                    <Marker coordinate={dropoff} title="Dropoff">
                        <Image 
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
                            style={{ width: 40, height: 40 }} 
                        />
                    </Marker>
                )}

                {/* Driver Markers */}
                {showDrivers && drivers.map(driver => {
                    // Check if driver has location coordinates
                    // Depending on how get_nearby_drivers returns data (it might return geometry or lat/lng)
                    const coords = driver.location?.coordinates || [driver.longitude, driver.latitude];
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return null;

                    return (
                        <Marker
                            key={driver.id}
                            coordinate={{
                                latitude: coords[1],
                                longitude: coords[0]
                            }}
                        >
                            <Image
                                source={require('../../../assets/app-logo/hubliCab-logo.png')}
                                style={styles.driverMarker}
                                resizeMode="contain"
                            />
                        </Marker>
                    );
                })}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    driverMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    pickupMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 204, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickupInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFCC00',
    }
});

export default HomeMap;
