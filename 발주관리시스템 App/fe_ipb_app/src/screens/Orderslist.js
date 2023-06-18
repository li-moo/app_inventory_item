import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import StoreOrdersDetailItem from './StoreOrdersDetailItem';
import { logInState } from '../state/loginState';

function OrdersList({ navigation: { navigate } }) {
  const [loginData, setLoginData] = useRecoilState(logInState);
  const [storeOrdersDetailData, setStoreOrdersDetailData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleRowClick = (id, ordersDate) => {
    setSelectedId(id);
    console.log("------> ordersDate : ", ordersDate);
    navigate("StoreOrdersDetail", { propsData: { "storeId": id, "orderDate": ordersDate } });
  };

  useEffect(() => {
    fetchStoreOrdersDetailData();
  }, []);

  const url_be = `http://43.202.9.215:8080/orders/store-orders-date/${loginData.store_id}`;

  const fetchStoreOrdersDetailData = () => {
    axios(url_be, {
      method: 'get'
    })
      .then((res) => {
        console.log("> fetchStoreOrdersDetailData > fetch 받은 데이터 res.data>>>", res.data);
        // Sorting the data by orders_date in descending order
        const sortedData = res.data.sort((a, b) => new Date(b.orders_date) - new Date(a.orders_date));
        setStoreOrdersDetailData(sortedData);
      })
      .catch((err) => console.log("storeexp/err", err))
  }

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleRowClick(item.id, item.orders_date)}
      style={[styles.itemContainer, styles.itemBorder]}
    >
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={[styles.itemText, styles.largeText, styles.boldText, styles.centerText]} >
            {item.orders_date}
          </Text>
          <Text style={[styles.itemText, styles.largeText, styles.centerText]}>
            발주내역
          </Text>
        </View>
        <View style={styles.cell}>
          <Text style={[styles.itemText, styles.largeText, styles.boldText, styles.centerText]}>
            {item.orders_status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={20} color="black" />
      </TouchableOpacity>

      <Text style={[styles.title, styles.largeText]}>발주내역</Text>
      <Divider />
      <FlatList
        data={storeOrdersDetailData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  goBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
  },
  itemText: {
    color: 'black',
  },
  largeText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
});

export default OrdersList;
