#### 添加点

```js
let marker = new BMapGL.Marker(new BMapGL.Point(116.404, 39.915));
map.addOverlay(marker); 
```

#### 绘制带图标的点

```js  
// 创建标注对象并添加到地图  
var marker = new BMapGL.Marker(
    new BMapGL.Point(116.33337396094367, 40.009645090734296),
    {
        icon: new BMapGL.Icon(
            "markers.png", 
            new BMapGL.Size(23, 25), 
            {   
                // 指定定位位置。  
                anchor: new BMapGL.Size(10, 25),   
                // 设置图片偏移     
                imageOffset: new BMapGL.Size(0, 0 - 25)    
            }
        )
    }
);   
map.addOverlay(marker); 
```

#### 绘制带高度的点

```js
var marker = new BMapGL.Marker3D(
    new BMapGL.Point(119.53341540456555, 35.42283899843767),
    Math.round(Math.random()) * 130000, 
    {
        size: 50,
        // [BMAP_SHAPE_RECT, BMAP_SHAPE_CIRCLE]
        shape: 'BMAP_SHAPE_CIRCLE',
        fillColor: '#333',
        fillOpacity: 0.4
    }
);
map.addOverlay(marker);
```

#### 绘制带图标带高度的点

```js
// 创建带高度的点，这里只需要size和icon
var marker = new BMapGL.Marker3D(
    // 创建位置点,例：清华大学 
    new BMapGL.Point(116.33337396094367, 40.009645090734296), 
    8000, 
    {
        size: 80,
        // 创建贴图纹理Icon
        icon: new BMapGL.Icon('http://127.0.0.1:5500/覆盖物/icons/qinghua.png', new BMapGL.Size(40, 40))
    }
);
// 将点添加到地图上
map.addOverlay(marker);
```

#### 添加折线

```js
let polyline = new BMapGL.Polyline([
        new BMapGL.Point(116.399, 39.910),
        new BMapGL.Point(116.405, 39.920),
        new BMapGL.Point(116.425, 39.900)
    ], 
    { 
        strokeColor: "blue", 
        strokeWeight: 2, 
        strokeOpacity: 0.5 
    });   
map.addOverlay(polyline); 
```

#### 添加圆

```js
let circle = new BMapGL.Circle(
    point, 
    500, 
    { 
        strokeColor: "blue", 
        strokeWeight: 2, 
        strokeOpacity: 0.5 
    }); 
map.addOverlay(circle); 
```

#### 添加多边形

```js
let polygon = new BMapGL.Polygon([
        new BMapGL.Point(116.387112, 39.920977),
        new BMapGL.Point(116.385243, 39.913063),
        new BMapGL.Point(116.394226, 39.917988),
        new BMapGL.Point(116.401772, 39.921364),
        new BMapGL.Point(116.41248, 39.927893)
    ], 
    { 
        strokeColor: "blue", 
        strokeWeight: 2, 
        strokeOpacity: 0.5 
    }); 

map.addOverlay(polygon); 
```

#### 添加矩形

```js
let pStart = new BMapGL.Point(116.392214, 39.918985);
let pEnd = new BMapGL.Point(116.41478, 39.911901);

// 创建矩形
let rectangle = new BMapGL.Polygon([
        new BMapGL.Point(pStart.lng, pStart.lat),
        new BMapGL.Point(pEnd.lng, pStart.lat),
        new BMapGL.Point(pEnd.lng, pEnd.lat),
        new BMapGL.Point(pStart.lng, pEnd.lat)
    ], 
    { 
        strokeColor: "blue", 
        strokeWeight: 2, 
        strokeOpacity: 0.5 
    });  
map.addOverlay(rectangle); 
```

#### 绘制行政区域块/镂空面绘制

```js
var bdary = new BMapGL.Boundary();
bdary.get('山东省', function (rs) {
    
    console.log(rs)
    map.clearOverlays();
    var count = rs.boundaries.length;
    if (count === 0) {
        alert('未能获取当前输入行政区域');
        return;
    }
    // 绘制行政区
    var pointArray = [];
    for (var i = 0; i < count; i++) {
        var ply = new BMapGL.Polygon(
            rs.boundaries[i], 
            { 
                strokeWeight: 1, 
                strokeColor: 'blue', 
                fillColor: 'blue', 
                fillOpacity: 0.5 
            }
        ); 
        // 建立多边形覆盖物
        map.addOverlay(ply);
        pointArray = pointArray.concat(ply.getPath());
    }
    map.setViewport(pointArray); // 调整视野
});
```

#### 获取地点经纬度

```js
var cityGeo = new BMapGL.Geocoder();
cityGeo.getPoint('汕头市', function (point) { // 地址解析获取对应经纬度
    var pt = new BMapGL.Point(point.lng, point.lat);
    console.log('汕头市', pt)
});
```


#### 绘制3D棱柱

```js
var bound = new BMapGL.Boundary();
bound.get('北京市', function (rs) {
    console.log('[rs]======>', rs);
    var count = rs.boundaries.length;
    if (count === 0) {
        alert('未能获取当前输入行政区域');
        return;
    }
    // 封装点集
    for (let i = 0; i < count; i++) {
        let pointsArr = [];
        let str = rs.boundaries[i].replace(' ', '');
        let points = str.split(';');
        for (let j = 0; j < points.length; j++) {
            let [lng, lat] = points[j].split(',');
            pointsArr.push(new BMapGL.Point(lng, lat));
        }
        // 绘制棱柱
        let prism = new BMapGL.Prism(
            pointsArr,
            // 棱柱高度
            5000,
            {
                topFillColor: '#5679ea',
                topFillOpacity: 0.6,
                sideFillColor: '#5679ea',
                sideFillOpacity: 0.9
            }
        );
        map.addOverlay(prism);
    }
});
```