<?php
include('./mysql.php');
$fn = $_GET['fn'];
$fn();

function lst()
{
  $id = $_POST['goodsId'];
  $id = substr($id,0,strlen($id)-1);
  // 一次性获取多条数据
  $sql = "select * from product where id in ($id)";
 // echo $sql;
 $data = select($sql);
 echo json_encode([
  'meta'=>[
    'status'=>200,
    'msg'=>'成功'
  ],
  'data'=>$data
]);
}

?>