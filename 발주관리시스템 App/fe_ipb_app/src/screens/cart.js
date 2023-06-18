import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { logInState } from '../state/loginState';
import axios from 'axios';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';

function Cart() {
  const navigation = useNavigation();

  const [storeProductData, setStoreProductData] = useState([]);
  const [logInData, setLogInData] = useRecoilState(logInState);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshExpBtn, setRefreshExpBtn] = useState(false);
  const [filteredProductData, setFilteredProductData] = useState([]);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`;

  useEffect(() => {
    fetchData();
  }, [refreshExpBtn]);

  const url_be = `http://43.202.9.215:8080/storeproduct/list/${logInData.store_id}`;

  const fetchData = () => {
    axios
      .get(url_be)
      .then((res) => {

        const addData = res.data.map((item) => ({
          ...item,
          addData: subtractDates(todayDate, item.exp),
        }));
        setStoreProductData(addData);
      })
      .catch((err) => {

      });
  };

  const subtractDates = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((new Date(date2) - new Date(date1)) / oneDay);
    return diffDays;
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredProducts = storeProductData.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const valueA = a.product_code;
    const valueB = b.product_code;
    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });

  let groupedProducts = storeProductData;
  let skuList = [];
  let dupSkuList = [];
  for (let i = 0; i < storeProductData.length; i++) {
    if (!skuList.includes(storeProductData[i].product_code)) {
      skuList.push(storeProductData[i].product_code);
    } else {
      dupSkuList.push(storeProductData[i].id);
    }
  }

  const disposeBtn = (id) => {
    const url_be_disposeBtn = 'http://43.202.9.215:8080/storeproduct/qntzero';

    axios
      .put(url_be_disposeBtn, { id })
      .then((res) => {
        setRefreshExpBtn(!refreshExpBtn);
      })
      .catch((err) => {

      });
  };

  const tableHead = ['상품 번호', '상품 이름', '유통기한', '재고', '가격', '폐기처'];

  const tableData = sortedProducts.map((item) => [
    item.product_code,
    item.product_name,
    item.exp,
    item.addData,
    item.price,
    !dupSkuList.includes(item.id) && item.addData <= 1 ? '폐기' : ''
  ]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: () => {},
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < -50) {
            handleGoBack();
          }
        },
      }),
    []
  );

  return (
    <View {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <Text>유통기한 임박 상품</Text>
      <TextInput
        placeholder="검색"
        onChangeText={(value) => handleSearch(value)}
        value={searchTerm}
      />
      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableText} />
          {tableData.map((rowData, index) => (
            <TableWrapper key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 5 ? (
                      !dupSkuList.includes(sortedProducts[index].id) && sortedProducts[index].addData <= 0 ? (
                        <TouchableOpacity onPress={() => disposeBtn(sortedProducts[index].id)}>
                          <Text style={styles.disposeButton}>폐기</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.disposeButtonDisabled}></Text>
                      )
                    ) : (
                      cellData
                    )
                  }
                  textStyle={styles.tableText}
                  style={styles.tableCell}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goBackButton: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  tableContainer: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableHead: { height: 40, backgroundColor: '#f1f8ff' },
  tableText: { textAlign: 'center', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', backgroundColor: '#FFFFFF' },
  tableRowAlt: { flexDirection: 'row', backgroundColor: '#F7F6E7' },
  tableCell: { flex: 1, borderRightWidth: 1, borderColor: '#C1C0B9' },
  disposeButton: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  disposeButtonDisabled: {
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default Cart;
