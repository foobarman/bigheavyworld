define(
['underscore', 'backbone', 'app/event_dispatcher', 'text!tpl/app.html', 'view/venue_search_form', 'collection/venue', 'view/venue_collection_list', 'view/venue_collection_map'],
function(_, Backbone, dispatcher, tpl, VenueSearchFormView, VenueCollection, VenueCollectionListView, VenueCollectionMapView) {

    var AppView = Backbone.View.extend({
        template: _.template(tpl),
        initialize: function(venue) {
            this.render();
            this.loadingMessage = this.$('#loading').hide();
            dispatcher.on('search', this.search, this);
            dispatcher.on('ajax.start', this.ajaxStart, this);
            dispatcher.on('ajax.complete', this.ajaxComplete, this);
            $(document).ajaxStart(function() { dispatcher.trigger('ajax.start'); });
            $(document).ajaxComplete(function() { dispatcher.trigger('ajax.complete'); });
        },
        render: function() {
            this.$el.html(this.template());
            this.searchView = new VenueSearchFormView({
                el: this.$('#search-form')
            });
            this.mapView = new VenueCollectionMapView({
                el: this.$('#search-map')
            });
            this.listView = new VenueCollectionListView({
                el: this.$('#search-list')
            });
        }
    });

    AppView.prototype.search = function(criteria, options) {
        var _this = this;
        var venueCollection = new VenueCollection();
        venueCollection.fetch({
            data: criteria,
            success: function(collection) {
                _this.searchComplete(collection, options);
            }
        });
    };

    AppView.prototype.searchComplete = function(collection, options) {
        if (collection.length) {
            this.$el.addClass('twocol');
            this.listView.collection = collection;
            this.listView.render(options);
            this.mapView.collection = collection;
            this.mapView.render(options);
        } else {
            alert('No venues match your search');
        }
    };

    AppView.prototype.ajaxStart = function() {
        this.loadingMessage.show();
    };

    AppView.prototype.ajaxComplete = function() {
        this.loadingMessage.hide();
    };

    return AppView;
});
