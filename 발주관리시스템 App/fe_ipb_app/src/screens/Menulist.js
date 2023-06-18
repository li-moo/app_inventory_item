import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Button } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Menulist = () => {
  const url_be = "http://43.202.9.215:8080/product/list";
  const [tableDataList, setTableDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const navigation = useNavigation();

  const tableHead = ['상품코드', '상품이름', '수량', '가격', '유통기한'];
  const widthArr = [60, 60, 50, 100, 100, 90];

  useEffect(() => {
    axios.get(url_be)
      .then((res) => {
        setTableDataList(res.data);
      })
      .catch((err) => console.log("orderproductlist/err", err));
  }, []);

  const handleDelete = (index) => {
    const product = tableDataList[index];
    if (!product) {
      console.error(`No product found at index ${index}`);
      return;
    }

    const productCode = product.product_code;
    axios
      .delete(`${url_be}/${productCode}`)
      .then((res) => {
        const updatedList = tableDataList.filter((_, idx) => idx !== index);
        setTableDataList(updatedList);
      })
      .catch((error) => {
        console.error("Deletion error:", error);
      });
  };

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...tableDataList].sort((a, b) => {
      const valueA = key === '상품이름' ? a.name : a.exp;
      const valueB = key === '상품이름' ? b.name : b.exp;
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTableDataList(sortedData);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.subtitle}>T e s t</Text>
          <View style={styles.sortButtonsContainer}>
            <Button
              title="상품이름 오름차순"
              onPress={() => sortTable('상품이름')}
              color="#262627"
            />
            <Button
              title="상품이름 내림차순"
              onPress={() => sortTable('상품이름')}
              color="#262627"
            />
            <Button
              title="유통기한 오름차순"
              onPress={() => sortTable('유통기한')}
              color="#262627"
            />
            <Button
              title="유통기한 내림차순"
              onPress={() => sortTable('유통기한')}
              color="#262627"
            />
          </View>
          <ScrollView>
            <Table>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.headText}
                widthArr={widthArr}
              />
              {tableDataList.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  <Row
                    data={[rowData.product_code, rowData.name, rowData.qnt, rowData.price, rowData.exp]}
                    textStyle={styles.text}
                    widthArr={widthArr.slice(0, 5)}
                  />
                  <TouchableOpacity
                    onPress={() => handleDelete(index)}
                    style={styles.deleteButton}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#f9f9f9' },
  head: { height: 40, backgroundColor: 'red' },
  headText: { textAlign: 'center', fontWeight: 'bold' },
  text: { textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#E7E6E1', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deleteButton: { backgroundColor: '#ea7070', flex: 1, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { color: '#0e0d0d', fontWeight: 'bold' },
  subtitle: { color: '#0f0f0f', marginTop: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  sortButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  goBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
});

export default Menulist;
