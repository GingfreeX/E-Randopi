Belousov/ChatBundle
===================

This bundle helps you create chat between your users.
Chat using long polling technical, it simulates real time messaging.

Features include:

- Instant messaging
- It uses Long polling technology 
- Simulates real time messaging

# Installation
### Composer

You can use Composer for the automated process:

``` 
$ php composer.phar require belousovr/belousovChatBundle
```

### Adding bundle to your application kernel

```
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new FOS\UserBundle\FOSUserBundle(),
        new belousovr\belousovChatBundle\belousovChatBundle(),
        // ...
    );
}
```

if you already have FOSUserBundle, in the your AppKernel, you don't need to add it's twice.

# Configuration 
 First time you need configurate FOSUserBundle.
 Next you need configurate routing in file app/config/routing.yml:
 
     belousovr:
         resource: "@belousovChatBundle/Controller"
         type:     annotation
 
 And add in services.yml this code:
 
    parameters:
        belousov.chat.user_class: AppBundle\Entity\User
    services:
        belousov.mapping.listener:
            class: belousovr\belousovChatBundle\EventListener\DynamicRelationSubscriber
            tags:
                - { name: doctrine.event_listener, event: loadClassMetadata }
            arguments:
                - %belousov.chat.user_class% 
 
  In "belousov.chat.user_class:" you need insert path to your User class
  
 And last, you need create the table in your database:
 
    $ php app/console doctrine:schema:update --force
    
# Usage

### Controller
If you need use chat on page, you must just to pass multiple variables

* users - array of users that will be available for messaging
* chatForm - FormType of "ChatType" - is formed at controller like:
     
        $actionUrl = $this->generateUrl(
            'belousov_chat_ajax_send_message'
        );

        $chatForm = $this->createForm(ChatType::class, null, array('action' => $actionUrl));

* getMessageUrl - generated url "belousov_chat_ajax_get_message"
    
    ```
    $getMessageUrl = $this->generateUrl(
        'belousov_chat_ajax_get_message'
    );
    ```
    
* currentUser - current user object, you can get user like
    
    ```
    $this->getUser();
    ```
    
Your controller will be look like so

```
class ChatController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository(User::class)->findAll();

        $actionUrl = $this->generateUrl(
            'belousov_chat_ajax_send_message'
        );

        $getMessageUrl = $this->generateUrl(
            'belousov_chat_ajax_get_message'
        );

        $chatForm = $this->createForm(ChatType::class, null, array('action' => $actionUrl));

        return $this->render('base.html.twig', array('chatForm' => $chatForm->createView(), 'users' => $users, 'getMessageUrl' => $getMessageUrl, 'currentUser' => $this->getUser()));
    }
}
```

### Template

Template will be look like so, you can override this template in your opinion. But if you override this template you need override and jQuery code too.
jQuery code will be next..

##### twig template:
```
{% if currentUser %}
    <div id="belousovChat" data-author="{{ currentUser.id }}" data-addressee="" data-action="{{ getMessageUrl }}" >
        <div id="belousovMessageZone"></div>
        <div id="belousovFormZone">
            {{ form_start(chatForm) }}
    
                {{ form_widget(chatForm.messageText) }}
    
                {{ form_errors(chatForm) }}
    
            {{ form_end(chatForm) }}
        </div>
    </div>
    <div id="selectUser">
        {% for user in users %}
            {% if user.id != currentUser.id %}
                <a href="" onclick="return false;" data-number="{{ user.id }}" class="changeUser" >{{ user.username }}</a>
            {% endif %}
        {% endfor %}
    </div>
{% else %}
    <p>Войдите на сайт, для доступа к чату</p>
{% endif %}
```

##### javascript code:

Javascript use jQuery and ajax request. you can override this code in your opinion.

```
/**
 * Created by Roman Belousov on 07.04.16.
 */
$(document).ready(function(){
    setInterval(function() {
        if (ajax) { ajax.abort(); }
        getMessage();
    },30000);
    var ajax;
    $('.belousovSendMessage').click(function () {
        var message = $('.belousovMessageText');
        var addressee = $('#belousovChat').attr('data-addressee');
        var url = $('form[name=chat]').attr('action');
        if (addressee == "" || message == "") {
            alert('change dialog');
        }
        $.ajax({
            type: "POST",
            url: url,
            data: {'messageText': message.val(), 'addressee' : addressee},
            cache: "false",
            dataType: "json",
            success: function (response) {
                if (response.error === undefined){
                    message.val('');
                }
            }
        });
    });
    function getMessage(){
        var chat = $('#belousovChat');
        var user_id = chat.attr('data-author');
        var addressee = chat.attr('data-addressee');
        var url = chat.attr('data-action');
        ajax = $.ajax({
            type:'POST',
            url:url,
            data:{'user_id' : user_id, 'addressee_id' : addressee},
            dataType:'json',
            success:function(resp){
                if (resp.error === undefined){
                    var html;
                    resp.forEach(function (item) {
                        if (item.author.id == user_id){
                            html = '<p class="mainUser">'+ item.messageText +'</p>';
                            $('#belousovMessageZone').append(html);
                        }
                        if (item.addressee.id == user_id){
                            html = '<p class="secondUser">'+ item.messageText +'</p>';
                            $('#belousovMessageZone').append(html);
                        }
                    });
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: {'user_id': user_id, 'addressee_id': addressee, 'update' : true},
                        dataType: 'json',
                        success: function (resp) {
                        }
                    });
                }
                setTimeout(function(){
                    getMessage()
                },1000)
            }
        });
    }
    $('.changeUser').click(function () {
        var addressee = $(this).attr('data-number');
        var chat = $('#belousovChat');
        var url = chat.attr('data-action');
        var user_id = chat.attr('data-author');
        chat.attr('data-addressee', addressee);
        $.ajax({
            type: "POST",
            url: url,
            data: {'changeUser' : true, 'user_id' : addressee},
            cache: "false",
            dataType: "json",
            success: function (response) {
                var html;
                $('#belousovMessageZone').html('');
                if (ajax) { ajax.abort(); }
                getMessage();
                if (response) {
                    response.forEach(function (item) {
                        if (item.author.id == user_id){
                            html = '<p class="mainUser">'+ item.messageText +'</p>';
                            $('#belousovMessageZone').append(html);
                        }
                        if (item.addressee.id == user_id){
                            html = '<p class="secondUser">'+ item.messageText +'</p>';
                            $('#belousovMessageZone').append(html);
                        }
                    });
                }
            }
        });
    });
});
```

This document have three methods:

* Get message
* Send message
* Change user for messaging

##### css style:

You can override this style, this css code just for example

```
    #belousovChat {
        width:200px;
        height:300px;
        border:1px solid #ccc;
        padding:0;
    }
    #belousovMessageZone {
        height:200px;
        padding:0;
        margin:auto;
        width:100%;
        border-bottom:1px solid #ccc;
        overflow-y: auto;
    }
    #belousovMessageZone p {
        padding:5px;
        margin:auto;
        width:90%;
    }
    #belousovMessageZone .mainUser {
        text-align:left;
    }
    #belousovMessageZone .secondUser {
        text-align:right;
    }
    #belousovFormZone {
        height:95px;
        margin:auto;
        padding:0;
        width:100%;
    }
    #belousovFormZone form {
        margin:10px;
    }
    #belousovFormZone form textarea {
        width:90%;
    }
```

# Author

If you have any questions or you find bug, please send message to me on my email

Roman Belousov. Email: romanandreyvich@gmail.com