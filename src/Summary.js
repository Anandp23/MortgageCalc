import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';

const Summary = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { monthlyPayment } = route.params;

  let insurance = 67;
  let tax = 402;
  let hoa = 50;

  const data = [
    { name: 'Pricipal & interest', paymentValues: Math.round(monthlyPayment) },
    { name: "Homeowner's insurance", paymentValues: insurance },
    { name: 'Property tax', paymentValues: tax },
    { name: 'HOA fees', paymentValues: hoa },
  ];
  // Calculate the total paymentValues
  const totalpaymentValues = data.reduce((total, item) => total + item.paymentValues, 0);

  // Define an array of five different colors
  const colors = ['#734d8a', '#FFC300', '#33FF57', '#33BFFF', '#E833FF'];

  // Adjust the radius of the chart
  const chartRadius = 120; // Increase this value to make the chart larger

  // Calculate the angles for the chart segments
  let startAngle = -90; 

  // Sort the data by paymentValues in descending order
  data.sort((a, b) => b.paymentValues - a.paymentValues);

  const chartSegments = data.map((item, index) => {
    const angle = (item.paymentValues / totalpaymentValues) * 360;
    const endAngle = startAngle + angle;

    const path = `
      M 200 200
      L ${200 + chartRadius * Math.cos((startAngle * Math.PI) / 180)} ${200 + chartRadius * Math.sin((startAngle * Math.PI) / 180)}
      A ${chartRadius} ${chartRadius} 0 ${angle > 180 ? 1 : 0} 1
      ${200 + chartRadius * Math.cos((endAngle * Math.PI) / 180)} ${200 + chartRadius * Math.sin((endAngle * Math.PI) / 180)}
      Z
    `;

    // Calculate the position for the label
    const labelAngle = startAngle + angle / 2;
    const labelX = 200 + (chartRadius - 20) * Math.cos((labelAngle * Math.PI) / 180);
    const labelY = 200 + (chartRadius - 20) * Math.sin((labelAngle * Math.PI) / 180);

    startAngle = endAngle;

    return (
      <React.Fragment key={item.name}>
        <Path d={path} fill={colors[index % colors.length]} />
        <SvgText x={labelX} y={labelY + 15} textAnchor="middle" fontSize="10" fill={colors[index % colors.length]}>
          {item.paymentValues}
        </SvgText>
      </React.Fragment>
    );
  });

  // Create a Items at the bottom of the chart
  const Items = data.map((item, index) => (
    <View key={item.name} style={styles.ItemsItem}>
      <View style={[styles.ItemsColor, { backgroundColor: colors[index % colors.length] }]} />
      <Text style={[styles.ItemsText]}>{item.name}</Text>
      <Text style={[styles.paymentValuesText]}>$ {item.paymentValues}</Text>
    </View>
  ));

  // to increase the circle size
  const centerCircle = (
    <Circle cx="200" cy="200" r={chartRadius - 10} fill="#0b0a21" />

  );

  const centerText = (
    <SvgText x="200" y="200" textAnchor="middle" fontSize="34" fill="white" fontFamily='Montserrat-Regular'>
      {"$ " + totalpaymentValues}
    </SvgText>
  );

  const handleRecalculate = () => {
    // Get back to the calculator screen and reset every data
    navigation.goBack();

    // Reset the state by calling the resetState function in Calculator Component
    if (navigation.canGoBack()) {
      navigation.addListener('focus', () => {
        navigation.goBack(); 
      });
    }
  };
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={{alignSelf:'flex-start',marginBottom:-40,marginTop:40}}>
      </View>

      <Text style={styles.headingText1}>Monthly</Text>
      <Text style={styles.headingText2}>Payment</Text>

      <Svg width="400" height="400">
        {chartSegments}
        {centerCircle}
        {centerText}
      </Svg>

      <View style={ styles.itemMainContainer}>
        <View style={styles.itemContainer}>{Items}</View>
        <TouchableOpacity style={styles.buttonStyle}
          onPress={handleRecalculate}
        >
          <Text style={styles.buttonText}>Recalculate</Text>
        </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#0b0a21', 
    height: '100%', 
    width: '100%', 
    alignItems: 'center',
    justifyContent:'center'
  },

  headingText1: {
    color: 'white',
    fontSize: 36,
    fontFamily: 'Montserrat-Bold',

  },

  menuIconSize: {
    height: 30,
    width: 30,
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginTop: 10

  },
  headingText2: {
    color: 'white',
    fontSize: 36,
    marginTop: 10,
    fontFamily: 'Montserrat-Bold',

  },

  itemMainContainer: {
    width: '100%', 
    height: '40%', 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'white', 
    borderTopEndRadius: 40, 
    borderTopStartRadius: 40, 
    padding: 10,
    alignSelf:'baseline'
  },

  itemContainer: {
    flexDirection: 'column',
    padding: 20,
    width: '100%'
  },

  ItemsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  ItemsColor: {
    width: 20,
    height: 20,
    borderRadius: 8,
    marginRight: 5,
  },
  ItemsText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
    fontFamily: 'Montserrat-Regular', 
  },

  paymentValuesText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 'auto',
    borderBottomWidth: .5,
    fontFamily: 'Montserrat-Regular',

  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0a21',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  }
});

export default Summary;
