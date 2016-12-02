/**
 * 公共配置
**/
var publicAllocation = {
    url: "http://192.168.0.88:8088/pp", //请求地址
    userID: "",
    authId: "",
    //Ajax二次封装
    initAjax: function(url, data, successfun) {
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success:function(data) {
                if(successfun && typeof(successfun) === "function"){
                    successfun(data);
                }
            }
            //error: function() {
            //    alert("网络错误");
            //}
        });
    },
    //解析地址栏
    parseURL: function(urlparameter) {
        var _url = window.location.href.split("?")[1];
        if (_url != undefined) {
            var _index;
            var _arr = _url.split("&");
            for (var i = 0, _len = _arr.length; i < _len; i++) {
                if (_arr[i].indexOf(urlparameter + "=") >= 0) {
                    _index = i;
                    break;
                } else {
                    _index = -1;
                }
            }
            if (_index >= 0) {
                var _key = _arr[_index].split("=")[1];
                return _key;
            }
        }
    },
    //Login加载
    PageLoading: function(options) {
        var defaults = {
            opacity: 1,
            backgroundColor: "#fff",
            loadingTips: "",
            TipsColor: "#666",
            delayTime: 0,
            zIndex: 999,
            sleep: 0
        };
        var options = $.extend(defaults, options);
        var _PageHeight = document.documentElement.clientHeight,
            _PageWidth = document.documentElement.clientWidth;
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zIndex + ';"><div id="loadingTips" style="position: absolute; width: 40px;; height: 32px; background: ' + options.backgroundColor + ' url(images/loading.gif) no-repeat 5px center; color:' + options.TipsColor + '; font-size: 0px;">' + options.loadingTips + '</div></div>';
        $("body").append(_LoadingHtml);
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
            _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        var _LoadingTop = _PageHeight > _LoadingTipsH ? (_PageHeight - _LoadingTipsH) / 2 : 0,
            _LoadingLeft = _PageWidth > _LoadingTipsW ? (_PageWidth - _LoadingTipsW) / 2 + 40 / 4 : 0;

        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });
        document.onreadystatechange = PageLoaded;
        //当页面加载完成后执行
        function PageLoaded() {
            if (document.readyState == "complete") {
                //console.log("页面加载完成");
                var loadingMask = $('#loadingPage');
                setTimeout(function () {loadingMask.animate({"opacity": 0}, options.delayTime, function () {
                    $(this).hide();
                    $(this).remove();
                });}, options.delayTime);
            }
        }
    },
    //动态计算fontSize
    rootNodeFontSize: function(doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            reCalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
            };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, reCalc, false);
        doc.addEventListener('DOMContentLoaded', reCalc, false);
    },
    //切换CSS
    cssUrl: function(path) {
        if(!path || path.length === 0){
            throw new Error('路径不存在 !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    //拼接地址栏参数
    IdUrl: function(href) {
        var str = window.location.pathname,
            _str = str.substr(str.lastIndexOf("/") + 1),
            url = window.location.href,
            rs = url.replace(_str, href.attr('href'));
        href.attr("href", rs);
    },
    //切换tab
    switchTab: function(_self) {
        _self.addClass("gsx-tab-on");
        _self.siblings('a').removeClass('gsx-tab-on');
        return _self;
    }
};
publicAllocation.PageLoading({sleep: 3000000000});
var Template = {};

var timer = null;
!function(self, a) {
    self.Tab = a();
} (this, function() {
    var a = function(ts, options) {
        this.start = function(duration, callback, index, _form) {
            var defaults = {
                id: document.getElementById("tabSwitch"),
                trigger: 'click',
                type: 'slide',
                auto: false,
                width: $("body").width()
            };

            if(options){ $.extend(defaults, options); }

            this.duration = duration;
            var op = options || defaults;
            switch (op.type) {
                case 'slide':
                    return this.slide(index, op.id, callback ,_form);
                    break;
                case 'fade':
                    return;
                    break;
                case 'none':
                    return;
                    break;
                default:
                    return;
            }
        };
        this.slide = function(index, id, _callback, _form) {
            var gsxPl = $(".gsx-pl");
            if(index == 1) {
                $("#id").empty().append('<ul> <li class="gsx-li"> <label class="gsx-label">身份证号</label> <input autocomplete="off" placeholder="请输入身份证号" class="gsx-input wd9" type="text" data-check="required||IdCard" data-msg="身份证号" name="loginname" maxlength="18"> </li> <li class="gsx-li"> <label class="gsx-label">查询密码</label> <input autocomplete="off" placeholder="请输入查询密码" class="gsx-input wd9" type="password" data-check="required" data-msg="查询密码" name="loginpwd" maxlength="20"> </li> <li class="gsx-lih"> <label class="gsx-label">验证码</label> <input autocomplete="off" placeholder="点击图片可刷新" class="gsx-input" type="text" data-check="required||four" data-msg="验证码" maxlength="4" name="authcode"> <img src="" id="yzm2" class="gsx-yzm"> </li> </ul>');
            } else {
                $("#card").empty().prepend('<ul> <li class="gsx-li"> <label class="gsx-label">联名卡号</label> <input autocomplete="off" placeholder="请输入联名卡号" class="gsx-input wd9" type="text" data-check="required" data-msg="联名卡号" name="loginname" maxlength="20"> </li> <li class="gsx-li"> <label class="gsx-label">查询密码</label> <input autocomplete="off" placeholder="请输入查询密码" class="gsx-input wd9" type="password" data-check="required" data-msg="查询密码" name="loginpwd" maxlength="20"> </li> <li class="gsx-lih"> <label class="gsx-label">验证码</label> <input autocomplete="off" placeholder="点击图片可刷新" class="gsx-input" type="text" data-check="required||four" data-msg="验证码" maxlength="4" name="authcode"> <img src="" id="yzm" class="gsx-yzm"> </li> </ul>');
            }
            _form.unbind().validate();
            clearInterval(timer);
            timer = setInterval(function () {
                var speed = (parseInt(-gsxPl.width() * index) - id.offsetLeft) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if(id.offsetLeft == parseInt(-gsxPl.width() * index)) {
                    clearInterval(timer);
                    _callback();
                }else {
                    id.style.left = parseInt(id.offsetLeft) + speed + 'px';
                }
            }, this.duration / 60);
        }
    };
    return a;
});