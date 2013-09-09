(function($){
	var User = Backbone.Model.extend({
		defaults: {
			displayName: 'JohnDoe',
			login: 'johndoe@hotmail.com',
			created: getTimeStamp(),
			lastUpdated: getTimeStamp(),
			lastLogin: getTimeStamp()

		}
	});

	var List = Backbone.Collection.extend({
		model: User
	});

	var ListView = Backbone.View.extend({
		el: $('body'),
		events: {'click button#add': 'addItem'},
		initialize: function() {
			_.bindAll(this, 'render', 'addItem', 'appendItem');

			this.collection = new List();
			this.collection.bind('add', this.appendItem); // Collection event binder.

			this.counter = 0;
			this.render();
		},
		render: function() {
			var self = this;
			$(this.el).append('<button id="add">Add user</button>');
			$(this.el).append('<ul></ul>');
			_(this.collection.models).each(function(user) {
				self.appendItem(user);
			}, this);
		},

		addItem: function() {
			this.counter++;
			var user = new User();
			//user.set({ part2: user.get('part2') + this.counter });
			user.set({ displayName: user.get('displayName') + this.counter });
			user.set({ login: user.get('login') + this.counter });
			//user.set({ created: 'abc' });
			//user.set({ lastUpdated: 'abc' });
			//user.set({ lastLogin: 'abc' });


			this.collection.add(user); // Add user to collection. View is updated via event 'add'.
		},
		appendItem: function(user){
			$('ul', this.el).append('<li>' + user.get('displayName') + ' ' + user.get('lastLogin') + '</li>');
		}
	});

	var listView = new ListView();

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

})(jQuery);