class Cart {
  static checkOne;//商品单选按钮
  static all;//全选按钮
  static deleteAll;
  constructor() {
    // 获取全选按钮
    Cart.all = document.querySelectorAll('.check-all');
    Cart.list();
    //获取商品单选按钮
    Cart.checkOne = document.getElementsByClassName('check-one');
    Cart.checkAll();
    //删除按钮的获取
    Cart.deleteAll = document.getElementById('deleteAll');
    Cart.delete();
  }
  /*商品列表*/
  static list () {
    //获取商品id
    let goodsId = JSON.parse(localStorage.getItem('cart'));
    var goodsIdStr = '';//存放商品id的 用来拼接的字符串
    for (var id in goodsId) {
      goodsIdStr += id + ',';
    }
    //发送ajax请求，获取数据
    axios.post('http://localhost/1012/server/cart.php?fn=lst', 'goodsId=' + goodsIdStr).then(res => {
      let { meta, data } = JSON.parse(res);
      if (meta.status == 200) {
        let html = '';
        data.forEach(goods => {
          let { id, goodsName, price, goodsImg } = goods;
          html +=
            `<tr>
              <td class="checkbox" >
                <input class="check-one check" onclick="Cart.chOne()" type="checkbox" ids=${id} />
              </td >
              <td class="goods">
                <img src="${goodsImg}" alt="" />
                <span>${goodsName}</span>
              </td>
              <td class="price">${price}</td>
              <td class="count">
                <span class="reduce" onclick="Cart.cutGoodsNum(this,${id})">-</span>
                <input class="count-input" type="text" value="${goodsId[id]}" />
                <span class="add" onclick="Cart.addGoodsNum(this,${id})">+</span>
              </td>
              <td class="subtotal">${(goodsId[id] * price).toFixed(2)}</td>
              <td class="operation">
                <span class="delete" onclick = "Cart.delGoods(this,${id})">删除</span>
              </td>
            </tr >`;
        });
        let tbody = document.querySelector('tbody');
        tbody.innerHTML = html;
      }
    });
  }
  /*全选实现*/
  static checkAll () {
    //给全选绑定事件
    Cart.all[0].addEventListener('click', Cart.allEvevt);
    Cart.all[1].addEventListener('click', Cart.allEvevt);
  }
  //全选事件方法
  static allEvevt () {
    //获取全选按钮状态
    let check = this.checked;
    //获取所有商品单选按钮，让他们跟随全选按钮状态
    Array.from(Cart.checkOne).forEach(ele => {
      ele.checked = check;
    });
    //设置另一个全选按钮跟随状态
    Cart.all[0].checked = check;
    Cart.all[1].checked = check;
    //更新数量和小计
    Cart.goodsCount();
  }
  /*单选的操作*/
  static chOne () {
    //获取单个商品的数量
    let goodsLen = Cart.checkOne.length;
    let count = 0;
    //统计选中状态的个数
    Array.from(Cart.checkOne).forEach(ele => {
      if (ele.checked) count++;
    });
    //判断选中的个数是否等于商个数
    let checkSta = false;
    if (goodsLen == count) {
      checkSta = true;
    }
    //设置全选按钮的状态
    Cart.all[0].checked = checkSta;
    Cart.all[1].checked = checkSta;
    //更新数量和小计
    Cart.goodsCount();
  }
  /*价格和数量的统计*/
  static goodsCount () {
    let count = 0;//数量
    let price = 0;//小计
    //统计选中的单选按钮对应的商品数量
    Array.from(Cart.checkOne).forEach(ele => {
      if (ele.checked) {
        //找到数量节点
        let trObj = ele.parentNode.parentNode;
        let goodsNum = trObj.getElementsByClassName('count-input')[0].value - 0;
        count += goodsNum;
        //获取小计
        let xj = trObj.getElementsByClassName('subtotal')[0].innerHTML - 0;
        price += xj;
      }
    });
    // 放到已选商品和合计
    let totaObj = document.getElementById('selectedTotal');
    let priceObj = document.getElementById('priceTotal');
    totaObj.innerHTML = count;
    priceObj.innerHTML = price.toFixed(2);
  }
  /*商品数量增加的改变*/
  static clickStatus = true;//防止过快点击
  static addGoodsNum (that, id) {
    //设计延时器 0.5s点击一次
    if (!this.clickStatus) return;
    Cart.clickStatus = false;
    setTimeout(() => {
      Cart.clickStatus = true;
    }, 500);
    let numObj = that.previousElementSibling;
    let num = numObj.value - 0;
    num++;
    numObj.value = num;
    let cartGoods = JSON.parse(localStorage.getItem('cart'));
    cartGoods[id] = num;
    localStorage.setItem('cart', JSON.stringify(cartGoods));
    //更新小计
    let trObj = that.parentNode.parentNode;
    let oneP = trObj.getElementsByClassName('price')[0].innerHTML;
    trObj.getElementsByClassName('subtotal')[0].innerHTML = (oneP * num).toFixed(2);
    //更新数量和小计
    Cart.goodsCount();
  }
  /*商品数量减少的改变*/
  static clickStatus = true;//防止过快点击
  static cutGoodsNum (that, id) {
    //设计延时器 0.5s点击一次
    if (!this.clickStatus) return;
    Cart.clickStatus = false;
    setTimeout(() => {
      Cart.clickStatus = true;
    }, 500);
    let numObj = that.nextElementSibling;
    let num = numObj.value - 0;
    num--;
    if (num <= 1) num = 1;
    numObj.value = num;
    let cartGoods = JSON.parse(localStorage.getItem('cart'));
    cartGoods[id] = num;
    localStorage.setItem('cart', JSON.stringify(cartGoods));
    //更新小计
    let trObj = that.parentNode.parentNode;
    let oneP = trObj.getElementsByClassName('price')[0].innerHTML;
    trObj.getElementsByClassName('subtotal')[0].innerHTML = (oneP * num).toFixed(2);
    //更新数量和小计
    Cart.goodsCount();
  }
  /*删除的实现*/
  static delGoods (that, id) {
    //删除tr
    that.parentNode.parentNode.remove();
    //更新local
    let cartGoods = JSON.parse(localStorage.getItem('cart'));
    //删除属性
    delete cartGoods[id];
    localStorage.setItem('cart', JSON.stringify(cartGoods));
    //更新数量和小计
    Cart.goodsCount();
  }
  //多选删除的实现
  static delete () {
    Cart.deleteAll.addEventListener('click', Cart.deleteAllFun);
  }
  static deleteAllFun () {
    var id;
    Array.from(Cart.checkOne).forEach(ele => {
      if (ele.checked) {
        id = ele.getAttribute('ids');
        Cart.delGoods(ele, id);
      }
    });
  }
}
new Cart;