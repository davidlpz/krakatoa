/**
 * Krakatoa
 * https://github.com/davidlpz/krakatoa
 */
(function(c){var b=0;c.fn.krakatoa=function(e){var e=c.extend({},c.fn.krakatoa.defaults,e);return this.each(function(){var p,n,g=c(this),j=g.children().length,f,r,m,h,q,k,o=0,l;
l=(c(this).data("settings"))?c.extend({},e,d(c(this).data("settings"))):e;if(g.data("krakatoa")){return;}g.attr("data-krakatoa",true);g.html('<div class="krakatoa-control"></div><div class="krakatoa-container">'+g.html()+"</div>");
f=g.find(".krakatoa-container");g.css({position:"relative",width:l.width,display:l.display});f.css({overflow:"hidden",position:"relative"});f.children().css({position:"absolute",top:0,left:0,display:"none"});
if(l.items<j){g.find(".krakatoa-control").append('<ul class="arrows"><li data-move="-1" class="arrow arrow-left"><a href="#">&laquo;</a></li><li data-move="1" class="arrow arrow-right"><a href="#">&raquo;</a></li></ul>');
g.find(".arrow a").on("click touchstart",{settings:l},a);if(!l.arrows){g.find(".arrows").css("display","none");}if(l.buttons){n='<ul class="buttons">';
for(m=0;m<j/l.items;m++){n+='<li class="pagination"><a href="#">'+m+"</a></li>";}n+="</ul>";g.find(".krakatoa-control").append(n);g.find(".buttons a").on("click touchstart",{settings:l},a);
g.find(".buttons").find("li").eq(l.first).addClass("active-button");}}h=g.width();k=(h-(l.items-1)*l.gutter)/l.items;for(m=0;m<j;m++){r=f.children().eq(m);
r.css("width",k);if(l.height==="max"){q=r.outerHeight(true);if(q>o){o=q;}}}for(m=0;m<l.items&&l.first+m<j;m++){r=f.children().eq(l.first+m);r.addClass("current").css({display:"block",left:(k+l.gutter)*m});
if(l.height!=="max"){o=l.height==="auto"?r.outerHeight(true):l.height;}}g.attr("data-current",l.first);f.css("height",o);if(l.autoplay){l.playing=true;
c.fn.krakatoa.play(l,g);g.on("mouseleave",function(){c.fn.krakatoa.play(l,g);});g.on("mouseover",function(){clearTimeout(b);l.playing=false;});}else{l.playing=false;
}});};c.fn.krakatoa.play=function(e,f){b=window.setTimeout(function(){f.find(".arrow-"+e.direction+" a").trigger("click");},e.delay);if(e.autoplay){e.playing=true;
}};c.fn.krakatoa.defaults={width:"400px",height:"300px",display:"block",arrows:true,buttons:true,items:1,first:0,gutter:10,loop:false,autoplay:false,direction:"right",delay:2000,duration:500};
function a(q){var w=c(this),h=w.closest(".krakatoa-control").parent(),f=h.find(".krakatoa-container"),r=parseInt(h.attr("data-current")),k=f.children().length,o,m,p,g,t,v,l,s=0,u=c.Deferred(),n=q.data.settings,j=0;
q.preventDefault();if(w.parent().attr("data-move")){m=w.parent().data("move");p=r+n.items*m;if(n.loop&&(p<0||p>=k)){p=Math.ceil(k/n.items)*n.items-p*m;
}else{if(p<0||p>=k){if(n.playing){n.playing=false;}return;}}}else{if(n.buttons){if(w.hasClass("active-button")){return;}m=(w.parent().index()*n.items>r)?1:-1;
p=w.parent().index()*n.items;}}w.off("click touchstart").on("click touchstart",function(i){i.preventDefault();});g=h.width();l=(g-(n.items-1)*n.gutter)/n.items;
for(o=0;o<n.items;o++){v=f.children().eq(r+o);v.removeClass("current").animate({left:-(g+n.gutter)*m+(l+n.gutter)*o},n.duration,"linear",function(){c(this).css({left:0,display:"none"});
});if(p+o>k-1){continue;}j++;v=f.children().eq(p+o);v.addClass("current").css({display:"block",left:(g+n.gutter)*m+(l+n.gutter)*o}).animate({left:(l+n.gutter)*o},n.duration,"linear",function(){j--;
if(j===0){u.resolve();}});if(n.height==="auto"){t=v.outerHeight(true);if(t>s){s=t;}f.css("height",s);}}h.attr("data-current",p);u.done(function(){if(n.playing){c.fn.krakatoa.play(n,h);
}w.off("click touchstart");w.on("click touchstart",{settings:n},a);});r=Math.round(p/n.items);if(n.buttons){h.find(".active-button").removeClass("active-button").parent().children().eq(r).addClass("active-button");
}}function d(f){var h=new Object(),j=[],e=0,g;if(typeof f!=="string"){return;}f=f.replace(/[{}\s]/g,"");j=f.split(",");for(e;e<j.length;e++){g=j[e].split(":");
if(!isNaN(g[1]-0)){if(g[1]%1===0){g[1]=parseInt(g[1]);}else{g[1]=parseFloat(g[1]);}}else{if(g[1].toLowerCase()=="true"||g[1].toLowerCase()=="false"){g[1]=(g[1]=="true");
}}h[g[0]]=g[1];}return h;}}(jQuery));