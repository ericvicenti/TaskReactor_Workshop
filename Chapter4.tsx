import "react-native-gesture-handler";
import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import {
  NavigationContainer,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ScrollView } from "react-native-gesture-handler";
import TaskRow from "./components/3-TaskRow";
import {
  useTaskList,
  useTaskTitle,
  deleteTask,
  useTask,
  createTask,
} from "./logic/TaskLogic";
import Ionicons from "@expo/vector-icons/Ionicons";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootParamList = {
  Home: undefined;
  NewTask: undefined;
  Task: { id: string };
};
type HomeScreenNavigationProp = StackNavigationProp<RootParamList, "Home">;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  const tasks = useTaskList();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
      <View style={{ borderTopWidth: 1, borderColor: "#ddd" }}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            title={task.title}
            onPress={() => {
              navigation.push("Task", { id: task.id });
            }}
          />
        ))}
      </View>
      <Button
        title="New Task..."
        onPress={() => {
          navigation.navigate("NewTask");
        }}
      />
    </ScrollView>
  );
}

type TaskScreenProps = {
  route: RouteProp<RootParamList, "Task">;
  navigation: NavigationProp<RootParamList, "Task">;
};

function TaskScreen({ route, navigation }: TaskScreenProps) {
  const task = useTask(route.params.id);
  if (!task) {
    return null;
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>{task.title}</Text>
      <Text>{task.isComplete ? "Complete" : "Not Complete"}</Text>
      <Button
        title="Delete Task"
        onPress={() => {
          navigation.goBack();
          deleteTask(task.id);
        }}
        color="#922"
      />
      <Button
        title="See a bug?"
        onPress={() => {
          navigation.navigate("Support", {
            screen: "ReportBug",
          });
        }}
      />
    </ScrollView>
  );
}
type NewTaskScreenProps = {
  navigation: NavigationProp<RootParamList, "NewTask">;
};
function NewTaskScreen({ navigation }: NewTaskScreenProps) {
  const [newTitle, setNewTitle] = React.useState("");
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (newTitle === "") {
          return false;
        } else {
          Alert.alert("Unfinished changes");
          return true;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [newTitle === ""])
  );
  function handleSubmit() {
    if (newTitle === "") return;
    createTask(newTitle);
    navigation.goBack();
  }
  function handleNewTitle(title: string) {
    navigation.setOptions({
      gestureEnabled: title === "",
    });
    setNewTitle(title);
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={0}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 10 }} />
        <TextInput
          autoFocus
          value={newTitle}
          onChangeText={handleNewTitle}
          onSubmitEditing={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#ddd",
            marginVertical: 10,
          }}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TaskTitle({ id }: { id: string }) {
  const title = useTaskTitle(id);
  return <Text>{title}</Text>;
}

function DiscussScreen() {
  return null;
}

function TagsScreen({ navigation }: any) {
  const tasks = useTaskList();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
      <View style={{ borderTopWidth: 1, borderColor: "#ddd" }}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            title={task.title}
            onPress={() => {
              navigation.push("Task", { id: task.id });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const MainStack = createStackNavigator();
function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Task Reactor!",
        }}
      />
      <MainStack.Screen
        name="Task"
        component={TaskScreen}
        options={({ route, navigation }: any) => ({
          title: <TaskTitle id={route.params.id} />,
          headerRight: () => (
            <Button
              title="Discuss"
              color="#239"
              onPress={() => {
                navigation.navigate("Discuss", {
                  id: route.params.id,
                });
              }}
            />
          ),
        })}
      />
      <MainStack.Screen
        name="Discuss"
        component={DiscussScreen}
        options={({ route, navigation }) => ({
          title: `Discuss Task`,
        })}
      />
    </MainStack.Navigator>
  );
}
const TagStack = createStackNavigator();
function TagsStackScreen() {
  return (
    <TagStack.Navigator>
      <TagStack.Screen
        name="Tags"
        component={TagsScreen}
        options={{
          title: "Task Tags",
        }}
      />
      <TagStack.Screen
        name="Task"
        component={TaskScreen}
        options={({ route, navigation }: any) => ({
          title: <TaskTitle id={route.params.id} />,
          headerRight: () => (
            <Button
              title="Discuss"
              color="#239"
              onPress={() => {
                navigation.navigate("Discuss", {
                  id: route.params.id,
                });
              }}
            />
          ),
        })}
      />
      <TagStack.Screen
        name="Discuss"
        component={DiscussScreen}
        options={({ route, navigation }) => ({
          title: `Discuss Task`,
        })}
      />
    </TagStack.Navigator>
  );
}
function TitleScreen({ title }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 32, textAlign: "center" }}>{title}</Text>
    </View>
  );
}
function HistoryScreen() {
  return <TitleScreen title="Recent Activity" />;
}
function SupportHomeScreen() {
  return <TitleScreen title="Support Home" />;
}
function ReportBugScreen() {
  return <TitleScreen title="Report a Bug" />;
}
function SystemStatusScreen() {
  return <TitleScreen title="System Status" />;
}
const Drawer = createDrawerNavigator();

function SupportScreen() {
  return (
    <Drawer.Navigator initialRouteName="SupportHome">
      <Drawer.Screen name="SupportHome" component={SupportHomeScreen} />
      <Drawer.Screen name="ReportBug" component={ReportBugScreen} />
      <Drawer.Screen name="SystemStatus" component={SystemStatusScreen} />
    </Drawer.Navigator>
  );
}
const MainTabs = createBottomTabNavigator();
function MainTabsScreen() {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Support") {
            iconName = focused ? "ios-help-circle" : "ios-help-circle-outline";
          } else if (route.name === "Home") {
            iconName = focused ? "ios-checkbox" : "ios-checkbox-outline";
          } else if (route.name === "Tags") {
            iconName = focused ? "ios-list-box" : "ios-list";
          } else {
            iconName = focused ? "ios-cloud" : "ios-cloud-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <MainTabs.Screen name="Home" component={MainStackScreen} />
      <MainTabs.Screen name="Tags" component={TagsStackScreen} />
      <MainTabs.Screen name="History" component={HistoryScreen} />
      <MainTabs.Screen name="Support" component={SupportScreen} />
    </MainTabs.Navigator>
  );
}

const RootStack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={MainTabsScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="NewTask"
          component={NewTaskScreen}
          options={({ navigation }) => ({
            title: "Add Task",
            headerLeft: null,
            headerRight: () => (
              <Button
                title="cancel"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
