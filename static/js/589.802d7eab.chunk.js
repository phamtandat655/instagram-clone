"use strict";(self.webpackChunkinstagram_clone=self.webpackChunkinstagram_clone||[]).push([[589],{1674:function(e,o,i){i.d(o,{Z:function(){return m}});var n=i(9439),t=i(9448),a=i.n(t),l=i(2791),s=i(7689),c=i(4446),r=i(184),d=a().bind({wrapper:"Comment_wrapper__0wVGF",account:"Comment_account__MRUPN",avatar:"Comment_avatar__drCcj",about:"Comment_about__bqJVu",name:"Comment_name__fkuWP",time__cmt:"Comment_time__cmt__CWdYN"});function u(e){var o=e.cmt,i=(0,l.useState)(""),t=(0,n.Z)(i,2),a=t[0],u=t[1],m=(0,l.useState)(""),v=(0,n.Z)(m,2),p=v[0],f=v[1],_=(0,c.i)().getUserByEmail,h=(0,s.s0)();return(0,l.useEffect)((function(){var e,i,n=(null===o||void 0===o?void 0:o.timestampSecond)||"",t=new Date(1e3*n),a=new Date,l=(e=t,(i=a).getMonth()-e.getMonth()+12*(i.getFullYear()-e.getFullYear())),s=a.getFullYear()-t.getFullYear(),c=Math.abs(a-t)/1e3,r=Math.floor(c/86400);c-=86400*r;var d=Math.floor(c/3600)%24;c-=3600*d;var m=Math.floor(c/60)%60;c-=60*m;var v=Math.round(c%60);u(s<1?l>=1?"".concat(l," TH\xc1NG TR\u01af\u1edaC"):r<1?d<1?m<1?"".concat(v," GI\xc2Y TR\u01af\u1edaC"):"".concat(m," PH\xdaT TR\u01af\u1edaC"):"".concat(d," GI\u1edc TR\u01af\u1edaC"):"".concat(r," NG\xc0Y TR\u01af\u1edaC"):"N\u0102M ".concat(s," TH\xc1NG ").concat(l," NG\xc0Y ").concat(r))}),[null===o||void 0===o?void 0:o.timestampSecond]),(0,l.useEffect)((function(){var e;f(null===(e=_("".concat(null===o||void 0===o?void 0:o.useremail)))||void 0===e?void 0:e.information.avatar)}),[null===o||void 0===o?void 0:o.useremail,_]),(0,r.jsxs)("div",{className:d("wrapper"),children:[(0,r.jsx)("div",{className:d("account"),onClick:function(e){return h("/personalPage/".concat(o.useremail))},children:(0,r.jsx)("div",{className:d("avatar"),children:(0,r.jsx)("img",{src:p||"http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg",alt:"avatar"})})}),(0,r.jsxs)("div",{className:d("about"),children:[(0,r.jsx)("span",{className:d("name"),children:null===o||void 0===o?void 0:o.username}),(0,r.jsx)("span",{className:d("cmt"),children:null===o||void 0===o?void 0:o.comment}),(0,r.jsx)("div",{className:d("info__cmt"),children:(0,r.jsx)("p",{className:d("time__cmt"),children:a||""})})]})]})}var m=(0,l.memo)(u)},45:function(e,o,i){i.r(o),i.d(o,{default:function(){return b}});var n=i(4165),t=i(3433),a=i(5861),l=i(1413),s=i(9439),c=i(9448),r=i.n(c),d=i(9922),u=i(4499),m=i(2791),v=i(7689),p=i(7799),f=i(9514),_=i(7084),h=i(9329),x=i(6605),w=(i(4676),i(4432),i(5880),i(7752),i(4446)),j=i(1877),k=i(1674),g=i(4183),P=i(184),N=r().bind({wrapper:"PostDetail_wrapper__UE74+","post-option":"PostDetail_post-option__hp1ec","close-icon":"PostDetail_close-icon__dA8iv",container:"PostDetail_container__yfyRD","slider-wrapper":"PostDetail_slider-wrapper__2VsJ8","number-of-like":"PostDetail_number-of-like__F7wSM","info-wrapper":"PostDetail_info-wrapper__NTdar","account-wrapper":"PostDetail_account-wrapper__omlRw","cmt-wrapper":"PostDetail_cmt-wrapper__LfThU","about-post-wrapper":"PostDetail_about-post-wrapper__qacLk","icons-container":"PostDetail_icons-container__Njrxq","icons-left":"PostDetail_icons-left__WAd9U",icon:"PostDetail_icon__qsWbA","time-post":"PostDetail_time-post__0azG0","upload-cmt-wrapper":"PostDetail_upload-cmt-wrapper__MEWBJ","likeds-modal":"PostDetail_likeds-modal__A0iv9","likeds-modal-wrapper":"PostDetail_likeds-modal-wrapper__jHh-G","likeds-modal-header":"PostDetail_likeds-modal-header__-VHOk","likeds-modal-close":"PostDetail_likeds-modal-close__WZxcA","likeds-modal-list":"PostDetail_likeds-modal-list__h-D8k","likeds-modal-item":"PostDetail_likeds-modal-item__COKLy","personalPage-top":"PostDetail_personalPage-top__jSrFn","save-icon":"PostDetail_save-icon__DephI"});var b=function(e){var o=e.setPage,i=e.page;console.log("postdetail");var c=(0,w.i)().idPostList,r=(0,v.UO)().idPost,b=(0,v.s0)(),C=(0,m.useState)(!1),D=(0,s.Z)(C,2),Z=D[0],M=D[1],S=(0,m.useState)({}),T=(0,s.Z)(S,2),U=T[0],y=T[1],E=(0,m.useState)([]),R=(0,s.Z)(E,2),F=R[0],G=R[1],Y=(0,m.useState)(!0),J=(0,s.Z)(Y,2),H=J[0],A=J[1],V=(0,m.useState)([]),O=(0,s.Z)(V,2),q=O[0],B=O[1],W=(0,m.useState)(""),I=(0,s.Z)(W,2),L=I[0],X=I[1],K=(0,m.useState)(""),z=(0,s.Z)(K,2),Q=z[0],$=z[1],ee=(0,m.useState)([]),oe=(0,s.Z)(ee,2),ie=oe[0],ne=oe[1],te=(0,_._)().user,ae=(0,w.i)().users,le=(0,m.useState)({}),se=(0,s.Z)(le,2),ce=se[0],re=se[1],de=(0,m.useState)(""),ue=(0,s.Z)(de,2),me=ue[0],ve=ue[1],pe=(0,m.useState)(!0),fe=(0,s.Z)(pe,2),_e=fe[0],he=fe[1];(0,m.useEffect)((function(){0===c.length||c.includes(r)||b("/NotFound/".concat(r))}),[c,b,r]),(0,m.useEffect)((function(){var e,o,i=(null===ce||void 0===ce?void 0:ce.timestampSecond)||"",n=new Date(1e3*i),t=new Date,a=(e=n,(o=t).getMonth()-e.getMonth()+12*(o.getFullYear()-e.getFullYear())),l=t.getFullYear()-n.getFullYear(),s=Math.abs(t-n)/1e3,c=Math.floor(s/86400);s-=86400*c;var r=Math.floor(s/3600)%24;s-=3600*r;var d=Math.floor(s/60)%60;s-=60*d;var u=Math.round(s%60);ve(l<1?a>=1?"".concat(a," TH\xc1NG TR\u01af\u1edaC"):c<1?r<1?d<1?"".concat(u," GI\xc2Y TR\u01af\u1edaC"):"".concat(d," PH\xdaT TR\u01af\u1edaC"):"".concat(r," GI\u1edc TR\u01af\u1edaC"):"".concat(c," NG\xc0Y TR\u01af\u1edaC"):"N\u0102M ".concat(l," TH\xc1NG ").concat(a," NG\xc0Y ").concat(c))}),[null===ce||void 0===ce?void 0:ce.timestampSecond]),(0,m.useEffect)((function(){(0,p.cf)((0,p.JU)(f.db,"users","".concat(null===te||void 0===te?void 0:te.email)),(function(e){var o;G(null===(o=e.data())||void 0===o?void 0:o.follows)})),(0,p.cf)((0,p.JU)(f.db,"posts","".concat(r)),(function(e){re((0,l.Z)({id:e.id},e.data()))}));var e=(0,p.IO)((0,p.hJ)(f.db,"posts/".concat(r,"/comments")),(0,p.Xo)("timestamp","desc")),o=(0,p.cf)(e,(function(e){var o=[];e.forEach((function(e){o.push((0,l.Z)({id:e.id},e.data()))})),ne(o)})),i=(0,p.cf)((0,p.JU)(f.db,"users","".concat(null===te||void 0===te?void 0:te.email)),(function(e){var o;X(null===(o=e.data())||void 0===o?void 0:o.information.name)})),n=(0,p.cf)((0,p.JU)(f.db,"posts","".concat(r)),(function(e){var o;B(null===(o=e.data())||void 0===o?void 0:o.likeds)}));return function(){o(),i(),n()}}),[null===te||void 0===te?void 0:te.email,r]),(0,m.useEffect)((function(){(0,p.cf)((0,p.JU)(f.db,"users","".concat(null===ce||void 0===ce?void 0:ce.useremail)),(function(e){y(e.data())}))}),[null===ce||void 0===ce?void 0:ce.useremail]);var xe,we=(0,m.useRef)(),je=function(e){(0,p.ET)((0,p.hJ)(f.db,"posts/".concat(r,"/comments")),{timestampSecond:Math.floor(Date.now()/1e3),timestamp:(0,p.Bt)(),comment:Q,username:L,useremail:null===te||void 0===te?void 0:te.email}),$("")},ke=function(){$(""),i===r?(o("home"),b("/")):(b("/".concat("home"===i?"":i)),o(i))},ge=function(e){q.includes(null===te||void 0===te?void 0:te.email)||Pe()},Pe=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(){var o;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=(0,p.JU)(f.db,"posts","".concat(r)),e.next=3,(0,p.r7)(o,{likeds:[].concat((0,t.Z)(q),[null===te||void 0===te?void 0:te.email])});case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ne=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(){var o,i;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=(0,p.JU)(f.db,"posts","".concat(r)),i=q.filter((function(e){return e!==(null===te||void 0===te?void 0:te.email)})),e.next=4,(0,p.r7)(o,{likeds:(0,t.Z)(i)});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,P.jsxs)("div",{className:N("wrapper"),onClick:ke,children:[!1===_e&&(0,P.jsx)(j.Z,{post:ce,ownPost:(null===ce||void 0===ce?void 0:ce.useremail)===(null===te||void 0===te?void 0:te.email),setHidePostOption:he,followings:F,page:i}),!1===H&&(0,P.jsx)("div",{className:N("likeds-modal"),onClick:function(e){e.stopPropagation(),A(!0)},children:(0,P.jsxs)("div",{className:N("likeds-modal-wrapper"),onClick:function(e){e.stopPropagation()},children:[(0,P.jsx)("i",{className:N("likeds-modal-close"),onClick:function(e){A(!0)},children:"X"}),(0,P.jsx)("div",{className:N("likeds-modal-header"),children:"L\u01b0\u1ee3t th\xedch"}),(0,P.jsx)("div",{className:N("likeds-modal-list"),children:ae&&ae.map((function(e,o){return q.includes(null===e||void 0===e?void 0:e.information.email)?(0,P.jsx)("div",{className:N("likeds-modal-item"),onClick:function(o){A(!0),b("/personalPage/".concat(null===e||void 0===e?void 0:e.id))},children:(0,P.jsx)(d.Z,{userAccount:e,lengthDesc:40,followings:F,follow:!(F&&F.find((function(o){return o.User.information.email===(null===e||void 0===e?void 0:e.information.email)}))||(null===e||void 0===e?void 0:e.information.email)===(null===te||void 0===te?void 0:te.email))})},(null===e||void 0===e?void 0:e.id)||o):(0,P.jsx)(m.Fragment,{},o)}))})]})}),(0,P.jsx)("p",{className:N("close-icon"),onClick:ke,children:"X"}),!1===(xe=ce,0===Object.keys(xe).length)&&(0,P.jsxs)("div",{className:N("container"),onClick:function(e){e.stopPropagation()},children:[(0,P.jsx)("div",{className:N("slider-wrapper"),children:1===(null===ce||void 0===ce?void 0:ce.url.length)?null!==ce&&void 0!==ce&&ce.url[0].type.includes("image")?(0,P.jsx)("div",{children:(0,P.jsx)("img",{src:null===ce||void 0===ce?void 0:ce.url[0].src,alt:"post img",onDoubleClick:ge})}):(0,P.jsx)(g.Z,{file:null===ce||void 0===ce?void 0:ce.url[0],postDetail:!0}):(0,P.jsx)(h.tq,{modules:[x.W_,x.tl],slidesPerView:1,navigation:!0,pagination:{clickable:!0},children:null===ce||void 0===ce?void 0:ce.url.map((function(e){return e.type.includes("image")?(0,P.jsx)(h.o5,{style:{height:"100%"},className:"item-wrapper",onDoubleClick:ge,children:(0,P.jsx)("img",{src:e.src,alt:"post img"})},e.src):e.type.includes("video")?(0,P.jsx)(h.o5,{onDoubleClick:ge,children:(0,P.jsx)(g.Z,{file:e,postDetail:!0})},e.src):(0,P.jsx)(h.o5,{children:"Hinh anh hoac video bi loi!"},e.src)}))})}),(0,P.jsxs)("div",{className:N("info-wrapper"),children:[(0,P.jsxs)("div",{className:N("account-wrapper"),children:[(0,P.jsx)("div",{onClick:function(e){o("personalPage/".concat(null===ce||void 0===ce?void 0:ce.useremail)),b("/personalPage/".concat(null===ce||void 0===ce?void 0:ce.useremail))},children:(0,P.jsx)(d.Z,{userAccount:U})}),(0,P.jsx)("i",{className:N("post-option"),onClick:function(e){e.stopPropagation(),he(!1)},children:u.P0})]}),(0,P.jsx)("div",{className:N("cmt-wrapper"),children:ie.map((function(e,o){return(0,P.jsx)(k.Z,{cmt:e},o)}))}),(0,P.jsxs)("div",{className:N("about-post-wrapper"),children:[(0,P.jsxs)("div",{className:N("icons-container"),children:[(0,P.jsxs)("div",{className:N("icons-left"),children:[(0,P.jsx)("div",{className:N("icon"),onClick:function(e){q.includes(null===te||void 0===te?void 0:te.email)?Ne():Pe()},children:q&&!0===q.includes(null===te||void 0===te?void 0:te.email)?u.cK:u.lM}),(0,P.jsx)("div",{className:N("icon"),onClick:function(e){we.current.focus()},children:u.t6}),(0,P.jsx)("div",{className:N("icon"),children:u.aA})]}),(0,P.jsx)("div",{className:N("icon","save-icon"),onClick:function(e){M(!Z)},children:!0===Z?u.rm:u.N})]}),(0,P.jsxs)("div",{className:N("number-of-like"),onClick:function(e){A(!1)},children:[q?q.length:0," l\u01b0\u1ee3t th\xedch"]}),(0,P.jsx)("p",{className:N("time-post"),children:me})]}),(0,P.jsxs)("div",{className:N("upload-cmt-wrapper"),children:[(0,P.jsx)("span",{children:u.B1}),(0,P.jsx)("input",{ref:we,type:"text",placeholder:"Th\xeam b\xecnh lu\u1eadn...",value:Q,onChange:function(e){$(e.target.value)},onKeyDown:function(e){if("Enter"===e.code){if(0===Q.length)return;je()}}}),(0,P.jsx)("button",{onClick:je,disabled:0===Q.length,children:"\u0110\u0103ng"})]})]})]})]})}},1877:function(e,o,i){i.d(o,{Z:function(){return f}});var n=i(4165),t=i(3433),a=i(5861),l=i(9448),s=i.n(l),c=i(9514),r=i(7799),d=i(7084),u=i(7689),m=i(276),v=i(184),p=s().bind({wrapper:"PostOption_wrapper__rg5TR","post-option-container":"PostOption_post-option-container__lREA-"});var f=function(e){var o=e.post,i=e.ownPost,l=e.setHidePostOption,s=e.followings,f=e.page,_=(0,d._)().user,h=(0,u.s0)(),x=(0,m.cF)(),w=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(a){var d,u;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!0!==i){e.next=8;break}if(!window.confirm("B\u1ea1n c\xf3 mu\u1ed1n x\xf3a b\xe0i vi\u1ebft ?")){e.next=6;break}return h("/".concat("home"===f?"":f)),e.next=5,(0,r.oe)((0,r.JU)(c.db,"posts","".concat(null===o||void 0===o?void 0:o.id)));case 5:null===o||void 0===o||o.url.forEach((function(e){var o=(0,m.iH)(x,"files/".concat(e.src.split("files%2F")[1].split("?alt")[0]));(0,m.oq)(o).then((function(){})).catch((function(e){console.log(e)}))}));case 6:e.next=15;break;case 8:if(!s.find((function(e){var i;return(null===e||void 0===e||null===(i=e.User)||void 0===i?void 0:i.information.email)===(null===o||void 0===o?void 0:o.useremail)}))){e.next=15;break}if(!window.confirm("B\u1ea1n c\xf3 mu\u1ed1n h\u1ee7y theo d\xf5i ?")){e.next=15;break}return d=(0,r.JU)(c.db,"users","".concat(null===_||void 0===_?void 0:_.email)),u=s.filter((function(e){var i;return(null===e||void 0===e||null===(i=e.User)||void 0===i?void 0:i.information.email)!==(null===o||void 0===o?void 0:o.useremail)})),e.next=14,(0,r.r7)(d,{follows:(0,t.Z)(u)});case 14:l(!0);case 15:case"end":return e.stop()}}),e)})));return function(o){return e.apply(this,arguments)}}();return(0,v.jsx)("div",{className:p("wrapper"),onClick:function(e){l(!0),e.stopPropagation()},children:(0,v.jsxs)("div",{className:p("post-option-container"),children:[(s.find((function(e){var i;return(null===e||void 0===e||null===(i=e.User)||void 0===i?void 0:i.information.email)===(null===o||void 0===o?void 0:o.useremail)}))||!0===i)&&(0,v.jsx)("div",{onClick:function(e){e.stopPropagation(),w(e)},children:!0===i?"X\xf3a b\xe0i vi\u1ebft":" B\u1ecf theo d\xf5i"}),(0,v.jsx)("div",{onClick:function(e){l(!0),e.stopPropagation()},children:"H\u1ee7y"})]})})}},4183:function(e,o,i){i.d(o,{Z:function(){return u}});var n=i(9439),t=i(9448),a=i.n(t),l=i(2791),s=i(4499),c=i(184),r=a().bind({"video-container":"PostVideo_video-container__EjErU","video-wrapper":"PostVideo_video-wrapper__mZlZm",video:"PostVideo_video__MD9iw","PostDetail-video":"PostVideo_PostDetail-video__AawwE","volume-icon":"PostVideo_volume-icon__cAEt9","pause-icon":"PostVideo_pause-icon__gywPd"});function d(e){var o=e.file,i=e.postDetail,t=(0,l.useState)(!0),a=(0,n.Z)(t,2),d=a[0],u=a[1],m=(0,l.useState)(!0),v=(0,n.Z)(m,2),p=v[0],f=v[1],_=(0,l.useRef)(),h=function(e){!1===_.current.paused?(_.current.pause(),f(!0)):(_.current.play(),f(!1))};return(0,c.jsx)("div",{className:r("video-container"),children:(0,c.jsxs)("div",{className:r("video-wrapper"),children:[!0===p&&(0,c.jsx)("p",{className:r("pause-icon"),onClick:h,onDoubleClick:function(e){return e.stopPropagation()},children:s.o1}),(0,c.jsx)("p",{className:r("volume-icon"),onClick:function(e){!0===_.current.muted?u(!1):u(!0)},onDoubleClick:function(e){return e.stopPropagation()},children:d?s.qD:s.eU}),(0,c.jsx)("video",{ref:_,width:"400",onClick:h,loop:!0,muted:d,className:r("video",{"PostDetail-video":i}),children:(0,c.jsx)("source",{src:o.src,type:"video/mp4"})})]})})}var u=(0,l.memo)(d)},7752:function(){}}]);
//# sourceMappingURL=589.802d7eab.chunk.js.map