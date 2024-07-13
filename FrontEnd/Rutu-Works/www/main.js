$(document).ready(function () {
    $('.text').textillate({
        loop:true,
        sync:true,
        in:{
            effect: "bounceIn",
        },
        out:{
            effect: "bounceOut",
        },
    })

//siri config
var siriWave = new SiriWave({
    container: document.getElementById("siri-container"),
    width: 800,
    height: 200,
    style: "ios9",
    amplitude: "1",
    speed: "0.30",
    autostart: true
  });
});

// mic button click event
$("#Micbtn").click(function () { 
 $("#oval-circle").attr("hidden", true);
 $("#SiriWave").attr("hidden", false);
});
