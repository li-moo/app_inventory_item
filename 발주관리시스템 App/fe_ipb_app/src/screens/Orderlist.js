import React, { useState, useEffect } from 'react';
import { FlatList, Button, View, Text, TouchableOpacity } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function OrderList() {
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  const url_be = `http://43.202.9.215:8080/product/list`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios(url_be, { method: 'get' })
      .then((res) => {
        console.log("res:", res);
        console.log("orderProdutList=>res.data:", res.data);
        setProductData(res.data);
      })
      .catch((err) => console.log("orderproductlist/err", err));
  };

  const handleAddCart = (id) => {
    console.log("Add product to cart:", id);
    const product = productData.find(item => item.id === id);
    if (product) {
      setCartItems(prevItems => [...prevItems, product]);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
          발주내역
        </Text>
      </View>
      <FlatList
        data={productData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={<Text style={{ color: 'black' }}>{`${item.brand} ${item.name}`}</Text>}
            description={<Text style={{ color: 'black' }}>{`SKU: ${item.product_code}, Quantity: ${item.qnt}, Cost: ${item.cost}, Price: ${item.price}`}</Text>}
            right={(props) => (
              <IconButton
                {...props}
                icon="cart"
                color="#262627"
                onPress={() => handleAddCart(item.id)}
              />
            )}
          />
        )}
      />
      {cartItems.length > 0 && <Cart cartItems={cartItems} />}
    </View>
  );
}

const styles = {
  goBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
};

export default OrderList;
