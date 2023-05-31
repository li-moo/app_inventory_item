import React, { useState, useEffect } from 'react';
import { FlatList, Button, View, Text, TouchableOpacity } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function OrderList() {
  const [productData, setProductData] = useState([]);
  const navigation = useNavigation();

  const url_be = `http://localhost:8080/product/list`;

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
  }

  const handleAddCart = (id) => {
    console.log("Add product to cart:", id);
    // Add to cart logic goes here
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Button title="뒤로가기" onPress={handleGoBack} />
      <FlatList
        data={productData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={<Text style={{color: 'black'}}>{`${item.brand} ${item.name}`}</Text>}
            description={<Text style={{color: 'black'}}>{`SKU: ${item.product_code}, Quantity: ${item.qnt}, Cost: ${item.cost}, Price: ${item.price}`}</Text>}
            right={props => 
              <IconButton 
                {...props}
                icon="cart"
                color="black"
                onPress={() => handleAddCart(item.id)}
              />}
          />
        )}
      />
    </View>
  );
}

export default OrderList;
