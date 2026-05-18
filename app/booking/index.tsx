import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
    Image,
    Alert,
    Dimensions
} from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import CustomButton from '../../src/components/ui/CustomButton';
import HomeMap from '../../src/components/map/HomeMap';
import { COLORS, SIZES } from '../../src/constants/colors';
import { supabase } from '../../supabase/client';

const { height } = Dimensions.get('window');

type BookingStep = 
    | 'LOCATIONS'        // Twin inputs
    | 'SELECT_VEHICLE'   // Select car/driver
    | 'WAITING'          // Connecting & Live progress (PIN + End Trip)
    | 'PAYMENT'          // Checkout breakdown
    | 'FEEDBACK';        // optional review

export default function DynamicBookingWizard() {
    const router = useRouter();

    // Steps state
    const [step, setStep] = useState<BookingStep>('LOCATIONS');
    const [pickup, setPickup] = useState('Current location');
    const [destination, setDestination] = useState('');
    
    // Drivers & vehicles state
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Ride details state
    const [rideId, setRideId] = useState<string | null>(null);
    const [rideStatus, setRideStatus] = useState<'searching' | 'accepted' | 'ongoing' | 'completed'>('searching');
    const [rideOtp, setRideOtp] = useState('');
    const [timer, setTimer] = useState(300);

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash' | 'card'>('wallet');

    // Review state
    const [stars, setStars] = useState(5);
    const [comment, setComment] = useState('');

    // Fetch drivers from Supabase
    const fetchOnlineDrivers = async () => {
        setLoading(true);
        try {
            const { data: driverData, error } = await supabase
                .from('profiles')
                .select('*, vehicles(*)')
                .eq('role', 'driver');
            
            let fetchedRides = [];
            if (driverData && driverData.length > 0) {
                fetchedRides = driverData.map(driver => {
                    const vehicle = driver.vehicles && driver.vehicles[0];
                    return {
                        id: driver.id,
                        name: vehicle?.model || 'Premium Sedan',
                        type: vehicle?.type || 'sedan',
                        plate_number: vehicle?.plate_number || 'KA-12-AB-3456',
                        color: vehicle?.color || 'White',
                        driver_name: driver.full_name || 'Driver',
                        driver_phone: driver.phone_number || '',
                        estimated_arrival: '4 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    };
                });
            }

            // Fallback: Populate beautiful preloaded drivers if none registered yet
            if (fetchedRides.length === 0) {
                fetchedRides = [
                    {
                        id: 'dummy-driver-1',
                        name: 'Toyota Prius',
                        type: 'hybrid',
                        plate_number: 'KA-03-MX-7777',
                        color: 'Silver',
                        driver_name: 'Amit Kumar',
                        driver_phone: '+91 9900881122',
                        estimated_arrival: '3 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    },
                    {
                        id: 'dummy-driver-2',
                        name: 'Honda Civic',
                        type: 'sedan',
                        plate_number: 'KA-05-ZZ-9999',
                        color: 'Black',
                        driver_name: 'Rajesh Patel',
                        driver_phone: '+91 9888223344',
                        estimated_arrival: '6 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    },
                    {
                        id: 'dummy-driver-3',
                        name: 'Tesla Model S',
                        type: 'electric',
                        plate_number: 'KA-01-EL-8888',
                        color: 'Red',
                        driver_name: 'Vikram Singh',
                        driver_phone: '+91 9555112233',
                        estimated_arrival: '2 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    }
                ];
            }

            setDrivers(fetchedRides);
            if (fetchedRides.length > 0) {
                setSelectedDriver(fetchedRides[0]);
            }
        } catch (err) {
            console.error('Error fetching drivers:', err);
        } finally {
            setLoading(false);
        }
    };

    // Subscriptions & Timers for live tracking simulations
    useEffect(() => {
        if (step !== 'WAITING' || !rideId) return;

        // 1. Simulates dynamic driver approval in 3 seconds
        const acceptTimer = setTimeout(async () => {
            setRideStatus('accepted');
            await supabase
                .from('rides')
                .update({ status: 'accepted' })
                .eq('id', rideId);
        }, 3000);

        // 2. Simulates trip starting in 8 seconds
        const startTimer = setTimeout(async () => {
            setRideStatus('ongoing');
            await supabase
                .from('rides')
                .update({ status: 'ongoing' })
                .eq('id', rideId);
        }, 8000);

        // Real-time Postgres changes subscription
        const channel = supabase
            .channel(`wizard_ride_${rideId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rides', filter: `id=eq.${rideId}` }, (payload) => {
                const updated = payload.new;
                if (updated.status === 'completed') {
                    setStep('PAYMENT');
                }
            })
            .subscribe();

        return () => {
            clearTimeout(acceptTimer);
            clearTimeout(startTimer);
            channel.unsubscribe();
        };
    }, [step, rideId]);

    // Handle Confirm Ride Booking
    const handleConfirmBooking = async () => {
        if (!selectedDriver) return;
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
            setRideOtp(otpCode);

            const { data, error } = await supabase
                .from('rides')
                .insert({
                    rider_id: user?.id || null,
                    driver_id: selectedDriver.id.startsWith('dummy') ? null : selectedDriver.id,
                    vehicle_type_id: selectedDriver.type,
                    pickup_address: pickup,
                    destination_address: destination,
                    pickup_latitude: 18.5204,
                    pickup_longitude: 73.8567,
                    destination_latitude: 18.5204,
                    destination_longitude: 73.8567,
                    status: 'pending',
                    estimated_fare: 150,
                    final_fare: 150,
                    payment_method: 'Wallet',
                    payment_status: 'unpaid',
                    otp: otpCode
                })
                .select()
                .single();
            
            if (error) throw error;
            if (data) {
                setRideId(data.id);
                setRideStatus('searching');
                setStep('WAITING');
            }
        } catch (err: any) {
            console.error('Ride booking failed:', err);
            Alert.alert("Booking Error", err.message || "Failed to create ride request");
        } finally {
            setLoading(false);
        }
    };

    // End Ride Trigger (updates DB status)
    const handleEndRide = async () => {
        if (!rideId) return;
        setLoading(true);
        try {
            await supabase
                .from('rides')
                .update({ status: 'completed', payment_status: 'paid' })
                .eq('id', rideId);
            
            setStep('PAYMENT');
        } catch (err) {
            console.error('Failed ending trip:', err);
        } finally {
            setLoading(false);
        }
    };

    // Complete Payment Flow
    const handleMakePayment = async () => {
        setLoading(true);
        // Simulate debit transaction duration
        setTimeout(() => {
            setLoading(false);
            setStep('FEEDBACK');
        }, 1500);
    };

    // Submit rating & go home
    const handleSubmitFeedback = () => {
        router.replace('/(tabs)/');
    };

    return (
        <ScreenWrapper style={styles.container}>
            {/* Split Screen Layout: Dynamic Map background */}
            <View style={styles.mapContainer}>
                <HomeMap />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/')}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Wizard Dashboard Bottom Container */}
            <View style={styles.dashboardContainer}>
                <View style={styles.dragBar} />

                {step === 'LOCATIONS' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Where are you going?</Text>

                        {/* Location inputs box */}
                        <View style={styles.inputsBox}>
                            <View style={styles.inputRow}>
                                <Ionicons name="location" size={20} color={COLORS.primaryDark} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="From Where (Pickup)"
                                    placeholderTextColor="#9CA3AF"
                                    value={pickup}
                                    onChangeText={setPickup}
                                />
                            </View>
                            <View style={styles.dividerLine} />
                            <View style={styles.inputRow}>
                                <Ionicons name="pin" size={20} color="#EF4444" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Destination Address"
                                    placeholderTextColor="#9CA3AF"
                                    value={destination}
                                    onChangeText={setDestination}
                                    autoFocus
                                />
                            </View>
                        </View>

                        <CustomButton
                            title="Next: Select Car"
                            onPress={() => {
                                if (!destination.trim()) {
                                    Alert.alert("Input Required", "Please enter a destination address");
                                    return;
                                }
                                fetchOnlineDrivers();
                                setStep('SELECT_VEHICLE');
                            }}
                            style={[styles.actionBtn, !destination.trim() && styles.disabledBtn]}
                            disabled={!destination.trim()}
                        />
                    </View>
                )}

                {step === 'SELECT_VEHICLE' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Select online driver</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color={COLORS.primaryDark} style={{ marginVertical: 30 }} />
                        ) : (
                            <FlatList
                                data={drivers}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.cardList}
                                renderItem={({ item }) => {
                                    const isSelected = selectedDriver?.id === item.id;
                                    return (
                                        <TouchableOpacity
                                            style={[styles.driverCard, isSelected && styles.selectedCard]}
                                            onPress={() => setSelectedDriver(item)}
                                            activeOpacity={0.8}
                                        >
                                            <Image source={{ uri: item.image_url }} style={styles.carImg} />
                                            <View style={styles.cardDetails}>
                                                <Text style={styles.carModelText}>{item.name}</Text>
                                                <Text style={styles.driverSubText}>{item.driver_name} • {item.plate_number}</Text>
                                                <Text style={styles.colorText}>Color: {item.color}</Text>
                                            </View>
                                            <View style={styles.fareDetails}>
                                                <Text style={styles.fareText}>₹150</Text>
                                                <Text style={styles.etaText}>{item.estimated_arrival} away</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}

                        <View style={styles.rowActions}>
                            <CustomButton
                                title="Back"
                                variant="outline"
                                onPress={() => setStep('LOCATIONS')}
                                style={styles.halfBtn}
                            />
                            <CustomButton
                                title="Confirm Ride"
                                onPress={handleConfirmBooking}
                                style={styles.halfBtn}
                                isLoading={loading}
                            />
                        </View>
                    </View>
                )}

                {step === 'WAITING' && (
                    <View style={styles.stepContent}>
                        {rideStatus === 'searching' ? (
                            <View style={styles.searchingBox}>
                                <ActivityIndicator size="large" color={COLORS.primaryDark} />
                                <Text style={styles.progressHeader}>Contacting nearby captains...</Text>
                                <Text style={styles.progressSub}>Simulating real-time acceptance</Text>
                            </View>
                        ) : (
                            <View style={styles.activeRideBox}>
                                <View style={styles.trackingHeader}>
                                    <View>
                                        <Text style={styles.trackingTitle}>
                                            {rideStatus === 'accepted' ? 'Captain arriving soon' : 'Heading to destination'}
                                        </Text>
                                        <Text style={styles.trackingStatus}>
                                            {rideStatus === 'accepted' ? 'ETA: 3 mins away' : 'En Route'}
                                        </Text>
                                    </View>
                                    {rideOtp && rideStatus === 'accepted' && (
                                        <View style={styles.otpBox}>
                                            <Text style={styles.otpLabel}>PIN</Text>
                                            <Text style={styles.otpValue}>{rideOtp}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Driver credentials */}
                                <View style={styles.driverInfoBlock}>
                                    <Image
                                        source={{ uri: 'https://img.freepik.com/free-photo/handsome-young-man-with-new-haircut_273609-12182.jpg' }}
                                        style={styles.driverAvatar}
                                    />
                                    <View style={styles.driverMeta}>
                                        <Text style={styles.driverHeaderName}>{selectedDriver?.driver_name}</Text>
                                        <Text style={styles.carHeaderModel}>{selectedDriver?.name} • {selectedDriver?.plate_number}</Text>
                                        <View style={styles.ratingRow}>
                                            <Ionicons name="star" size={14} color={COLORS.primaryDark} />
                                            <Text style={styles.ratingText}>4.9 ★ Rating</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.callIconBtn}>
                                        <Ionicons name="call" size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                <CustomButton
                                    title="End Ride"
                                    onPress={handleEndRide}
                                    style={styles.endRideBtn}
                                    isLoading={loading}
                                />
                            </View>
                        )}
                    </View>
                )}

                {step === 'PAYMENT' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Ride Payment Receipt</Text>
                        
                        {/* Receipt Details card */}
                        <View style={styles.receiptBox}>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Ride Fare ({selectedDriver?.name || 'Standard'})</Text>
                                <Text style={styles.receiptValue}>₹150</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>VAT (5%)</Text>
                                <Text style={styles.receiptValue}>₹8</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Promo Applied</Text>
                                <Text style={styles.promoValue}>-₹10</Text>
                            </View>
                            <View style={styles.hr} />
                            <View style={styles.receiptRow}>
                                <Text style={styles.totalLabel}>Total Charge</Text>
                                <Text style={styles.totalValue}>₹148</Text>
                            </View>
                        </View>

                        {/* Payment Options */}
                        <Text style={styles.sectionHeader}>Select Payment Method</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsScroll}>
                            <TouchableOpacity
                                style={[styles.methodCard, paymentMethod === 'wallet' && styles.selectedMethod]}
                                onPress={() => setPaymentMethod('wallet')}
                            >
                                <Ionicons name="wallet-outline" size={24} color={paymentMethod === 'wallet' ? COLORS.primaryDark : '#9CA3AF'} />
                                <Text style={[styles.methodName, paymentMethod === 'wallet' && styles.selectedMethodText]}>HubliCab Wallet</Text>
                                <Text style={styles.balanceText}>Bal: ₹450</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.methodCard, paymentMethod === 'cash' && styles.selectedMethod]}
                                onPress={() => setPaymentMethod('cash')}
                            >
                                <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cash' ? COLORS.primaryDark : '#9CA3AF'} />
                                <Text style={[styles.methodName, paymentMethod === 'cash' && styles.selectedMethodText]}>Cash</Text>
                                <Text style={styles.balanceText}>Pay driver</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.methodCard, paymentMethod === 'card' && styles.selectedMethod]}
                                onPress={() => setPaymentMethod('card')}
                            >
                                <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? COLORS.primaryDark : '#9CA3AF'} />
                                <Text style={[styles.methodName, paymentMethod === 'card' && styles.selectedMethodText]}>Credit Card</Text>
                                <Text style={styles.balanceText}>**** 8970</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        <CustomButton
                            title={`Confirm & Pay ₹148`}
                            onPress={handleMakePayment}
                            style={styles.payBtn}
                            isLoading={loading}
                        />
                    </View>
                )}

                {step === 'FEEDBACK' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Rate your trip with {selectedDriver?.driver_name}</Text>
                        <Text style={styles.feedbackSub}>Your feedback helps improve our captains' standard</Text>

                        {/* Rating Stars row */}
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <TouchableOpacity key={item} onPress={() => setStars(item)}>
                                    <Ionicons
                                        name={item <= stars ? "star" : "star-outline"}
                                        size={40}
                                        color={COLORS.primaryDark}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.feedbackArea}
                            placeholder="Tell us about your ride (Optional)"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <View style={styles.rowActions}>
                            <CustomButton
                                title="Skip Review"
                                variant="outline"
                                onPress={handleSubmitFeedback}
                                style={styles.halfBtn}
                            />
                            <CustomButton
                                title="Submit Review"
                                onPress={handleSubmitFeedback}
                                style={styles.halfBtn}
                            />
                        </View>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
        minHeight: height * 0.4,
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    dashboardContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: SIZES.padding,
        paddingBottom: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 15,
        marginTop: -30,
    },
    dragBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 15,
    },
    stepContent: {
        width: '100%',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 20,
    },
    inputsBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 8,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        outlineStyle: 'none',
    } as any,
    dividerLine: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 10,
    },
    actionBtn: {
        width: '100%',
        height: 56,
        borderRadius: 12,
    },
    disabledBtn: {
        backgroundColor: '#E5E7EB',
        opacity: 0.5,
    },
    cardList: {
        maxHeight: 220,
        marginBottom: 20,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 10,
    },
    selectedCard: {
        borderColor: COLORS.primaryDark,
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
    },
    carImg: {
        width: 80,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    cardDetails: {
        flex: 1,
    },
    carModelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    driverSubText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    colorText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    fareDetails: {
        alignItems: 'flex-end',
    },
    fareText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    etaText: {
        fontSize: 11,
        color: COLORS.primaryDark,
        fontWeight: '600',
        marginTop: 4,
    },
    rowActions: {
        flexDirection: 'row',
        gap: 15,
    },
    halfBtn: {
        flex: 1,
        height: 52,
    },
    searchingBox: {
        alignItems: 'center',
        paddingVertical: 35,
    },
    progressHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 15,
    },
    progressSub: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    activeRideBox: {
        width: '100%',
    },
    trackingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    trackingTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    trackingStatus: {
        fontSize: 12,
        color: COLORS.primaryDark,
        fontWeight: '600',
        marginTop: 4,
    },
    otpBox: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: 55,
        height: 48,
    },
    otpLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
    },
    otpValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
        marginTop: 2,
    },
    driverInfoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    driverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    driverMeta: {
        flex: 1,
    },
    driverHeaderName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    carHeaderModel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    ratingText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    callIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    endRideBtn: {
        width: '100%',
        backgroundColor: COLORS.primaryDark,
        height: 52,
    },
    receiptBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 20,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    receiptLabel: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    receiptValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    promoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    hr: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    paymentMethodsScroll: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    methodCard: {
        width: 120,
        height: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedMethod: {
        borderColor: COLORS.primaryDark,
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
    },
    methodName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 6,
        textAlign: 'center',
    },
    selectedMethodText: {
        color: COLORS.primaryDark,
    },
    balanceText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 2,
    },
    payBtn: {
        width: '100%',
        height: 56,
    },
    feedbackSub: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 20,
        lineHeight: 18,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 25,
    },
    feedbackArea: {
        width: '100%',
        height: 80,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 12,
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 30,
        outlineStyle: 'none',
    } as any,
});
