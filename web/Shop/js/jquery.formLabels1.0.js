;(function($){var formLabels,opts,elts;$.fn.tagName=function(){return this.get(0).tagName;}
formLabels=$.fn.formLabels=function(options){opts=$.extend({excludeElts:'',refreshOnResize:false,safemode:false,labelParent:'form',semantic:true},options);var spanID=0;elts=$("textarea, input[type='email'], input[type='text'], input[type='password']").not(opts.excludeElts).filter(":visible[title]");if(elts.length&&!opts.safemode){elts.each(function(){var $this=$(this);var spanBg='';var $thisBC,$thisBI,labelParent,tagName;if(this.value==''&&this.title!=''){if(opts.labelParent=='form'){labelParent=$this.closest('form');tagName='<label/>';}
else{labelParent=$(opts.labelParent);tagName='<span/>';}
if(labelParent.css('position')=='static'){labelParent.css({'position':'relative'})}
var label=this.title;var parentPosition,offsetValue,myPosition;var paddingValue={top:parseFloat($this.css("padding-top"))+ 1,left:(parseFloat($this.css("padding-left"))<2)?2:parseFloat($this.css("padding-left"))+ 1}
if($this.tagName()=='TEXTAREA'){parentPosition='left top';myPosition='left top';offsetValue=paddingValue.left+' '+ paddingValue.top;}
else{parentPosition='left center';myPosition='left center';offsetValue=paddingValue.left+' 0'}
if($.browser.mozilla){$thisBC=$this.css("background-color");$thisBI=$this.css("background-image");if($thisBI=='none'){if($thisBC!=''){spanBg=$thisBC}
else{spanBg='#fff'}}}
var formLabel=$(tagName,{css:{'font-family':$this.css("font-family"),'font-size':$this.css("font-size"),'font-style':$this.css("font-style"),'font-weight':$this.css("font-weight"),'text-shadow':($.support.opacity)?$this.css("text-shadow"):'','line-height':$this.css("line-height"),'background-color':spanBg,'position':'absolute','top':0,'left':0,'color':$this.css("color"),'-moz-user-select':'none','-webkit-user-select':'none','cursor':'text','z-index':'999'},id:"spanLabel"+ spanID,'for':($this.attr("id")=='')?'':$this.attr("id"),"class":"fLabel",html:label,click:function(){$this.trigger('focus');return false;}});if(opts.semantic&&opts.labelParent=='form'){$this.before(formLabel)}
else{formLabel.appendTo(labelParent)}
formLabel.position({my:myPosition,at:parentPosition,of:$this,offset:offsetValue,collision:'none'});$this.data({"spanID":"#spanLabel"+ spanID,"my":myPosition,"at":parentPosition,"offset":offsetValue})}
spanID++;});elts.bind('focus blur change cut paste input keyup',function(e){var LabelSpanID=$($(this).data("spanID"));if(e.type=='focus'){if(this.title!=''&&this.value==''){LabelSpanID.stop().fadeTo(300,0.2);}}
if(e.type=='blur'){if(this.title!=''){if(this.value==''){LabelSpanID.stop().fadeTo(300,1,function(){if(!$.support.opacity)this.style.removeAttribute("filter");})}
else{LabelSpanID.stop().fadeOut(300)}}}
if(e.type=='change'||e.type=='cut'||e.type=='paste'||e.type=='input'||e.type=='keyup'){if(this.title!=''){LabelSpanID.stop().fadeOut(300)}
if(this.value==''){LabelSpanID.stop().fadeTo(100,0.2)}}});if(opts.refreshOnResize){$(window).bind("resize",function(){formLabels.refreshLabels(elts);});}}
if(elts.length&&opts.safemode){elts.val(function(i,v){if(v=='')
return this.title;else return v});elts.bind('focus blur',function(e){if(e.type=='focus'){if(this.value==this.title)
this.value='';}
else{if(this.value=='')
this.value=this.title;}})
$("input:image, button, input:submit").click(function(){$(this.form.elements).each(function(){if(this.type=='email'||this.type=='text'||this.type=='textarea'||this.type=='password'){if(this.value==this.title&&this.title!=''){this.value='';}}});});}}
formLabels.refreshLabels=function(){elts.each(function(){var $this=$(this);var assocSpan=$($this.data("spanID"));assocSpan.position({my:$this.data("my"),at:$this.data("at"),of:$this,offset:$this.data("offset"),collision:'none'});})}})(jQuery);