define(["jquery","underscore","backbone","data","text!apps/docs/templates/css.html","text!apps/docs/templates/css-nav.html"],function(e,t,n,r,i,s){var o=n.View.extend({events:{},initialize:function(){t.bindAll(this)},render:function(){var n,r;return n=t.template(i,{}),e(this.el).html(n),r=t.template(s,{}),e("#nav").html(r),this}});return new o});