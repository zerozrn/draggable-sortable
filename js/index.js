var dragNum = 0;
$(function(){
    // 渲染form
    layui.use(['form','laydate', 'upload']); 
    
    // 设置li可拖动
    $("#fieldList li, #customField li").draggable({
        helper: "clone",  // 助手是拖拽元素的克隆
        cursor: "move",   // 设置鼠标样式
        appendTo: "body",  // 设置助手追加到什么元素
        cursorAt: { right: 0, bottom: 0 },  // 设置助手在拖拽期间相对于鼠标的偏移(此设置是右下方)
        connectToSortable: "#realformbox",  // 设置draggable放置在可排序的容器(#formbox)内
        revert: "invalid",  // 设置当拖拽停止时，元素还原到它的开始位置。
        containment: "#container",  // 指定在某个区域内拖拽
        zIndex: 100  // 设置助手的z-index
    });

    $("#realformbox").sortable({
        placeholder: "ui-sortable-box",
        revert: false,
        stop: function(event, ui){
            var elm = ui ? ui.item : $(this),
                elmHtml = elm.html(),
                elmName = $(elm).attr("name");
            // 是拖动而不是排序
            if(elmName){
                var str = tablist(elmName, dragNum);
                elm.replaceWith(str);
                
                layui.form.render();

                // 渲染日期
                layui.laydate.render({
                    elem: '#' + elmName + dragNum
                });

                // 渲染上传
                if(elmName == "upload"){
                    renderOpload(elmName + dragNum);
                }

                // 地区只能拖动一次,之后置灰不可拖动
                if(elmName == "district"){
                    $("#customField li[name=district]").addClass("disable");
                }
                
                // 渲染地区
                $('#distpicker').distpicker();
                dragNum++;
            }
        }
    });

    // 删除功能
    $("body").on("click", ".js-delete", function(){
        var self = $(this);
        layer.confirm('您确定要删除此项吗?', {icon: 3, title:'提示'}, function(index){
            var name = self.attr("name");
            if(name == "district"){
                $("#customField li[name=district]").removeClass("disable");
            }
            self.closest(".js-formitem").remove();
            dragNum--;
            layer.close(index);
          });
        
    });
    
});

