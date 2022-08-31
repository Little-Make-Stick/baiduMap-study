
#### 目前国内主要有以下三种坐标系：

    * WGS84：为一种大地坐标系，也是目前广泛使用的GPS全球卫星定位系统使用的坐标系。

    * GCJ02：又称火星坐标系，是由中国国家测绘局制订的地理信息系统的坐标系统。由WGS84坐标系经加密后的坐标系。

    * BD09：为百度坐标系，在GCJ02坐标系基础上再次加密。其中bd09ll表示百度经纬度坐标，bd09mc表示百度墨卡托米制坐标。


非中国地区地图，服务坐标统一使用WGS84坐标。

#### 其他坐标转百度坐标

百度对外接口的坐标系为BD09坐标系，并不是GPS采集的真实经纬度，在使用百度地图JavaScript API服务前，需先将非百度坐标通过坐标转换接口转换成百度坐标。


```js
// GPS标准坐标转换为百度地图采用的经纬度坐标（bd09ll）
new BMap.Convertor().translate(pointArr, 1, 5, (data) => {
    // { status: 0, points: [] }
    if(data.status === 0) {
        console.log("服务请求正常召回")
    } else if(data.status === 1) {
        console.log("内部错误")
    } else if(data.status === 4) {
        console.log("转换失败")
    } else if(data.status === 21) {
        console.log("原坐标类型非法")
    } else if(data.status === 22) {
        console.log("目标坐标类型非法")
    } else if(data.status === 24) {
        console.log("要转换的坐标格式非法")
    } else if(data.status === 25) {
        console.log("要转换的坐标个数非法，超过限制")
    } else if(data.status === 26) {
        console.log("参数错误")
    } else {
        console.log("未知错误")
    }
})
```