# innerHTML 和 innerText

这两个元素都是用来获取document对象中的文本内容。

**区别：** innerText将 HTML 元素（整个代码）作为字符串返回并在屏幕上显示，而innerHTML返回的则是一个HTML元素

例子：
```HTML
<!DOCTYPE html>
<html>
    <head>
        <style>
            .name {
                color:red;
            }
        </style>
    </head>
    <body>
        <p><b>innertext 效果</b></p>
        <p id="innertext"></p>
        <br>
        <p><b>innerHTML 效果</b></p>
        <p id="innerhtml"></p>
        <script>
            const ourstring = 'My name is <b class="name">Satish chandra Gupta</b>.';
            document.getElementById('innertext').innerText = ourstring;
            document.getElementById('innerhtml').innerHTML = ourstring;
        </script>
    </body>
</html>
```

![image](https://user-images.githubusercontent.com/72189350/210807547-d684b406-2569-4fe3-8586-812630efc7d2.png)

可以看到innerText是把内容直接当成字符串，而innerHTML则会渲染成一个标签.


其次innerHTML的兼容性更佳，其实，innerHTML 是W3C 组织规定的属性；而innerText 属性是IE浏览器自己的属性，不过后来的浏览器部分实现这个属性罢了。

