### 地图控件

#### 缩放控件

```js
var zoomCtrl = new BMapGL.ZoomControl();
map.addControl(zoomCtrl);
```

#### 比例尺控件

```js
var scaleCtrl = new BMapGL.ScaleControl();  
map.addControl(scaleCtrl);
``` 

#### 3D控制控件

```js
var navi3DCtrl = new BMapGL.NavigationControl3D();  
map.addControl(navi3DCtrl);
```

#### 定位相关控件

```js
// 创建定位控件
var locationControl = new BMapGL.LocationControl({
    // 控件的停靠位置（可选，默认左上角）
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    // 控件基于停靠位置的偏移量（可选）
    offset: new BMapGL.Size(20, 20),
});

// 添加定位事件
locationControl.addEventListener("locationSuccess", function (e) {
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    alert("当前定位地址为：" + address);
});
locationControl.addEventListener("locationError", function (e) {
    alert(e.message);
})
// 将控件添加到地图上
map.addControl(locationControl);
```

#### 城市列表控件

```js
// 创建城市选择控件
var cityControl = new BMapGL.CityListControl({
    // 控件的停靠位置（可选，默认左上角）
    anchor: BMAP_ANCHOR_TOP_LEFT,
    // 控件基于停靠位置的偏移量（可选）
    offset: new BMapGL.Size(10, 5)
});
// 将控件添加到地图上
map.addControl(cityControl);
```

#### 第三方版权控件

```js
// 设置版权控件位置
var cr = new BMapGL.CopyrightControl({
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    offset: new BMapGL.Size(20, 20)
});   

// 返回地图可视区域
var bs = map.getBounds();  
 
cr.addCopyright({
    id: 1,
    content: "<img src='https://lbs.baidu.com/jsdemo/img/baidu.jpg' width='50px' height='50px'/>" + "<a href='#style='font-size:16px;color:#000'>@我是自定义版权控件呀</a>",
    bounds: bs
});
// 添加版权控件
map.addControl(cr); 
```

#### 自定义控件

```js
//定义一个控件类
function ZoomControl() {
    // 设置默认位置
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    // 设置默认位置偏移量
    this.defaultOffset = new BMapGL.Size(20, 20)
}
//通过JavaScript的prototype属性继承于BMap.Control
ZoomControl.prototype = new BMapGL.Control()
//自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
//在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
ZoomControl.prototype.initialize = function (map) {
    //创建一个dom元素
    var div = document.createElement('div');
    //添加文字说明
    div.appendChild(document.createTextNode('放大2级'));
    // 设置样式
    div.style.cursor = "pointer";
    div.style.padding = "7px 10px";
    div.style.boxShadow = "0 2px 6px 0 rgba(27, 142, 236, 0.5)";
    div.style.borderRadius = "5px";
    div.style.backgroundColor = "white";

    // 绑定事件,点击一次放大两级
    div.onclick = function (e) {
        map.setZoom(map.getZoom() + 2);
        console.log('[当前地图缩放等级]', map.getZoom())
    }

    // 添加DOM元素到地图中
    map.getContainer().appendChild(div);
    // 将DOM元素返回
    return div;
}
//创建控件元素
var myZoomCtrl = new ZoomControl();
//添加到地图中
map.addControl(myZoomCtrl);
```

#### 移除控件

```js
var scaleControl = new BMapGL.ScaleControl(opts);
// 移除控件
map.removeControl(scaleControl);
```