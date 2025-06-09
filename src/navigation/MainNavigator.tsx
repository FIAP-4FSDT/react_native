import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../theme';

import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import MyPostsScreen from '../screens/main/MyPostsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import PostDetailScreen from '../screens/main/PostDetailScreen';
import CreatePostScreen from '../screens/main/CreatePostScreen';
import EditPostScreen from '../screens/main/EditPostScreen';

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  MyPostsTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  PostDetail: {postId: number};
  CreatePost: undefined;
  EditPost: {postId: number};
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'SearchTab':
              iconName = 'search';
              break;
            case 'MyPostsTab':
              iconName = 'article';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{title: 'Início'}}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen}
        options={{title: 'Buscar'}}
      />
      <Tab.Screen 
        name="MyPostsTab" 
        component={MyPostsScreen}
        options={{title: 'Meus Posts'}}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{title: 'Perfil'}}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;