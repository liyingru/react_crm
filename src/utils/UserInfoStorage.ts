// import RenderAuthorize from '@/components/Authorized';
// import { getAuthority } from './authority';
import { UserInfo } from '@/pages/user/login/data';
import LOCAL from './LocalStorageKeys';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
// let Authorized = RenderAuthorize(getAuthority());

// Reload the rights component
const getUserInfo = () => {
  const currentUserInfoStr = localStorage ? localStorage.getItem(LOCAL.USER_INFO) : "{}";
  let currentUserInfo: UserInfo | undefined;
  try {
    if (currentUserInfoStr) {
      currentUserInfo = JSON.parse(currentUserInfoStr);
    }
  } catch (e) {
    currentUserInfo = undefined;
  }
  return currentUserInfo;
}

/**
 * 1: 到喜啦
 * 2：北京：喜铺、尼克、蘭Club、数据中心、北京婚纱摄影、兰摩婚纱、北京婚车等
 * 3：武汉：喜庄、塞尔维、武汉到喜啦渠道
 * 4：星享非凡
 * 5：埃菲尔
 */
const getCompanyType = () => {
  const userInfo = CrmUtil.getUserInfo();
  if (userInfo) {
    if (userInfo.company_tag == 'DXL') {
      return 1;
    } else if (userInfo.company_tag == 'XP' || userInfo.company_tag == 'NK' || userInfo.company_tag == 'LANCLUB' || userInfo.company_tag == 'SJZX' || userInfo.company_tag == 'BJHSSY' || userInfo.company_tag == 'LMHS' || userInfo.company_tag == 'BJHC') {
      // 喜铺、尼克、蘭Club   // 这三个公司，新建客资如果选择跳过线索，会自动生成需求单。
      return 2;
    } else if (userInfo.company_tag == 'XZ' || userInfo.company_tag == 'SEW' || userInfo.company_tag == 'WHEPC') {  // 喜庄  塞尔维  武汉到喜啦渠道
      return 3;
    } else if (userInfo.company_tag == 'XX') {  // 星享非凡
      return 4;
    } else if (userInfo.company_tag == 'AFE') {  // 埃菲尔
      return 5;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

const getCompanyTag = () => {
  return CrmUtil.getUserInfo()?.company_tag;
}

const getCompanyName = () => {
  const userInfo = CrmUtil.getUserInfo();
  if (userInfo) {
    const company_tag = userInfo.company_tag;
    if (company_tag && company_tag == 'DXL') {
      return '到喜啦'
    } else if (company_tag && company_tag == 'SEW') {
      return '塞尔维'
    } else if (company_tag && company_tag == 'XZ') {
      return '喜庄'
    } else {
      return '';
    }
  } else {
    return '';
  }
}

const CrmUtil = {
  getUserInfo, getCompanyType, getCompanyTag, getCompanyName,
}

export default CrmUtil;
