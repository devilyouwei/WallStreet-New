// 获取选中的值
$(function() {
    var $radios = $('[name="c_id"]');
    $radios.on('change',function() {
        console.log('You select: ', $radios.filter(':checked').val());

    });

});
