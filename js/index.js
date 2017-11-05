/**
 * Created by Administrator on 2017/9/18.
 */

$(function () {
    init();
    function init() {

        //轻触开始游戏
        touch.on('#gameStart', 'tap', function (e) {
            $('#p1').hide(300);
            $('#p2').show(300);
            game();
        });

        //轻触关掉游戏规则
        touch.on('.gameGuide_wrap', 'tap', function (e) {
            $(this).parent().hide();

        });

        function game() {

            //按住小车并移动使小车移动
            let isMove = false;
            touch.on('#race', 'touchstart', function (e) {
                touch.on('#race', 'touchmove', function (e) {
                    //获得第一个触摸点
                    let race = e.changedTouches[0];
                    //获得下车的宽高
                    let w = $(this).width();
                    let h = $(this).height();

                    //获得触摸点的坐标
                    let x = race.clientX - w / 2;
                    let y = race.clientY - h / 2;

                    //调用小车移动的函数
                    raceMove(x, y);

                    if (!isMove) {
                        //调用砖头移动函数
                        stonesMove();
                        showTime();
                        isMove = true;
                    }


                })
            });

            setInterval(function () {
                isOver();
            }, 100);

            //小车移动
            function raceMove(x, y) {
                $('#race').css({
                    left: x,
                    top: y
                })
            }

            //全部砖头移动
            function stonesMove() {
                $('.stone').each(function () {
                    stoneMove($(this));
                });
            }

            //一个砖头随机移动
            function stoneMove(stone) {

                //获得界面的宽度
                let w = $('.p2_wrap').width();
                let h = $('.p2_wrap').height();
                let stoneW = stone.width();
                let stoneH = stone.height();
                let time = 3000;
                //砖头随机的坐标
                $(function step() {
                    let x = randomInt(0, w - stoneW);
                    let y = randomInt(0, h - stoneH);
                    time = randomInt(2000, 4000);
                    stone.animate({
                        left: x,
                        top: y
                    }, time, step)
                })
            }

            //定义计时并显示时间的函数
            let second = 1;
            let time = 0;
            let timer;

            function showTime() {
                timer = setInterval(function () {
                    if (second % 60 == 0) {
                        time++;
                        $('#time').html(time);
                    }
                    $('#second').html(second);
                    second++;
                }, 1000)
            }

            //定义判断游戏是否结束
            function isOver() {

                let stones = document.querySelectorAll('.stone');

                for (let i = 0; i < stones.length; i++) {
                    let minLeft = stones[i].offsetLeft;
                    let maxLeft = stones[i].offsetLeft + stones[i].offsetWidth;
                    let minTop = stones[i].offsetTop;
                    let maxTop = stones[i].offsetTop + stones[i].offsetHeight;

                    if (isAre(minLeft, maxLeft, minTop, maxTop)) {
                        gameOver();
                    }
                }
                if (overStep()) {
                    gameOver();
                }

            }

            //定义判断小车是否在一个区域内的函数
            function isAre(x1, x2, y1, y2) {

                let race = document.querySelector('#race');
                let left = race.offsetLeft;
                let top = race.offsetTop;

                let leftW = left + race.offsetWidth;
                let topH = top + race.offsetHeight;

                if ((left >= x1 && left <= x2 && top >= y1 && top <= y2)
                    || (leftW >= x1 && leftW <= x2 && topH >= y1 && topH <= y2)
                ) {
                    return true;
                } else {
                    return false;
                }
            }

            //定义判断小车是否越界
            function overStep() {
                //获得界面的宽度
                let w = $('.p2_wrap').width();
                let h = $('.p2_wrap').height();
                let race = document.querySelector('#race');
                let left = race.offsetLeft;
                let top = race.offsetTop;
                if (left <= 0 || left >= w - race.offsetWidth || top <= 0 || top >= h - race.offsetHeight) {
                    return true;
                } else {
                    return false;
                }
            }

            //定义游戏结束函数
            function gameOver() {

                //清除计时器
                clearInterval(timer);

                //停止石头移动
                $('.stone').stop();

                //游戏结束时小车闪烁效果
                let race = document.querySelector('#race');
                race.className = 'fadeRace';
                race.addEventListener('animationend', function () {
                    $('#p2').hide();
                    $('#p3').show();
                    $('#score').html(time);
                });

            }

            //产生范围随机数的函数
            function randomInt(from, to) {
                return parseInt(Math.random() * (to - from + 1) + from);
            }

        }

        //重新开始游戏
        touch.on('#againBtn', 'tap', function () {
            location.reload();
        })
    }

});