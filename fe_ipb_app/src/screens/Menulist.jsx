import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Button, Alert } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Menulist = () => {
  const url_be = "http://localhost:8080/product/list";
  const [tableDataList, setTableDataList] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumnIndex, setSortColumnIndex] = useState(null);
  const navigation = useNavigation();

  const tableHead = ['상품코드', '상품이름', '수량', '가격', '유통기한'];
  const widthArr = [60, 60, 50, 100, 100, 90];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(url_be)
      .then((res) => {
        setTableDataList(res.data);
      })
      .catch((err) => console.log("orderproductlist/err", err));
  };

  const handleDelete = (index) => {
    Alert.alert(
      "삭제 확인", 
      "삭제하시겠습니까?", 
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => {
          axios.delete(`${url_be}/${tableDataList[index].product_code}`)
            .then(res => {
              console.log(res);
              console.log(res.data);
              // Remove the item from tableDataList
              const updatedList = [...tableDataList];
              updatedList.splice(index, 1);
              setTableDataList(updatedList);
            })
            .catch(error => {
              console.error(error);
            });
        }}
      ]
    );
  };

  const handleSort = (index) => {
    const sortedData = [...tableDataList].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[tableHead[index]] > b[tableHead[index]] ? 1 : -1;
      } else {
        return a[tableHead[index]] < b[tableHead[index]] ? 1 : -1;
      }
    });
    setTableDataList(sortedData);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumnIndex(index);
  };

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
        <Text style={styles.subtitle}>각 테이블을 누르시면 정렬 할 수 있습니다.</Text>
        <ScrollView>
          <Table>
            <Row 
              data={tableHead} 
              style={styles.head} 
              textStyle={styles.headText} 
              widthArr={widthArr} 
              onPress={(data, index) => handleSort(index)}
            />
            {tableDataList.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                <Row
                  data={[rowData.product_code, rowData.name, rowData.qnt, rowData.price, rowData.exp]}
                  textStyle={styles.text}
                  widthArr={widthArr.slice(0, 5)} // Exclude delete button column
                />
                <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              </TableWrapper>
            ))}
          </Table>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#f9f9f9' },
  head: { height: 40, backgroundColor: '#00B386' },
  headText: { textAlign: 'center', fontWeight: 'bold' },
  text: { textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#E7E6E1', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deleteButton: { color: '#00B386' , flex: 1, justifyContent: 'center', alignItems: 'center', },
  deleteButtonText: { color: '#0e0d0d', fontWeight: 'bold' },
  subtitle: {color: '#0f0f0f', marginTop: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default Menulist;
