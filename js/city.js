;(function(doc, win, $) {
    publicAllocation.rootNodeFontSize(doc, win);
    Template.$body = $(doc.body);
    Template._self = "";
    Template.appName = publicAllocation.parseURL('appName');
    Template.type = publicAllocation.parseURL('type');
    Template._url = urlId('url');
    Template.city = publicAllocation.parseURL('city');
    Template.a = $('#login');
    Template.ts = "";
    Template.demo = "";
    Template._index = "";
    Template._gsxError = $(".gsx-error");
    Template.id = $("#id");
    Template._card = $("#card");
    Template._gxsSub = $(".gxs-sub");
    Template._form = $("#form");
    Template._publicBg = $("#public-bg");
    Template._publicModal = $("#public-modal");
    Template._textMsg = $("#textMsg");
    Template.lb = $("#tab").children(":first").attr("data-lb");
    Template.first = $(".gsx-ig").children(":first");
    //配置参数
    Template.options = {
        id: document.getElementById("tabSwitch"), //绑定ID
        trigger: 'click', //tab切换模式
        type: 'slide', //切换效果：'none'（无效果）/'fade'（淡入效果）/'slide'（滑动效果）
        auto: false, //是否自动切换，true为自动，false为非自动
        width: $("body").width(), //宽(内容区)，单位像素
        style: 'mF_tab', //风格样式
        time: 2, //自动切换模式下的切换时间间隔，单位秒
        height: 0 //高(内容区)
    };

    Template._card.prepend('<ul> <li class="gsx-li"> <label class="gsx-label">联名卡号</label> <input autocomplete="off" placeholder="请输入联名卡号" class="gsx-input wd9" type="text" data-check="required||cardReg" data-msg="联名卡号" maxlength="20" name="loginname"> </li> <li class="gsx-li"> <label class="gsx-label">查询密码</label> <input autocomplete="off" placeholder="请输入查询密码" class="gsx-input wd9" type="password" data-check="required" data-msg="查询密码" maxlength="20" name="loginpwd"> </li> <li class="gsx-lih"> <label class="gsx-label">验证码</label> <input autocomplete="off" placeholder="点击图片可刷新" class="gsx-input" type="text" data-check="required||four" data-msg="验证码" maxlength="4" name="authcode"> <img src="" id="yzm" class="gsx-yzm"> </li> </ul>');

    function urlId(id) {
        var len = window.location.href.split("&");
        for(var i = 0, l = len.length; i < l; i++) {
            if(len[i].indexOf(id + '=') >= 0) {
                var lenNull = len[i].replace(id + '=', "");
            }
        }
        return lenNull;
    }

    //验证
    $.fn.validate = function() {
        var objThat = this, iSok = false;

        //自定义规则
        var defaults = {
            //验证错误提示信息
            tips_success: '', //验证成功时的提示信息，默认为空
            tips_required: '不能为空',
            tips_SelError: '认真阅读公积金查询授权协议并选中',
            tips_Id: '身份证号长度为15位或18位,并且格式正确',
            tips_four: '验证码格式不正确',

            //匹配正则
            card_Reg: /$/, //联名卡号
            Id_Reg: /^\d{15}$|(^\d{17}[0-9]|X)$/, //身份证号
            yzm_Reg: /[a-zA-Z0-9]{4}/ //验证码
        };

        //勾选分期协议
        $(".gsx-ig").on("click", function(){ _radio() });

        $(":text,:password").each(function() {
            $(this).bind('input propertychange', function() {
                var _validate = $(this).attr("data-check");
                if (_validate) {
                    var arr = _validate.split('||');
                    for (var i = 0, l = arr.length; i < l; i++) {
                        if (!check($(this), arr[i], $(this).val())) {
                            Template._gxsSub.removeClass("gsx-subSuc").attr("disabled", true);
                            iSok = false;
                            return false;
                        } else {
                            continue;
                        }
                    }
                }
                if(_onButton()) {
                    if(!Template.first.hasClass("gsx-Check")) {
                        Template._gsxError.text(defaults.tips_SelError);
                        Template._gxsSub.removeClass("gsx-subSuc").attr("disabled", true);
                    } else {
                        Template._gxsSub.addClass("gsx-subSuc").attr("disabled", false);
                    }
                }
            });
        });

        function _radio() {
            Template.first.addClass("gsx-Check");
            if(Template.first.hasClass("gsx-Check")) {
                Template._gsxError.text("");
                _onButton();
            }
            if(Template.first.hasClass("gsx-Check") && _onButton()) {
                Template._gxsSub.addClass("gsx-subSuc").attr("disabled", false);
            }
        }

        function _onButton() {
            iSok = true;
            $(":text,:password").each(function () {
                var _validate = $(this).attr("data-check");
                if (_validate) {
                    var arr = _validate.split('||');
                    for (var i = 0, l = arr.length; i < l; i++) {
                        if (!check($(this), arr[i], $(this).val())) {
                            iSok = false;
                            return false;
                        } else{
                            continue;
                        }
                    }
                }
            });
            return iSok;
        }

        var check = function (obj, _match, _val) {
            switch (_match) {
                case 'required':
                    return $.trim(_val ) !== '' ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, obj.attr("data-msg") + defaults.tips_required, false);
                case 'IdCard':
                    return chk(_val, defaults.Id_Reg) ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, defaults.tips_Id, false);
                case 'four':
                    return chk(_val, defaults.yzm_Reg) ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, defaults.tips_four, false);
                default:
                    return true;
            }
        };

        var chk = function (str, reg) {
            return reg.test(str);
        };

        var showMsg = function (obj, msg, mark) {
            Template._gsxError.text(msg);
            if(mark){
                Template._gsxError.text(msg);
            }
            return mark;
        };

        if (objThat.is("form")) {
            objThat.submit(function (e) {
                var dataArr = $(this).serializeArray();
                e.preventDefault();
                if(iSok === true){
                    //防止重复提交
                    Template._gxsSub.removeClass("gsx-subSuc").attr("disabled", true);
                    var list = $(this).serializeJson(dataArr);
                    Template.fC.login(list);
                }
            });
        }
    };

    //封装JSON对象
    $.fn.serializeJson = function(Arr) {
        var ua = navigator.userAgent.toLowerCase(),
            equipment;
        if (/iphone|ipad|ipod/.test(ua)) {
            equipment = "ios";
        } else if (/android/.test(ua)) {
            equipment = "安卓";
        }
        var data = {
            "userId": publicAllocation.userID,
            "lb": Template.lb,
            "appName": Template.appName,
            "type": Template.type,
            "source": equipment
        };
        $(Arr).each(function(){
            data[this.name] = this.value;
        });
        return data;
    };

    //模态框
    $.fn.center = function(loaded) {
        var obj = this,
            body_width = parseInt($(window).width()),
            body_height = parseInt($(window).height()),
            block_width = parseInt(obj.width()),
            block_height = parseInt(obj.height()),
            left_position = parseInt(body_width - block_width) / 2 - 10,
            top_position = parseInt((body_height / 2) - (block_height / 2) + $(window).scrollTop());
        if (body_width < block_width) {
            left_position = 0 + $(window).scrollLeft();
        }
        if (body_height < block_height) {
            top_position = 0 + $(window).scrollTop();
        }
        if (!loaded) {
            obj.css({ 'position': 'absolute' });
            obj.css({ 'top': (($(window).height() / 2) - ($('#public-modal').height()) * 0.5), 'left': left_position });
            $(window).bind('resize', function() { obj.center(!loaded); });
            $(window).bind('scroll', function() { obj.center(!loaded); });
        } else {
            obj.stop();
            obj.css({'position': 'absolute'});
            obj.animate({'top': top_position}, 200, 'linear');
        }
    };
    Template.fC = TemplateCity.fCity.call(TemplateCity, Template.city);
    Template._form.validate();
})(document, window, jQuery);