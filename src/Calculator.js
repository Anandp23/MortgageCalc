import React, { useState, useEffect, } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Slider, Dimensions, Alert, Image, StatusBar, ScrollView } from "react-native";

import { useNavigation, useIsFocused } from "@react-navigation/native";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const Calculator = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [homePrice, setHomePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);


  const resetState = () => {
    setHomePrice(0);
    setDownPayment(0);
    setInterestRate(0);
    setSelectedYear(0);
    setMonthlyPayment(0);
  };

  const calculatePercentage = (downPaymentValue, homePriceValue) => {
    const homePriceFloat = parseFloat(homePriceValue);
    const downPaymentFloat = parseFloat(downPaymentValue);
    if (
      !isNaN(homePriceFloat) &&
      !isNaN(downPaymentFloat) &&
      homePriceFloat > 0
    ) {
      const calculatedPercentage = (
        (downPaymentFloat / homePriceFloat) * 100)
      return parseFloat(calculatedPercentage);
    } else {
      return 0;
    }
  };
  const percentage = calculatePercentage(downPayment, homePrice);


  const handleYearClicked = (year) => {
    setSelectedYear(year);
  }


  useEffect(() => {
    if (monthlyPayment > 0) {
      navigation.navigate("Summary", { monthlyPayment });
    }
    if (isFocused) {
      resetState(); // Reset your state or perform any other actions
    }
  }, [monthlyPayment, navigation, isFocused]);



  const calculateMortgage = () => {
    if (homePrice === 0 || downPayment === 0 || interestRate === 0 || selectedYear === 0) {
      Alert.alert("Validation Error", "Please fill in all input fields.");
      return;
    }

    //Formula:
    // P = (Pv * r) / (1 - (1 + r)^(-n))
    // Where:
    // - P is the monthly payment
    // - Pv is the loan amount (home price - down payment)
    // - r is the monthly interest rate (annual interest rate / 12 / 100)
    // - n is the number of monthly payments (loan term in years * 12)

    // Convert input values to numbers
    const principal = (homePrice) - (downPayment);
    const monthlyInterestRate = (interestRate) / 12 / 100;
    const numberOfPayments = (selectedYear) * 12;

    // Calculate the monthly mortgage payment
    const monthlyPaymentResult =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    // Update the state with the calculated monthly payment
    setMonthlyPayment(monthlyPaymentResult.toFixed(2));
  };
  console.log("calculator : " + monthlyPayment);

  const yearLength = [30, 25, 15, 10]
  const LengthOfYear = yearLength.map((item, index) => (
    
      <View style={styles.yearsContainer}>
        <TouchableOpacity
          style={[
            styles.yearButton,
            selectedYear == item ? styles.selectedButton : null,
          ]}
          onPress={() => handleYearClicked(item)}
        >
          <Text style={{ color: 'white', fontFamily: 'Montserrat-Regular' }}>
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    
  

  ));



  return (

    <View style={styles.constainer}>

      <Text style={styles.headingText1}>Calculate</Text>
      <Text style={styles.headingText2}>Mortgage</Text>
      <Text style={styles.inputTextheading}>Home Price</Text>

      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        selectionColor={'#c7a7f3'}
        value={homePrice === 0 ? '' : `$ ${homePrice}`}
        placeholder="$ 0"
        onChangeText={(value) => {

          const numericValue = parseFloat(value.replace(" $", "").replace("$", ""));
          if (!isNaN(numericValue) || numericValue === 0) {
            setHomePrice(numericValue);
          } else {
            setHomePrice(0);
          }
        }}
      />

      <Slider
        maximumValue={100000}
        minimumValue={100}
        step={100}
        value={homePrice}
        style={{ width: windowWidth - 50, marginTop: -10 }}
        thumbTintColor={'#734d8a'}
        maximumTrackTintColor={'#734d8a'}
        minimumTrackTintColor={'#734d8a'}
        interestRate={homePrice}
        onValueChange={(value) => {
          setHomePrice(value);
        }}

      />

      <Text style={styles.inputTextheading}>Down payment</Text>
      <View >
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          selectionColor={'#c7a7f3'}
          value={downPayment === 0 ? '' : `$ ${downPayment}`}
          placeholder="$ 0"
          onChangeText={(value) => {
            const numericValue = parseFloat(value.replace(" $", "").replace("$", ""));
            if (!isNaN(numericValue) || numericValue === 0) {
              setDownPayment(numericValue);
            } else {
              setDownPayment(0);
            }
          }}

        />

        <Slider
          maximumValue={100000}
          minimumValue={100}
          step={100}
          value={downPayment}
          style={{ width: windowWidth - 50, marginTop: -10 }}
          thumbTintColor={'#734d8a'}
          maximumTrackTintColor={'#734d8a'}
          minimumTrackTintColor={'#734d8a'}
          downPayment={downPayment}
          onValueChange={(value) => {
            setDownPayment(value);
          }}

        />
        <Text style={styles.inputPercentageText}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.yearsHeadingTextView}>
        <Text style={styles.lengthOfLoanText}>Length of loan</Text>
        <Text style={styles.yearsText}>Years</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
      {LengthOfYear}
      </View>

      <Text style={styles.inputTextheading}>Interest rate</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        selectionColor={'#c7a7f3'}
        value={interestRate === 0 ? '' : `${interestRate}` + `%`}
        placeholder="0 %"
        onChangeText={(value) => {
          const numericValue = parseFloat(value.replace(" %", "").replace("%", ""));
          if (!isNaN(numericValue) || numericValue === 0) {
            setInterestRate(numericValue);
          } else {
            setInterestRate(0);
          }
        }}

      />

      <Slider
        maximumValue={12}
        minimumValue={0}
        step={1}
        value={interestRate}
        style={{ width: windowWidth - 50, marginTop: -10 }}
        thumbTintColor={'#734d8a'}
        maximumTrackTintColor={'#734d8a'}
        minimumTrackTintColor={'#734d8a'}
        downPayment={interestRate}
        onValueChange={(value) => {
          setInterestRate(value);
        }}

      />
      <TouchableOpacity style={styles.calculateButton}
        onPress={() => calculateMortgage()}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>



      <StatusBar hidden={true} />

    </View>


  )
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    alignItems: 'center'

  },

  menuIconSize: {
    height: 30,
    width: 30,
    alignSelf: 'flex-start',
    marginLeft: -80,

  },

  textInput: {
    height: 60,
    width: windowWidth - 50,
    borderWidth: 1,
    borderColor: '#c7a7f3',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    fontFamily: 'Montserrat-Regular',
    fontSize: 22
  },

  inpuTextStyle: {
    fontSize: 22,
    fontFamily: 'Montserrat-Regular'
  },

  headingText1: {
    fontSize: 38,
    fontFamily: 'Montserrat-Bold',
    color: '#413b5c',
    margin: 10
  },

  headingText2: {
    fontSize: 38,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
    color: '#413b5c'
  },

  inputTextheading: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    padding: 10,
    alignSelf: 'flex-start',
    color: '#413b5c',
    marginTop: 20,
    marginLeft: 15
  },

  inputPercentageText: {
    alignSelf: 'flex-end',
    marginTop: -50,
    marginBottom: 40,
    marginRight: 30,
    fontFamily: 'Montserrat-Regular',
    fontSize: 20
  },

  yearsHeadingTextView: {
    width: windowWidth - 50,
    height: 30,
    justifyContent: 'center',


  },

  lengthOfLoanText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#413b5c',



  },

  yearsText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#413b5c',
    alignSelf: 'flex-end',
    marginTop: -20

  },
  
  yearsContainer: {
    
    padding:20,
    flexDirection: 'row', // Display buttons horizontally
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically
   


  },
  yearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 60,
    backgroundColor: '#9b9eae',
    borderRadius: 15,
    

  },
  selectedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 60,
    backgroundColor: '#9d72e9',
    
  },

  calculateButton: {
    height: '7%',
    width: 350,
    backgroundColor: '#0b0a21',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40

  },

  buttonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16
  }
})

export default Calculator;