//轮廓线
var OverlaysList = []
var map
//地图div要给它一个初始的宽高 否则加载不出来 写在页面结构样式里即可。
var div = document.getElementById('map')
div.style.width = '100%'
div.style.height = '750px'
map = new BMap.Map('map')
// 创建地图实例
map.centerAndZoom('沈阳市', 8)
map.enableScrollWheelZoom(true)
map.addControl(new BMap.MapTypeControl()) //添加地图类型控件
var overViewOpen = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }) // 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl() //左上角，添加默认缩放平移控件
////三维 卫星 等

map.addControl(overViewOpen)
map.addControl(top_left_control)
map.addControl(top_left_navigation)
//点聚合
var markerClusterer = new BMapLib.MarkerClusterer(map)
$(function () {
    //此处是handlebars加载上方下拉框可以跳过不看
    var data = null
    var source = $('#DropdownTemplate').html()
    var template = Handlebars.compile(source)
    data = GetDefalutData()
    //获取下拉菜单那部分的模板
    var html = template(data)
    $('#DropdownBar').html(html)
    //给二级地区加载下拉选项
    var source1 = $('#test').html()
    var template1 = Handlebars.compile(source1)
    var html1 = template1({ SecondAreas: data.SecondAreas })
    $('#second-area').html(html1)

    //获取地图数据 并展示在百度地图上
    //获取数据
    var mapdata = GetMapDatas('xj06', '全部', $('#time').attr('data-value'), '学校分布', null).data
    initmap(mapdata, '沈阳', 8)

    //画轮廓线
    getBoundary('辽宁省')
    $('#MapSubmit').click(function () {
        提交按钮点击事件
    })
})

function initmap(mapdata, city, size) {
    map.centerAndZoom(city, size)
    markerClusterer.clearMarkers()
    var myIconblue = new BMap.Icon(
        'https://mapv.baidu.com/gl/examples/images/icons/icon-accident.png',
        new BMap.Size(30, 30),
        { anchor: new BMap.Size(12, 38), imageOffset: new BMap.Size(-225, 0 - 222) }
    )
    var myIconred = new BMap.Icon(
        'https://mapv.baidu.com/gl/examples/images/icons/icon-airplane.png',
        new BMap.Size(30, 30),
        { anchor: new BMap.Size(12, 38), imageOffset: new BMap.Size(-225, -184) }
    )

    for (; i < MAX; i++) {
        //这里调用后台的数据并展示
        pt = new BMap.Point(mapdata[i].Longitude, mapdata[i].Latitude)
        var marker
        //根据限制条件判断应该加载的图标

        if (mapdata[i].SchoolType.indexOf('小学') > -1) {
            marker = new BMap.Marker(pt, { icon: myIconblue })
        } else {
            marker = new BMap.Marker(pt, { icon: myIconred })
        }
        marker.customData = mapdata[i].SchoolCode
        marker.addEventListener(
            'click',
            function () {
                {
                    attribute(this)
                }
            },
            false
        )
        markers.push(marker)
    }
    markerClusterer.addMarkers(markers)
}
function attribute(e) {
    var point = new BMap.Point(e.point.lng, e.point.lat)
    var _url = '/SchoolDistr/GetSchoolInfo'
    var Time = $('#time').attr('data-value')
    var CategStandard = $('#CategStandard').attr('data-value')
    var Indicator = $('#Indicator').attr('data-value')
    var _data = new SchoolInfoClass(e.customData, null, null, Time, null, CategStandard, Indicator)
    var _async = false
    var areas = null
    var schoolinfo = PostRequest(_url, _data, _async).data
    var infocontent =
        '<p>学校名称:' +
        schoolinfo.SchoolName +
        '</p><p>学校主管部门:' +
        schoolinfo.Schooldep +
        '</p></p>学校地址:' +
        schoolinfo.Address +
        '</p>'
    if (schoolinfo.IndicatorsList != null) {
        for (var i = 0; i < schoolinfo.IndicatorsList.length; i++) {
            infocontent +=
                '<p>' +
                schoolinfo.IndicatorsList[i].IndicatorTime +
                schoolinfo.IndicatorsList[i].IndicatorName +
                ':' +
                schoolinfo.IndicatorsList[i].IndicatorData +
                schoolinfo.IndicatorsList[i].IndicatorUnit +
                '</p>'
        }
    }
    var searchInfoWindow = null
    ////获取起始点到终点的驾车距离
    var output = '到县城(或城市行政中心)距离:'
    var searchComplete = function (results) {
        if (transit.getStatus() == BMAP_STATUS_SUCCESS) {
            var plan = results.getPlan(0)
            output += plan.getDistance(true) + '\n 驾车需要:'
            output += plan.getDuration(true)
            infocontent += '<p>' + output + '</p>'
            // return;
        }
        var content = '<div  style="margin:0;line-height:20px;padding:2px;">' + infocontent + '</div>'
        searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title: '详细信息', //标题
            width: 300, //宽度
            panel: 'routeResult', //检索结果面板
            enableAutoPan: true,
            enableMessage: false,
            enableSendToPhone: false,
            searchTypes: [
                //BMAPLIB_TAB_FROM_HERE //从这里出发
            ],
        })
        searchInfoWindow.open(point)
    }
    var transit = new BMap.DrivingRoute(map, {
        renderOptions: { map: map, autoViewport: false }, //autoViewport: false
        BMAP_HIGHLIGHT_ROUTE: false,
        onSearchComplete: searchComplete,
        onPolylinesSet: function () {
            transit.disableAutoViewport()
            transit.clearResults()
        },
    })
    transit.search(point, schoolinfo.AreaConutry) //schoolinfo.AreaConutry
}
function ClearOverlays(OverlaysList) {
    OverlaysList.forEach(function (item) {
        map.removeOverlay(item)
    })
}
//将地区名传入即可 比如辽宁省；沈阳市;大连市；需要注意的是百度地图支持你直接传递地名但是遇到同名的时候会加载不出来，需要把省市区写详细。
function getBoundary(item) {
    if (OverlaysList.length > 0) {
        ClearOverlays(OverlaysList)
    }
    var bdary = new BMap.Boundary()
    bdary.get(item, function (rs) {
        var count = rs.boundaries.length //行政区域的点有多少个
        if (count == 0) {
            return
        }
        var pointArray = []
        for (var i = 0; i < count; i++) {
            let ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 2,
                strokeColor: '#ff0000',
                fillColor: 'rgba(255, 255, 255, 0.00)',
                strokeOpacity: 0.3,
            }) //建立多边形覆盖物
            map.addOverlay(ply) //添加覆盖物
            OverlaysList.push(ply)
            pointArray = pointArray.concat(ply.getPath())
        }
    })
}
function GetMapDatas(AreaCode, SchoolGrade, Time, CategStandard, Indicator) {}
function GetSecondArea(event) {}
function GetDefalutData() {}
