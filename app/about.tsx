import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../src/components/ui/CustomButton';
import ScreenWrapper from '../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../src/constants/colors';

export default function AboutScreen() {
    return (
        <ScreenWrapper showHeader title="About Us" showMenu={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png' }} // Placeholder taxi icon
                        style={styles.logo}
                    />
                    <Text style={styles.appName}>RideGO</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.text}>
                        RideGO is committed to providing safe, reliable, and affordable transportation solutions.
                        We believe in connecting people and places with ease and comfort. Our fleet of modern vehicles
                        and professional drivers ensure a top-notch experience for every journey.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.text}>
                        Email: support@ridego.com{'\n'}
                        Phone: +1 (555) 123-4567{'\n'}
                        Address: 123 Taxi Lane, Cityville, ST 12345
                    </Text>
                </View>

                <CustomButton
                    title="Rate Us on App Store"
                    onPress={() => { }}
                    style={styles.button}
                />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    version: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 5,
    },
    section: {
        marginBottom: 25,
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: SIZES.radius,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    button: {
        marginTop: 10,
    },
});
