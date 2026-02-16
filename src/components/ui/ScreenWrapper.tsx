import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/colors';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    showHeader?: boolean;
    title?: string;
    showMenu?: boolean;
    onMenuPress?: () => void;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    style,
    showHeader,
    title,
    showMenu,
    onMenuPress
}) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const gradientColors = COLORS.backgroundGradient;

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={[
                styles.contentContainer,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
                style
            ]}>
                {showHeader && (
                    <View style={styles.header}>
                        {showMenu ? (
                            <TouchableOpacity style={styles.backButton} onPress={onMenuPress}>
                                <Ionicons name="menu" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.title}>{title}</Text>
                        <View style={{ width: 40 }} />
                    </View>
                )}
                {children}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 15,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
});

export default ScreenWrapper;
