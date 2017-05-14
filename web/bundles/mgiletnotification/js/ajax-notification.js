(function() {

    // ajax request to mark a notification as seen
    function markAsSeen(e) {
        var xhttp = new XMLHttpRequest();
        var element = e.target;
        xhttp.onreadystatechange = function () {
            // on success
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // mark notification as seen
                element.parentNode.classList+= ' seen';
                // remove button
                element.remove();
                // decrease notification count
                var notificationCounter = document.getElementById('notificationCount').value;
                var notificationNumber = parseInt(notificationCounter);
                notificationNumber--;

                var notificationCount = document.getElementById('counttag');
                notificationCounter.innerHTML ='<span id="notificationCount" ><i class="blue ace-icon fa fa-globe bigger-120">' +
                    '</i>Notification <div class="badge" id="counttag"> '
                    + notificationNumber
                    +'</div> </span>';
                if (notificationNumber == 0){

                    notificationCount.innerHTML = '0';
                    notificationCounter.innerHTML ='<span id="notificationCount" ><i class="blue ace-icon fa fa-globe bigger-120">' +
                        '+</i>Notification <div class="badge" id="counttag"> '
                        + notificationNumber.toString()
                        +'</div> </span>';
                }
            }
        };
        xhttp.open("POST", element.href, true);
        xhttp.send();
    }

    function markAllAsSeen(e) {
        var xhttp = new XMLHttpRequest();
        var element = e.target;
        xhttp.onreadystatechange = function () {
            // on success
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // add "seen" class for all notifications
                var notifications = document.getElementsByClassName('notification');
                for (var notification of notifications){
                    notification.children[0].classList += ' seen';
                }
                // remove action buttons
                var paras = document.getElementsByClassName('ajax-notification');
                while(paras[0]) {
                    paras[0].parentNode.removeChild(paras[0]);
                }
                // set notification count to 0
                var notificationCount = document.getElementById('counttag');
                notificationCount.innerHTML = '0';

            }
        };
        xhttp.open("POST", element.href, true);
        xhttp.send();
    }

    // mark as seen button handler
    var btns = document.getElementsByClassName('ajax-notification');
    for(var btn of btns){
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            markAsSeen(e);
        });
    }

    // mark all as seen button handler
    document.getElementById('notification-MarkAllAsSeen').addEventListener('click',function (e) {
        e.preventDefault();
        markAllAsSeen(e);
    });

})();
