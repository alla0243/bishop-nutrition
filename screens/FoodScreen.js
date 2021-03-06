import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, Button, ScrollView, Item, SectionList, TouchableOpacity, Image } from 'react-native'
import { List, Checkbox } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';     //imports all required components and libraries
import { SearchBar } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Accordion from 'react-native-collapsible/Accordion';
import * as firebase from "firebase/app"
import "firebase/firestore"
import { DataContext } from '../contexts/DataContext'
let dairyPortions = 0
let restrictedVegPortions = 0
let fruitPortions = 0
let simpleCarbPortions = 0
let proteinPortions = 0
let fatPortions = 0
let freeVegPortions = 0
let str = "hi"




export default class FoodScreen extends Component {

  static contextType = DataContext
  constructor(props) {
    super(props)

    this.state = {
      db: firebase.firestore(),
      expanded: false,
      uid: "",
      activeSections: [],
      search: '',               //initialized state variables
      searchActive: false,
      selectedIndex: 1,
      docId: "",
      longPressed: 0,
      favAdded: 0,
      foodTrackingList: [],
      lists: [
        {
          type: "Dairy",
          list: []
        },
        {
          type: "Restricted Vegetables",
          list: []
        },
        {
          type: "Fruit",
          list: []
        },
        {
          type: "Simple Carbs",
          list: []
        },
        {
          type: "Protein",
          list: []
        },
        {
          type: "Fats",
          list: []
        },
        {
          type: "Free Vegetables",
          list: []
        }
      ],
      searchLists: [
        {
          type: "Dairy",
          list: []
        },
        {
          type: "Restricted Vegetables",
          list: []
        },
        {
          type: "Fruit",
          list: []
        },
        {
          type: "Simple Carbs",
          list: []
        },
        {
          type: "Protein",
          list: []
        },
        {
          type: "Fats",
          list: []
        },
        {
          type: "Free Vegetables",
          list: []
        }
      ],
      favouriteLists: [
        {
          type: "Dairy",
          list: []
        },
        {
          type: "Restricted Vegetables",
          list: []
        },
        {
          type: "Fruit",
          list: []
        },
        {
          type: "Simple Carbs",
          list: []
        },
        {
          type: "Protein",
          list: []
        },
        {
          type: "Fats",
          list: []
        },
        {
          type: "Free Vegetables",
          list: []
        }
      ]
    }
  }
  async componentDidMount() {
    this._isMounted = true
    let dairyList = []
    let restrictedList = []
    let fruitList = []
    let simpleCarbList = []
    let proteinList = []
    let fatsList = []
    let freeVegList = []


    await this.setUid()
    await this.setTodaysDocId()
    await this._loadFavList()

    await this.state.db.collection("foodList").doc("allFood").get().then((doc) => {
      Object.values(doc.data()).forEach((item) => { //pulls all data from Firebase and assigns it to the respective list
        if (item.category == "Dairy") {
          dairyList.push(item)
        }
        if (item.category == "Restricted Vegetables") {
          restrictedList.push(item)
        }
        if (item.category == "Fruit") {
          fruitList.push(item)
        }
        if (item.category == "Simple Carbs") {
          simpleCarbList.push(item)
        }
        if (item.category == "Protein") {
          proteinList.push(item)
        }
        if (item.category == "Fats") {
          fatsList.push(item)
        }
        if (item.category == "Free Vegetables") {
          freeVegList.push(item)
        }

      })
    }).catch((err) => {
      console.log(err)
    })

    var listArray = [...this.state.lists]
    listArray[0].list = dairyList
    listArray[1].list = restrictedList
    listArray[2].list = fruitList
    listArray[3].list = simpleCarbList
    listArray[4].list = proteinList
    listArray[5].list = fatsList
    listArray[6].list = freeVegList

    this.setState({ lists: listArray })
  }
  setUid = async () => {
    let uid = await firebase.auth().currentUser.uid
    this.setState({ uid }) //finds the current users ID
  }
  updateFavouriteSearch = search => { //updates a search list when searching on the favourite screen

    let lists = [
      {
        type: "Dairy",
        list: []
      },
      {
        type: "Restricted Vegetables",
        list: []
      },
      {
        type: "Fruit",
        list: []
      },
      {
        type: "Simple Carbs",
        list: []
      },
      {
        type: "Protein",
        list: []
      },
      {
        type: "Fats",
        list: []
      },
      {
        type: "Free Vegetables",
        list: []
      }
    ]

    if (search != "") {
      this.setState({ searchActive: true })

    }
    else {
      this.setState({ searchActive: false })

    }
    this.state.favouriteLists[0].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[0].list.push(element)
      }
    });
    this.state.favouriteLists[1].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[1].list.push(element)
      }
    });

    this.state.favouriteLists[2].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[2].list.push(element)
      }
    });
    this.state.favouriteLists[3].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[3].list.push(element)
      }
    });
    this.state.favouriteLists[4].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[4].list.push(element)
      }
    });
    this.state.favouriteLists[5].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[5].list.push(element)
      }
    });
    this.state.favouriteLists[6].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[6].list.push(element)
      }
    });
    this.setState({ searchLists: lists })
    this.setState({ search });
  };
  setTodaysDocId = async () => {
    //get todays date - format
    let d = new Date()
    let today = this.formatDate(d)
    let formatDate = (d) => { //can't access this function inside the forEach for some reason
      return this.formatDate(d)
    }
    let docId

    //loop through user data and get the dates to format
    await firebase.firestore().collection("userData").doc(this.state.uid).collection("healthTracking").orderBy("timeStamp", "desc").limit(15).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let formattedDate = formatDate(new Date(doc.data().timeStamp))

        if (formattedDate == today) {
          docId = doc.id
        }
      })
    })

    this.setState({ docId })
  }
  formatDate = (d) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const date = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const formattedDate = date + month + year //looks like this: 4March2020

    return formattedDate
  }

  updateSearch = search => { //updates a search list when searching on the foodlist screen

    let lists = [
      {
        type: "Dairy",
        list: []
      },
      {
        type: "Restricted Vegetables",
        list: []
      },
      {
        type: "Fruit",
        list: []
      },
      {
        type: "Simple Carbs",
        list: []
      },
      {
        type: "Protein",
        list: []
      },
      {
        type: "Fats",
        list: []
      },
      {
        type: "Free Vegetables",
        list: []
      }
    ]

    if (search != "") {
      this.setState({ searchActive: true })
      console.log("search active")

    }
    else {
      this.setState({ searchActive: false })

    }
    this.state.lists[0].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") { //compares what was typed to any food in a specific category
        lists[0].list.push(element)
      }
    });
    this.state.lists[1].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[1].list.push(element)
      }
    });

    this.state.lists[2].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[2].list.push(element)
      }
    });
    this.state.lists[3].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[3].list.push(element)
      }
    });
    this.state.lists[4].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[4].list.push(element)
      }
    });
    this.state.lists[5].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        lists[5].list.push(element)
      }
    });
    this.state.lists[6].list.forEach(element => {
      if (element.name.toLowerCase().includes(search.toLowerCase()) && search != "") {
        // console.log(element)
        lists[6].list.push(element)
      }
    });


    this.setState({ searchLists: lists })
    this.setState({ search });
  };
  _handlePress = (food) => //function that opens and closes the accordian list
    this.setState({
      expanded: !this.state.expanded
    });
  _loadFavList = async () => {
    let dairyList = []
    let restrictedList = []
    let fruitList = []
    let simpleCarbList = []
    let proteinList = []
    let fatsList = []
    let freeVegList = []
    await this.state.db.collection("userData").doc(this.state.uid).collection("favouriteFoodList").doc("allFavFood").get().then((doc) => {
      Object.values(doc.data()).forEach((item) => {
        if (item.category == "Dairy") {
          dairyList.push(item)
        }
        if (item.category == "Restricted Vegetables") {
          restrictedList.push(item)
        }
        if (item.category == "Fruit") {
          fruitList.push(item)
        }
        if (item.category == "Simple Carbs") {
          simpleCarbList.push(item)
        }
        if (item.category == "Protein") {
          proteinList.push(item)
        }
        if (item.category == "Fats") {
          fatsList.push(item)
        }
        if (item.category == "Free Vegetables") {
          freeVegList.push(item)
        }

      })
    }).catch((err) => {
      console.log(err)
    })
    var listArray = [...this.state.favouriteLists]
    listArray[0].list = dairyList
    listArray[1].list = restrictedList
    listArray[2].list = fruitList
    listArray[3].list = simpleCarbList
    listArray[4].list = proteinList
    listArray[5].list = fatsList
    listArray[6].list = freeVegList

    this.setState({ favouriteLists: listArray })
  }

  _handleIndexChange = (index) => { //changes which segemented tab is displayed
    this.setState({ selectedIndex: index });


  };

  updateHalfDb = async (item) => {
    let foodEntry = {}


    let obj = {
      [item.category.toLowerCase()]: {
        name: item.name,
        portions: 0.5
      }
    }

    Object.assign(foodEntry, obj)


    await firebase.firestore().collection("userData").doc(this.state.uid).collection("healthTracking").doc(this.state.docId)
      .set({ foodEntry }, { merge: true })
  }


  _renderHeader = section => { //renders the accordion list headers based on what food categories are there
    return (
      <View style={styles.listItemContainer}>


        {(section.type == "Dairy") ? (
          <Image
            style={styles.catagoryIconDairy}
            source={require('../assets/dairy_Icon.png')}
          />
        ) : (section.type == "Restricted Vegetables") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/restrictedVeg_Icon.png')}
          />
        ) : (section.type == "Fruit") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/fruit_icon.png')}
          />
        ) : (section.type == "Simple Carbs") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/carb_icon.png')}
          />
        ) : (section.type == "Protein") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/protein_icon.png')}
          />
        ) : (section.type == "Fats") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/fats_icon.png')}
          />
        ) : (section.type == "Free Vegetables") ? (
          <Image
            style={styles.catagoryIcon}
            source={require('../assets/restrictedVeg_Icon.png')}
          />
        ) : (
                        <Image
                          style={styles.catagoryIcon}
                          source={'../assets/restrictedVeg_Icon.png'}
                        />
                      )}
        <Text style={styles.listItemTitle}>{section.type}</Text>
      </View>
    );
  };

  _addFavourite = async (item) => { //adds an item to the users favourite list when clicked

    await firebase.firestore().collection("userData").doc(this.state.uid).collection("favouriteFoodList").doc("allFavFood").set({
      [item.name]: {
        category: item.category,
        favourite: item.favourite,
        key: item.key,
        name: item.name,
        plans: [
          item.plans[0],
          item.plans[1]
        ],
        portionSize: item.portionSize
      }
    }, { merge: true })

    this._loadFavList()
  };
  _removeFavourite = async (item) => { //removes an item from  a users favourite list

    var collectionRef = this.state.db.collection("userData").doc(this.state.uid).collection("favouriteFoodList").doc("allFavFood")

    var removeRef = collectionRef.update({
      [item.name]: firebase.firestore.FieldValue.delete()
    });

    this._loadFavList()

  }

  _openDeleteOrHalfPortion = (item) => { //displays two smaller buttons 
    this.setState({ longPressed: item.key })
  }

  _deleteHalfPortion = (item) => {//removes a portion of the selected food to the users daily
    console.log(item.category)
  }
  _closeDeleteOrHalfPortion = (item) => { //closes the smaller buttons
    this.setState({ longPressed: "" })
  }
  _renderFavouriteContent = section => { //renders the items on the favourite list 
    return (


      section.list.map((item, key) => (
        <View key={key} style={styles.foodItemsFav}>
          {(item.category == "Dairy") ? (
            <Image
              style={styles.catagoryIconDairy}
              source={require('../assets/dairy_Icon.png')}
            />
          ) : (item.category == "Restricted Vegetables") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/restrictedVeg_Icon.png')}
            />
          ) : (item.category == "Fruit") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/fruit_icon.png')}
            />
          ) : (item.category == "Simple Carbs") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/carb_icon.png')}
            />
          ) : (item.category == "Protein") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/protein_icon.png')}
            />
          ) : (item.category == "Fats") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/fats_icon.png')}
            />
          ) : (item.category == "Free Vegetables") ? (
            <Image
              style={styles.catagoryIcon}
              source={require('../assets/restrictedVeg_Icon.png')}
            />
          ) : (
                          <Image
                            style={styles.catagoryIcon}
                            source={require('../assets/dairy_Icon.png')}
                          />
                        )}
          <Text style={styles.content}>{item.name}</Text>
          <Text style={styles.contentSmall}>{item.portionSize}</Text>
          <View style={styles.foodItemIcons}>
            <TouchableOpacity onPress={() => this._removeFavourite(item)}>


              <Image
                style={
                  this.state.longPressed == item.key
                    ? styles.hideStarIcon
                    : styles.icon
                }
                source={require('../assets/star_Selected.png')}
              />




            </TouchableOpacity>
            {(this.state.longPressed == item.key) ? (
              //#region longpress buttons

              <View style={{ flexDirection: 'row' }}>
                <View>
                  <TouchableOpacity onPress={() => this._addHalfPortion(item)}>
                    <Image
                      style={styles.icon}
                      source={require('../assets/add_half_portion.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <TouchableOpacity onPress={() => this._closeDeleteOrHalfPortion(item)} >
                    <Image
                      style={styles.closeIcon}
                      source={require('../assets/longPress.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._deleteHalfPortion(item)}>
                    <Image
                      style={styles.icon}
                      source={require('../assets/minus_half_portion.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              //#endregion
            ) : (
                <TouchableOpacity onPress={() => this._addPortion(item)} onLongPress={() => this._openDeleteOrHalfPortion(item)}>
                  <Image
                    style={styles.icon}
                    source={require('../assets/add_Circle.png')}
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
      ))

    );
  };

  incrementPortion = async (item, portion) => {
    let dairyCount = {}
    let fatsCount = {}
    let fruitCount = {}
    let proteinCount = {}
    let resVegCount = {}
    let simpleCarbCount = {}
    let foodEntry = {}

    await firebase.firestore().collection("userData").doc(this.context.uid).collection("healthTracking").doc(this.context.todaysHealthTrackingDocId).get().then((doc) => {
      Object.values(doc.data().foodEntry).forEach((i) => {

        switch (i.name) {
          case "Dairy":
            dairyCount = i
            break;
          case "Fats":
            fatsCount = i
            break;
          case "Fruit":
            fruitCount = i
            break;
          case "Protein":
            proteinCount = i
            break;
          case "Res. Vegetables":
            resVegCount = i
            break;
          case "Simple Carbs":
            simpleCarbCount = i
            break;
          default:
            break;
        }
      })
    })

    switch (item.category) {
      case "Dairy":
        foodEntry = {
          ["dairy"]: {
            name: dairyCount.name,
            portions: dairyCount.portions + portion
          }
        }
        break;
      case "Fats":
        foodEntry = {
          ["fats"]: {
            name: fatsCount.name,
            portions: fatsCount.portions + portion
          }
        }
        break;
      case "Fruit":
        foodEntry = {
          ["fruit"]: {
            name: fruitCount.name,
            portions: fruitCount.portions + portion
          }
        }
        break;
      case "Protein":
        foodEntry = {
          ["protein"]: {
            name: proteinCount.name,
            portions: proteinCount.portions + portion
          }
        }
        break;
      case "Restricted Vegetables":
        foodEntry = {
          ["resVegs"]: {
            name: resVegCount.name,
            portions: resVegCount.portions + portion
          }
        }
        break;
      case "Simple Carbs":
        foodEntry = {
          ["simpleCarbs"]: {
            name: simpleCarbCount.name,
            portions: simpleCarbCount.portions + portion
          }
        }
        break;
      default:
        break;
    }
    this.updateDb(foodEntry)
  }
  updateDb = async (foodEntry) => {
    await firebase.firestore().collection("userData").doc(this.context.uid).collection("healthTracking").doc(this.context.todaysHealthTrackingDocId)
      .set({ foodEntry }, { merge: true })
  }

  _renderContent = section => {//renders the lists of foods in the accordion list

    return (

      section.list.map((item, key) => (


        (this.state.favouriteLists[this.state.favouriteLists.findIndex(i => i.type === item.category)].list.findIndex(i => i.name === item.name) !== -1) ? (
          <View key={key} style={styles.foodItemsFav}>
            <Text style={styles.content}>{item.name}</Text>
            <Text style={styles.contentSmall}>{item.portionSize}</Text>
            <View style={styles.foodItemIcons}>
              <TouchableOpacity onPress={() => this._removeFavourite(item)}>
                <Image
                  style={
                    this.state.longPressed == item.key
                      ? styles.hideStarIcon
                      : styles.icon
                  }
                  source={require('../assets/star_Selected.png')}
                />
              </TouchableOpacity>

              {(this.state.longPressed == item.key) ? ( //checks if someone longpressed an add button
                //#region longpress buttons

                <View style={{ flexDirection: 'row' }}>
                  <View>
                    <TouchableOpacity onPress={() => this.incrementPortion(item, 0.5)}>
                      <Image
                        style={styles.icon}
                        source={require('../assets/add_half_portion.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => this._closeDeleteOrHalfPortion(item)} >
                      <Image
                        style={styles.closeIcon}
                        source={require('../assets/longPress.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.incrementPortion(item, -0.5)}>
                      <Image
                        style={styles.icon}
                        source={require('../assets/minus_half_portion.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                //#endregion
              ) : (
                  <TouchableOpacity onPress={() => this.incrementPortion(item, 1)} onLongPress={() => this._openDeleteOrHalfPortion(item)}>
                    <Image
                      style={styles.icon}
                      source={require('../assets/add_Circle.png')}
                    />
                  </TouchableOpacity>
                )}






            </View>

          </View>
        ) : (
            <View key={key} style={styles.foodItemsFav}>
              <Text style={styles.content}>{item.name}</Text>
              <Text style={styles.contentSmall}>{item.portionSize}</Text>
              <View style={styles.foodItemIcons}>
                <TouchableOpacity onPress={() => this._addFavourite(item)}>
                  <Image
                    style={
                      this.state.longPressed == item.key
                        ? styles.hideStarIcon
                        : styles.icon
                    }
                    source={require('../assets/star_NotSelected.png')}
                  />
                </TouchableOpacity>

                {(this.state.longPressed == item.key) ? ( //checks if someone longpressed an add button
                  //#region longpress buttons

                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <TouchableOpacity onPress={() => this._addHalfPortion(item)}>
                        <Image
                          style={styles.icon}
                          source={require('../assets/add_half_portion.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <TouchableOpacity onPress={() => this._closeDeleteOrHalfPortion(item)} >
                        <Image
                          style={styles.closeIcon}
                          source={require('../assets/longPress.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._deleteHalfPortion(item)}>
                        <Image
                          style={styles.icon}
                          source={require('../assets/minus_half_portion.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  //#endregion
                ) : (
                    <TouchableOpacity onPress={() => this.incrementPortion(item)} onLongPress={() => this._openDeleteOrHalfPortion(item)}>
                      <Image
                        style={styles.icon}
                        source={require('../assets/add_Circle.png')}
                      />
                    </TouchableOpacity>
                  )}






              </View>

            </View>
          )




      ))

    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });

  };
  render() {
    const { search } = this.state;

    if (this.state.selectedIndex == 0) {
      if (this.state.searchActive) {
        return (
          <View style={styles.container}>
            <ScrollView>
              <View>


                <SearchBar
                  placeholder="Search Your Food Here..."
                  platform="ios"
                  containerStyle={{ backgroundColor: '#000', width: '96%', alignSelf: 'center' }}
                  inputContainerStyle={{ backgroundColor: '#1C1C1E' }}
                  onChangeText={this.updateFavouriteSearch}
                  value={search}
                  placeholderTextColor='#B7B7B7'
                  inputStyle={{ color: '#DDDEDE' }}

                />
                <SegmentedControlTab
                  values={["Favourites", "Food List"]}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this._handleIndexChange}

                  allowFontScaling={false}
                  tabsContainerStyle={styles.tabsContainerStyleFood}
                  tabStyle={styles.tabStyleFood}
                  firstTabStyle={styles.firstTabStyleFood}
                  lastTabStyle={styles.lastTabStyleFood}
                  tabTextStyle={styles.tabTextStyleFood}
                  activeTabStyle={styles.activeTabStyleFood}
                  activeTabTextStyle={styles.activeTabTextStyleFood}
                />
                {this._renderFavouriteContent(this.state.searchLists[0])}
                {this._renderFavouriteContent(this.state.searchLists[1])}
                {this._renderFavouriteContent(this.state.searchLists[2])}
                {this._renderFavouriteContent(this.state.searchLists[3])}
                {this._renderFavouriteContent(this.state.searchLists[4])}
                {this._renderFavouriteContent(this.state.searchLists[5])}
                {this._renderFavouriteContent(this.state.searchLists[6])}


              </View>
            </ScrollView>
          </View>
        )

      }
      else if (!this.state.searchActive) {
        return (

          <View style={styles.container}>
            <ScrollView>
              <View>


                <SearchBar
                  placeholder="Search Your Food Here..."
                  platform="ios"
                  containerStyle={{ backgroundColor: '#000', width: '96%', alignSelf: 'center' }}
                  inputContainerStyle={{ backgroundColor: '#1C1C1E' }}
                  onChangeText={this.updateFavouriteSearch}
                  value={search}
                  placeholderTextColor='#B7B7B7'
                  inputStyle={{ color: '#DDDEDE' }}

                />
                <SegmentedControlTab
                  values={["Favourites", "Food List"]}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this._handleIndexChange}

                  allowFontScaling={false}
                  tabsContainerStyle={styles.tabsContainerStyleFood}
                  tabStyle={styles.tabStyleFood}
                  firstTabStyle={styles.firstTabStyleFood}
                  lastTabStyle={styles.lastTabStyleFood}
                  tabTextStyle={styles.tabTextStyleFood}
                  activeTabStyle={styles.activeTabStyleFood}
                  activeTabTextStyle={styles.activeTabTextStyleFood}
                />
                {this._renderFavouriteContent(this.state.favouriteLists[0])}
                {this._renderFavouriteContent(this.state.favouriteLists[1])}
                {this._renderFavouriteContent(this.state.favouriteLists[2])}
                {this._renderFavouriteContent(this.state.favouriteLists[3])}
                {this._renderFavouriteContent(this.state.favouriteLists[4])}
                {this._renderFavouriteContent(this.state.favouriteLists[5])}
                {this._renderFavouriteContent(this.state.favouriteLists[6])}


              </View>
            </ScrollView>
          </View>

        )

      }


    }
    else if (this.state.selectedIndex == 1) {
      if (this.state.searchActive) {

        return (
          <View style={styles.container}>
            <ScrollView>
              <View>


                <SearchBar
                  placeholder="Search Your Food Here..."
                  platform="ios"
                  containerStyle={{ backgroundColor: '#000', width: '96%', alignSelf: 'center' }}
                  inputContainerStyle={{ backgroundColor: '#1C1C1E' }}
                  onChangeText={this.updateSearch}
                  value={search}
                  inputStyle={{ color: '#DDDEDE' }}
                  placeholderTextColor='#B7B7B7'
                />
                <SegmentedControlTab
                  values={["Favourites", "Food List"]}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this._handleIndexChange}

                  allowFontScaling={false}
                  tabsContainerStyle={styles.tabsContainerStyleFav}
                  tabStyle={styles.tabStyleFav}
                  firstTabStyle={styles.firstTabStyleFav}
                  lastTabStyle={styles.lastTabStyleFav}
                  tabTextStyle={styles.tabTextStyleFav}
                  activeTabStyle={styles.activeTabStyleFav}
                  activeTabTextStyle={styles.activeTabTextStyleFav}
                />
                {this._renderHeader(this.state.searchLists[0])}
                {this._renderContent(this.state.searchLists[0])}
                {this._renderHeader(this.state.searchLists[1])}
                {this._renderContent(this.state.searchLists[1])}
                {this._renderHeader(this.state.searchLists[2])}
                {this._renderContent(this.state.searchLists[2])}
                {this._renderHeader(this.state.searchLists[3])}
                {this._renderContent(this.state.searchLists[3])}
                {this._renderHeader(this.state.searchLists[4])}
                {this._renderContent(this.state.searchLists[4])}
                {this._renderHeader(this.state.searchLists[5])}
                {this._renderContent(this.state.searchLists[5])}
                {this._renderHeader(this.state.searchLists[6])}
                {this._renderContent(this.state.searchLists[6])}
              </View>
            </ScrollView>
          </View>


        )

      }
      else if (!this.state.searchActive) {
        return (

          <View style={styles.container}>
            <ScrollView>
              <View>


                <SearchBar
                  placeholder="Search Your Food Here..."
                  platform="ios"
                  containerStyle={{ backgroundColor: '#000', width: '96%', alignSelf: 'center' }}
                  inputContainerStyle={{ backgroundColor: '#1C1C1E' }}
                  onChangeText={this.updateSearch}
                  value={search}
                  placeholderTextColor='#B7B7B7'
                  inputStyle={{ color: '#DDDEDE' }}

                />
                <SegmentedControlTab
                  values={["Favourites", "Food List"]}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this._handleIndexChange}

                  allowFontScaling={false}
                  tabsContainerStyle={styles.tabsContainerStyleFav}
                  tabStyle={styles.tabStyleFav}
                  firstTabStyle={styles.firstTabStyleFav}
                  lastTabStyle={styles.lastTabStyleFav}
                  tabTextStyle={styles.tabTextStyleFav}
                  activeTabStyle={styles.activeTabStyleFav}
                  activeTabTextStyle={styles.activeTabTextStyleFav}
                />
                <Accordion style={styles.listContainer}
                  sections={this.state.lists}
                  activeSections={this.state.activeSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                />

              </View>
            </ScrollView>
          </View>

        )
      }
    }
  }
}



const styles = StyleSheet.create({
  //Styling by Jeff March 17
  container: {
    backgroundColor: '#000',
  },
  foodItems: { //accordian list items
    flexDirection: 'row',
    paddingLeft: 16,
    paddingTop: 16,
    marginBottom: 16,
    borderBottomColor: '#B7B7B7',
    borderBottomWidth: .5,
    borderBottomStartRadius: 16,
    alignContent: 'center',
  },
  foodItemsFav: { //fav list items
    flexDirection: 'row',
    marginLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: '#B7B7B7',
    borderBottomWidth: .5,
    alignContent: 'center',
  },
  listContainer: { //accodian background
    backgroundColor: '#1C1C1E',
  },
  content: {  //item name in accordian
    color: '#DDDEDE',
    alignSelf: 'center',
    fontSize: 16,
    flex: 2,
    paddingLeft: 8
  },
  contentSmall: { //accordian portino size
    color: '#DDDEDE',
    alignSelf: 'center',
    fontSize: 12,
    flex: 1.5,
    flexWrap: 'wrap',
    marginRight: 15
  },
  foodItemIcons: {  //accorian add portion/fav icon
    flexDirection: 'row',
    flex: 1,
    justifyContent: "flex-end",
    alignContent: 'center',
  },
  listItemTitle: { //foodlist catagories
    paddingLeft: 16,
    fontSize: 22,
    color: '#DDDEDE',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemContainer: //space between
  {
    height: 45,
    paddingLeft: 16,
    marginTop: 16,
    backgroundColor: '#1C1C1E',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: { //fav & add portion icon style
    height: 30,
    width: 30,
    marginRight: 16,
    resizeMode: 'center'
  },
  closeIcon: {
    height: 30,
    width: 30,
    marginRight: 16,
    marginBottom: 16,
    resizeMode: 'center'
  },
  hideStarIcon: {
    height: 30,
    width: 30,
    marginRight: 16,
    resizeMode: 'center',
    display: 'none'
  },
  catagoryIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center'
  },
  catagoryIconDairy: {
    height: 30,
    width: 22,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainerStyleFood: {
    width: 250,
    alignSelf: 'center',
    marginBottom: 8,
  },
  tabStyleFood: {
    borderColor: '#636366',
    backgroundColor: '#1C1C1E'
  },
  tabTextStyleFood: {
    color: '#DDDEDE'
  },
  activeTabStyleFood: {
    backgroundColor: '#636366',
  },
  activeTabTextStyleFood: {
    color: '#DDDEDE'
  },
  tabsContainerStyleFav: {
    width: 250,
    alignSelf: 'center',
  },
  tabStyleFav: {
    borderColor: '#636366',
    backgroundColor: '#1C1C1E'
  },
  tabTextStyleFav: {
    color: '#DDDEDE'
  },
  activeTabStyleFav: {
    backgroundColor: '#636366',
  },
  activeTabTextStyleFav: {
    color: '#DDDEDE'
  },
});