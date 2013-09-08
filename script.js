$(function() {
	var User = Backbone.Model.extend({
		
		defaults: {
			id: '1',
			login: 'johndoe@hotmail.com',
			displayName: 'JohnDoe123',
			password: '',
			created: new Date().getTime(),
			lastVisit: new Date().getTime()
		}
		//el: $('body'), // Attaches 'this.el' to an existing element.
		//initialize: function() {
		//	_.bindAll(this, 'render'); // Fixes loss of context for 'this' within methods.
		//	this.render(); // Not all views are self-rendering. This one is.
		//},
		//render: function() {
		//	$(this.el).append('<ul><li>Hello world! ' + getTimeStamp() + '</li></ul>');
		//}
	});

	var UserView = Backbone.View.extend({
		// Every Backbone.js view has an 'el' property, and if not defined, Backbone will construct its own as an empty div element.
		el: $('#userInfo'),
		initialize: function() {
			this.render();
		},
		tagName: 'div',
		className: 'userInfo',
		render: function() {
			this.el.innerHTML = this.model.get('displayName')
			return this;
		}
	});

	var johnDoe = new User({
		id: '123',
		login: 'johndoe@gmail.com',
		displayName: 'JohnDoe',
		password: 'abc'
	});

	var userView = new UserView({
		model: johnDoe
	});


	var user =  new User();

	function getTimeStamp() {
		var now = new Date();
		return (
			now.getMonth() + 1 + '/' +
			now.getDate() + '/' +
			now.getFullYear() + ' ' +
			now.getHours() + ':' +
			((now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes()) + ':' +
			((now.getSeconds() < 10) ? '0' + now.getSeconds() : now.getSeconds()));
	};
})(jquery);