function tablist(name, n){
    var content = '<div class="layui-form-item js-formitem">', label = "", constr = "";
    var textStr = '<div class="layui-input-inline">'+
                    '<input type="text" name="' + name + '" />'+
                '</div>';
    switch(name){
        case "name": label = "姓名";constr = textStr;break;
        case "phone": label = "联系电话"; constr = textStr;break;
        case "email": label = "电子邮箱"; constr = textStr;break;
        case "nativePlace": label = "籍贯";constr = textStr;break;
        case "graduateSchool": label = "毕业学校";constr = textStr;break;
        case "text": label = "单行输入框";constr = textStr;break;
        case "sex": label = "性别";
            constr = '<div class="layui-input-inline">'+
                            '<input type="radio" name="sex" value="男" title="男" checked>'+
                            '<input type="radio" name="sex" value="女" title="女">'+
                            '<input type="radio" name="sex" value="保密" title="保密">'+
                        '</div>';
            break;
        case "radio": label = "单选";
            constr = '<div class="layui-input-inline">'+
                            '<input type="radio" name="radio" value="radio1" title="radio1" checked>'+
                            '<input type="radio" name="radio" value="radio2" title="radio2">'+
                            '<input type="radio" name="radio" value="radio3" title="radio3">'+
                        '</div>';
            break;
        case "age": label = "年龄";
            constr = '<div class="layui-input-inline">'+
                            '<input type="number" min="1" max="200" name="'+name+'"/>'+
                        '</div>';
                break;
        case "number": label = "数字";
            constr = '<div class="layui-input-inline">'+
                            '<input type="number" name="'+name+'"/>'+
                        '</div>';
            break;
        case "birthdate": label = "出生日期";
            constr = '<div class="layui-input-inline">'+
                        '<input type="text" name="' + name + '" id="' + name + n + '" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">'+
                    '</div>';
            break;
        case "customdate": label = "日期";
            constr = '<div class="layui-input-inline">'+
                        '<input type="text" name="' + name + '" id="' + name + n + '" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">'+
                    '</div>'; 
            break;
        case "bodyWeight": label = "体重";
            constr = '<div class="layui-input-inline marr">'+
                        '<input type="text" name="' + name + '"/>'+
                    '</div>'+
                    '<div class="layui-form-mid layui-word-aux">KG</div>';
            break;
        case "bodyHeight": label = "身高";
            constr = '<div class="layui-input-inline marr">'+
                        '<input type="text" name="' + name + '"/>'+
                    '</div>'+
                    '<div class="layui-form-mid layui-word-aux">cm</div>';
            break;
        case "textarea": label = "多行输入框";
            constr = '<div class="layui-input-inline">'+
                        '<textarea name="' + name + '"></textarea>'+
                    '</div>';
            break;
        case "education": label = "学历";
            constr = '<div class="layui-input-inline">'+
                        '<select name="' + name + '" lay-verify="">'+
                            '<option value="">请选择您的学历</option>'+
                            '<option value="1">初中</option>'+
                            '<option value="2">高中</option>'+
                            '<option value="3">本科</option>'+
                            '<option value="4">研究生</option>'+
                            '<option value="5">博士</option>'+
                        '</select>'+
                    '</div>';
            break;
        case "select": label = "下拉框";
            constr = '<div class="layui-input-inline">'+
                        '<select name="' + name + '" lay-verify="">'+
                            '<option value="">请选择</option>'+
                            '<option value="1">项目1</option>'+
                            '<option value="2">项目2</option>'+
                            '<option value="3">项目3</option>'+
                            '<option value="4">项目4</option>'+
                            '<option value="5">项目5</option>'+
                        '</select>'+
                    '</div>';
            break;
        case "address": label = "所在地";
            constr = '<div class="layui-input-inline">'+
                        '<textarea name="' + name + '"></textarea>'+
                    '</div>';
            break;
        case "district": label = "地区";
            constr = '<div class="layui-input-inline distpicker" data-toggle="distpicker" id="distpicker">'+
                        '<select id="province" data-province="---- 选择省 ----" lay-ignore></select>'+
                        '<select id="city" data-city="---- 选择市 ----" lay-ignore></select>'+
                        '<select id="area" data-district="---- 选择区 ----" lay-ignore></select>'+
                    '</div>';
            break;
        case "checkbox": label = '多选框';
            constr = '<div class="layui-input-inline">'+
                        '<input type="checkbox" name="like1[write]" lay-skin="primary" title="写作" checked="">'+
                        '<input type="checkbox" name="like1[read]" lay-skin="primary" title="阅读">'+
                        '<input type="checkbox" name="like1[game]" lay-skin="primary" title="游戏">'+
                    '</div>';
            break;
        case "upload": label = "上传";
            constr = '<div class="layui-input-inline">'+
                        '<div class="img preview-img" id="preview-imgbox"><img src="" alt="" id="img"></div>'+
                        '<div class="img img-btn" id="' + name + n + '"></div>'+
                    '</div>';
            break;
    }
    var labelstr = '<label class="layui-form-label">' + label + '：</label>';
    return content + labelstr + constr + '<a href="javascript:;" class="a-delete js-delete" name="' + name + '"><i class="fa fa-trash-o"></i></a></div>';
}

/**
 * @method renderOpload 渲染上传
 */
function renderOpload(name){
    layui.upload.render({
        elem: '#' + name, //绑定元素
        url: '/api/upload', //上传接口(并非真实的上传接口)
        before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $("#preview-imgbox").show();
                $("#img").attr('src', result); //图片链接（base64）
            });
        },
        done: function(res){
          //上传完毕回调
        },
        error: function(){
          //请求异常回调
        }
    });
}