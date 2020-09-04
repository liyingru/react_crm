import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getCompanyList, getRoleList, getPermissionsList, getRoleTree, addRole, deleteRole, editRole } from './service';

import { RoleData, CompanyData, PermissionData, PermissionSubData, RoleTreeData } from './data';

export interface StateType {
  data: {rolesList: RoleData[]};
  companyList?: CompanyData[]|undefined;
  permissions?: PermissionData[];
  roleTreeList?: RoleTreeData[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCompanyList: Effect;
    getRolesListByCompanyId: Effect;
    getPermissionsConfig: Effect;
    getRoleTreeList: Effect;
    addRole: Effect;
    deleteRole: Effect;
    updateRole: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
 

const Model: ModelType = {
  namespace: 'roleManagementModel',

  state: {
    data: {
      rolesList: [],
    },
    companyList: undefined,
    permissions: undefined,
  },


  effects: {
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList);
      if(response.code == 200) {
        const companyList: CompanyData[] = response.data.result.rows;
        const isAdmin = payload.isAdmin;
        if(isAdmin) {
          yield put({
            type: 'save',
            payload: {
              companyList
            }
          },);
          if(callback) {
            callback(companyList);
          }
        } else {
          const userCompanyId = payload.userCompanyId;
          const selfCompanyList = companyList.filter(companyItem => companyItem.id.toString() == userCompanyId.toString());
          yield put({
            type: 'save',
            payload: {
              companyList: selfCompanyList
            }
          },);
          if(callback) {
            callback(selfCompanyList);
          }
        }
      } else {
        if(callback) {
          callback(false);
        }
      }
    },
    *getRolesListByCompanyId({ payload, callback }, { call, put }) {
      const response = yield call(getRoleList, payload);
      if(response.code == 200 && response.data.result.rows) {
        const rolesList:RoleData[] = response.data.result.rows;
        yield put({
          type: 'save', 
          payload: {
            data: {
              rolesList,
            }
          },
        });
        if(callback) callback(rolesList)
      } else {
        yield put({
          type: 'save', 
          payload: {
            data: {
              rolesList: [],
            }
          },
        });
      }
    },
    *getPermissionsConfig({ payload }, { call, put }) {
      const response = yield call(getPermissionsList, payload);
      if(response.code == 200 && response.data.result.rows) {
        const rawMenus = response.data.result.rows;
        const permissions:PermissionData[] = [];
        for(let i = 0; i < rawMenus.length; i++) {
          let options: PermissionSubData[] = [];
          options[0] = {
            id: rawMenus[i].id,
            name: rawMenus[i].name
          }
          if(rawMenus[i].childlist.length>0) {
            for(let j = 0; j < rawMenus[i].childlist.length; j++) {
              options = [
                ...options,
                {
                  id: rawMenus[i].childlist[j].id,
                  name: rawMenus[i].childlist[j].name,
                }
              ]
              if(rawMenus[i].childlist[j].childlist.length>0) {
                for(let k = 0; k < rawMenus[i].childlist[j].childlist.length; k++) {
                  options = [
                    ...options,
                    {
                      id: rawMenus[i].childlist[j].childlist[k].id,
                      name: rawMenus[i].childlist[j].childlist[k].name,
                    }
                  ]
                }
              }
            }
          }
          permissions[i] = {
            title: rawMenus[i].name,
            options
          }
        }
        console.log("最终的permissions列表为 = " + JSON.stringify(permissions))
        yield put({
          type: 'save', 
          payload: {
            permissions
          },
        });
      } else {
        yield put({
          type: 'save', 
          payload: {
            permissions:[]
          },
        });
      }
    },

    *getRoleTreeList({ payload, callback }, { call, put }) {
      const response = yield call(getRoleTree, payload);
      if(response.code == 200 && response.data.result) {
        const roleTreeList = response.data.result;
        yield put({
          type: 'save', 
          payload: {
            roleTreeList
          },
        });
      } else {
        yield put({
          type: 'save', 
          payload: {
            roleTreeList:[]
          },
        });
      }
      if(callback) callback(response.code == 200);
    },

    *addRole({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      if (callback) callback(response.code == 200);
    },

    *deleteRole({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (callback) callback(response.code == 200);
    },

    *updateRole({ payload, role, callback }, { call, put }) {
      payload = {
        id: role.id,
        name: role.name,
        right: role.rights,
        tag: role.tag,
        dataAuthority: role.dataAuthority,
        ...payload,
      }
      const response = yield call(editRole, payload);
      if (callback) callback(response.code == 200);
    },
  },

  reducers: {

    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },

  },
};

export default Model;
