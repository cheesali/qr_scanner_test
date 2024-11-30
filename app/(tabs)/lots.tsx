import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';

interface LotItem {
  id: string;
  didCode: string;
  lotId: string;
  timestamp: any;
  rawQrText: string;
  part_number: string;
  qty: number;
  insertion_datetime: any;
  insertion_userid: string;
  update_datetime: any;
  update_user_id: string;
  warehouse: string;
}

export default function LotsScreen() {
  const [lots, setLots] = useState<LotItem[]>([]);
  const params = useLocalSearchParams();
  const scannedDidCode = params.didCode as string;
  const scannedLotId = params.lotId as string;

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const lotsRef = collection(FIREBASE_DB, 'Lots');
      const snapshot = await getDocs(lotsRef);
      const lotsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const rawDataArray = data.rawQrText?.split(',') || [];
        return {
          id: doc.id,
          didCode: rawDataArray[0] || '',
          part_number: rawDataArray[1] || '',
          qty: parseInt(rawDataArray[2]) || 0,
          lotId: rawDataArray[3] || '',
          warehouse: rawDataArray[4] || '',
          rawQrText: data.rawQrText,
          insertion_datetime: rawDataArray[5] || '',
          insertion_userid: rawDataArray[6] || '',
          update_datetime: rawDataArray[7] || '',
          update_user_id: rawDataArray[8] || '',
          timestamp: data.timestamp
        } as LotItem;
      });
      setLots(lotsData);
      Alert.alert(
        'Успешно',
        'Данные успешно загружены',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось загрузить данные',
        [{ text: 'OK' }]
      );
    }
  };

  const renderLotItem = ({ item }: { item: LotItem }) => (
    <View style={[
      styles.lotItem,
      (item.didCode === scannedDidCode && item.lotId === scannedLotId) && styles.highlightedLot
    ]}>
      <Text style={styles.lotText}>ID: {item.id}</Text>
      <Text style={styles.lotText}>DIDCODE: {item.didCode}</Text>
      <Text style={styles.lotText}>PART_NUMBER: {item.part_number}</Text>
      <Text style={styles.lotText}>QTY: {item.qty}</Text>
      <Text style={styles.lotText}>LOT_ID: {item.lotId}</Text>
      <Text style={styles.lotText}>INSERTION_DATETIME: {item.insertion_datetime}</Text>
      <Text style={styles.lotText}>INSERTION_USERID: {item.insertion_userid}</Text>
      <Text style={styles.lotText}>UPDATE_DATETIME: {item.update_datetime}</Text>
      <Text style={styles.lotText}>UPDATE_USER_ID: {item.update_user_id}</Text>
      <Text style={styles.lotText}>WAREHOUSE: {item.warehouse}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchLots}>
        <Text style={styles.refreshButtonText}>Обновить</Text>
      </TouchableOpacity>
      <FlatList
        data={lots}
        renderItem={renderLotItem}
        keyExtractor={item => item.id}
        refreshing={false}
        onRefresh={fetchLots}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lotItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  highlightedLot: {
    backgroundColor: '#ffe4b5',
    borderWidth: 2,
    borderColor: '#ffa500',
  },
  lotText: {
    fontSize: 16,
    marginBottom: 4,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});