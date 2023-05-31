import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import { logInState } from '../state/loginState';
import { useRecoilState } from 'recoil';
import StoreOrdersDetail from './StoreOrdersDetail';

function OrdersList() {
  const [loginData, setLoginData] = useRecoilState(logInState);
  const [storeOrdersDetailData, setStoreOrdersDetailData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleRowClick = (id, ordersDate) => {
    setSelectedId(id);
    console.log("------> ordersDate : ", ordersDate);
  };

  useEffect(() => {
    fetchStoreOrdersDetailData();
  }, []);

  const url_be = `http://localhost:8080/orders/store-orders-date/${loginData.store_id}`;

  const fetchStoreOrdersDetailData = () => {
    axios(url_be, {
      method: 'get'
    })
      .then((res) => {
        console.log("> fetchStoreOrdersDetailData > fetch 받은 데이터 res.data>>>", res.data);
        setStoreOrdersDetailData(res.data);
      })
      .catch((err) => console.log("storeexp/err", err))
  }

  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>발주내역</Text>
      <Divider />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#ccc' }}>
          <View style={{ flex: 1 }}>
            <Text>ID</Text>
            <Text>발주내역</Text>
            <Text>배송상태</Text>
          </View>
          <View style={{ flex: 10 }}>
            {storeOrdersDetailData.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleRowClick(item.orders_date)}
                style={{ flexDirection: 'row' }}
              >
                <Text>{item.id}</Text>
                <Text>{`${item.orders_date}일자 발주내역`}</Text>
                <Text>{item.orders_status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ flex: 2, backgroundColor: '#666' }}>
          {selectedId && <StoreOrdersDetail selectedId={selectedId} />}
        </View>
      </View>
    </>
  );
}

export default OrdersList;
