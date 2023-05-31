import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { logInState } from '../state/loginState';
import { useRecoilState } from 'recoil';

function StoreOrdersDetail(props) {
  const [storeOrdersDetailListData, setStoreOrdersDetailListData] = useState([]);
  const [loginData, setLoginData] = useRecoilState(logInState);

  useEffect(() => {
    fetchStoreOrdersDetailListData();
  }, [props.selectedId]);

  const orders_date = props.selectedId;

  const url_be_detail_list = `http://localhost:8080/orders/store-orders-detail-list`;

  const fetchStoreOrdersDetailListData = () => {
    const requestData = {
      storeId: loginData.store_id,
      orderDate: orders_date,
    };

    axios
      .get(url_be_detail_list, {
        params: requestData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log("# Store fetch-list 받은 데이터 res.data>>>", res.data);
        setStoreOrdersDetailListData(res.data);
      })
      .catch((err) => console.log('storeOrdersDetail/err', err));
  };

  return (
    <View style={styles.container}>
      {storeOrdersDetailListData.map((item) => {
        return (
          <View style={styles.row} key={item.id}>
            <Text style={styles.cell}>{item.product_code}</Text>
            <Text style={styles.cell}>
              ({item.product_info_brand}){item.product_name}
            </Text>
            <Text style={styles.cell}>{item.qnt}</Text>
            <Text style={styles.cell}>{item.orders_status}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
});

export default StoreOrdersDetail;
