import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable, TextInput } from 'react-native';
import axios from 'axios';
import { logInState } from '../state/loginState';
import { useRecoilState } from 'recoil';
import Icon from 'react-native-vector-icons/MaterialIcons';

function StoreOrdersDetail(props) {
  const [storeOrdersDetailListData, setStoreOrdersDetailListData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loginData, setLoginData] = useRecoilState(logInState);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  

  useEffect(() => {
    if (props.route != undefined) {
      const reqOrderData = props.route.params.propsData.orderDate;
      const reqStoreId = props.route.params.propsData.storeId;
      const url_be_detail_list = `http://43.202.9.215:8080/orders/store-orders-detail-list?storeId=${loginData.store_id}&orderDate=${reqOrderData}`;
      fetchStoreOrdersDetailListData(url_be_detail_list);
    }
  }, [props.route, loginData]);

  useEffect(() => {
    setFilteredOrders(storeOrdersDetailListData);
    // setFilteredOrders(filteredOrders);
    // updateQnt();
  }, [storeOrdersDetailListData]);

  const fetchStoreOrdersDetailListData = (url) => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStoreOrdersDetailListData(res.data);
        } else if (typeof res.data === 'object' && res.data !== null) {
          setStoreOrdersDetailListData([res.data]);
        } else {
          setStoreOrdersDetailListData([]);
        }
      })
      .catch((err) => {

      });
  };

  const updateQnt = (putItemId, putQuantity) => {
    const url_be_updateQnt = `http://43.202.9.215:8080/orders/update-orders`;
    // console.log("updatedOrders", updatedOrders);
    // console.log("updateQnt안itemId", itemId);
    // console.log("updateQnt안quantity", quantity);

    fetch(url_be_updateQnt, {
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        withCredentials: true,
        mode: 'cors',
      },
      // body: JSON.stringify({
      //   id: tarId,
      //   qnt: tarQnt,
      //   delivery_id: 1,
      // }),
      body: JSON.stringify({
        id: putItemId,
        qnt: putQuantity,
        delivery_id: 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {

      })
      .catch((error) => {

      });
  };
  

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    for (let i = 0; i < filteredOrders.length; i++) {
      totalQuantity += filteredOrders[i].quantity;
    }
    return totalQuantity;
  };

  const handleFilterByType = (typeId) => {
    if (typeId === 0) {
      setFilteredOrders(storeOrdersDetailListData);
    } else {
      const filtered = storeOrdersDetailListData.filter((item) => item.orders_type_id === typeId);
      setFilteredOrders(filtered);
    }
  };

  const handleDeleteOrder = (id) => {
    const orderToDelete = filteredOrders.find((item) => item.id === id);
    if (orderToDelete.orders_status === '배송완료') {
      // console.log('배송완료된 주문은 삭제할 수 없습니다.');
      return;
    }

    setOrderToDelete(orderToDelete);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteOrder = () => {
    const id = orderToDelete.id;
    const url_be_deleteOrder = `http://43.202.9.215:8080/orders/orderdetail/delete/${id}`;

    axios
      .delete(url_be_deleteOrder, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          withCredentials: true,
        },
        data: {
          id: id,
        },
      })
      .then(() => {
        const updatedOrders = filteredOrders.filter((item) => item.id !== id);
        setFilteredOrders(updatedOrders);
        setShowDeleteModal(false);
      })
      .catch(function (error) {
        .catch((err) => {

        });
      });
  };

  const handleCancelDeleteOrder = () => {
    setShowDeleteModal(false);
  };

  const handleGoBack = () => {
    props.navigation.goBack();
  };

  const handleQuantityChange = (itemId, quantity) => {

    const updatedOrders = filteredOrders.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          qnt: quantity,
        };
      }
      return item;
    });
    setFilteredOrders(updatedOrders);

    const putItemId = itemId;
    const putQuantity = quantity;
    updateQnt(putItemId, putQuantity)

  };


  return (

    
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: 'black' }]}
          onPress={() => handleFilterByType(0)}
        >
          <Text style={[styles.filterButtonText, { fontSize: 14, color: 'white' }]}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: 'black' }]}
          onPress={() => handleFilterByType(1)}
        >
          <Text style={[styles.filterButtonText, { fontSize: 14, color: 'white' }]}>일반</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: 'black' }]}
          onPress={() => handleFilterByType(2)}
        >
          <Text style={[styles.filterButtonText, { fontSize: 14, color: 'white' }]}>자동</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: 'black' }]}
          onPress={() => handleFilterByType(3)}
        >
          <Text style={[styles.filterButtonText, { fontSize: 14, color: 'white' }]}>날씨/이벤트</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.columnWidth]}>발주번호</Text>
          <Text style={[styles.cell, styles.columnWidth]}>상품이름 (Brand)</Text>
          <Text style={[styles.cell, styles.qtyWidth]}>총 수량</Text>
        </View>

        {filteredOrders.length !== 0 ? (
          filteredOrders.map((item) => {
            return (
              <View style={styles.row} key={item.id}>
                <Text style={[styles.cell, styles.columnWidth]}>{item.product_code}</Text>
                <Text style={[styles.cell, styles.productCell]}>
                  ({item.product_info_brand}){item.product_name}
                </Text>

                <View style={styles.columnWidthInput}>
                  <TextInput
                    style={[styles.cell, styles.columnWidth, styles.quantityCell]}
                    value={item.qnt.toString()}
                    onChangeText={(text) => handleQuantityChange(item.id, text)}
                    keyboardType="numeric" 
                  />
                </View>


                {item.orders_type_id !== 4 && (
                  <TouchableOpacity onPress={() => handleDeleteOrder(item.id)}>
                    <Icon name="delete" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              아직 발주 내역이 없습니다.{'\n'}확인하여 이용해주시길 바랍니다.
            </Text>
          </View>
        )}

        {filteredOrders.length !== 0 && (
          <View style={styles.totalQuantityContainer}>
          </View>
        )}
      </View>

      <View>
      {/* Your other component code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => {
          setShowDeleteModal(!showDeleteModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              배송완료된 주문은 삭제할 수 없습니다.
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleCancelDeleteOrder}
              >
                <Text style={styles.buttonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => {
          setShowDeleteModal(!showDeleteModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              발주번호 {orderToDelete && orderToDelete.product_code}을(를) 삭제하시겠습니까?
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCancelDeleteOrder}
              >
                <Text style={styles.buttonText}>아니요</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonConfirm]} onPress={handleConfirmDeleteOrder}>
                <Text style={styles.buttonText}>예</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50, // 조정할 값
  },
  filterButtonContainer: {
    marginBottom: 40, // Adjust the margin bottom as desired
  },
  filterButton: {
    flex: 1,
    height: 40, // Adjust the height to make the buttons smaller
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  filterButtonText: {
    fontWeight: 'bold',
    marginBottom: -10,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 12,
   
  },
  qtyWidth: {
    flex: 0.8,
  },
  columnWidth: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 13,
  
  },

  columnWidthInput: {
    width: 40,
  },


  productCell: {
    flex: 1,
    fontSize: 17,
    numberOfLines: 1,
    paddingRight: 40,
    width: 200,
  },
  quantityCell: {
    textAlign: 'right',
  },

 
  

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  totalQuantityContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
    paddingTop: 10,
  },
  totalQuantityText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: 'red',
  },
  buttonConfirm: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StoreOrdersDetail;
