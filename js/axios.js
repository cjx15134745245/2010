let axios = {
  get (url) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      // 准备一个请求
      xhr.open('get', url);
      // 监听状态,接收服务返回的数据
      xhr.onreadystatechange = function () {
        // ajax状态4 服务器 200
        if (xhr.readyState == 4 && xhr.status == 200) {
          // 接收返回值
          let res = xhr.responseText;
          resolve(res)
        }
      }
      // 发送请求
      xhr.send();
    })
  },
  post (url, data) {
    return new Promise(function (resolve, reject) {
      //1 实例化对象
      let xhr = new XMLHttpRequest();
      // 2设置一个请求
      xhr.open('post', url);
      // 所有的post请求,必须设置参数的编码方式
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      // 3 监听请求
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          // 接收返回值
          resolve(xhr.response)
        }
      }
      //4 发送请求
      xhr.send(data);
    })
  }
}