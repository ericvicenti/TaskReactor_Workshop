import "react-native-gesture-handler";
import * as React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ScrollView } from "react-native-gesture-handler";
import TaskRow from "../../components/3-TaskRow";
import { useTaskList, deleteTask, createTask } from "../../logic/TaskLogic";
import Ionicons from "@expo/vector-icons/Ionicons";

function HomeScreen({ navigation }) {
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

function TaskScreen({ route, navigation }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>{route.params.title}</Text>
      <Button
        title="Delete Task"
        onPress={() => {
          navigation.goBack();
          deleteTask(route.params.id);
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
function NewTaskScreen({ navigation }) {
  const [newTitle, setNewTitle] = React.useState("");

  function handleSubmit() {
    if (newTitle === "") return;
    createTask(newTitle);
    navigation.goBack();
  }
  function handleNewTitle(title) {
    navigation.setOptions({
      gestureEnabled: title === "",
    });
    setNewTitle(title);
  }
  return (
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
  );
}

function TagsScreen({ navigation }) {
  const tasks = useTaskList();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
      <View style={{ borderTopWidth: 1, borderColor: "#ddd" }}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            title={task.title}
            onPress={() => {
              navigation.push("Task", { id: task.id, title: task.title });
            }}
          />
        ))}
      </View>
    </ScrollView>
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
function DiscussScreen() {
  return <TitleScreen title="Discuss" />;
}

const MainStack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
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
          options={({ route, navigation }) => ({
            title: route.params.title,
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
    </NavigationContainer>
  );
}

export default App;
