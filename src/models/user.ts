import { response } from 'express';
import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, queryasqueryUsers, getGroupUserList, userList } from '@/services/user';
import LOCAL from '@/utils/LocalStorageKeys';
import CrmUtil from '@/utils/UserInfoStorage';
import { UserInfo } from '@/pages/user/login/data';

// export interface CurrentUser {
//   avatar?: string;
//   name?: string;
//   title?: string;
//   group?: string;
//   signature?: string;
//   tags?: {
//     key: string;
//     label: string;
//   }[];
//   id?: string;
//   unreadCount?: number;
// }

export interface UserGroupParams {
  /**
  "keywords
   */
  keywords?: string;
}

export interface UserGroupItem {
  /**
  "group_id": 1,
  "group_name": "400客服组",
  "user_id": 2,
  "username": ""
   */
  group_id?: string;
  group_name?: string;
  user_id?: string;
  username?: string;
}


export interface UserModelState {
  // currentUser?: CurrentUser;
  currentUser?: UserInfo;
  userGroupList?: UserGroupItem[];
}


export interface UserModelType {
  namespace: 'user';    //  命名空间
  state: UserModelState;  // 存放数据
  effects: {   //  获取数据
    fetch: Effect;
    fetchCurrent: Effect;
    getGroupUserList:Effect
  };
  reducers: {   // 处理数据
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    saveUserGroupList: Reducer<UserModelState>;
  };
}


 

const UserModel: UserModelType = {
  namespace: 'user',

  state: {  // 存储Model的初始数据
    currentUser: {},
    userGroupList:[],
  },

  /**
   * effects 用于与后台的交互，处理数据逻辑
   */
  effects: {
    *fetch(_, { call, put }) {  //  "_"代表没有参数，
      const response = yield call(queryUsers);
      yield put({   //  put 用来触发reducer的方法
        type: 'save',  // reducer中的save方法
        payload: response,   
      });
    },
    /**
     * 进入首页时，先尝试获取currentUser信息，如果拿到了数据就直接进入主页。如果拿不到，就定位到login页面。
     * @param _ 
     * @param param1 
     */
    *fetchCurrent(_, { call, put }) {
      // const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
      // let currentUserInfo;
      // try {
      //   if (currentUserInfoStr) {
      //     currentUserInfo = JSON.parse(currentUserInfoStr);
      //   }
      // } catch (e) {
      //   currentUserInfo = currentUserInfoStr;
      // }

      const currentUserInfo = CrmUtil.getUserInfo();

      yield put({
        type: 'saveCurrentUser',  //  回调方法
        payload: currentUserInfo,  // 回调方法中的action的参数
      });
    },

     //用户列表
     *getGroupUserList({ payload }, { call, put  }) { 
      const response =  yield call(getGroupUserList, payload); 
      const userList = response.data.result;
      yield put({
        type: 'saveUserGroupList',
        payload: userList
      });
    },  
  },

  /**
   * 能改变界面的action放这里，用来return state 从而改变UI界面
   */
  reducers: {
    //用户组列表数据
    saveUserGroupList(state, action) {
      return {
        ...state, 
        userGroupList: action.payload  //第一个data是state的，第二个data是payload的
     };
    },
    // saveCurrentUser理解为一个方法名  里面的state就是初始的数据
    saveCurrentUser(state, action) {
      return {  // return 新的state，这样页面就会更新
        ...state,  // 把旧的state全部展开
        currentUser: action.payload || {},  // 更新原有的state中的currentUser的值
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
   
  },
  
};

export default UserModel;
