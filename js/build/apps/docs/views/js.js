define(["jquery","underscore","backbone","data","text!apps/docs/templates/js.html","text!apps/docs/templates/js-nav.html","json!apps/docs/data/docs.json"],function(e,t,n,r,i,s,o){var u=n.View.extend({events:{},initialize:function(){t.bindAll(this)},render:function(){var n,r;return n=t.template(i,{docsJson:o}),e(this.el).html(n),r=t.template(s,{docsJson:o}),e("#nav").html(r),this}});return new u});