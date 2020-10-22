class Goods {
  constructor() {
    Goods.list();
  }
  /* 
  获取商品信息的
  static 静态方法
  静态方法只属于某个类
  */
  static list () {
    //发送ajax请求
    axios.get('http://localhost/1012/server/server.php?fn=lst')
      .then(res => {
        //将数据转化为json对象
        let { meta, data } = JSON.parse(res);
        //判断状态
        if (meta.status == 200) {
          //遍历对象数组
          let html = '';
          data.forEach(ele => {
            let { id, goodsName, price, goodsImg } = ele;
            html += `<div class="box"><img src="${goodsImg}" 
            alt=""><p>${goodsName}</p><span class="goods_item_price" 
            data-price-id="100004222715" style="">¥${price}</span>
            <a href="javascript:" id="InitCartUrl" class="btn-special1 btn-lg" onclick="Goods.addCart(${id},1)">加入购物车</a>
            </div>`;
          });
          //追加到页面中去
          let cont = document.querySelector('#cont');
          cont.innerHTML = html;
        }
      });
  }
  /*添加购物车方法
  购物车逻辑：
  1.判断cart这个key是否存在
  2.存在就判断商品是否存在
    2-1商品存在增加竖向
    2-2商品不存在新增商品
  3.不存在则新增cart
  */
  static addCart (id, num) {
    //获取 cart
    let cartGoods = localStorage.getItem('cart');
    //判断是否存在
    if (cartGoods) {
      cartGoods = JSON.parse(cartGoods);
      for (let attr in cartGoods) {
        if (id == attr) {
          num += cartGoods[id];
        }
      }
      // 设置商品,商品存在就更新数量,不存在就新增
      cartGoods[id] = num;
      cartGoods = JSON.stringify(cartGoods);
      localStorage.setItem('cart', cartGoods);
    } else {
      cartGoods = { [id]: num };
      cartGoods = JSON.stringify(cartGoods);
      localStorage.setItem('cart', cartGoods);
    }
  }

}
new Goods();