import { Image, StyleSheet, Platform, Button, Alert, TouchableOpacity, Text, View, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCameraPermissions } from 'expo-camera';
import { Link, Stack } from "expo-router"

export default function HomeScreen() {

  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Страница настройки</ThemedText>
        
        <HelloWave />
      </ThemedView>
  
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Шаг 1: разрешить камеру</ThemedText>
        <Pressable onPress={requestPermission}> 
          <Text style={styles.roundButton1}>Разрешение на вкл. камеры</Text>
        </Pressable>
        <ThemedText type="subtitle">Шаг 2: Сканировать</ThemedText>
        <Link href={"/scanner"} asChild>
            <Pressable disabled={!isPermissionGranted}>
              <Text style={[
                styles.roundButton1,
                {opacity: !isPermissionGranted ? 0.5 : 1}
              ]}>Сканировать штрих-код</Text>
            </Pressable>
        </Link>
      </ThemedView>
 
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  roundButton1: {
    width: 300,
    textAlign: "center",
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#67bbee',
    textAlignVertical: 'center',
    color: "white",
    fontSize: 18, 
    fontWeight: 'bold',
    borderWidth: 2, 
     borderColor: '#abcdef', 
  },
});
