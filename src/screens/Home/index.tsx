import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native'
import Colors from '../../constants/Colors';
import ButtonCrypto from '../../components/ButtonCrypto';
const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
            contentContainerStyle={{alignItems: 'center'}}>
                <Image 
                style={styles.image}
                source={require('../../../assets/images/home.png')}
                 />
                <Text style={styles.title}>Welcome to CoinTrace!</Text>
                <Text style={styles.subTitle}>Make your first investment today</Text>
                <ButtonCrypto title="Get started" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        padding: 20
    },
    image: {
        height: 250,
        width: 150,
        marginTop: 40
    },
    title: {
        fontSize: 21,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: .5
    },
    subTitle: {
        fontSize: 17,
        
        marginBottom: 24,
        color: Colors.subtitle
    },
})

export default Home