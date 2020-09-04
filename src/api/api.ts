import axios from 'axios';
import url from './serverAPI.config';

//接口1方法
export function login(data: any) {
  return axios
    .post(url.login, data)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });

  // return server({
  //     url: url.login,
  //     method: 'post',
  //     dataType: "json",
  //     contentType: "application/x-www-form-urlencoded;charset=UTF-8",
  //     data: data
  // })
}
