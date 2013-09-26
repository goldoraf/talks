App.Todo = Ember.Object.extend({
    title: null,
    completed: false,

    complete: function() {
        this.set('completed', true);
    }
});

var todo = App.Todo.create({
    title: 'Acheter du pain'
});
console.log(todo.get('title'));
todo.set('completed', true);

App.Task = App.Todo.extend({
    dueAt: null,
    completedAt: null,

    complete: function() {
        this._super();
        this.set('completedAt', new Date());
    }
});

App.Task.reopen({
    assignee: null
});

App.Task.reopenClass({
    instantiate: function() {
        return this.create();
    }
});

App.Contact = Ember.Object.extend({
    firstname: null,
    lastname: null,
    email: null,

    fullname: function() {
        return this.get('firstname') + ' ' + this.get('lastname');
    }.property('firstname', 'lastname')
});

App.Contact.reopen({
    fullname: function(key, value) {
        // getter
        if (arguments.length === 1) {
            return this.get('firstname') + ' ' + this.get('lastname');
        // setter
        } else {
            var name = value.split(" ");
            this.set('firstName', name[0]);
            this.set('lastName', name[1]);
        }
    }.property('firstname', 'lastname')
});

App.PersonalAddressbook = Ember.Object.create({
    name: 'My contacts'
});

App.Contact = Ember.Object.extend({
    firstname: null,
    lastname: null,
    email: null,

    addressbookBinding: 'App.PersonalAddressbook.name'
});

var c = App.Contact.create({
    firstname: 'John',
    lastname: 'Doe'
});
console.log(c.get('addressbook')); // -> 'My contacts'

App.Todo = Ember.Object.extend({
    title: null,
    completed: false,

    todoChanged: function() {
        App.store.save(this);
    }.observes('title', 'completed')
});

App.Todo = Ember.Object.extend({
    title: null,
    completed: false,

    todoChanged: Ember.observer(function() {
        App.store.save(this);
    }, 'title', 'completed')
});

App.TodoList = Ember.Object.extend({
    todos: [],

    completed: function() {
        return this.get('todos').filterProperty('completed', true);
    }.property('todos.@each.completed')
});

var todos = [
    App.Todo.create({ title: 'Acheter le pain' }),
    App.Todo.create({ title: 'Finir mes slides' }),
    App.Todo.create({ title: 'Jouer de la guitare' })
];

todos.forEach(function(item, index, self) {
    item.set('completed', true);
});

todos.invoke('complete');

var titles = todos.map(function(item) {
    return item.get('title');
});

var titles = todos.mapProperty('title');

var completed = todos.filter(function(item) {
    return item.get('completed') === true;
});

var completed = todos.filterProperty('completed', true);

var allCompleted = todos.every(function(item) {
    return item.get('completed') === true;
});

var allCompleted = todos.everyProperty('completed', true);

var someCompleted = todos.some(function(item) {
    return item.get('completed') === true;
});

var someCompleted = todos.someProperty('completed', true);

<script type="text/x-handlebars" data-template-name="task-item">
    <span class="title">{{task.title}}</span>
    <a href="#" class="assignee">{{task.assignee.name}}</a>
    {{#if task.dueAt}}
        Due at {{format_date task.dueAt}}
    {{/if}}
</script>

var view = Ember.View.create({
    templateName: 'hi',
    name: 'Bob'
});

view.appendTo('#container');

App.NoticeView = Ember.View.extend({
    specificCSSClass: 'uber-notice-ui',
    isError: true
});

<div {{bindAttr class="specificCSSClass isError"}}>
  Lorem ipsum
</div>

App.ContactView = Ember.View.extend({
    templateName: 'contact',
    contact: App.Contact.create({
        firstname: 'John',
        lastname: 'Doe',
        email: 'jdoe@zz.com'
    })
});

App.ContactInfoView = Ember.View.extend({
    templateName: 'contact-info'
});

&lt;script type="text/x-handlebars" data-template-name="contact"&gt;
    Name: {{contact.firstname}} {{contact.lastname}}
    {{view App.ContactInfoView contactBinding="contact"}}
&lt;/script&gt;

&lt;script type="text/x-handlebars" data-template-name="contact-info"&gt;
    Email: {{contact.email}}
&lt;/script&gt;

App.TodoView = Ember.View.extend({
    templateName: 'todo-view',
    todo: null,
    isEditing: false,

    edit: function(event) {
        this.set('isEditing', true);
    }
});

&lt;script type="text/x-handlebars" data-template-name="todo-view"&gt;
    {{view Ember.Checkbox checkedBinding="todo.completed"}}
    {{#if isEditing}}
        {{view Ember.TextField valueBinding="todo.title"}}
    {{else}}
        &lt;span {{action "edit" on="click" target="parentView"}}&gt;{{todo.title}}&lt;/span&gt;
    {{/if}}
&lt;/script&gt;

App.todosController = Ember.ArrayController.extend({
    remaining: function() {
        return this.filterProperty('completed', false);
    }.property('@each.completed')
});

$.get('todos.json', function(data) {
    App.todosController.set('content', data);
});

{{#each App.todosController as todo}}
    {{view App.TodoView todoBinding="todo"}}
{{/each}}

App.Todo = DS.Model.extend({
    title: DS.attr('string'),
    completed: DS.attr('boolean'),
    owner: DS.belongsTo('App.User')
});

App.User = DS.Model.extend({
    fullname: DS.attr('string'),
    todos: DS.hasMany('App.Todo')
});

App.store = DS.Store.create({
    adapter: DS.RESTAdapter.create()
});

var todos = App.store.findAll(App.Todo);
// -> GET /todos

window.App = Ember.Application.create({
    ApplicationView = Ember.View.extend({
        templateName: 'application'
    }),
    ApplicationController = Ember.Controller.extend({
        title: 'Todo list'
    }),
    store = DS.Store.create(),
    ready: function() {
        console.log('App ready');
    },
    Router: Ember.Router.extend({
        root: Ember.Route.extend({
            index: Ember.Route.extend({
                route: '/',
                connectOutlets: function(router, context) {
                    router.get('applicationController').connectOutlet('todos', store.findAll(App.Todo));
                }
            }),
            completed: Ember.Route.extend({
                route: '/completed',
                connectOutlets: function(router, context) {
                    router.get('applicationController').connectOutlet('todos', 
                        store.filter(App.Todo, function(todo) {
                            return item.get('completed') === true;
                        })
                    );
                }
            })
        })
    })
});

&lt;script type="text/x-handlebars" data-template-name="application"&gt;
    &lt;h1&gt;{{title}}&lt;/h1&gt;
    &lt;div id="content"&gt;{{outlet}}&lt;/div&gt;
&lt;/script&gt;