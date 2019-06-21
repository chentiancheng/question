//正则表达式集合

$.extend($, {

    regList: {
        
        //去掉所有空格
        removeAllSpace: function(str) {
            return str.replace(/\s/g, "")
        },

        //判断是否全是数字
        isAllNumber: function(str) {
            var reg = /^[0-9]*$/;
            return reg.test(str);
        },

        //判断邮箱格式
        checkEmail: function(str) {
            var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            return reg.test(str);
        },

        //判断数字从0-9或是1-9
        checkNumber: function(str) {
            var reg = /^[1-9][0-9]*$/;
            return reg.test(str);
        },

        //去掉中文和英文逗号
        removeComma: function(str) {
            return str.replace(/,/g, '').replace(/，/g, '');
        },

        //把中文逗号改成英文逗号
        changeChinaComma: function(str) {
            return str.replace(/，/g, ',');
        },

        //判断是否是全部一样的数字
        isSameNumber: function(str, n) {
            var re = new RegExp(n, 'g');
            if (str.match(re).length == str.length) {
                //全是同样的字符
                return true;
            }
            return false;
        },

        //判断字符串格式是否超出汉字/英文字母包括大小写/·/空格/下划线,用于姓名校验
        isNameCheck: function(str) {
            var reg_1 = /[\u4e00-\u9fa5]/g;
            var reg_2 = /[_]|[·]|[\s]/g;
            var reg_3 = /[_]|[·]|[a-zA-Z]|[\s]/g;

            if (str.replace(reg_1, '').length != 0) {
                //不是只有中文
                if (str.replace(reg_3, '').length != 0) {
                    return false;
                }
            }
            //var reg = /[\u4e00-\u9fa5]|[_]|[·]|[a-zA-Z]|[\s]/g;
            return true;
        },

        //留下所有数字和第一位的.，去掉其他字符
        onlyNumberDian: function(str) {

            //去掉非数字和.
            str = str.replace(/[^\d.]/g, '');

            if (!str) {
                return str;
            } else {
                var s_1 = str.match(/\d+.{1}/g);
                if (s_1) {
                    s_1 = s_1[0];
                    var s_2 = str.match(/\d+.{1}\d{0,2}/g);
                    if (s_2) {
                        s_2 = s_2[0];
                        return s_2;
                    } else {
                        return s_1;
                    }
                } else {
                    return str;
                }
            }

        }

    }

})