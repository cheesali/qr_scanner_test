import { Camera, CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {Clipboard} from 'react-native';


import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { addDoc, collection, DocumentData, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const testFirebaseConnection = async () => {
    try {
        // Test Firestore connection by reading Lots collection
        const lotsRef = collection(FIREBASE_DB, 'Lots');
        const snapshot = await getDocs(lotsRef);
        console.log('Successfully connected to Firestore!');
        console.log('Number of documents in Lots:', snapshot.size);
        snapshot.forEach(doc => {
            console.log('Document data:', doc.data());
        });
        return true;
    } catch (error) {
        console.log('Firebase connection error:', error);
        return false;
    }
};
import { useEffect, useRef, useState } from "react";

const Scanner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setIsProcessing(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data && !isProcessing) {
      setIsProcessing(true);
      try {
        const [id, didCode, part_number, qty, lotId, insertion_datetime, insertion_userid, update_datetime, update_user_id, warehouse] = data.split(',');

        // Check if didCode already exists
        const lotsRef = collection(FIREBASE_DB, 'Lots');
        const q = query(lotsRef, where("DIDCODE", "==", didCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Data exists for this didCode
          let existingData: DocumentData[] = [];
          querySnapshot.forEach(doc => {
            existingData.push(doc.data());
          });
          Alert.alert(
            "Existing Data Found",
            `Найдено ${existingData.length} записей с данным DIDCODE: ${didCode}`,
            [
              {
                text: "View Details",
                onPress: () => {
                  const detailsText = existingData.map((data: DocumentData) => 
                    `DIDCODE: ${data.DIDCODE}\nPart Number: ${data.PART_NUMBER}\nQty: ${data.QTY}\nLot ID: ${data.LOT_ID}\nWarehouse: ${data.WAREHOUSE}`
                  ).join('\n\n');
                  
                  Alert.alert(
                    "Record Details",
                    detailsText,
                    [
                      {
                        text: "Copy",
                        onPress: () => Clipboard.setString(detailsText)
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          setTimeout(() => {
                            router.push({
                              pathname: "/explore",
                              params: {
                                didCode,
                                lotId,
                                scannedData: data
                              }
                            });
                          }, 2000);
                        }
                      }
                    ]
                  );
                }              }
            ]
          );
        } else {
          // No existing data, save new record
          await addDoc(lotsRef, {
            ID: id,
            DIDCODE: didCode,
            PART_NUMBER: part_number,
            QTY: qty,
            LOT_ID: lotId,
            INSERTION_DATETIME: insertion_datetime,
            INSERTION_USERID: insertion_userid,
            UPDATE_DATETIME: update_datetime,
            UPDATE_USER_ID: update_user_id,
            WAREHOUSE: warehouse,
            rawQrText: data,        
          });

          Alert.alert(
            "Success",
            "New record saved successfully",
            [
              {
                text: "OK",
                onPress: () => {
                  setTimeout(() => {
                    router.push({
                      pathname: "/explore",
                      params: {
                        didCode,
                        lotId,
                        scannedData: data
                      }
                    });
                  }, 2000);
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error saving scan:', error);
        Alert.alert("Error", "Failed to process scan data");
      } finally {
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      }
    }
  };
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scanner",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}></View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
});

export default Scanner;