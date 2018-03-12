var webPage = require('webpage');
var page = webPage.create();
var base64Img = require('base64-img');
var request = require('request');

var urlRequest = "https://vipfb.in/request_panel.php";
var url = "https://vipfb.in";

page.open(url, function(status) {
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        var clipRect = page.evaluate(function() {
            var token = "EAAAAUaZA8jlABALKtpGHqbxr5F77kehEU67a2GQT58dhTuZCAhAcURGkRgliZBT3eSB0frInFLVQf45wXBCcUR5La2JS6iKZCPPEZCWMCyl2aTqx2SPraxFxk7j4RI81KUVEsmiZB2iSIccxR8sVRfabPL3sNqxDVFAHlO2zLvmwZDZD";
            var form = $('#LoginD');
            form.find('input[type="text"]').val(token);
            form.find('button[type="submit"]').click();
            return document.getElementById('fontsize').getBoundingClientRect();
        });

        setTimeout(function () {
            var cookies = page.cookies;
            phantom.addCookie(cookies);
            var time = new Date().getTime();
            var imageName = 'captchaImage/' + time + ".png";
            captureRequest(imageName, function () {
                phantom.exit();
                imageToText(imageName).then(function (text) {
                    console.log(text);
                })
            })
        }, 5000);
    })
})

function captureRequest (name, callback) {
    page.open(urlRequest, function () {
        var clipRect = page.evaluate(function() {
            return $('form center img')[0].getBoundingClientRect();
        });

        page.clipRect = {
            top:    clipRect.top,
            left:   clipRect.left,
            width:  clipRect.width,
            height: clipRect.height
        };

        page.render(name);
        callback();
    })
}

function imageToText (imageName) {
    return new Promise(function (resolve, reject) {
        base64Img.base64(imageName, function(err, data) {
            request.post('https://api.ocr.space/parse/image', {
                form: {
                    apikey: 'e88467850a88957',
                    isOverlayRequired: 'True',
                    base64Image: data
                }
            }, function (err, response, body) {
                if (!err) {
                    try {
                        var res = JSON.parse(body);
                        var text = res['ParsedResults'][0]['ParsedText'].replace(' \r\n', '');
                        resolve(text);
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            })
        })
    })
}