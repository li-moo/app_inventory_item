import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
// import { Button, Popconfirm } from 'antd';
import axios from 'axios';

function StoreOrdersDetailItem(props) {
  const [selectedGroupId, setSelectedGroupId] = useState(0);

  const updateQnt = (tarId, tarQnt) => {
    const url_be_updateQnt = "http://43.202.9.215:8080/orders/update-orders";

    axios(url_be_updateQnt, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        id: tarId,
        qnt: tarQnt,
        delivery_id: 1,
      },
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  };

  const deleteOrder = (id) => {
    const url_be_deleteOrder = `http://43.202.9.215:8080/orders/orderdetail/delete/${id}`;

    axios(url_be_deleteOrder, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        id: id,
      },
    })
      .then(() => {
        props.onDeleteOrder();
      })
      .catch(function (error) {
        console.log("error-> StoreOrdersDetailItem:", error);
      });
  };

  const handleGroupButtonClick = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <View>
      <View style={{ overflow: 'scroll', maxHeight: 490 }}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, props.showAllData ? styles.active : null]}
            onPress={props.onShowAllData}
          >
            <Text>전체 ({props.storeOrdersDetailListData.length})</Text>
          </TouchableOpacity>
          {Object.entries(props.groupedOrders).map(([groupId, orders]) => (
            <TouchableOpacity
              key={groupId}
              style={[styles.tabButton, selectedGroupId == groupId ? styles.active : null]}
              onPress={() => handleGroupButtonClick(groupId)}
            >
              <Text>
                {groupId == 1 && `일반 (${orders.length})`}
                {groupId == 2 && `자동 (${orders.length})`}
                {groupId == 3 && `이벤트/날씨 (${orders.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.alignCenter]}>SKU</Text>
            <Text style={[styles.tableHeader, styles.alignCenter]}>상품이름</Text>
            <Text style={[styles.tableHeader, styles.alignCenter]}>발주수량</Text>
            <Text style={[styles.tableHeader, styles.alignCenter]}></Text>
          </View>
          {(props.showAllData ? Object.values(props.groupedOrders).flat() : props.groupedOrders[selectedGroupId])?.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.alignCenter}>{item.product_code}</Text>
              <Text>{`(${item.product_info_brand})${item.product_name}`}</Text>
              {item.orders_status === "배송준비중" ? (
                <TextInput
                  style={styles.roundedInput}
                  value={item.qnt.toString()}
                  onChangeText={(newQuantity) => {
                    const parsedQuantity = parseInt(newQuantity) || item.qnt - 1;
                    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                      const updatedOrders = props.groupedOrders[selectedGroupId].map((order) => {
                        if (order.id === item.id) {
                          return { ...order, qnt: parsedQuantity };
                        }
                        return order;
                      });

                      props.onUpdateGroupedOrders({
                        ...props.groupedOrders,
                        [selectedGroupId]: updatedOrders,
                      });
                    }
                    const tarId = item.id;
                    const tarQnt = parsedQuantity;
                    updateQnt(tarId, tarQnt);
                  }}
                />
              ) : (
                <Text style={styles.alignCenter}>{item.qnt}</Text>
              )}
              {item.orders_status === "배송준비중" ? (
                <View>
                  <Popconfirm
                    title="발주내역을 삭제 하시겠습니까?"
                    onConfirm={() => deleteOrder(item.id)}
                    okText="네"
                    cancelText="아니오"
                  >
                    <Button style={{ position: 'static', zIndex: 1 }}>삭제</Button>
                  </Popconfirm>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = {
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
    borderRadius: 5,
  },
  active: {
    backgroundColor: 'blue',
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    paddingHorizontal: 5,
  },
  
  alignCenter: {
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    paddingHorizontal: 5,
  },
  
  alignCenter: {
    textAlign: 'center',
  },
  roundedInput: {
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
};

export default StoreOrdersDetailItem;
