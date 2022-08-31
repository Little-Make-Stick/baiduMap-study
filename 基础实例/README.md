#### 申请ak

https://lbsyun.baidu.com/apiconsole/key#/home

#### 引入地图

```html
<script type="text/javascript"
        src="http://api.map.baidu.com/api?v=2.0&ak=IfkNE0XDdoaTwdGGkOWrALDkFZOTI9b8"></script>
```
#### 创建地图容器

```html
<div id="allmap"></div>
```

#### 创建地图实例

```js
var map = new BMapGL.Map("allmap");  
```

#### 初始化地图

```js
var centerPoint = new BMapGL.Point(116.404, 39.915);
map.centerAndZoom(centerPoint, 11);  
```

#### 设置地图旋转角度

```js
map.setHeading(64.5);
```

#### 设置地图的倾斜角度

```js
map.setTilt(73);  
```

#### 设置地图类型

地图类型：
        * 地球模式（BMAP_EARTH_MAP）
        * 标准地图（BMAP_NORMAL_MAP）
        * 普通卫星图模式（BMAP_SATELLITE_MAP）

```js
map.setMapType(BMAP_EARTH_MAP);     
```