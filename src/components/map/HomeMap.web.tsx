import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeMap: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map View (Web)</Text>
            <Text style={styles.subtext}>Run on iOS/Android for full map functionality</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F0F0F',
    },
    text: {
        color: '#D4AF37',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#666',
        marginTop: 10,
    }
});

export default HomeMap;
